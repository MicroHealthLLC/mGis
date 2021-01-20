<template>
  <div id="watch_view" data-cy="watch_view">
    <div class="row">
      <div class="col">
        <div class="watch-task-timeline p-4 mb-4" data-cy="watch_task_timeline">
          <h5 class="mb-2">On Watch Timeline</h5>
          <div id="watch_task_timeline"></div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-7">
        <div class="row">
          <div class="col-md-4">
            <div class="blue-box w-100 h-100 text-center p-3" data-cy="total_watched_tasks">
              <h6 class="px-3">Total Number of Watched Tasks</h6>
              <h1 class="px-3">{{on_watched.tasks.length}}</h1>
            </div>
          </div>
          <div class="col-md-4">
            <div class="blue-box w-100 h-100 text-center p-3" data-cy="total_watched_issues">
              <h6 class="px-3">Total Number of Watched Issues</h6>
              <h1 class="px-3">{{on_watched.issues.length}}</h1>
            </div>
          </div>
          <div class="col-md-4">
            <div class="blue-box w-100 h-100 text-center p-3" data-cy="total_watched_facilities">
              <h6 class="px-3">Facilities on Watch</h6>
              <h1 class="px-3">{{on_watched.facilities.length}}</h1>
            </div>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-4">
            <div class="d_chart_box text-center" data-cy="in_progress_tasks">
              <h6 class="py-2 px-3 text-center">Watched Task Progress</h6>
              <div class="d_chart">
                <doughnut :chart-data="watchedTasksCompletionData" :width="200" :height="100" />
                <h5 class="d_abbr">{{completedTasksInPercent}} %</h5>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="d_chart_box text-center" data-cy="in_progress_issues">
              <h6 class="py-2 px-3 text-center">Watched Issue Progress</h6>
              <div class="d_chart">
                <doughnut :chart-data="watchedIssuesCompletionData" :width="200" :height="100" />
                <h5 class="d_abbr">{{completedIssuesInPercent}} %</h5>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="blue-box w-100 h-75 text-center p-3 pb-5" data-cy="overdue_details">
              <div class="warning-icon" v-tooltip="`overdue`"><i class="fa fa-exclamation-triangle"></i></div>
              <h6 class="px-3">Overdue Tasks and Issues</h6>
              <h1 class="px-3">{{overdueTasksNIssues.length}}</h1>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-5" data-cy="watched_facilities">>
        <div class="border-gray h-330">
          <h5 class="mb-2">Watched Facilities, Status and % Progress</h5>
          <div v-if="contentLoaded">
            <div v-if="on_watched.facilities.length > 0">
              <div v-for="facility in on_watched.facilities">
                <div class="row my-3">
                  <div class="col-md-9">
                    <div class="d-flex align-items-center">
                      <div class="fbody-icon mr-2"><i class="fas fa-check"></i></div>
                      <div class="mr-2">{{facility.facilityName}}</div>
                      <div class="status-box px-2 text-secondary" :style="`border-color: ${facility.color}`">{{facility.projectStatus || 'No Status'}}</div>
                    </div>
                  </div>
                  <div class="col-md-3 d-flex align-items-center">
                    <span class="w-100 progress pg-content" :class="{'progress-0': facility.progress <= 0}">
                      <div class="progress-bar bg-info" :style="`width: ${facility.progress}%`">{{facility.progress}} %</div>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="p-2 text-danger" data-cy="no_facility_found">No Data Found..</div>
          </div>
          <div v-else class="my-4">
            <loader type="code"></loader>
          </div>
        </div>
      </div>
    </div>

    <div class="border-gray mt-3" data-cy="watched_task_status">
      <h5 class="px-3 mb-2">Watched Tasks Stats</h5>
      <div class="row">
        <div class="col-md-6">
          <div class="border-gray h-330" data-cy="watched_task_categories">
            <h5 class="mb-2">Watched Task Categories Progressions</h5>
            <div v-if="contentLoaded">
              <div v-if="displayWatchedTaskTypes">
                <div v-for="task in watchedTaskTypes">
                  <div class="row mt-1" v-if="task._display">
                    <div class="col-md-9">
                      <span> {{task.name}}</span>
                      <span class="badge badge-secondary badge-pill">{{task.length}}</span>
                    </div>
                    <div class="col-md-3 d-flex align-items-center">
                      <span class="w-100 progress pg-content" :class="{'progress-0': task.progress <= 0}">
                        <div class="progress-bar bg-info" :style="`width: ${task.progress}%`">{{task.progress}} %</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="p-2 text-danger" data-cy="no_task_category_found">No Data Found..</div>
            </div>
            <div v-else class="my-4">
              <loader type="code"></loader>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="wacthed-task-list" data-cy="watched_task_list">
            <div class="watched-list">
              <h5 class="py-2 px-3">Watched Tasks</h5>
              <div v-if="contentLoaded">
                <div v-if="sortedTasks.length > 0">
                  <div
                    class="p-1 watch-task-item"
                    v-for="(task, i) in sortedTasks"
                    :key="task.id"
                    >
                    <task-show
                      :class="{'b_border': !!on_watched.tasks[i+1]}"
                      :task="task"
                      from-view="watch_view"
                      @toggle-watched="updateWatchedTasks"
                    ></task-show>
                  </div>
                </div>
                <div v-else class="p-2 text-danger" data-cy="no_task_found">No Data Found..</div>
              </div>
              <div v-else class="my-4">
                <loader type="code"></loader>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row mt-4">
        <div class="col-md-6" data-cy="watched_tasks_vs_total">
          <h6 class="px-3 text-center">Watched Task Categories vs Total</h6>
          <stacked :chart-data="onWatchedTaskData" :width="300" :height="100" />
        </div>
        <div class="col-md-6" data-cy="assigned_task_users">
          <h6 class="px-3">Assigned Users</h6>
          <bar :chart-data="watchedTaskUsers" :width="300" :height="watchedTaskUsersHeight" />
          <p class="mt-2 text-center">Total Assigned Tasks and Checklist Items</p>
        </div>
      </div>
    </div>

    <div class="border-gray mt-4" data-cy="watched_issue_status">
      <h5 class="px-3 mb-2">Watched Issues Stats</h5>
      <div class="row">
        <div class="col-md-6">
          <div class="border-gray h-330" data-cy="watched_issue_types">
            <h5 class="mb-2">Watched Issue Types</h5>
            <div v-if="contentLoaded">
              <div v-if="displayWatchedIssueTypes">
                <div v-for="issue in watchedIssueTypes">
                  <div class="row mt-1" v-if="issue._display">
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
              <div v-else class="p-2 text-danger" data-cy="no_issue_category_found">No Data Found..</div>
            </div>
            <div v-else class="my-4">
              <loader type="code"></loader>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="watched-issue-list" data-cy="watched_issue_list">
            <div class="watched-list">
              <h5 class="py-2 px-3">Watched Issues</h5>
              <div v-if="contentLoaded">
                <div v-if="sortedIssues.length > 0">
                  <div
                    v-for="(issue, i) in sortedIssues"
                    :key="issue.id"
                    class="p-1 watch-task-item"
                    >
                    <issue-show
                      :class="{'b_border': !!on_watched.issues[i+1]}"
                      :issue="issue"
                      from-view="watch_view"
                      @toggle-watch-issue="updateWatchedIssues"
                    ></issue-show>
                  </div>
                </div>
                <div v-else class="p-2 text-danger" data-cy="no_issue_found">>No Data Found..</div>
              </div>
              <div v-else class="my-4">
                <loader type="code"></loader>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-md-6" data-cy="watched_issues_vs_total">
          <h6 class="px-3 text-center">Watched Issues vs Total</h6>
          <stacked :chart-data="onWatchedIssueData" :width="300" :height="100" />
        </div>
        <div class="col-md-6" data-cy="assigned_issue_users">
          <h6 class="px-3">Assigned Users</h6>
          <bar :chart-data="watchedIssueUsers" :width="300" :height="watchedIssueUsersHeight" />
          <p class="mt-2 text-center">Total Assigned Issues and Checklist Items</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import {Timeline, DataSet} from "vis-timeline/standalone"
  import Doughnut from '../components/shared/doughnut_chart'
  import Stacked from '../components/shared/stacked_chart'
  import Loader from '../components/shared/loader'
  import Bar from '../components/shared/bar_chart'
  import TaskShow from '../components/tasks/task_show'
  import IssueShow from '../components/issues/issue_show'

  export default {
    name: "WatchView",
    components: {
      Doughnut,
      Stacked,
      Bar,
      TaskShow,
      IssueShow,
      Loader
    },
    data() {
      return {
        watchItem: null,
        watchType: '',
        timeline: null,
        timelineOptions: {
          clickToUse: true,
          height: '480px',
          zoomFriction: 10,
          zoomMax: 315360000000,
          zoomMin: 864000000,
          tooltip: {
            template: (data) => {
              return `<div>
                        <div>Facility: ${data.item.facilityName}</div>
                        <div>Type: ${data.taskType}</div>
                        <div>Start: ${this.formatDate(data.item.startDate)}</div>
                        <div class="${data.overdue ? 'text-danger' : ''}">Due: ${this.formatDate(data.item.dueDate)}<span>${data.overdue ? '<span class="warning-icon ml-2"><i class="fa fa-exclamation-triangle"></i></span>' : ''}</span></div>
                        <div>Progress: ${data.item.progress}%</div>
                      </div>`
            },
            delay: 100,
            followMouse: true
          }
        }
      }
    },
    mounted() {
      this.createTimeline()
    },
    computed: {
      ...mapGetters([
        'contentLoaded',
        'on_watched',
        'issueTypes',
        'taskTypes',
        'issueTypeFilter',
        'taskTypeFilter',
        'activeProjectUsers',
        'filteredAllTasks',
        'filteredAllIssues'
      ]),
      completedIssues() {
        return _.filter(this.on_watched.issues, i => i.progress && Number(i.progress) == 100)
      },
      completedTasks() {
        return _.filter(this.on_watched.tasks, i => i.progress && Number(i.progress) == 100)
      },
      completedIssuesInPercent() {
        return Number(_.meanBy(this.on_watched.issues, 'progress').toFixed(2)) || 0
      },
      completedTasksInPercent() {
        return Number(_.meanBy(this.on_watched.tasks, 'progress').toFixed(2)) || 0
      },
      watchedIssuesCompletionData() {
        return {
          datasets: [{
            data: [
              this.completedIssuesInPercent,
              100 - this.completedIssuesInPercent
            ],
            backgroundColor: ['#ef8d38', '#eee']
          }]
        }
      },
      watchedTasksCompletionData() {
        return {
          datasets: [{
            data: [
              this.completedTasksInPercent,
              100 - this.completedTasksInPercent
            ],
            backgroundColor: ['#a3cde4', '#eee']
          }]
        }
      },
      overdueTasksNIssues() {
        return _.filter([...this.on_watched.tasks, ...this.on_watched.issues], t => t.progress !== 100 && new Date(t.dueDate).getTime() < new Date().getTime())
      },
      watchedIssueTypes() {
        let names = this.issueTypeFilter && this.issueTypeFilter.length && _.map(this.issueTypeFilter, 'name')
        let issueTypes = new Array
        for (let type of this.issueTypes) {
          let issues = _.filter(this.on_watched.issues, t => t.issueTypeId == type.id)
          issueTypes.push(
            {
              _id: type.id,
              name: type.name,
              _display: (names ? names.includes(type.name) : true) && issues.length > 0,
              length: issues.length,
              progress: Number(_.meanBy(issues, 'progress').toFixed(2))
            }
          )
        }
        return issueTypes
      },
      displayWatchedIssueTypes() {
        return _.filter(this.watchedIssueTypes, i => i._display).length > 0
      },
      watchedTaskTypes() {
        let names = this.taskTypeFilter && this.taskTypeFilter.length && _.map(this.taskTypeFilter, 'name')
        let taskTypes = new Array
        for (let type of this.taskTypes) {
          let tasks = _.filter(this.on_watched.tasks, t => t.taskTypeId == type.id)
          taskTypes.push(
            {
              _id: type.id,
              name: type.name,
              _display: tasks.length > 0 && (names ? names.includes(type.name) : true),
              length: tasks.length,
              progress: Number(_.meanBy(tasks, 'progress').toFixed(2))
            }
          )
        }
        return taskTypes
      },
      displayWatchedTaskTypes() {
        return _.filter(this.watchedTaskTypes, t => t._display).length > 0
      },
      onWatchedTaskData() {
        let c_data = {labels: [], datasets: [{label: 'watched', backgroundColor: '#ef549a', data: [], maxBarThickness: 14}, {label: 'total', backgroundColor: '#34edfe', data: [], maxBarThickness: 14}]}
        for (let type of this.watchedTaskTypes) {
          if (!type._display) continue
          let total = _.filter(this.filteredAllTasks, t => t.taskTypeId == type._id)
          let tasks = _.filter(this.on_watched.tasks, t => t.taskTypeId == type._id)
          c_data.labels.push(type.name)
          c_data.datasets[0].data.push(tasks.length)
          c_data.datasets[1].data.push(total.length - tasks.length)
        }
        return c_data
      },
      onWatchedIssueData() {
        let c_data = {labels: [], datasets: [{label: 'watched', backgroundColor: '#ef549a', data: [], maxBarThickness: 14}, {label: 'total', backgroundColor: '#34edfe', data: [], maxBarThickness: 14}]}
        for (let type of this.watchedIssueTypes) {
          if (!type._display) continue
          let total = _.filter(this.filteredAllIssues, t => t.issueTypeId == type._id)
          let issues = _.filter(this.on_watched.issues, t => t.issueTypeId == type._id)
          c_data.labels.push(type.name)
          c_data.datasets[0].data.push(issues.length)
          c_data.datasets[1].data.push(total.length - issues.length)
        }
        return c_data
      },
      watchedTaskUsers() {
        let u_data = {labels: [], datasets: []}
        for (let user of this.activeProjectUsers) {
          let stat = this.getUserTaskInfo(user, 'tasks')
          if (stat.count > 0) {
            u_data.datasets.push({
              _meta: {stat},
              label: user.fullName,
              backgroundColor: user.color,
              maxBarThickness: 14,
              data: [stat.count]
            })
          }
        }
        return u_data
      },
      watchedIssueUsers() {
        let u_data = {labels: [], datasets: []}
        for (let user of this.activeProjectUsers) {
          let stat = this.getUserTaskInfo(user, 'issues')
          if (stat.count > 0) {
            u_data.datasets.push({
              _meta: {stat},
              label: user.fullName,
              backgroundColor: user.color,
              maxBarThickness: 14,
              data: [stat.count]
            })
          }
        }
        return u_data
      },
      watchedTaskUsersHeight() {
        return this.watchedTaskUsers.datasets.length > 10 ? this.watchedTaskUsers.datasets.length * 10 : 100
      },
      watchedIssueUsersHeight() {
        return this.watchedIssueUsers.datasets.length > 10 ? this.watchedIssueUsers.datasets.length * 10 : 100
      },
      timelineData() {
        let data = []
        for (let task of [...this.on_watched.issues, ...this.on_watched.tasks]) {
          let _hash = {item: {...task}}
          let is_task = task.className == 'Task' //task.hasOwnProperty('taskTypeId')          
          _hash.id = is_task ? 'task_'+task.id : 'issue_'+task.id
          _hash.taskType = is_task ? task.taskType : task.issueType
          _hash.content = is_task ? task.text : task.title
          _hash.start = task.startDate
          _hash.className = is_task ? 'vis-task' : 'vis-issue'
          if (task.progress !== 100 && new Date(task.dueDate).getTime() < new Date().getTime()) {
            _hash.className = 'vis-overdue-' + (is_task ? 'task' : 'issue')
            _hash.overdue = true
          }

          data.push(_hash)
        }
        return data
      },
      sortedTasks() {
        return _.sortBy(this.on_watched.tasks, ['dueDate'])
      },
      sortedIssues() {
        return _.sortBy(this.on_watched.issues, ['dueDate'])
      }
    },
    methods: {
      ...mapActions([
        'updateWatchedTasks',
        'updateWatchedIssues'
      ]),
      createTimeline() {
        let container = document.getElementById('watch_task_timeline')
        this.timeline = new Timeline(container, new DataSet(this.timelineData), this.timelineOptions)
      },
      getUserTaskInfo(user, key) {
        let tasks = _.filter(this.on_watched[key], t => t.userIds.includes(user.id))
        let checklists = _.filter(_.compact(_.flatten(_.map(this.on_watched[key], 'checklists'))), t => t.userId == user.id)
        let count = tasks.length + checklists.length
        return {tasks, checklists, count, type: _.startCase(key)}
      }
    },
    watch: {
      on_watched: {
        handler(value) {
          if(this.timeline)
            this.timeline.destroy()
          this.createTimeline()
        }, deep: true
      }
    }
  }
</script>

<style lang="scss">
  #watch_view {
    padding: 10px 70px;
    max-height: calc(100vh - 94px);
    height: calc(100vh - 94px);
    overflow-y: auto;
  }
  .d_chart {
    margin: 0 auto;
    width: 200px;
    .d_abbr {
      position: relative;
      bottom: 25px;
    }
  }
  .bar_chart {
    width: 400px;
    height: 100px;
  }
  .watched-list {
    border: 1px solid rgba(0, 0, 0, 0.125);
    height: 330px;
    overflow-y: auto;
    padding: 1em;
  }
  .watch-task-timeline {
    height: 570px;
    border: 1px solid rgba(0, 0, 0, 0.125);
    overflow-y: auto;
  }
  .watch-months {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 2px solid blue;
  }
  .blue-box {
    border: 2px solid blue;
  }
  .light-box {
    border: 1px solid #ccc;
  }
  .watch-task-item:hover {
    background: lightcyan;
  }
  .border-gray {
    border: 1px solid rgba(0, 0, 0, 0.125);
    padding: 1.5em;
    margin-bottom: 10px;
  }
  .vis-task {
    color: #28a745;
    background: #c7ffd4;
    border-color: #28a745;
  }
  .vis-issue {
    color: #ea9800;
    background: #ffe5b5;
    border-color: #ea9800;
  }
  .vis-overdue-task {
    color: #fff !important;
    background: #014011 !important;
    border-color: #014011 !important;
  }
  .vis-overdue-issue {
    color: #fff !important;
    background: #ff5c5c !important;
    border-color: #ff5c5c !important;
  }
  .h-330 {
    height: 330px;
    overflow-y: auto;
  }
  .status-box {
    border: 1px solid;
    border-left: 16px solid;
    font-size: 12px;
  }
</style>
