<template>
  <div id="facility_view">
    <!-- <div class="row">
      <div class="col-md-2 facility-groups-tab">
        <facility-sidebar
          title="Facility Manager"
          :current-facility-group="currentFacilityGroup"
          :expanded="expanded"
          :current-facility="currentFacility"
          @on-expand-facility-group="expandFacilityGroup"
          @on-expand-facility="showFacility"
        ></facility-sidebar>
      </div>
      <div class="col-md-4 facility-show-tab bt-light pb-2">
        <div class="mt-2">
          <facility-show
            v-if="C_showFacilityTab"
            from="manager_view"
            :facility="currentFacility"
            :facility-group="currentFacilityGroup"
          ></facility-show>
          <facility-rollup
            v-else
            :facility-group="C_showFacilityRollup ? currentFacilityGroup : null"
            from="manager_view"
          ></facility-rollup>
        </div>
      </div>
      <div class="col-md-6 facility-forms-tab bt-light">
        <div class="default-background mt-2">
          <div class="bg-white">
            <task-form
              v-if="managerView.task"
              :facility="currentFacility"
              :task="managerView.task"
              title="Edit Task"
              @task-created="updateFacilityTask"
              @task-updated="updateFacilityTask"
            ></task-form>

            <issue-form
              v-else-if="managerView.issue"
              :facility="currentFacility"
              :issue="managerView.issue"
              @issue-updated="updateFacilityIssue"
              @issue-created="updateFacilityIssue"
            ></issue-form>

            <notes-form
              v-else-if="managerView.note"
              from="manager_view"
              :facility="currentFacility"
              :note="managerView.note"
              @close-note-input=""
              @note-created="createdFacilityNote"
              @note-updated="updatedFacilityNote"
            ></notes-form>

            <div v-else class="center-section text-center">
              <i class="fa fa-tasks font-lg text-center" style="font-size:1.8rem"></i>
              <p>View, Add or Edit Tasks, Issues, and Notes here.</p>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import FacilityShow from '../components/facilities/facility_show'
  import FacilityRollup from '../components/facilities/facility_rollup'
  import FacilitySidebar from '../components/facilities/facility_sidebar'
  import TaskForm from "../components/tasks/task_form"
  import IssueForm from "../components/issues/issue_form"
  import NotesForm from "../components/notes/notes_form"

  export default {
    name: "FacilityManagerView",
    components: {
      FacilityShow,
      FacilityRollup,
      FacilitySidebar,
      TaskForm,
      IssueForm,
      NotesForm
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
        'managerView'
      ]),
      C_showFacilityTab() {
        return !_.isEmpty(this.currentFacility) && !_.isEmpty(this.currentFacilityGroup)
      },
      C_showFacilityRollup() {
        return !_.isEmpty(this.currentFacilityGroup)
      }
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  #facility_view {
    padding: 0 10px;
    .bt-light {
      border-top: solid #ededed 15px;
    }
    .facility-groups-tab {
      background: #ededed;
      max-height: calc(100vh - 94px);
      height: calc(100vh - 94px);
      overflow-y: auto;
    }
    .facility-forms-tab,
    .facility-show-tab {
      max-height: calc(100vh - 94px);
      height: calc(100vh - 94px);
      overflow-y: auto;
      box-shadow: 0 2.5px 2.5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
    }

    .default-background {
      background-color: #ededed;
      box-shadow: 0 2.5px 2.5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
      height: calc(100vh - 130px);
      max-height: calc(100vh - 130px);
      position: relative;
      border-radius: 4px;
      z-index: 1;
    }
    .center-section {
      position: absolute;
      box-shadow: 0.5px 0.5px 5px 5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
      border-radius: 2px;
      padding: 10px;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
