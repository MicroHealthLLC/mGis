<template>
  <div id="notes-index" data-cy="note_list">
    <div v-if="_isallowed('write') && newNote" class="mb-3">    
      <notes-form
        title="Add Note"
        :facility="DV_facility"
        @close-note-input="newNote=false"
        @note-created="noteCreated"
        class="notes_form_modal"
      ></notes-form> 
    </div>
    <div v-else>
      <div class="mb-3 row" :class="{'align-items-center justify-content-between': _isallowed('write')}">
        <div class="col-md-6">
          <div class="input-group" :class="{'search-tab': _isallowed('write')}">
            <div class="input-group-prepend">
              <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
            </div>
            <input type="search" class="form-control form-control-sm" placeholder="Search Notes" aria-label="Search" aria-describedby="search-addon" v-model="notesQuery" data-cy="search_notes">
          </div>
        </div>
      </div>
      <div class="col-md-6 form-check-inline w-100 mb-2 font-sm">
        <div class="px-0 float-left" v-if="_isallowed('write')">
          <button @click.prevent="addNewNote"
          class="btn btn-md btn-primary addNote"
          data-cy="new_note"><i class="fas fa-plus-circle mr-2"></i>
          Add Note</button>
        </div>
        <div class="float-right ml-auto">
          <label class="form-check-label">
            <input type="checkbox" class="form-check-input" v-model="C_myNotes"> <i class="fas fa-user mr-1"></i>My Notes
          </label>
          <!-- <label class="form-check-label ml-2 text-primary">
            <h5 class="mb-0 mr-2" data-cy="note_total">Total Notes: {{filteredNotes.length}}</h5>
          </label> -->
        </div>
      </div>
      
      <div class="notes-container row pt-2">
      <div v-if="_isallowed('read')" class="notes-rows col-md-6" > 
        <div v-if="filteredNotes.length > 0" v-for="note in filteredNotes" :key="note.id" class="mb-1">
          <notes-sheets
            :facility="DV_facility"
            :note="note"
            id="notesHover"
            :from="from"
            @note-updated="noteUpdated"
            @note-deleted="noteDeleted"
            class="notes"
          ></notes-sheets>
        </div>      
        <div v-show="filteredNotes.length <= 0" class="text-danger ml-3">No notes found..</div>
        </div>
      <div v-else class="text-danger mx-2 my-4">You don't have permissions to read!</div>
    </div>
  </div>
  </div>

</template>

<script>
  import {mapMutations, mapGetters} from "vuex"
  import NotesForm from './notes_form'
  import NotesSheets from './notes_sheets'
  import {SweetModal} from 'sweet-modal-vue'

  export default {
    name: 'NotesSheetsIndex',
    components: {
      NotesForm,
      NotesSheets,
      SweetModal
    },
    props: ['facility', 'from'],
    data() {
      return {
        loading: true,
        newNote: false,
        notesQuery: '',
        DV_facility: Object.assign({}, this.facility)
      }
    },
    methods: {
      ...mapMutations([
        'setTaskForManager',
        'setMyActionsFilter'
      ]),
      addNewNote() {
        if (this.from == "manager_view") {         
          this.setTaskForManager({key: 'note', value: {}})
        } else {
          this.newNote = true        
        }
      }, 
      noteCreated(note) {
        this.newNote = false
        this.DV_facility.notes.unshift(note)
      },
      noteUpdated(note) {
        let index = this.DV_facility.notes.findIndex(n => n.id == note.id)
        if (index > -1) Vue.set(this.DV_facility.notes, index, note)
      },
      noteDeleted(note) {
        this.DV_facility.notes.splice(this.DV_facility.notes.findIndex(n => n.id == note.id), 1)
      }
    },
    computed: {
      ...mapGetters([
        'myActionsFilter'
      ]),
      filteredNotes() {
        const resp = this.exists(this.notesQuery.trim()) ? new RegExp(_.escapeRegExp(this.notesQuery.trim().toLowerCase()), 'i') : null
        return _.filter(this.DV_facility.notes, n => {
          let valid = this.C_myNotes ? this.$currentUser.id == n.userId : true
          if (resp) valid = valid && resp.test(n.body)
          return valid
        })
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.notes[salut]
      },
      C_myNotes: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('notes')
        },
        set(value) {
          if (value) this.setMyActionsFilter([...this.myActionsFilter, {name: "My Notes", value: "notes"}])
          else this.setMyActionsFilter(this.myActionsFilter.filter(f => f.value !== "notes"))
        }
      }
    },
    watch: {
      facility: {
        handler: function(value) {
          this.DV_facility = Object.assign({}, value)
          this.loading = true
        }, deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  #search-addon {
    background-color: #ededed !important;
  }
  #notes-index {
    height: 500px;
  }
  input[type=search] {
    color: #383838;
    text-align: left;
    cursor: pointer;
    display: block;
  }
  .addNote{
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }
  .notes{
    padding:8px;
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
    z-index: 100;
  }
  #notesHover:hover {
    box-shadow: 0.5px 0.5px 1px 1px rgba(56,56, 56,0.29), 0 2px 2px rgba(56,56,56,0.23);
    background-color: rgba(91, 192, 222, 0.3);
    border-left: solid rgb(91, 192, 222);
  }
  .notes-container {
    position: relative;
    overflow: hidden;  
    height: 61vh;    
  }
  .notes-rows {
    overflow-y: scroll;
    box-shadow: 0.5px 0.5px 1px 1px rgba(56,56, 56,0.29), 0 2px 2px rgba(56,56,56,0.23);
    max-height: 59vh;
    border-top: solid 4px #ededed;
    padding-top: 8px;  
  }
  
</style>
