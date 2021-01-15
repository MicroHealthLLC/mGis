<template>
  <div id="sheets_view" data-cy="sheets_view">   
        <!-- <sweet-modal
          class="form_modal"
          ref="formModals"
          :hide-close-button="true"
          :blocking="true"
          >
          <div v-if="managerView.task || managerView.issue || managerView.note" class="w-100">
            <task-form
              v-if="managerView.task"
              :facility="currentFacility"
              :task="managerView.task"
              title="Edit Task"
              @task-created="updateFacilityTask"
              @task-updated="updateFacilityTask"
              class="form-inside-modal"
            ></task-form>
            <issue-form
              v-else-if="managerView.issue"
              :facility="currentFacility"
              :issue="managerView.issue"
              @issue-updated="updateFacilityIssue"
              @issue-created="updateFacilityIssue"
              class="form-inside-modal"
            ></issue-form>
              <notes-form
              v-else-if="managerView.note"            
              :facility="currentFacility"
              :note="managerView.note"
              @close-note-input="newNote=false"
              @note-created="createdFacilityNote"
              @note-updated="updatedFacilityNote"
              class="form-inside-modal"
            ></notes-form>
          </div>
        </sweet-modal> -->
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import {SweetModal} from 'sweet-modal-vue'
  import FacilitySheets from './facilities/facility_sheets'
  import FacilitySidebar from './facilities/facility_sidebar'
  import FacilityRollup from './facilities/facility_rollup'
  import TaskForm from "./tasks/task_form"
  import IssueForm from "./issues/issue_form"
  import NotesForm from "./notes/notes_form"


  export default {
    name: "ProjectSheets",
    components: {
      FacilitySheets,
      FacilityRollup,
      TaskForm,
      IssueForm,
      NotesForm,
      FacilitySidebar,
      SweetModal
    },
    data() {
      return {
        expanded: {
          id: ''
        },
        currentFacility: {},
        currentFacilityGroup: {}
      }
    },
    computed: {
      ...mapGetters([
        'filteredFacilityGroups',
        'facilityGroupFacilities',
        'managerView',
        
      ]),
      C_showFacilityTab() {
        return !(_.isEmpty(this.currentFacility) && _.isEmpty(this.currentFacility))
      },
       C_showFacilityRollup() {
        return !_.isEmpty(this.currentFacilityGroup)
      }
    },
    mounted() {
      // make the first facility_group expanded
      if (this.filteredFacilityGroups.length) this.expandFacilityGroup(this.filteredFacilityGroups[0])
    },
    methods: {
      ...mapMutations([
        'updateTasksHash',
        'updateIssuesHash',
        'setTaskForManager'
      ]),
      ...mapActions([
        'taskUpdated'
      ]),
      expandFacilityGroup(group) {
        if (group.id == this.expanded.id) {
          this.expanded.id = ''
          this.currentFacilityGroup = {}
        }
        else {
          this.expanded.id = group.id
          this.currentFacilityGroup = group
        }
        this.currentFacility = {}
      },
      showFacility(facility) {
        this.currentFacility = facility
      },
      updateFacilityTask(task) {
        let cb = () => this.updateTasksHash({task: task})
        this.taskUpdated({facilityId: task.facilityId, projectId: task.projectId, cb}).then((facility) => this.currentFacility = facility)
        this.setTaskForManager({key: 'task', value: null})
      },
       updateFacilityIssue(issue) {
        let cb = () => this.updateIssuesHash({issue: issue})
        this.taskUpdated({facilityId: issue.facilityId, projectId: issue.projectId, cb}).then((facility) => this.currentFacility = facility)
        this.setTaskForManager({key: 'issue', value: null})
      },
      createdFacilityNote(note) {
        this.currentFacility.notes.unshift(note)
        this.setTaskForManager({key: 'note', value: null})
      },
      updatedFacilityNote(note) {
        let index = this.currentFacility.notes.findIndex(n => n.id == note.id)
        if (index > -1) Vue.set(this.currentFacility.notes, index, note)
        this.setTaskForManager({key: 'note', value: null})
      },
      goBackFromEdits() {
        this.setTaskForManager({key: 'task', value: null})
        this.setTaskForManager({key: 'issue', value: null})
        this.setTaskForManager({key: 'note', value: null})
      }
    },
    watch: {
       currentFacility: {
        handler(value, previous) {
          if (_.isEmpty(value) || value.id !== previous.id) {
            this.goBackFromEdits()
          }
        }, deep: true
      },
      filteredFacilityGroups: {
        handler(value) {
          if (!(this.currentFacilityGroup && _.map(value, 'id').includes(this.currentFacilityGroup.id))) {
            this.currentFacilityGroup = {}
            this.currentFacility = {}
            this.expanded.id = ''
          } else {
            let group = value.find(f => f.id === this.currentFacilityGroup.id)
            if (group) {
              this.currentFacilityGroup = group
              let facility = this.facilityGroupFacilities(this.currentFacilityGroup).find(f => f.id == this.currentFacility.id)
              if (facility) {
                this.currentFacility = facility
              } else {
                this.currentFacility = {}
              }
            }
            else {
              this.currentFacilityGroup = {}
              this.currentFacility = {}
              this.expanded.id = ''
            }
          }
        }, deep: true
      },     
      managerView: {
        handler(value) {
          if (value.task || value.issue || value.note) {
            this.$refs.formModals && this.$refs.formModals.open()
          } else {
            this.$refs.formModals && this.$refs.formModals.close()
          }
        }, deep: true
      }
    }
  }
</script>

<style lang="scss">
  #sheets_view {
    overflow: hidden;
    padding: 0 10px;
    .cursor {
      cursor: pointer;
    }
    .facility-groups-tab {
      background: #ededed;
      max-height: calc(100vh - 94px);
      height: calc(100vh - 94px);
      overflow-y: scroll;
    }
    .facility-forms-tab,
    .facility-show-tab {
      max-height: calc(100vh - 94px);
      height: calc(100vh - 94px);
      overflow-y: scroll;
      position: relative;
    }
    .facilitySidebar {
      width: 200px;
      max-width: 200px;
      min-width: 200px;
    }
    .form_modal.sweet-modal-overlay {
      z-index: 10000001;
    }
    .form_modal.sweet-modal-overlay /deep/ .sweet-modal {
      min-width: 80vw;
      max-height: 90vh;
      background-color: #ededed;
      .sweet-content {
        padding-top: 30px;
        text-align: unset;
      }
      .modal_close_btn {
        display: flex;
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 20px;
        cursor: pointer;
      }
      .form-inside-modal {
        form {
          position: inherit !important;
        }
      }
    }
  }
</style>

