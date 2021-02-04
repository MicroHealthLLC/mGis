<template>
  <div id="facility_sidebar">
    <div class="row">
      <div class="col-md-2 facility-groups-tab">
        <facility-sidebar
          :current-facility-group="currentFacilityGroup"
          :expanded="expanded"
          :current-facility="currentFacility"
          @on-expand-facility-group="expandFacilityGroup"
          @on-expand-facility="showFacility"
        ></facility-sidebar>
      </div>
       <div class="col-md-4 facility-show-tab px-4" v-if="isFacilityManagerView">
        <div class="my-3">
          <facility-show
            v-if="C_showFacilityTab"
            from="manager_view"
            :facility="currentFacility"
            :facility-group="currentFacilityGroup"
          ></facility-show>
<!--           <facility-rollup
            v-else
            :facility-group="C_showFacilityRollup ? currentFacilityGroup : null"
            from="manager_view"
          ></facility-rollup> -->
        </div>
      </div>
        <div class="col-md-6 facility-forms-tab" v-if="isFacilityManagerView">
        <div class="default-background">
          <div class="bg-white mt-4">
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
              @close-note-input="newNote=false"
              @note-created="createdFacilityNote"
              @note-updated="updatedFacilityNote"
            ></notes-form>

            <risk-form
              v-else-if="managerView.risk"
              from="manager_view"
              :facility="currentFacility"
              :risk="managerView.risk"
              @risk-created="updateFacilityRisk"
              @risk-updated="updateFacilityRisk"
            ></risk-form>

            <div v-else class="center-section text-center">
              <i class="fa fa-tasks font-lg text-center" style="font-size:1.8rem"></i>
              <p>View, Add or Edit Tasks, Issues, Risks and Notes here.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sheets View starts here -->

       <div class="col-md-10 facility-show-tab px-4" data-cy="sheets_view" style="background-color: solid #ededed 15px" v-if="isSheetsView" v-loading="!contentLoaded" element-loading-text="Fetching your data. Please wait..." element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <div class="mt-3">
          <facility-sheets 
            v-if="C_showFacilityTab"
            from="manager_view"
            :facility="currentFacility"
            :facility-group="currentFacilityGroup"
          ></facility-sheets>
          <!-- <facility-rollup v-else></facility-rollup> -->
        </div>
        <div v-if="isSheetsView">   
          <sweet-modal
            class="form_modal"
            ref="formModals"
            :hide-close-button="true"
            :blocking="true"
            >           
          <div v-if="managerView.task || managerView.issue || managerView.risk || managerView.note " class="w-100" >
            <task-form
              v-if="managerView.task"
              :facility="currentFacility"
              :task="managerView.task"
              title="Edit Task"
              @task-created="updateFacilityTask"
              @task-updated="updateFacilityTask"
              class="form-inside-modal"
            ></task-form>
            <risk-form
              v-if="managerView.risk"
              :facility="currentFacility"
              :risk="managerView.risk"          
              @risk-created="updateFacilityRisk"
              @risk-updated="updateFacilityRisk"
              class="form-inside-modal"
            ></risk-form>
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
          </sweet-modal>
         </div>
      
      </div>

      <!-- Sheets View ends here -->

      <!-- Kanban Starts here -->
       <div class="col-md-10 facility-show-tab pr-3" data-cy="sheets_view" style="background-color: solid #ededed 15px" v-if="isKanbanView" >
           <custom-tabs :current-tab="currentTab" :tabs="tabs" @on-change-tab="onChangeTab" class="tab pt-3 float-left" badge-margin="4px" />
             <div class="d-inline align-item-center kanban-filters-bar w-100">
       
            <div v-if="currentTab === 'tasks'">              
                 <div class="searchBar input-group w-25 mr-1 d-inline-flex">
                    <div class="input-group-prepend d-inline">
                     <span class="input-group-text searchB"><i class="fa fa-search"></i></span>
                    </div>
                    <input
                      type="search"                
                      class="form-control searchB form-control-sm"
                      placeholder="Search Tasks"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      v-model="sidebarTasksQuery"
                      data-cy="search_tasks"
                    />
                  </div>

                  <div class="simple-select w-25  d-inline mr-1" style="position:absolute">
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

                   <div class="simple-select w-25 d-inline" style="position:absolute;right: 23.8%">
                    <label class="font-sm mb-0">Flags</label>
                    <multiselect v-model="C_kanbanTaskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                   <!-- <div class="form-check my-4 pl-0" data-cy="search_task_total">
                    <label class="form-check-label text-primary">
                     <h5> Total: {{filteredTasks.length}}</h5>
                    </label>
                  </div> -->
                </div>
                        
              <div v-if="currentTab === 'issues'">
              
                  <div class="searchBar input-group w-25 mr-1 d-inline-flex">
                    <div class="input-group-prepend d-inline">
                      <span class="input-group-text searchB"><i class="fa fa-search"></i></span>
                    </div>
                    <input
                      type="search"                   
                      class="form-control searchB form-control-sm"
                      placeholder="Search Issues"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      v-model="sidebarIssuesQuery"
                      data-cy="search_issues"
                    />
                  </div>
                  <div class="simple-select w-25 mr-1 d-inline" style="position:absolute">
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
                     <div class="simple-select w-25 d-inline" style="position:absolute;right: 23.8%">
                    <label class="font-sm mb-0">Flags</label>
                    <multiselect v-model="C_kanbanTaskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                     <!-- <div class="simple-select w-25 d-inline-block">
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
                   </div> -->

                    <!-- <div class="simple-select w-25 d-inline-block">
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
                  </div> -->
                   <!-- <div class="form-check my-4 pl-0" data-cy="search_issue_total">
                    <label class="form-check-label text-primary">
                      <h5>Total: {{filteredIssues.length}}</h5>
                    </label>
                  </div>              -->
                </div>




              <div v-if="currentTab === 'risks'">              
                  <div class="searchBar input-group w-25 d-inline-flex mr-1">
                    <div class="input-group-prepend d-inline">
                      <span class="input-group-text searchB"><i class="fa fa-search"></i></span>
                    </div>
                    <input
                      type="search"                
                      class="form-control searchB form-control-sm"
                      placeholder="Search Risks"
                      aria-label="Search"
                      aria-describedby="search-addon"
                      v-model="sidebarRisksQuery"
                      data-cy="search_risks"
                    />
                  </div>
                           
                  <div class="simple-select w-25 d-inline" style="position:absolute">
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
                  <div class="simple-select w-25 d-inline" style="position:absolute;right: 23.8%">
                    <label class="font-sm mb-0">Flags</label>
                    <multiselect v-model="C_kanbanTaskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                <!-- <div class="mx-2 mb-3 font-sm">
                  <div class="form-check my-4 pl-0" data-cy="search_risk_total">
                    <label class="form-check-label text-primary">
                      <h5>Total: {{filteredRisks.length}}</h5>
                    </label>
                  </div>
                </div>         -->
              </div>
              </div>
         <sweet-modal
          class="form_modal"
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
          @create-duplicate-task="createDuplicateTask"
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
          @risk-created="handleNewRisk"
          @on-close-form="onCloseForm"
          class="form-inside-modal"
        ></risk-form>
      </div>
    </sweet-modal>
    
      <div class="kanban-tab">
        <!-- <div v-if="currentFacilityGroup && ('id' in currentFacilityGroup)">         
        </div> -->

        <div>
         <!-- <div class="mt-0 ml-3" style="position:absolute"  v-if="currentFacility">
           <h5 class="mb-0 pb-1"> {{ currentFacility.facilityName }}</h5>
         </div> -->
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
    </div> 
       </div>
      
      <!-- Kanban ends here -->
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import {SweetModal} from 'sweet-modal-vue'
  import CustomTabs from './custom-tabs'
  import FacilityShow from './../dashboard/facilities/facility_show'
  import FacilitySheets from './../dashboard/facilities/facility_sheets'
  import FacilityRollup from './../dashboard/facilities/facility_rollup'
  import FacilitySidebar from './../dashboard/facilities/facility_sidebar'
  import TaskForm from "./../dashboard/tasks/task_form"
  import IssueForm from "./../dashboard/issues/issue_form"
  import NotesForm from "./../dashboard/notes/notes_form"
  import RiskForm from "./../dashboard/risks/risk_form"
  import KanbanView from './../dashboard/kanban_view.vue'
  import Kanban from "./kanban"

  export default {
    name: "StateFacilitySidebar",
     components: {
     FacilitySidebar,
     CustomTabs,
     FacilityRollup,
     FacilitySheets,
     FacilityShow,
     SweetModal,
     TaskForm,
     IssueForm,
     NotesForm,
     RiskForm,
     Kanban, 
     KanbanView
    
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
          {
            label: 'Risks',
            key: 'risks',        
            closable: false
          }
        ],
        currentTab: 'tasks',
        expanded: {
          id: ''
        },
        currentFacility: {},
        currentFacilityGroup: {},
        currentTab: 'tasks',
        fixedStageId: null,
        viewList: 'all',
        listOptions: ['active','all', 'completed'],  
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
    computed: {
      ...mapGetters([ 
        'managerView',
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

          if (this.searchStageId && this.searchStageId == resource.riskStageId) {
            if (search_query) valid = valid && search_query.test(resource.title)
          } else if(stageIds.length > 0) {
            valid = valid && stageIds.includes(resource.riskStageId)
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
            C_showFacilityTab() {
        return !_.isEmpty(this.currentFacility) && !_.isEmpty(this.currentFacilityGroup)
      },
      C_showFacilityRollup() {
        return !_.isEmpty(this.currentFacilityGroup)
      },
      isFacilityManagerView() {
        return this.$route.name === 'FacilityManagerView'
      },
      isSheetsView() {
        return this.$route.name === 'ProjectSheets'
      },
      isKanbanView() {
        return this.$route.name === 'ProjectKanbanView'
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
    methods: {
      ...mapMutations([        
        'updateIssuesHash',
        'updateRisksHash',
        'setTaskForManager',
        'setRiskForManager',
        'setAdvancedFilter',
        'setTaskIssueOverdueFilter',
        'setMyActionsFilter',
        'setOnWatchFilter',
        'setIssueSeverityFilter',
        'setIssueTypeFilter',
        'setTaskTypeFilter',
        'updateTasksHash',               
      ]),
      ...mapActions([
        'taskUpdated'
      ]),
       onChangeTab(tab) {
        this.currentTab = tab ? tab.key : 'tasks'
      },
      expandFacilityGroup(group) {
        if (group.id == this.expanded.id) {
          this.expanded.id = ''
          //this.currentFacilityGroup = {}
        }
        else {
          this.expanded.id = group.id
          this.currentFacilityGroup = group
          this.currentFacility = this.facilityGroupFacilities(group)[0] || {}

        }
        //this.currentFacility = {}
      },
      handleAddNew(stage) {
        if (!this.viewPermit(this.currentTab, 'write')) return
        this.fixedStageId = stage.id
        this.$refs.newFormModal && this.$refs.newFormModal.open()
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
        var facilities =  this.facilityGroupFacilities(this.currentFacilityGroup)
        var f = facilities.find((t) => t.facilityId === note.noteableId);
        if(!f.notes){
          f.notes = []
        }
        f.notes.unshift(note)
        this.currentFacility = f
        this.setTaskForManager({key: 'note', value: null})
      },
      updatedFacilityNote(note) {
        var facilities =  this.facilityGroupFacilities(this.currentFacilityGroup)
        var f = facilities.find((t) => t.facilityId === note.noteableId);
        if(!f.notes){
          f.notes = []
        }
        if(note.noteableId == this.currentFacility.facilityId ){
          var index = this.currentFacility.notes.findIndex(n => n.id == note.id)
          if (index > -1) Vue.set(this.currentFacility.notes, index, note)
        }else{
          var index = this.currentFacility.notes.findIndex(n => n.id == note.id)
          if (index > -1) this.currentFacility.notes.splice(index, 1)
          f.notes.unshift(note)
          //this.currentFacility = f
        }

        this.setTaskForManager({key: 'note', value: null})
      },
      updateFacilityRisk(risk) {
        let cb = () => this.updateRisksHash({risk: risk})
        this.taskUpdated({facilityId: risk.facilityId, projectId: risk.projectId, cb}).then((facility) => this.currentFacility = facility)
        this.setTaskForManager({key: 'risk', value: null})
      },
      goBackFromEdits() {
        this.setTaskForManager({key: 'task', value: null})
        this.setTaskForManager({key: 'issue', value: null})
        this.setTaskForManager({key: 'note', value: null})
        this.setTaskForManager({key: 'risk', value: null})
        this.setRiskForManager({key: 'risk', value: null})
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
        if ($(searchElement).attr("data-kanban-type") == "risks") {
          this.searchIssuesQuery = $(searchElement).val()
        }
      },
    },
    watch: {
      currentFacility: {
        handler(value, previous) {
          if (_.isEmpty(value) || value.id !== previous.id) {
            this.goBackFromEdits()
          }
        }, deep: true
      },
        managerView: {
        handler(value) {
          if (value.task || value.issue || value.note || value.risk) {
            this.$refs.formModals && this.$refs.formModals.open()
          } else {
            this.$refs.formModals && this.$refs.formModals.close()
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
          // NOTE: https://github.com/MicroHealthLLC/mGis/issues/1037
          if(!this.currentFacilityGroup.id && value[0]){
            this.currentFacility = this.facilityGroupFacilities(value[0])[0] || {}
            this.currentFacilityGroup = value[0]
            this.expanded.id = value[0].id
          }
        }, deep: true
      }
    }
  };
</script>

<style lang="scss" scoped>
  #facility_sidebar {
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
  /deep/.tab {    
    background-color: #ededed;
    position: absolute;
    width:min-content;
    padding-bottom: 13.7px;
    z-index: 100;
    border-top:solid .3px #ededed;
    padding-left:5px;
    padding-right:5px;
    box-shadow: 0 2.5px 2.5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
  }
  .searchBar {
    margin-top: 24px;
  }
  .searchB {
    height:32px;
  }
  .kanban-filters-bar {
    background-color: #fff;
    border-top:solid .3px #ededed;
    padding-bottom: 9px;
    margin-left:200px;
    position: absolute;
    z-index: 10; 
    padding-left: 10px;
    box-shadow: 0 2.5px 2.5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
  }
  .form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .form_modal.sweet-modal-overlay /deep/ .sweet-modal {
    min-width: 80vw;
    max-height: 90vh;
    background-color: #ededed;
    .sweet-content {    
      text-align: unset;
      padding: 10px;
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
