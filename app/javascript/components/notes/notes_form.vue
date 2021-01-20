<template>
  <div class="notes-form">
       <div class="d-flex form-group sticky mb-2">
        <button
          :disabled="!readyToSave || loading"
          class="btn btn-success sticky-btn btn-sm"
          @click.prevent.stop="saveNote"
          data-cy="note_save_btn"
          >
          Save
        </button>
        <button
          class="btn btn-sm btn-warning sticky-btn ml-2"
          @click.prevent="cancelNoteSave"
          data-cy="note_close_btn"
          >
          Close
        </button>
        <button
          v-if="_isallowed('delete')"
          @click.prevent="deleteNote"
          class="btn btn-sm btn-danger sticky-btn ml-auto"
          data-cy="note_delete_btn"
          >
          <i class="fas fa-trash-alt mr-2"></i>
          Delete
        </button>
      </div>

   <div class="notes_input mt-2 paperLook formTitle" :class="{'_disabled': loading, 'border-0': from == 'manager_view'}">
      <div class="form-group">
       <label class="font-sm"><h5>Note</h5></label>
        <textarea class="form-control" v-model="DV_note.body" rows="5" v-validate="'required'" placeholder="type notes here..." data-cy="note_details"></textarea>
      </div>
      <div class="input-group mb-2">
        <div v-for="file in filteredFiles" class="d-flex mb-2 w-100">
          <div class="input-group-prepend">
            <div class="input-group-text clickable" :class="{'btn-disabled': !file.uri}" @click.prevent="downloadFile(file)">
              <i class="fas fa-file-image"></i>
            </div>
          </div>
          <input
            readonly
            type="text"
            class="form-control form-control-sm mw-95"
            :value="file.name || file.uri"
          />
          <div
            :class="{'_disabled': loading}"
            class="del-check clickable"
            @click.prevent="deleteFile(file)"
            >
            <i class="fas fa-times"></i>
          </div>
        </div>
      </div>
      <div class="form-group" >
        <attachment-input
          @input="addFile"
          :show-label="true"
        />
      </div>

    </div>
    <div v-if="loading" class="load-spinner spinner-border text-dark" role="status"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import humps from 'humps'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import AttachmentInput from '../shared/attachment_input'

  export default {
    props: ['facility', 'note', 'title', 'from'],
    components: {
      AttachmentInput
    },
    data() {
      return {
        DV_note: this.INITIAL_NOTE_STATE(),
        loading: true,
        destroyedFiles: []
      }
    },
    mounted() {
      if (!_.isEmpty(this.note)) {
        this.loadNote(this.note)
      }
      this.loading = false
    },
    methods: {
      ...mapMutations([
        'setTaskForManager'
      ]),
      ...mapActions([
        'noteDeleted'
      ]),
      INITIAL_NOTE_STATE() {
        return {
          body: '',
          noteFiles: []
        }
      },
      loadNote(note) {
        this.DV_note = {...this.DV_note, ..._.cloneDeep(note)}
        if (note.attachFiles) this.addFile(note.attachFiles)
        this.$nextTick(() => {
          this.errors.clear()
          this.$validator.reset()
        })
      },
      addFile(files) {
        let _files = [...this.DV_note.noteFiles]
        for (let file of files) {
          file.guid = this.guid()
          _files.push(file)
        }
        this.DV_note.noteFiles = _files
      },
      deleteFile(file) {
        if (!file) return;

        var confirm = window.confirm(`Are you sure you want to delete attachment?`)
        if (!confirm) return;

        if (file.uri) {
          var index = this.DV_note.noteFiles.findIndex(f => f.guid === file.guid)
          Vue.set(this.DV_note.noteFiles, index, {...file, _destroy: true})
          this.destroyedFiles.push(file)
        }
        else if (file.name) {
          this.DV_note.noteFiles.splice(this.DV_note.noteFiles.findIndex(f => f.guid === file.guid), 1)
        }
      },
      saveNote() {
        this.$validator.validate().then((success) =>
        {
          if (!success || this.loading) {
            this.showErrors = !success
            return;
          }

          this.loading = true
          var formData = new FormData()
          formData.append('note[body]', this.DV_note.body)
          formData.append('note[destroy_file_ids]', _.map(this.destroyedFiles, 'id'))
          for (var file of this.DV_note.noteFiles) {
            if (!file.id) {
              formData.append('note[note_files][]', file)
            }
          }

          var url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/notes.json`
          var method = "POST"
          var callback = "note-created"

          if (this.note && this.note.id) {
            url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/notes/${this.note.id}.json`
            method = "PUT"
            callback = "note-updated"
          }

          axios({
            method: method,
            url: url,
            data: formData,
            headers: {
              'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
            }
          })
          .then((response) => {
            this.$emit(callback, humps.camelizeKeys(response.data))
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        })
      },
      deleteNote() {
        var confirm = window.confirm(`Are you sure, you want to delete this note?`)
        if (!confirm) return;
        this.noteDeleted({note: this.DV_note, facilityId: this.facility.id, projectId: this.currentProject.id, cb: () => this.cancelNoteSave() })
      },
      cancelNoteSave() {
        this.$emit('close-note-input')
        this.setTaskForManager({key: 'note', value: null})
      },
      downloadFile(file) {
        let url = window.location.origin + file.uri
        window.open(url, '_blank');
      }
    },
    computed: {
      ...mapGetters([
        'currentProject',
         'managerView'
      ]),
      readyToSave() {
        return (
          this.DV_note &&
          this.exists(this.DV_note.body)
        )
      },
      titleText() {
        return _.isEmpty(this.note) ? "Add Note" : "Edit Note"
      },
      filteredFiles() {
        return _.filter(this.DV_note.noteFiles, f => !f._destroy)
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.notes[salut]
      }
    },
    watch: {
      note: {
        handler: function(value) {
          if (!('id' in value)) this.DV_note = this.INITIAL_NOTE_STATE()
          this.DV_note.noteFiles = []
          this.destroyedFiles = []
          this.loadNote(value)
        }, deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .notes-form {
    z-index: 10;
    width: 100%;
    background-color: #fff;
  }
  .notes_input {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px;
  }
  .close-icon {
    float: right;
    cursor: pointer;
    display: flex;
    flex-direction: row-reverse;
  }
  .del-check {
    position: relative;
    top: -5px;
    display: flex;
    right: 10px;
    background: #fff;
    height: fit-content;
    color: red;
  }
  .formTitle {
    padding-top: 25px;
  }
  .paperLook {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    padding-bottom: 20px;
    margin-bottom: 10px;
    position: relative;
  }
  .sticky-btn {
    margin-top: 5px;
    margin-bottom: 5px;
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }
  .sticky {
    position: sticky;
    position: -webkit-sticky;
    justify-content: center;
    margin-bottom: -2.5rem;
    z-index: 1000;
    left: 15;
    top: 0;
    width: 100%;
    padding: 6px;
    background-color: rgba(237, 237, 237, 0.85);
    box-shadow: 0 10px 20px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
</style>
