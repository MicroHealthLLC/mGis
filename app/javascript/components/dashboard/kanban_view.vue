<template>
  <div id="kanban-view">
    <div class="row">
      <!-- <div class="col-md-2 facility-groups-tab" :class="{'col-md-4': expandFilter, 'col-md-2': !expandFilter}">
        <custom-tabs :current-tab="currentTab" :tabs="tabs" @on-change-tab="onChangeTab" class="mt-4" badge-margin="4px" />
        <div class="row">
          <div class="col d-flex">
      

            <div v-if="expandFilter && contentLoaded" class="mt-4 ml-2" style="border-left:solid 1px lightgray">
              <div v-if="currentTab === 'tasks'">
                <div class="d-flex align-item-center justify-content-between mx-2">
                 <div class="mb-2 input-group w-100">
                    <div class="input-group-prepend d-inline">
                     <span class="input-group-text"><i class="fa fa-search"></i></span>
                    </div>
                    <input
                      type="search"
                      style="height:30px"
                      class="form-control form-control-sm"
                      placeholder="Search Tasks"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      v-model="sidebarTasksQuery"
                      data-cy="search_tasks"
                    />
                  </div>
                </div>
                <div class="d-flex align-item-center justify-content-between mx-2">
                  <div class="simple-select w-100">
                     <label class="font-sm mb-0">Task Category</label>
                    <multiselect
                      v-model="C_taskTypeFilter"
                      track-by="name"
                      label="name"
                      :options="taskTypes"
                      :searchable="false"
                      :multiple="true"
                      select-label="Select"
                      deselect-label="Remove"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div>

                <div class="mx-2 mb-3 font-sm">
                  <div class="simple-select w-50">
                    <label class="font-sm mb-0">Flags</label>
                    <multiselect v-model="C_kanbanTaskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                   <div class="d-flex align-item-center justify-content-between">
                </div>

                  <div class="form-check my-4 pl-0" data-cy="search_task_total">
                    <label class="form-check-label text-primary">
                     <h5> Total: {{filteredTasks.length}}</h5>
                    </label>
                  </div>
                </div>
              </div>
              <div v-if="currentTab === 'issues'">
                <div class="d-flex align-item-center justify-content-between mx-2">
                  <div class="mb-2 input-group w-100">
                    <div class="input-group-prepend d-inline">
                      <span class="input-group-text"><i class="fa fa-search"></i></span>
                    </div>
                    <input
                      type="search"
                      style="height:30px"
                      class="form-control form-control-sm"
                      placeholder="Search Issues"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      v-model="sidebarIssuesQuery"
                      data-cy="search_issues"
                    />
                  </div>
                </div>
                <div class="d-flex align-item-center justify-content-between mx-2">
                  <div class="simple-select w-100">
                    <label class="font-sm mb-0">Task Category</label>
                    <multiselect
                      v-model="C_taskTypeFilter"
                      track-by="name"
                      label="name"
                      :options="taskTypes"
                      :searchable="false"
                      :multiple="true"
                      select-label="Select"
                      deselect-label="Remove"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div>

                <div class="d-flex align-item-center justify-content-between mx-2">
                  <div class="simple-select w-50">
                    <label class="font-sm mb-0">Flags</label>
                    <multiselect v-model="C_kanbanTaskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div>

                 <div class="d-flex align-item-center justify-content-between mx-2">
                   <div class="simple-select w-50">
                    <label class="font-sm mb-0">Issue Type</label>
                    <multiselect
                      v-model="C_issueTypeFilter"
                      track-by="name"
                      label="name"
                      placeholder="Filter by Issue Type"
                      :options="issueTypes"
                      :searchable="false"
                      :multiple="true"
                      select-label="Select"
                      deselect-label="Remove"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                   </div>
                 </div>

                 <div class="d-flex align-item-center justify-content-between mx-2">
                   <div class="simple-select w-50">
                   <label class="font-sm mb-0">Issue Severity</label>
                    <multiselect
                      v-model="C_issueSeverityFilter"
                      track-by="name"
                      label="name"
                      placeholder="Filter by Issue Severity"
                      :options="issueSeverities"
                      :searchable="false"
                      :multiple="true"
                      select-label="Select"
                      deselect-label="Remove"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div>

                 <div class="mx-2 mb-3 font-sm">
                  <div class="form-check my-4 pl-0" data-cy="search_issue_total">
                    <label class="form-check-label text-primary">
                      <h5>Total: {{filteredIssues.length}}</h5>
                    </label>
                  </div>
                </div>
              </div> -->
<!-- 
              <div v-if="currentTab === 'risks'">
                <div class="d-flex align-item-center justify-content-between mx-2">
                  <div class="mb-2 input-group w-100">
                    <div class="input-group-prepend d-inline">
                      <span class="input-group-text"><i class="fa fa-search"></i></span>
                    </div>
                    <input
                      type="search"
                      style="height:30px"
                      class="form-control form-control-sm"
                      placeholder="Search Risks"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      v-model="sidebarRisksQuery"
                      data-cy="search_risks"
                    />
                  </div>
                </div>
                <div class="d-flex align-item-center justify-content-between mx-2">
                  <div class="simple-select w-100">
                    <label class="font-sm mb-0">Task Category</label>
                    <multiselect
                      v-model="C_taskTypeFilter"
                      track-by="name"
                      label="name"
                      :options="taskTypes"
                      :searchable="false"
                      :multiple="true"
                      select-label="Select"
                      deselect-label="Remove"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                </div>
                <div class="mx-2 mb-3 font-sm">
                  <div class="form-check my-4 pl-0" data-cy="search_risk_total">
                    <label class="form-check-label text-primary">
                      <h5>Total: {{filteredRisks.length}}</h5>
                    </label>
                  </div>
                </div>
              </div> -->

            <!-- </div>
          </div>
        </div>
      </div> -->

      <!-- <div class="kanban-tab bt-light" :class="{'col-md-8': expandFilter, 'col-md-10': !expandFilter}">
        <div v-if="currentFacilityGroup && ('id' in currentFacilityGroup)">
          <span class="clickable" @click.prevent="expandFilter=!expandFilter" data-cy="kanban_search">
            <span v-show="!expandFilter" class="expandBtn">
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </span>
            <span v-show="expandFilter" class="expandBtn">
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </span>
          </span>
        </div>

        <div>
         <div class="mt-0 ml-3" style="position:absolute"  v-if="currentFacility">
           <h5 class="mb-0 pb-1"> {{ currentFacility.facilityName }}</h5>
         </div>
          <div v-if="currentFacility && ('id' in currentFacility)">
            <kanban
              :stages="C_kanban.stages"
              :kanban-type="currentTab"
              :cards="C_kanban.cards"
              @on-add-new="handleAddNew"
              @on-search-change="handleSearchQueryChange"
            ></kanban>
          </div>
          <div v-else class="center-section text-center">
            <i class="fa fa-tasks font-lg text-center" style="font-size:1.8rem"></i>
            <p>View, Edit, filter Tasks/Issues/Risks in kanban mode.</p>
          </div>
        </div>
      </div>
    </div> -->

    <sweet-modal
      class="new_form_modal"
      ref="newFormModal"
      :hide-close-button="true"
      :blocking="true"
      v-if="viewPermit(currentTab, 'write')"
      >
      <div v-if="currentFacility && ('id' in currentFacility) && fixedStageId" class="w-100">
        <task-form
          v-if="currentTab === 'tasks'"
          :facility="currentFacility"
          :fixed-stage="fixedStageId"
          @on-close-form="onCloseForm"
          @task-created="handleNewTask"
          class="form-inside-modal"
        ></task-form>

        <issue-form
          v-if="currentTab === 'issues'"
          :facility="currentFacility"
          :fixed-stage="fixedStageId"
          @issue-created="handleNewIssue"
          @on-close-form="onCloseForm"
          class="form-inside-modal"
        ></issue-form>

        <risk-form
          v-if="currentTab === 'risks'"
          :facility="currentFacility"
          :fixed-stage="fixedStageId"
          @issue-created="handleNewRisk"
          @on-close-form="onCloseForm"
          class="form-inside-modal"
        ></risk-form>
      </div>
    </sweet-modal>
  </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import {SweetModal} from 'sweet-modal-vue'
  import Kanban from './../shared/kanban'
  import CustomTabs from './../shared/custom-tabs'
  import FacilitySidebar from './facilities/facility_sidebar'
  import IssueForm from "./issues/issue_form"
  import TaskForm from "./tasks/task_form"
  import RiskForm from "./risks/risk_form"
  import * as Moment from 'moment'
  import {extendMoment} from 'moment-range'
  const moment = extendMoment(Moment)

  export default {
    name: 'KanbanView',
    components: {
      Kanban,
      CustomTabs,
      FacilitySidebar,
      IssueForm,
      TaskForm,
      RiskForm,
      SweetModal
    },
    data() {
      return {
        tabs: [
          {
            label: 'Tasks',
            key: 'tasks',
            closable: false
          },
          {
            label: 'Issues',
            key: 'issues',
            closable: false
          },
          // {
          //   label: 'Risks (Coming Soon)',
          //   key: 'risks',
          //   disabled: true,
          //   closable: false
          // }
        ],
        currentTab: 'tasks',
        expanded: {
          id: ''
        },
        fixedStageId: null,
        viewList: 'all',
        listOptions: ['active','all', 'completed'],
        currentFacility: {},
        currentFacilityGroup: {},
        expandFilter: false,
        searchTasksQuery: '',
        searchIssuesQuery: '',
        searchRisksQuery: '',
        searchStageId: null,
        sidebarTasksQuery: '',
        sidebarIssuesQuery: '',
        sidebarRisksQuery: ''
      }
    },
    mounted() {
      // make the first facility_group expanded
      if (this.filteredFacilityGroups.length) this.expandFacilityGroup(this.filteredFacilityGroups[0])

    },
    methods: {
      ...mapMutations([
        'setAdvancedFilter',
        'setTaskIssueOverdueFilter',
        'setMyActionsFilter',
        'setOnWatchFilter',
        'setIssueSeverityFilter',
        'setIssueTypeFilter',
        'setTaskTypeFilter',
        'updateTasksHash',
        'updateIssuesHash',
        'updateRisksHash'
      ]),
      ...mapActions([
        'taskUpdated'
      ]),
      onChangeTab(tab) {
        this.currentTab = tab ? tab.key : 'tasks'
      },
      showFacility(facility) {
        this.currentFacility = facility
      },
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
      handleAddNew(stage) {
        if (!this.viewPermit(this.currentTab, 'write')) return
        this.fixedStageId = stage.id
        this.$refs.newFormModal && this.$refs.newFormModal.open()
      },
      onCloseForm() {
        this.fixedStageId = null
        this.$refs.newFormModal && this.$refs.newFormModal.close()
      },
      handleNewTask(task) {
        let cb = () => this.updateTasksHash({task: task})
        this.taskUpdated({facilityId: task.facilityId, projectId: task.projectId, cb}).then((facility) => this.currentFacility = facility)
        this.onCloseForm()
      },
      handleNewIssue(issue) {
        let cb = () => this.updateIssuesHash({issue: issue})
        this.taskUpdated({facilityId: issue.facilityId, projectId: issue.projectId, cb}).then((facility) => this.currentFacility = facility)
        this.onCloseForm()
      },
      handleNewRisk(risk) {
        let cb = () => this.updateRisksHash({risk: risk})
        this.taskUpdated({facilityId: risk.facilityId, projectId: risk.projectId, cb}).then((facility) => this.currentFacility = facility)
        this.onCloseForm()
      },
      handleSearchQueryChange(searchElement){
        this.searchStageId = $(searchElement).attr("data-stage-id")
        if ($(searchElement).attr("data-kanban-type") == "issues") {
          this.searchIssuesQuery = $(searchElement).val()
        }
        if ($(searchElement).attr("data-kanban-type") == "tasks") {
          this.searchTasksQuery = $(searchElement).val()
        }
      }
    },
    computed: {
      ...mapGetters([
        'getRiskApproachFilter',
        'getRiskPriorityLevelFilter',
        'getAdvancedFilterOptions',
        'filterDataForAdvancedFilter',
        'taskIssueProgressFilter',
        'getTaskIssueUserFilter',
        'getAdvancedFilter',
        'getTaskIssueProgressStatusOptions',
        'getTaskIssueProgressStatusFilter',
        'getTaskIssueTabFilterOptions',
        'getTaskIssueOverdueOptions',
        'taskIssueOverdueFilter',
        'noteDateFilter',
        'taskIssueDueDateFilter',
        'contentLoaded',
        'filteredFacilityGroups',
        'taskStages',
        'issueStages',
        'riskStages',
        'taskTypeFilter',
        'taskStageFilter',
        'issueStageFilter',
        'riskStageFilter',
        'myActionsFilter',
        'onWatchFilter',
        'issueTypeFilter',
        'issueSeverityFilter',
        'viewPermit',
        'facilityGroupFacilities',
        'taskTypes',
        'issueTypes',
        'issueSeverities'
      ]),
      filteredTasks() {
        let typeIds = _.map(this.C_taskTypeFilter, 'id')
        let stageIds = _.map(this.taskStageFilter, 'id')
        const search_query = this.exists(this.searchTasksQuery.trim()) ? new RegExp(_.escapeRegExp(this.searchTasksQuery.trim().toLowerCase()), 'i') : null
        const sidebar_search_query = this.exists(this.sidebarTasksQuery.trim()) ? new RegExp(_.escapeRegExp(this.sidebarTasksQuery.trim().toLowerCase()), 'i') : null
        let noteDates = this.noteDateFilter
        let taskIssueDueDates = this.taskIssueDueDateFilter
        let taskIssueProgress = this.taskIssueProgressFilter

        let taskIssueUsers = this.getTaskIssueUserFilter
        var filterDataForAdvancedFilterFunction = this.filterDataForAdvancedFilter

        return _.orderBy(_.filter(this.currentFacility.tasks, (resource) => {
          let valid = Boolean(resource && resource.hasOwnProperty('progress'))
          if (typeIds.length > 0) valid = valid && typeIds.includes(resource.taskTypeId)
          if (stageIds.length > 0) valid = valid && stageIds.includes(resource.taskStageId)
          let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

          if (taskIssueUsers.length > 0) {
            if (taskIssueUsers.length > 0) {
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }

          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && filterDataForAdvancedFilterFunction([resource], 'kanbanTasks')

          if (noteDates && noteDates[0] && noteDates[1]) {
            let startDate = moment(noteDates[0], "YYYY-MM-DD")
            let endDate = moment(noteDates[1], "YYYY-MM-DD")
            let _notesCreatedAt = _.map(resource.notes, 'createdAt')
            let is_valid = resource.notes.length > 0
            for(let createdAt of _notesCreatedAt){
              let nDate = moment(createdAt, "YYYY-MM-DD")
              is_valid = nDate.isBetween(startDate, endDate, 'days', true)
              if(is_valid) break
            }
            valid = valid && is_valid
          }

          if (taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]) {
            let startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
            let endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")
            let is_valid = true
            let nDate = moment(resource.dueDate, "YYYY-MM-DD")
            is_valid = nDate.isBetween(startDate, endDate, 'days', true)
            valid = valid && is_valid
          }

          if (taskIssueProgress && taskIssueProgress[0]) {
            let min = taskIssueProgress[0].value.split("-")[0]
            let max = taskIssueProgress[0].value.split("-")[1]
            valid = valid && (resource.progress >= min && resource.progress <= max)
          }

          if (search_query) valid = valid && search_query.test(resource.text)
          if (sidebar_search_query) valid = valid && sidebar_search_query.test(resource.text)
          return valid
        }), 'kanbanOrder', 'asc')
      },
      C_kanbanTaskFilter: {
        get() {
          return this.getAdvancedFilter
        },
        set(value) {
          this.setAdvancedFilter(value)
        }
      },
      C_myTasks: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('tasks')
        },
        set(value) {
          if (value) this.setMyActionsFilter([...this.myActionsFilter, {name: "My Tasks", value: "tasks"}])
          else this.setMyActionsFilter(this.myActionsFilter.filter(f => f.value !== "tasks"))
        }
      },
      C_taskTypeFilter: {
        get() {
          return this.taskTypeFilter
        },
        set(value) {
          this.setTaskTypeFilter(value)
        }
      },
      C_onWatchTasks: {
        get() {
          return _.map(this.onWatchFilter, 'value').includes('tasks')
        },
        set(value) {
          if (value) this.setOnWatchFilter([...this.onWatchFilter, {name: "On Watch Tasks", value: "tasks"}])
          else this.setOnWatchFilter(this.onWatchFilter.filter(f => f.value !== "tasks"))
        }
      },
      filteredIssues() {
        let typeIds = _.map(this.C_issueTypeFilter, 'id')
        let taskTypeIds = _.map(this.C_taskTypeFilter, 'id')
        let severityIds = _.map(this.C_issueSeverityFilter, 'id')
        let stageIds = _.map(this.issueStageFilter, 'id')
        const search_query = this.exists(this.searchIssuesQuery.trim()) ? new RegExp(_.escapeRegExp(this.searchIssuesQuery.trim().toLowerCase()), 'i') : null
        const sidebar_search_query = this.exists(this.sidebarIssuesQuery.trim()) ? new RegExp(_.escapeRegExp(this.sidebarIssuesQuery.trim().toLowerCase()), 'i') : null
        let noteDates = this.noteDateFilter
        let taskIssueDueDates = this.taskIssueDueDateFilter
        let taskIssueProgress = this.taskIssueProgressFilter

        let taskIssueUsers = this.getTaskIssueUserFilter

        return _.orderBy(_.filter(this.currentFacility.issues, (resource) => {
          let valid = Boolean(resource && resource.hasOwnProperty('progress'))

          let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

          if (taskIssueUsers.length > 0) {
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }

          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && this.filterDataForAdvancedFilter([resource], 'kanbanIssues')

          if (typeIds.length > 0) valid = valid && typeIds.includes(resource.issueTypeId)
          if (taskTypeIds.length > 0) valid = valid && taskTypeIds.includes(resource.taskTypeId)

          if (noteDates && noteDates[0] && noteDates[1]) {
            let startDate = moment(noteDates[0], "YYYY-MM-DD")
            let endDate = moment(noteDates[1], "YYYY-MM-DD")
            let _notesCreatedAt = _.map(resource.notes, 'createdAt')
            let is_valid = resource.notes.length > 0
            for (let createdAt of _notesCreatedAt) {
              let nDate = moment(createdAt, "YYYY-MM-DD")
              is_valid = nDate.isBetween(startDate, endDate, 'days', true)
              if(is_valid) break
            }
            valid = is_valid
          }

          if (taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]) {
            let startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
            let endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")
            let is_valid = true
            let nDate = moment(resource.dueDate, "YYYY-MM-DD")
            is_valid = nDate.isBetween(startDate, endDate, 'days', true)
            valid = is_valid
          }

          if (taskIssueProgress && taskIssueProgress[0]) {
            let min = taskIssueProgress[0].value.split("-")[0]
            let max = taskIssueProgress[0].value.split("-")[1]
            valid = valid && (resource.progress >= min && resource.progress <= max)
          }

          if (this.searchStageId && this.searchStageId == resource.issueStageId) {
            if (search_query) valid = valid && search_query.test(resource.title)
          } else if(stageIds.length > 0) {
            valid = valid && stageIds.includes(resource.issueStageId)
          }
          if (sidebar_search_query) valid = valid && sidebar_search_query.test(resource.title)
          if (severityIds.length > 0) valid = valid && severityIds.includes(resource.issueSeverityId)

          return valid
        }), 'kanbanOrder', 'asc')
      },
      C_issueTypeFilter: {
        get() {
          return this.issueTypeFilter
        },
        set(value) {
          this.setIssueTypeFilter(value)
        }
      },
      C_issueSeverityFilter: {
        get() {
          return this.issueSeverityFilter
        },
        set(value) {
          this.setIssueSeverityFilter(value)
        }
      },
      C_myIssues: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('issues')
        },
        set(value) {
          if (value) this.setMyActionsFilter([...this.myActionsFilter, {name: "My Issues", value: "issues"}])
          else this.setMyActionsFilter(this.myActionsFilter.filter(f => f.value !== "issues"))
        }
      },
      C_onWatchIssues: {
        get() {
          return _.map(this.onWatchFilter, 'value').includes('issues')
        },
        set(value) {
          if (value) this.setOnWatchFilter([...this.onWatchFilter, {name: "On Watch Issues", value: "issues"}])
          else this.setOnWatchFilter(this.onWatchFilter.filter(f => f.value !== "issues"))
        }
      },

      filteredRisks() {
        let taskTypeIds = _.map(this.C_taskTypeFilter, 'id')
        let stageIds = _.map(this.riskStageFilter, 'id')
        const search_query = this.exists(this.searchRisksQuery.trim()) ? new RegExp(_.escapeRegExp(this.searchRisksQuery.trim().toLowerCase()), 'i') : null
        const sidebar_search_query = this.exists(this.sidebarRisksQuery.trim()) ? new RegExp(_.escapeRegExp(this.sidebarRisksQuery.trim().toLowerCase()), 'i') : null

        let noteDates = this.noteDateFilter
        let taskIssueDueDates = this.taskIssueDueDateFilter
        let taskIssueProgress = this.taskIssueProgressFilter
        let taskIssueUsers = this.getTaskIssueUserFilter

        let riskPriorityLevelFilterIds = _.map(this.getRiskPriorityLevelFilter, 'id')

        let riskApproachIds = _.map(this.getRiskApproachFilter, 'id')

        return _.orderBy(_.filter(this.currentFacility.risks, (resource) => {
          let valid = Boolean(resource && resource.hasOwnProperty('progress'))

         let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

          if (taskIssueUsers.length > 0) {
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }

          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && this.filterDataForAdvancedFilter([resource], 'kanbanRisks')

          if (taskTypeIds.length > 0) valid = valid && taskTypeIds.includes(resource.taskTypeId)

          if (noteDates && noteDates[0] && noteDates[1]) {
            let startDate = moment(noteDates[0], "YYYY-MM-DD")
            let endDate = moment(noteDates[1], "YYYY-MM-DD")
            let _notesCreatedAt = _.map(resource.notes, 'createdAt')
            let is_valid = resource.notes.length > 0
            for (let createdAt of _notesCreatedAt) {
              let nDate = moment(createdAt, "YYYY-MM-DD")
              is_valid = nDate.isBetween(startDate, endDate, 'days', true)
              if(is_valid) break
            }
            valid = is_valid
          }

          if (taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]) {
            let startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
            let endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")
            let is_valid = true
            let nDate = moment(resource.dueDate, "YYYY-MM-DD")
            is_valid = nDate.isBetween(startDate, endDate, 'days', true)
            valid = is_valid
          }

          if (taskIssueProgress && taskIssueProgress[0]) {
            let min = taskIssueProgress[0].value.split("-")[0]
            let max = taskIssueProgress[0].value.split("-")[1]
            valid = valid && (resource.progress >= min && resource.progress <= max)
          }

          if (riskApproachIds.length > 0) valid = valid && riskApproachIds.includes(resource.riskApproach)

          if (riskPriorityLevelFilterIds.length > 0) valid = valid && riskPriorityLevelFilterIds.includes(resource.priorityLevelName.toLowerCase())

          if (this.searchStageId && this.searchStageId == resource.issueStageId) {
            if (search_query) valid = valid && search_query.test(resource.title)
          } else if(stageIds.length > 0) {
            valid = valid && stageIds.includes(resource.issueStageId)
          }
          if (sidebar_search_query) valid = valid && sidebar_search_query.test(resource.title)

          return valid
        }), 'kanbanOrder', 'asc')
      },
      C_myRisks: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('risks')
        },
        set(value) {
          if (value) this.setMyActionsFilter([...this.myActionsFilter, {name: "My Risks", value: "risks"}])
          else this.setMyActionsFilter(this.myActionsFilter.filter(f => f.value !== "risks"))
        }
      },
      C_onWatchRisks: {
        get() {
          return _.map(this.onWatchFilter, 'value').includes('risks')
        },
        set(value) {
          if (value) this.setOnWatchFilter([...this.onWatchFilter, {name: "On Watch Risks", value: "risks"}])
          else this.setOnWatchFilter(this.onWatchFilter.filter(f => f.value !== "risks"))
        }
      },
      filterTaskStages() {
        let stageIds = _.map(this.taskStageFilter, 'id')
        return _.filter(this.taskStages, s => stageIds && stageIds.length ? stageIds.includes(s.id) : true)
      },
      filterIssueStages() {
        let stageIds = _.map(this.issueStageFilter, 'id')
        return _.filter(this.issueStages, s => stageIds && stageIds.length ? stageIds.includes(s.id) : true)
      },
      filterRiskStages() {
        let stageIds = _.map(this.riskStageFilter, 'id')
        return _.filter(this.riskStages, s => stageIds && stageIds.length ? stageIds.includes(s.id) : true)
      },
      C_kanban() {
        let stages = [];
        let cards = [];
        if (this.currentTab == 'tasks') {
          stages = this.filterTaskStages
          cards = this.filteredTasks
        } else if (this.currentTab == 'issues') {
          stages = this.filterIssueStages
          cards = this.filteredIssues
        } else if (this.currentTab == 'risks') {
          stages = this.filterRiskStages
          cards = this.filteredRisks
        }
        return { stages, cards }
      }
    },
    watch: {
      filteredFacilityGroups: {
        handler(value) {
          if (!(this.currentFacilityGroup && _.map(value, 'id').includes(this.currentFacilityGroup.id))) {
            this.currentFacilityGroup = {}
            this.currentFacility = {}
            this.expanded.id = ''
          }
          else {
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
      currentFacilityGroup: {
        handler(value) {
          if (!('id' in value)) this.expandFilter = false
        }, deep: true
      },
      "expanded.id"(value) {
        if (!value) this.expandFilter = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  #kanban-view {
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
    .center-section {
      box-shadow: 0 10px 20px rgba(56,56, 56,0.19), 0 6px 6px rgba(56,56,56,0.23);
      border: 1px solid #383838;
      border-radius: 4px;
      padding: 10px;
      width: 25rem;
      margin: 10rem auto;
    }
  }
  .light {
    font-weight: 300 !important;
  }
  .row [class*='col-'] {
    transition: .2s ease-in-out;
  }
  .facilitySidebar {
    width: 200px;
    max-width: 200px;
    min-width: 200px;
  }
  input[type=search] {
    color: #383838;
    text-align: left;
    cursor: pointer;
    display: block;
  }
  .kanban-tab {
    margin-bottom: 20px !important;
  }
  .expandBtn {
    position: absolute;
    top: 50px;
    left: -12px;
    padding: 5px;
    border-radius: 50%;
    height: 25px;
    color: #fff;
    background-color: #17a2b8;
    font-size: 18px;
    width: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .simple-select /deep/ .multiselect {
    width: 230px;
  }
  .new_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .new_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
      min-width: 80vw;
      max-height: 80vh;
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
</style>
