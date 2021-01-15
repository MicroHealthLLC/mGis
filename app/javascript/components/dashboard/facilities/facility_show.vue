<!--  NOTE: This file is used in Facility Manager view as overview tab -->

<template>
  <div id="facility-show">
    <div class="position-sticky" v-if="!loading">
      <div class="d-flex align-items-center my-2">
        <span class="fbody-icon"><i class="fas fa-building"></i></span>
        <h4 class="f-head mb-0">{{DV_facility.facilityName}}</h4>
      </div>
      <div class="facility-tab mb-4">
        <custom-tabs :current-tab="currentTab" :tabs="tabs" @on-change-tab="onChangeTab" class="custom-tab" />
      </div>
      <div>
        <div v-if="currentTab == 'overview'">
          <div v-if="_isallowed('read')" class="fac-sum p-3">
            <h4 v-if="extras" class="text-center"><b>Facility Summary</b></h4>
            <div v-if="contentLoaded" class="f-body mt-3 p-2">
              <p class="mt-2">
                <span class="fbody-icon"><i class="fas fa-globe mr-0"></i></span>
                <span style="font-weight:700">Facility Group: </span>
                <span> {{facilityGroup.name}}</span>
              </p>
              <div>
                <p class="mt-2 d-flex align-items-center">
                  <span class="fbody-icon"><i class="fas fa-calendar-alt"></i></span>
                    <span style="font-weight:700; margin-right: 4px">Project Completion Date: </span>
                  <v2-date-picker
                    v-model="DV_facility.dueDate"
                    value-type="YYYY-MM-DD"
                    format="DD MMM YYYY"
                    class="w-80 vue2-datepicker"
                    @input="onChange"
                    placeholder="DD MM YYYY"
                    :disabled="!_isallowed('write') || !DV_facility.statusId"
                  />
                </p>
                <p v-if="!DV_facility.statusId && _isallowed('write')" class="ml-4 text-danger">Status must be updated before you can enter a Due Date</p>
                <p class="mt-2 d-flex align-items-center">
                  <span class="fbody-icon"><i class="fas fa-info-circle"></i></span>
                  <span style="font-weight:700; margin-right: 4px">Project Status: </span>
                  <span class="simple-select w-70 mt-2">
                    <multiselect
                      v-model="selectedStatus"
                      track-by="id"
                      label="name"
                      placeholder="No Status Selected"
                      :options="statuses"
                      :searchable="false"
                      select-label="Select"
                      deselect-label="Remove"
                      @select="onChange"
                      :disabled="!_isallowed('write')"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </span>
                </p>
              </div>
              <p class="mt-2 d-flex align-items-center">
                <span class="fbody-icon"><i class="fas fa-spinner"></i></span>
                <span style="font-weight:700; margin-right: 4px">Facility Progress: </span>
                <span class="w-50 progress pg-content" :class="{'progress-0': DV_facility.progress <= 0}">
                  <div class="progress-bar bg-info" :style="`width: ${DV_facility.progress}%`">{{DV_facility.progress}}%</div>
                </span>
              </p>
              <p class="mt-2 d-flex align-items-center">
                  <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
                  <span style="font-weight:700; margin-right: 4px">Task Category: </span>
                  <multiselect
                    v-model="C_taskTypeFilter"
                    track-by="name"
                    label="name"
                    class="ml-2 milestones w-50"
                    placeholder="Filter by Task Category"
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
                </p>        
              <p class="mt-2 d-flex align-items-center">
                <span class="fbody-icon"><i class="fas fa-sliders-h"></i></span>
                <span style="font-weight:700; margin-right: 4px">Data Set Filters:</span>
                <p>
                  <div v-for="filterArray in getAllFilterNames">
                    <div class="col-md-12 font-md" v-if="getFilterValue(filterArray[0])">
                      <span style="font-weight:700;margin-left:10px">{{filterArray[1]}}: </span><span>{{getFilterValue(filterArray[0])}}</span>
                    </div>
                  </div>
                </p>
              </p>

              <hr>
              <div class="my-1 tasks">
                <h5 class="text-center">{{filteredTasks.length}} Tasks</h5>
                <div>
                  <div class="row">
                    <div class="col-md-9">
                      <span>Complete</span>
                      <span class="badge badge-secondary badge-pill">{{taskVariation.completed.count}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': taskVariation.completed.percentage <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${taskVariation.completed.percentage}%`">{{taskVariation.completed.percentage}} %</div>
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-9">
                      <span>Overdue</span>
                      <span class="badge badge-secondary badge-pill">{{taskVariation.overdue.count}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': taskVariation.overdue.percentage <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${taskVariation.overdue.percentage}%`">{{taskVariation.overdue.percentage}} %</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="taskStats.length > 0">
                <div class="text-info font-weight-bold text-center">Task Categories</div>
                <p>
                  <div class="row my-2" v-for="task in taskStats">
                    <div class="col-md-9 font-md">
                      <span>{{task.name}}</span>
                      <span class="badge badge-secondary badge-pill">{{task.count}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': task.progress <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${task.progress}%`">{{task.progress}} %</div>
                      </span>
                    </div>
                  </div>
                </p>
              </div>
              <hr>
              <div class="my-1 issues">
                <h5 class="text-center">{{filteredIssues.length}} Issues</h5>
                <div>
                  <div class="row">
                    <div class="col-md-9">
                      <span>Complete</span>
                      <span class="badge badge-secondary badge-pill">{{issueVariation.completed.count}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': issueVariation.completed.percentage <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${issueVariation.completed.percentage}%`">{{issueVariation.completed.percentage}} %</div>
                      </span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-9">
                      <span>Overdue</span>
                      <span class="badge badge-secondary badge-pill">{{issueVariation.overdue.count}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': issueVariation.overdue.percentage <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${issueVariation.overdue.percentage}%`">{{issueVariation.overdue.percentage}} %</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="issueStats.length > 0">
                <div class="text-info font-weight-bold text-center">Issue Types</div>
                <p>
                  <div class="row my-2" v-for="issue in issueStats">
                    <div class="col-md-9 font-md">
                      <span>{{issue.name}}</span>
                      <span class="badge badge-secondary badge-pill">{{issue.count}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': issue.progress <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${issue.progress}%`">{{issue.progress}} %</div>
                      </span>
                    </div>
                  </div>
                </p>
              </div>
              <hr>
              <p class="mt-2">
                <span class="fbody-icon"><i class="fas fa-map-marker"></i></span>
                <span>{{DV_facility.address || 'N/A'}}</span>
              </p>
              <p class="mt-2">
                <span class="fbody-icon"><i class="far fa-id-badge"></i></span>
                <span>{{DV_facility.pointOfContact || 'N/A'}}</span>
              </p>
              <p class="mt-2">
                <span class="fbody-icon"><i class="fas fa-phone"></i></span>
                <span>{{DV_facility.phoneNumber || 'N/A'}}</span>
              </p>
              <p class="mt-2">
                <span class="fbody-icon"><i class="far fa-envelope"></i></span>
                <span>{{DV_facility.email || 'N/A'}}</span>
              </p>
              <button v-if="_isallowed('write') && DV_updated" class="mt-2 btn btn-success btn-sm" @click="updateFacility" :disabled="!DV_updated">Save</button>
            </div>
            <div v-else class="m-4">
              <loader type="code"></loader>
              <loader type="code"></loader>
              <loader type="code"></loader>
            </div>
          </div>
          <div v-else class="text-danger mx-2 my-4">You don't have permission to read!</div>
        </div>

        <div v-if="currentTab == 'notes'">
          <notes-index
            :facility="DV_facility"
            :from="from"
            @refresh-facility="refreshFacility"
          ></notes-index>
        </div>
        <div v-if="currentTab == 'tasks'">
          <detail-show
            :facility="DV_facility"
            :from="from"
            @refresh-facility="refreshFacility"
          ></detail-show>
        </div>
        <div v-if="currentTab == 'issues'">
          <issue-index
            :facility="DV_facility"
            :from="from"
            @refresh-facility="refreshFacility"
          ></issue-index>
        </div>
        <div v-if="currentTab == 'risks'">
          <risk-index
            :facility="DV_facility"
            :from="from"
            @refresh-facility="refreshFacility"
          ></risk-index>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import http from './../../../common/http'
  import DetailShow from './detail_show'
  import NotesIndex from './../notes/notes_index'
  import IssueIndex from './../issues/issue_index'
  import RiskIndex from './../risks/risk_index'
  import CustomTabs from './../../shared/custom-tabs'
  import Loader from './../../shared/loader'
  import {mapGetters, mapMutations, mapActions} from 'vuex'

  export default {
    name: 'FacilitiesShow',
    components: {
      DetailShow,
      NotesIndex,
      IssueIndex,
      RiskIndex,
      CustomTabs,
      Loader
    },
    props: {
      facility: {
        default: null,
        type: Object
      },
      facilityGroup: {
        default: null,
        type: Object
      },
      extras: {
        default: true,
        type: Boolean
      },
      from: {
        default: "",
        type: String
      }
    },
    data() {
      return {
        loading: true,
        DV_updated: false,
        notesQuery: '',
        DV_facility: Object.assign({}, this.facility),
        selectedStatus: null,
        currentTab: 'tasks',
        tabs: [
          {
            label: 'Overview',
            key: 'overview',
            closable: false
          },
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
            closable: false,                      
          },
          {
            label: 'Notes',
            key: 'notes',
            closable: false
          },         
        ]
      }
    },
    mounted() {
      if (this.from == "manager_view") {
        this.loadFacility(this.facility)
      } else {
        this.getFacility()
      }
    },
    methods: {
      ...mapMutations([
        'setTaskTypeFilter',
        'updateFacilityHash',
        'nullifyTasksForManager'
      ]),
      ...mapActions([
        'fetchFacility'
      ]),
      onChangeTab(tab) {
        this.currentTab = tab ? tab.key : 'tasks'
      },
      loadFacility(facility) {
        this.DV_facility = Object.assign({}, facility)
        this.selectedStatus = this.statuses.find(s => s.id == this.DV_facility.statusId)
        this.loading = false
      },
      getFacility() {
        this.fetchFacility({projectId: this.currentProject.id, facilityId: this.DV_facility.id}).then(facility => {
          this.loadFacility(facility)
        }).catch((err) => {
          console.error(err)
        })
      },
      updateFacility(e) {
        if (e.target) e.target.blur()
        if (!this._isallowed('write') || !this.DV_updated) return
        this.DV_updated = false
        let data = {facility: {statusId: this.DV_facility.statusId, dueDate: this.DV_facility.dueDate}}
        http
          .put(`/projects/${this.currentProject.id}/facilities/${this.DV_facility.id}.json`, data)
          .then((res) => {
            this.DV_facility = {...res.data.facility, ...res.data.facility.facility}
            if (this.from == "manager_view") this.updateFacilityHash(this.DV_facility)
            this.$emit('facility-update', this.DV_facility)
          })
          .catch((err) => {
            console.error(err);
          })
      },
      refreshFacility() {
        this.loading = true
        this.getFacility()
      },
      isBlockedStatus(status) {
        return status && status.name.toLowerCase().includes('complete') && this.DV_facility.progress < 100
      },
      onChange() {
        this.$nextTick(() => {
          this.DV_updated = true
        })
      }
    },
    computed: {
      ...mapGetters([
        'getTaskIssueUserFilter',
        'filterDataForAdvancedFilter',
        'taskTypes',
        'getAllFilterNames',
        'getFilterValue',
        'contentLoaded',
        'currentProject',
        'taskTypeFilter',
        'issueTypeFilter',
        'issueSeverityFilter',
        'taskUserFilter',
        'taskStageFilter',
        'issueStageFilter',
        'issueUserFilter',
        'statuses',
        'myActionsFilter',
        'onWatchFilter'
      ]),
      C_taskTypeFilter: {
        get() {
          return this.taskTypeFilter
        },
        set(value) {
          this.setTaskTypeFilter(value)
        }
      },
      C_myTasks: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('tasks')
        }
      },
      C_myIssues: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('issues')
        }
      },
      C_onWatchTasks: {
        get() {
          return _.map(this.onWatchFilter, 'value').includes('tasks')
        }
      },
      C_onWatchIssues: {
        get() {
          return _.map(this.onWatchFilter, 'value').includes('issues')
        }
      },
      filteredTasks() {
        let typeIds = _.map(this.taskTypeFilter, 'id')
        let stageIds = _.map(this.taskStageFilter, 'id')
        let taskIssueUsers = this.getTaskIssueUserFilter

        return _.filter(this.DV_facility.tasks, (resource) => {
          let valid = true
          let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

          if (taskIssueUsers.length > 0) {  
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }
          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && this.filterDataForAdvancedFilter([resource], 'facilityShowTasks')

          if (stageIds.length > 0) valid = valid && stageIds.includes(resource.taskStageId)
          if (typeIds.length > 0) valid = valid && typeIds.includes(resource.taskTypeId)
          return valid
        })
      },
      taskStats() {
        let tasks = new Array
        let group = _.groupBy(this.filteredTasks, 'taskType')
        for (let type in group) {
          tasks.push({
            name: type,
            count: group[type].length,
            progress: Number((_.meanBy(group[type], 'progress') || 0).toFixed(2))
          })
        }
        return tasks
      },
      taskVariation() {
        let completed = _.filter(this.filteredTasks, (t) => t && t.progress && t.progress == 100)
        let completed_percent = this.getAverage(completed.length, this.filteredTasks.length)
        let overdue = _.filter(this.filteredTasks, (t) => t && t.progress !== 100 && new Date(t.dueDate).getTime() < new Date().getTime())
        let overdue_percent = this.getAverage(overdue.length, this.filteredTasks.length)

        return {
          completed: {count: completed.length, percentage: completed_percent},
          overdue: {count: overdue.length, percentage: overdue_percent},
        }
      },
      filteredIssues() {
        let typeIds = _.map(this.issueTypeFilter, 'id')
        let severityIds = _.map(this.issueSeverityFilter, 'id')
        let stageIds = _.map(this.issueStageFilter, 'id')
        let taskIssueUsers = this.getTaskIssueUserFilter

        return _.filter(this.facility.issues, ((resource) => {
          let valid = true
          let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

          if (taskIssueUsers.length > 0) {  
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }
          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && this.filterDataForAdvancedFilter([resource], 'facilityShowIssues')

          if (typeIds.length > 0) valid = valid && typeIds.includes(resource.issueTypeId)
          if (severityIds.length > 0) valid = valid && severityIds.includes(resource.issueSeverityId)
          if (stageIds.length > 0) valid = valid && stageIds.includes(resource.issueStageId)
          return valid
        }))
      },
      issueStats() {
        let issues = new Array
        let group = _.groupBy(this.filteredIssues, 'issueType')
        for (let type in group) {
          issues.push({
            name: type,
            count: group[type].length,
            progress: Number((_.meanBy(group[type], 'progress') || 0).toFixed(2))
          })
        }
        return issues
      },
      issueVariation() {
        let completed = _.filter(this.filteredIssues, (t) => t && t.progress && t.progress == 100)
        let completed_percent = this.getAverage(completed.length, this.filteredIssues.length)
        let overdue = _.filter(this.filteredIssues, (t) => t && t.progress !== 100 && new Date(t.dueDate).getTime() < new Date().getTime())
        let overdue_percent = this.getAverage(overdue.length, this.filteredIssues.length)

        return {
          completed: {count: completed.length, percentage: completed_percent},
          overdue: {count: overdue.length, percentage: overdue_percent},
        }
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.overview[salut]
      }
    },
    watch: {
      facility: {
        handler(value) {
          this.DV_facility = Object.assign({}, value)
          this.selectedStatus = this.statuses.find(s => s.id == this.DV_facility.statusId)
          this.loading = false
          this.DV_updated = false
          if (this.from != "manager_view") {
            this.loading = true
            this.getFacility()
          }
        }, deep: true
      },
      "DV_facility.statusId"(value) {
        if (!value) this.DV_facility.dueDate = null
      },
      selectedStatus: {
        handler(value) {
          this.DV_facility.statusId = value ? value.id : null
        }, deep: true
      },
      currentTab(value) {
        this.nullifyTasksForManager()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .f-head {
    word-break: break-word;
    text-overflow: ellipsis;
  }
  .f-notes {
    border: 1px solid #ccc;
    padding: 5px 10px;
    border-radius: 5px;
    overflow: auto;
    min-height: 20vh;
    max-height: 34vh;
  }
  .f-show-btn {
    font-size: 12px;
    font-style: italic;
    display: flex;
    flex-direction: row-reverse;
  }
  .fa-building {
    font-size: large !important;
    color: #383838 !important;

  }
  .custom-tab {
    background-color: #ededed !important;
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  .pg-content {
    width: 100%;
    height: 20px;
    font-size: 14px;
    font-weight: bold;
  }
  .vue-tabs {
    margin-top: 15px;
  }
  .vdp-datepicker {
    width: 100%;
  }
  .search-tab {
    width: 80%;
  }
  .displayNone {
    display: none !important;
  }
  .close-sidebar-btn {
    z-index: 800;
    cursor: pointer;
    display: flex;
    position: absolute;
    left: 0;
    top: 0;
    background: #fff;
    padding: 5px;
  }
  .vue2-datepicker /deep/ .mx-input:disabled {
    color: #555;
    background-color: #fff;
  }
  .simple-select /deep/ .multiselect {
    .multiselect__placeholder {
      color: #dc3545;
      text-overflow: ellipsis;
    }
  }
   .fac-sum {
      border-radius: 2px;
      padding:8px;
      margin-bottom: 8px;
      background-color: #fff;
      box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
  }

</style>
