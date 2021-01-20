<!--  NOTE: This File is used in Map view right side bard -->
<template>
  <div class="m-2" data-cy="facility_rollup">
    <div class="bg-info proj-type" ><b>Project Type:</b> <span v-if="currentProject">{{currentProject.projectType}}</span></div>
    <br>
    <div class="text-center mt-1">
      <h2><span v-if="contentLoaded">{{C_facilityCount}}</span> Facilities</h2>
      <p class="mt-2 d-flex align-items-center">
        <span class="w-100 progress pg-content" :class="{'progress-0': C_facilityProgress <= 0}">
          <div class="progress-bar bg-info" :style="`width: ${C_facilityProgress}%`">{{C_facilityProgress}} %</div>
        </span>
      </p>
      <div v-if="C_facilityCount > 0" class="d-flex justify-content-around">
        <!-- <div>
          <span> active</span>
          <span class="badge badge-secondary badge-pill">{{activeFacilitiesByStatus}}</span>
        </div>
        <div>
          <span> inactive</span>
          <span class="badge badge-secondary badge-pill">{{inactiveFacilitiesByStatus}}</span>
         </div>-->
      </div>
    </div>

    <div class="my-3 p-3 fac-proj-status">
      <h5 class="text-center">Facility Project Status</h5>
      <hr>
      <div v-if="contentLoaded && C_facilityCount > 0">
        <div v-for="status in facilitiesByProjectStatus">
          <div class="row">
            <div class="col-md-9">
              <span class="badge badge-pill badge-color" :style="`background: ${status.color}`">&nbsp;</span>
              <span> {{status.name}}</span>
              <span class="badge badge-secondary badge-pill">{{status.length}}</span>
            </div>
            <div class="col-md-3 d-flex align-items-center">
              <span class="w-100 progress pg-content" :class="{'progress-0': status.progress <= 0}">
                <div class="progress-bar bg-info" :style="`width: ${status.progress}%`">{{status.progress}} %</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="!contentLoaded" class="my-4">
        <loader type="code"></loader>
      </div>
    </div>
    <hr>

    <div class="my-3 tasks p-3" data-cy="date_set_filter">
      <h5 class="text-center">Data Set Filters</h5>
      <hr>
      <div>
        <div v-for="filterArray in getAllFilterNames">
          <div class="row">
            <div class="col-md-12 font-md" v-if="getFilterValue(filterArray[0])">
              <span style="font-weight:700; ">{{filterArray[1]}}: </span><span >{{getFilterValue(filterArray[0])}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="my-3 tasks p-3" data-cy="tasks_summary">
      <h5 class="text-center"><span v-if="contentLoaded">{{filteredTasks.length}}</span> Tasks</h5>
     <hr>
      <div v-if="contentLoaded">
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
        <br>
        <div v-if="filteredTasks.length" class="text-info font-weight-bold text-center">Task Categories</div>
        <div v-for="task in currentTaskTypes">
          <div class="row" v-if="task._display">
            <div class="col-md-9">
              <span> {{task.name}}</span>
              <span class="badge badge-secondary badge-pill">{{task.length}}</span>
            </div>
            <div class="col-md-3 d-flex align-items-center">
              <span class="w-100 progress pg-content" :class="{ 'progress-0': task.progress <= 0 }">
                <div class="progress-bar bg-info" :style="`width: ${task.progress}%`">{{task.progress}} %</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="my-4">
        <loader type="code"></loader>
      </div>
    </div>

    <div class="my-3 issues p-3" data-cy="issues_summary">
      <h5 class="text-center"><span v-if="contentLoaded">{{filteredIssues.length}}</span> Issues</h5>
     <hr>
      <div v-if="contentLoaded">
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
        <br>
        <div v-if="filteredIssues.length" class="text-info font-weight-bold text-center">Issue Types</div>
        <div v-for="issue in currentIssueTypes">
          <div class="row" v-if="issue._display">
            <div class="col-md-9">
              <span> {{issue.name}}</span>
              <span class="badge badge-secondary badge-pill">{{issue.length}}</span>
            </div>
            <div class="col-md-3 d-flex align-items-center">
              <span class="w-100 progress pg-content" :class="{'progress-0': issue.progress <= 0}">
                <div class="progress-bar bg-info" :style="`width: ${issue.progress}%`">{{issue.progress}} %</div>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="my-4">
        <loader type="code"></loader>
      </div>
    </div>
    <div class="mb-3 p-3 fac-groups" v-if="from !== 'manager_view'" data-cy="facility_group_summary">
    <h5 class="text-center">Facility Groups</h5>
    <hr>
      <div v-if="contentLoaded" class="row my-2" v-for="facilityGroup in filteredFacilityGroups">
        <div class="col-md-9 font-md">
          <span class="badge badge-pill" :class="{'badge-success':
            facilityGroup.status == 'active', 'badge-danger': facilityGroup.status == 'inactive'}">
            {{facilityGroup.status}}
          </span>
          <span>{{facilityGroup.name}}</span>
          <span class="badge badge-secondary badge-pill">{{facilityGroupFacilities(facilityGroup).length}}</span>
        </div>
        <div class="col-md-3 d-flex align-items-center">
          <span class="w-100 progress pg-content" :class="{'progress-0': facilityGroupProgress(facilityGroup) <= 0}">
            <div class="progress-bar bg-info" :style="`width: ${facilityGroupProgress(facilityGroup)}%`">{{facilityGroupProgress(facilityGroup)}} %</div>
          </span>
        </div>
      </div>
      <div v-else class="my-4">
        <loader type="code"></loader>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../shared/loader'
import {mapGetters} from 'vuex'
export default {
  name: 'FacilityRollup',
  props: ['from', 'facilityGroup'],
  components: {
    Loader
  },
  computed: {
    ...mapGetters([
      'getTaskIssueUserFilter',
      'filterDataForAdvancedFilter',
      'taskTypes',
      'getAllFilterNames',
      'getAllFilterNames',
      'getFilterValue',
      'contentLoaded',
      'facilities',
      'currentProject',
      'filteredFacilityGroups',
      'facilityCount',
      'facilityProgress',
      'filteredFacilities',
      'facilityGroupFacilities',
      'taskTypeFilter',
      'taskStageFilter',
      'issueStageFilter',
      'issueTypeFilter',
      'issueSeverityFilter',
      'taskUserFilter',
      'issueUserFilter',
      'taskTypes',
      'issueTypes',
      'filteredAllTasks',
      'filteredAllIssues',
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
    C_facilityCount() {
      return this.facilityGroup ? this.facilityGroupFacilities(this.facilityGroup).length : this.facilityCount
    },
    C_facilityProgress() {
      return this.facilityGroup ? Number(_.meanBy(this.facilityGroupFacilities(this.facilityGroup), 'progress') || 0).toFixed(2) : this.facilityProgress
    },
    filteredTasks() {
      let typeIds = _.map(this.taskTypeFilter, 'id')
      let stageIds = _.map(this.taskStageFilter, 'id')
      let tasks = this.facilityGroup ? _.flatten(_.map(this.facilityGroupFacilities(this.facilityGroup), 'tasks')) : this.filteredAllTasks
      let taskIssueUsers = this.getTaskIssueUserFilter
      return _.filter(tasks, (resource) => {
        let valid = true
        let userIds = [..._.map(resource.checklists, 'userId'), resource.userIds]
        if(taskIssueUsers.length > 0){
          valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
        }
        //TODO: For performance, send the whole tasks array instead of one by one
        valid = valid && this.filterDataForAdvancedFilter([resource], 'facilitRollupTasks')
        if (stageIds.length > 0) valid = valid && stageIds.includes(resource.taskStageId)
        if (typeIds.length > 0) valid = valid && typeIds.includes(resource.taskTypeId)
        return valid
      })
    },
    filteredIssues() {
      let typeIds = _.map(this.issueTypeFilter, 'id')
      let stageIds = _.map(this.issueStageFilter, 'id')
      let severityIds = _.map(this.issueSeverityFilter, 'id')
      let issues = this.facilityGroup ? _.flatten(_.map(this.facilityGroupFacilities(this.facilityGroup), 'issues')) : this.filteredAllIssues
      
      let taskIssueUsers = this.getTaskIssueUserFilter
      return _.filter(issues, (resource) => {
        let valid = true
        let userIds = [..._.map(resource.checklists, 'userId'), resource.userIds]
        if(taskIssueUsers.length > 0){
          valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
        }
        //TODO: For performance, send the whole tasks array instead of one by one
        valid = valid && this.filterDataForAdvancedFilter([resource], 'facilitRollupIssues')
        if (typeIds.length > 0) valid = valid && typeIds.includes(resource.issueTypeId)
        if (severityIds.length > 0) valid = valid && severityIds.includes(resource.issueSeverityId)
        if (stageIds.length > 0) valid = valid && stageIds.includes(resource.issueStageId)
        return valid
      })
    },
    activeFacilitiesByStatus() {
      return this.facilityGroup ? this.facilityGroupFacilities(this.facilityGroup).length : this.filteredFacilities('active').length
    },
    inactiveFacilitiesByStatus() {
      return this.facilityGroup ? this.facilityGroupFacilities(this.facilityGroup, 'inactive').length : this.filteredFacilities('inactive').length
    },
    facilitiesByProjectStatus() {
      let statuses = new Array
      const active = this.facilityGroup ? this.facilityGroupFacilities(this.facilityGroup) : this.filteredFacilities('active')
      for (let [key, value] of Object.entries(_.groupBy(active, 'projectStatus'))) {
        statuses.push(
          {
            name: key.replace('null', 'No Status'),
            length: value.length,
            color: value[0].color,
            progress: this.getAverage(value.length, active.length)
          }
        )
      }
      return statuses
    },
    currentTaskTypes() {
      let names = this.taskTypeFilter && this.taskTypeFilter.length && _.map(this.taskTypeFilter, 'name')
      let taskTypes = new Array
      for (let type of this.taskTypes) {
        let tasks = _.filter(this.filteredTasks, t => t.taskTypeId == type.id)
        taskTypes.push(
          {
            name: type.name,
            _display: tasks.length > 0 && (names ? names.includes(type.name) : true),
            length: tasks.length,
            progress: Number(_.meanBy(tasks, 'progress').toFixed(2))
          }
        )
      }
      return taskTypes
    },
    currentIssueTypes() {
      let names = this.issueTypeFilter && this.issueTypeFilter.length && _.map(this.issueTypeFilter, 'name')
      let issueTypes = new Array
      for (let type of this.issueTypes) {
        let issues = _.filter(this.filteredIssues, t => t.issueTypeId == type.id)
        issueTypes.push(
          {
            name: type.name,
            _display: (names ? names.includes(type.name) : true) && issues.length > 0,
            length: issues.length,
            progress: Number(_.meanBy(issues, 'progress').toFixed(2))
          }
        )
      }
      return issueTypes
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
    issueVariation() {
      let completed = _.filter(this.filteredIssues, (t) => t && t.progress && t.progress == 100)
      let completed_percent = this.getAverage(completed.length, this.filteredIssues.length)
      let overdue = _.filter(this.filteredIssues, (t) => t && t.progress !== 100 && new Date(t.dueDate).getTime() < new Date().getTime())
      let overdue_percent = this.getAverage(overdue.length, this.filteredIssues.length)
      return {
        completed: {count: completed.length, percentage: completed_percent},
        overdue: {count: overdue.length, percentage: overdue_percent},
      }
    }
  },
  methods: {
    facilityGroupProgress(f_group) {
      let ids = _.map(this.filteredFacilities('active'), 'id')
      let mean = _.meanBy(_.filter(f_group.facilities, (f => ids.includes(f.facilityId) && f.projectId == this.currentProject.id)), 'progress') || 0
      return Number(mean.toFixed(2))
    }
  }
}
</script>

<style scoped lang="scss">
  .badge-color {
    height: 12px;
    padding-top: 2px;
  }
  .proj-type {
    display: inline;
    border-radius: 2px;
    padding: 4px;
    color: #fff;
    font-size: small;
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  .fac-proj-status, .tasks, .issues, .fac-groups {
   border-radius: 2px;
   background-color: #fff;
   box-shadow: 0 5px 5px rgba(0,0,0,0.19), 0 3px 3px rgba(0,0,0,0.23);
  }
  // .fac-proj-status:hover, .tasks:hover, .issues:hover, .fac-groups:hover {
  //  background-color: #fff;
  // }
</style>