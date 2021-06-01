
<template>
  <div data-cy="notes">
    <div v-if="C_editForManager" class="blur_show float-right">      
    </div>
    <div v-if="!loading" class="notes_show mb-5 mx-2">
      <div v-if="show">
        <div class="crud-actions mx-3 float-right">
          <span v-if="permitted('write')" class="mr-2 edit-action" @click.stop="editNoteMode" data-cy="note_edit_icon">
             <font-awesome-icon icon="ellipsis-h" /> 
          </span>
          <!-- <span v-if="permitted('delete')" class="font-sm delete-action" @click.stop="deleteNote" data-cy="note_delete_icon">
            <i class="fas fa-trash-alt"></i>
          </span> -->
        </div>
        <div class="note_by my-2">
          <!-- <span class="badge badge-secondary">Note by</span> -->
          <span class="text-muted font-sm">{{noteBy}}</span>
        </div>
        <div v-if="DV_note.attachFiles.length > 0" class="note_files">
          <span class="badge badge-secondary mr-3">Note Files</span>
          <span v-for="file in DV_note.attachFiles">
            <span class="file-icon" v-tooltip.bottom="`${file.name}`" @click="downloadFile(file)">
              <i class="fas fa-file-alt"></i>
            </span>
          </span>
        </div>
        <div class="note_body my-2 font-sm">
          {{DV_note.body}}
        </div>
      </div>
       <div v-else>     
        <notes-form
          v-if="permitted('write')"
          title="Edit Note"
          :note="DV_note"
          :facility="facility"       
           class="form-inside-modal"               
           @close-note-input="show=true"
          @note-updated="noteUpdated"
        />      
      </div>
    </div>
    
 </div>    
</template>


<script>
  import http from './../../../common/http'
  import {mapGetters, mapMutations} from 'vuex'
  import NotesForm from './notes_form'
  import {SweetModal} from 'sweet-modal-vue'

  export default {
    props: ['facility', 'note', 'from'],
    components: {
      NotesForm,
      SweetModal
    },
    data() {
      return {
        show: true,
        loading: true,
        DV_note: null,  
        // has_note: false        
      }
    },
    mounted() {
      if (!_.isEmpty(this.note)) {
        this.loading = false
        this.DV_note = this.note
      }
    },
    methods: {
      ...mapMutations([
        'setTaskForManager'
      ]),
     editNoteMode() {
        if (this.from == "manager_view") {                
          this.setTaskForManager({key: 'note', value: this.DV_note})
          this.$refs.notesFormModal && this.$refs.notesFormModal.open() 
        } else {
          this.show = false
          // this.DV_note = this.note
          // this.$refs.notesFormModal && this.$refs.notesFormModal.open() 
          this.$router.push(`/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/notes/${this.DV_note.id}`)
        }
      }, 
      noteUpdated(note) {
        this.show = true
        this.$emit('note-updated', note)
      },
      deleteNote() {
        var confirm = window.confirm(`Are you sure, you want to delete this note?`)
        if (!confirm) return;

        http
          .delete(`/projects/${this.currentProject.id}/facilities/${this.facility.id}/notes/${this.note.id}.json`)
          .then((res) => {
            this.loading = false
            this.$emit('note-deleted', this.note)
          })
          .catch((err) => {
            this.loading = false
            console.error(err)
          })
      },
      downloadFile(file) {
        if (this._isallowed('write')) {
          let url = window.location.origin + file.uri
          window.open(url, '_blank')
        }
      }
    },
    computed: {
      ...mapGetters([
        'currentProject',
        'managerView'
      ]),
      noteBy() {
        if (this.loading) return null
        return `${this.DV_note.user.fullName} at ${new Date(this.DV_note.createdAt).toLocaleString()}`
      },
      permitted() {
        return salut => !this.loading && this.note.userId === this.$currentUser.id && this._isallowed(salut)
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.notes[salut]
      },
      C_editForManager() {
        return this.managerView.note && this.managerView.note.id == this.DV_note.id
      }
    },
    watch: {
      note: {
        handler: function(value) {
          this.DV_note = value
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .notes_input {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 15px;
  }
  .note_body {
    padding-top: 10px;
    word-break: break-word;
    min-height: 80px;
    overflow-y: auto;
    font-size: 1.06rem;
  }
  .file-icon {
    cursor: pointer;
    font-size: 15px;
    color: gray;
    margin-right: 10px;
  } 
   .notes_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .notes_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
    min-width: 80vw;
    max-height: 80vh;
    .sweet-content {
      padding-top: 30px;
      text-align: unset;
    }   
      .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
    
  }
</style>
