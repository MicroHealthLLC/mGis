import http from './../common/http'
import * as Moment from 'moment'
import {extendMoment} from 'moment-range'
const moment = extendMoment(Moment)
import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'

// utility function
const getSimpleDate = (date) => {
  let dt = [undefined, null, 'N/A'].includes(date) ? new Date : new Date(date)
  let y = dt.getFullYear()
  let m = dt.getMonth()
  let d = dt.getDate()
  return new Date(y, m, d, 0, 0, 0).getTime()
}

export default new Vuex.Store({
  state: {
    contentLoaded: false,
    mapLoading: true,
    sideLoading: true,
    projects: new Array,
    facilities: new Array,
    facilityGroups: new Array,
    statuses: new Array,
    taskIssueOverdueOptions: [{id: "all",name: "all"},{id: "overdue",name: "overdue"}, {id: "not overdue",name: "not overdue"}],
    taskIssueOverdueFilter: null,
    taskTypes: new Array,
    taskStages: new Array,
    issueStages: new Array,
    issueTypes: new Array,
    issueSeverities: new Array,
    currentProject: null,
    projectUsers: new Array,
    currentFacility: null,
    currentFacilityGroup: null,
    mapFilters: new Array,
    projectStatusFilter: null,
    taskTypeFilter: null,
    facilityGroupFilter: null,
    facilityNameFilter: null,
    facilityProgressFilter: null,
    facilityDueDateFilter: null,
    noteDateFilter: null,
    taskIssueDueDateFilter: null,
    issueTypeFilter: null,
    issueSeverityFilter: null,
    taskStageFilter: null,
    issueStageFilter: null,
    issueProgressFilter: null,
    taskProgressFilter: null,
    progressFilter: {
      facility: {
        min: '',
        max: '',
        error: ''
      },
      task: {
        min: '',
        max: '',
        error: ''
      },
      issue: {
        min: '',
        max: '',
        error: ''
      }
    },
    taskUserFilter: null,
    issueUserFilter: null,
    myActionsFilter: new Array,
    onWatchFilter: new Array,
    managerView: {
      task: null,
      issue: null,
      note: null
    }
  },

  mutations: {
    setContentLoaded: (state, loading) => state.contentLoaded = loading,
    setMapLoading: (state, loading) => state.mapLoading = loading,
    setSideLoading: (state, loading) => state.sideLoading = loading,
    setProjects: (state, projects) => state.projects = projects,
    setFacilities: (state, facilities) => state.facilities = facilities,
    setFacilityGroups: (state, facilityGroups) => state.facilityGroups = facilityGroups,
    setStatuses: (state, statuses) => state.statuses = statuses,
    setTaskTypes: (state, taskTypes) => state.taskTypes = taskTypes,
    setTaskStages: (state, taskStages) => state.taskStages = taskStages,
    setIssueStages: (state, issueStages) => state.issueStages = issueStages,
    setIssueTypes: (state, issueTypes) => state.issueTypes = issueTypes,
    setIssueSeverities: (state, issueSeverities) => state.issueSeverities = issueSeverities,
    setCurrentProject: (state, project) => state.currentProject = project,
    setProjectUsers: (state, users) => state.projectUsers = users,
    setCurrentFacility: (state, facility) => state.currentFacility = facility,
    setCurrentFacilityGroup: (state, facilityGroup) => state.currentFacilityGroup = facilityGroup,
    setMapFilters: (state, filters) => state.mapFilters = filters,
    updateFacilities: (state, {index, facility}) => Vue.set(state.facilities, index, facility),
    updateFacilityHash: (state, facility) => {
      let index = state.facilities.findIndex(f => f.id == facility.id)
      if (index > -1) Vue.set(state.facilities, index, facility)
    },
    updateMapFilters: (state, {key, filter, same, _k}) => {
      if (filter && !filter.includes(null) && Array.isArray(filter) && filter.length > 0) {
        let i = state.mapFilters.findIndex(f => f.hasOwnProperty(key))
        if (i < 0) i = state.mapFilters.length
        let value = {[key]: same ? filter : _.map(filter, _k || 'id')}
        Vue.set(state.mapFilters, i, value)
      }
      else {
        state.mapFilters = _.filter(state.mapFilters, f => !f.hasOwnProperty(key))
      }
    },
    updateTasksHash: (state, {task, action}) => {
      let facility_i = state.facilities.findIndex(f => f.id == task.facilityId)
      if (facility_i > -1) {
        let facility = Object.assign({}, state.facilities[facility_i])
        let task_i = facility.tasks.findIndex((t) => t.id == task.id)
        if (action === 'delete') {
          for (let t of _.flatten(_.map(state.facilities, 'tasks'))) {
            _.remove(t.subTaskIds, id => id == t.id)
          }
          Vue.delete(facility.tasks, task_i)
        }
        else if (task_i > -1) Vue.set(facility.tasks, task_i, task)
        Vue.set(state.facilities, facility_i, facility)
      }
    },
    updateIssuesHash: (state, {issue, action}) => {
      let facility_i = state.facilities.findIndex(f => f.id == issue.facilityId)
      if (facility_i > -1) {
        let facility = Object.assign({}, state.facilities[facility_i])
        let issue_i = facility.issues.findIndex((t) => t.id == issue.id)
        if (action === 'delete') {
          for (let t of _.flatten(_.map(state.facilities, 'issues'))) {
            _.remove(t.subIssueIds, id => id == t.id)
          }
          Vue.delete(facility.issues, issue_i)
        }
        else if (issue_i > -1) Vue.set(facility.issues, issue_i, issue)
        Vue.set(state.facilities, facility_i, facility)
      }
    },
    updateNotesHash: (state, {note, facilityId, action}) => {
      let facility_i = state.facilities.findIndex(f => f.id == facilityId)
      if (facility_i > -1) {
        let facility = Object.assign({}, state.facilities[facility_i])
        let note_i = facility.notes.findIndex((t) => t.id == note.id)
        if (action === 'delete') {
          Vue.delete(facility.notes, note_i)
        }
        else if (note_i > -1) Vue.set(facility.notes, note_i, note)
        Vue.set(state.facilities, facility_i, facility)
      }
    },
    setProjectStatusFilter: (state, filter) => state.projectStatusFilter = filter,
    setTaskIssueOverdueFilter: (state, filter) => { 
      state.taskIssueOverdueFilter = filter
    },
    setTaskTypeFilter: (state, filter) => state.taskTypeFilter = filter,
    setFacilityGroupFilter: (state, filter) => state.facilityGroupFilter = filter,
    setFacilityNameFilter: (state, filter) => state.facilityNameFilter = filter,
    setFacilityProgressFilter: (state, filter) => state.facilityProgressFilter = filter,
    setFacilityDueDateFilter: (state, filter) => state.facilityDueDateFilter = filter,
    setNoteDateFilter: (state, filter) => state.noteDateFilter = filter,
    setTaskIssueDueDateFilter: (state, filter) => state.taskIssueDueDateFilter = filter,
    setIssueTypeFilter: (state, filter) => state.issueTypeFilter = filter,
    setTaskStageFilter: (state, filter) => state.taskStageFilter = filter,
    setIssueStageFilter: (state, filter) => state.issueStageFilter = filter,
    setIssueSeverityFilter: (state, filter) => state.issueSeverityFilter = filter,
    setIssueProgressFilter: (state, filter) => state.issueProgressFilter = filter,
    setTaskProgressFilter: (state, filter) => state.taskProgressFilter = filter,
    setTaskUserFilter: (state, filter) => state.taskUserFilter = filter,
    setIssueUserFilter: (state, filter) => state.issueUserFilter = filter,
    setMyActionsFilter: (state, filter) => state.myActionsFilter = filter,
    setOnWatchFilter: (state, filter) => state.onWatchFilter = filter,
    clearProgressFilters: (state) => {
      let filters = new Object
      for (let key of Object.keys(state.progressFilter)) {
        filters[key] = new Object
        for (let fil of Object.keys(state.progressFilter[key])) {
          filters[key][fil] = ""
        }
      }
      state.progressFilter = filters
    },
    setProgressFilters: (state, {key, value}) => state.progressFilter[key] = value,
    nullifyTasksForManager: (state) => state.managerView = {task: null, issue: null, note: null},
    setTaskForManager: (state, {key, value}) => {
      for (let k in state.managerView) {
        state.managerView[k] = k == key ? value : null
      }
    }
  },

  getters: {
    getAllFilterNames: (state, getters) => {
      return [

        ['facilityGroupFilter', 'Facility Group'],
        ['facilityNameFilter', 'Facility Name'],
        ['projectStatusFilter', 'Project Status'],
        ['taskIssueOverdueFilter','Taks and issue Overdue'],
        ['facilityProgressFilter', 'Facility Progress'],
        ['facilityDueDateFilter', 'Facility Due Date Range'],
        ['taskTypeFilter', 'Task Type'],
        ['noteDateFilter', 'Note Date Range'],
        ['taskIssueDueDateFilter', 'Task and Issue Due Date Range'],
        ['taskProgressFilter', 'Task Progress'],
        ['taskUserFilter', 'Task Users'],
        ['issueTypeFilter', 'Task Types'],
        ['issueProgressFilter', 'Issue Progress'],
        ['issueSeverityFilter', 'Issue Severities'],
        ['issueUserFilter', 'Issue Users'],
        ['myActionsFilter', 'My Actions'],
        ['onWatchFilter', 'On Watch'],
        ['taskStageFilter', 'Task Stages'],
        ['issueStageFilter', 'Issue Stages']

      ]
    },
    getFilterValue: (state, getter)=>(_filterValue) =>{
      
      if(_filterValue == 'facilityGroupFilter'){
        // console.log(getter.facilityGroupFilter)
        return getter.facilityGroupFilter[0] ? getter.facilityGroupFilter[0].name : null
      
      }else if(_filterValue == 'facilityNameFilter'){
        // console.log(getter.facilityNameFilter)
        return getter.facilityNameFilter[0] ? getter.facilityNameFilter[0].name : null
      
      }else if(_filterValue == 'projectStatusFilter'){
        // console.log(getter.projectStatusFilter)
        var user_names = null
        if(getter.projectStatusFilter && getter.projectStatusFilter[0]){
          user_names = _.map(getter.projectStatusFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'taskIssueOverdueFilter'){
        // console.log(getter.taskIssueOverdueFilter)
        return getter.taskIssueOverdueFilter[0] ? getter.taskIssueOverdueFilter[0].name : null
      
      }else if(_filterValue == 'facilityProgressFilter'){
        // console.log(getter.facilityProgressFilter)
        var user_names = null
        if(getter.facilityProgressFilter && getter.facilityProgressFilter[0]){
          user_names = _.map(getter.facilityProgressFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'facilityDueDateFilter'){
        // console.log(getter.facilityDueDateFilter)
        var dates = null
        if(getter.facilityDueDateFilter && getter.facilityDueDateFilter[0]){
          dates = []
          dates.push( moment(getter.facilityDueDateFilter[0]).format("YYYY-MM-DD") )
          dates.push( moment(getter.facilityDueDateFilter[1]).format("YYYY-MM-DD") )
          dates = dates.join(" - ")
        }
        return dates

      }else if(_filterValue == 'taskTypeFilter'){
        // console.log(getter.taskTypeFilter)
        var user_names = null
        if(getter.taskTypeFilter && getter.taskTypeFilter[0]){
          user_names = _.map(getter.taskTypeFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'noteDateFilter'){
        // console.log(getter.noteDateFilter)
        var dates = null
        if(getter.noteDateFilter && getter.noteDateFilter[0]){
          dates = []
          dates.push( moment(getter.noteDateFilter[0]).format("YYYY-MM-DD") )
          dates.push( moment(getter.noteDateFilter[1]).format("YYYY-MM-DD") )
          dates = dates.join(" - ")
        }
        return dates

      }else if(_filterValue == 'taskIssueDueDateFilter'){
        // console.log(getter.taskIssueDueDateFilter)
        var dates = null
        if(getter.taskIssueDueDateFilter && getter.taskIssueDueDateFilter[0]){
          dates = []
          dates.push( moment(getter.taskIssueDueDateFilter[0]).format("YYYY-MM-DD") )
          dates.push( moment(getter.taskIssueDueDateFilter[1]).format("YYYY-MM-DD") )
          dates = dates.join(" - ")
        }
        return dates

      }else if(_filterValue == 'taskProgressFilter'){
        // console.log(getter.taskProgressFilter)
        var user_names = null
        if(getter.taskProgressFilter && getter.taskProgressFilter[0]){
          user_names = _.map(getter.taskProgressFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'taskUserFilter'){
        // console.log(getter.taskUserFilter)
        var user_names = null
        if(getter.taskUserFilter && getter.taskUserFilter[0]){
          user_names = _.map(getter.taskUserFilter, 'fullName').join(", ")
        }
        return user_names

      }else if(_filterValue == 'issueTypeFilter'){
        // console.log(getter.issueTypeFilter)
        var names = null
        if(getter.issueTypeFilter && getter.issueTypeFilter[0]){
           names = _.map(getter.issueTypeFilter, 'name').join(", ")
        }
        return names

      }else if(_filterValue == 'issueProgressFilter'){
        // console.log(getter.issueProgressFilter)
        var user_names = null
        if(getter.issueProgressFilter && getter.issueProgressFilter[0]){
          user_names = _.map(getter.issueProgressFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'issueSeverityFilter'){
        // console.log(getter.issueSeverityFilter)
        var names = null
        if(getter.issueSeverityFilter && getter.issueSeverityFilter[0]){
           names = _.map(getter.issueSeverityFilter, 'name').join(", ")
        }
        return names

      }else if(_filterValue == 'issueUserFilter'){
        // console.log(getter.issueUserFilter)
        var user_names = null
        if(getter.issueUserFilter && getter.issueUserFilter[0]){
          user_names = _.map(getter.issueUserFilter, 'fullName').join(", ")
        }
        return user_names

      }else if(_filterValue == 'myActionsFilter'){
        // console.log(getter.myActionsFilter)
        var user_names = null
        if(getter.myActionsFilter && getter.myActionsFilter[0]){
          user_names = _.map(getter.myActionsFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'onWatchFilter'){
        // console.log(getter.onWatchFilter)
        var user_names = null
        if(getter.onWatchFilter && getter.onWatchFilter[0]){
          user_names = _.map(getter.onWatchFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'taskStageFilter'){
        // console.log(getter.taskStageFilter)
     
        var user_names = null
        if(getter.taskStageFilter && getter.taskStageFilter[0]){
          user_names = _.map(getter.taskStageFilter, 'name').join(", ")
        }
        return user_names

      }else if(_filterValue == 'issueStageFilter'){
        // console.log(getter.issueStageFilter)
        var user_names = null
        if(getter.issueStageFilter && getter.issueStageFilter[0]){
          user_names = _.map(getter.issueStageFilter, 'name').join(", ")
        }
        return user_names
      }
    },
    contentLoaded: state => state.contentLoaded,
    mapLoading: state => state.mapLoading,
    sideLoading: state => state.sideLoading,
    projects: state => state.projects,
    facilities: state => state.facilities,
    facilityGroups: state => state.facilityGroups,
    statuses: state => state.statuses,
    taskTypes: state => state.taskTypes,
    taskStages: state => state.taskStages,
    issueStages: state => state.issueStages,
    issueTypes: state => state.issueTypes,
    issueSeverities: state => state.issueSeverities,
    currentProject: state => state.currentProject,
    projectUsers: state => state.projectUsers,
    activeProjectUsers: state => _.filter(state.projectUsers, u => u.status == "active"),
    currentFacility: state => state.currentFacility,
    currentFacilityGroup: state => state.currentFacilityGroup,
    projectStatusFilter: state => state.projectStatusFilter,
    taskIssueOverdueFilter: state => state.taskIssueOverdueFilter,
    taskTypeFilter: state => state.taskTypeFilter,
    taskStageFilter: state => state.taskStageFilter,
    issueStageFilter: state => state.issueStageFilter,
    facilityGroupFilter: state => state.facilityGroupFilter,
    facilityNameFilter: state => state.facilityNameFilter,
    facilityProgressFilter: state => state.facilityProgressFilter,
    facilityDueDateFilter: state => state.facilityDueDateFilter,
    noteDateFilter: state => state.noteDateFilter,
    taskIssueDueDateFilter: state => state.taskIssueDueDateFilter,
    issueTypeFilter: state => state.issueTypeFilter,
    issueSeverityFilter: state => state.issueSeverityFilter,
    issueProgressFilter: state => state.issueProgressFilter,
    taskProgressFilter: state => state.taskProgressFilter,
    taskUserFilter: state => state.taskUserFilter,
    issueUserFilter: state => state.issueUserFilter,
    myActionsFilter: state => state.myActionsFilter,
    onWatchFilter: state => state.onWatchFilter,
    mapFilters: state => state.mapFilters,
    progressFilter: state => state.progressFilter,
    managerView: state => state.managerView,
    filteredFacilities: (state, getters) => (_status='active') => {
      return _.filter(getters.facilities, (facility) => {
        let valid = _status === 'all' || facility.status === _status
        valid = valid && facility.facilityGroupStatus == "active"
        if (!valid) return valid
        _.each(state.mapFilters, (f) => {
          let k = Object.keys(f)[0]
          switch(k) {
            case "dueDate": {
              let range = moment.range(f[k][0], f[k][1])
              valid = valid && facility[k] && range.contains(new Date(facility[k].replace(/-/g, '/')))
              break
            }
            case "noteDate": {
              var startDate = moment(f[k][0], "YYYY-MM-DD")
              var endDate = moment(f[k][1], "YYYY-MM-DD")
              var _notes = _.flatten(_.map(facility.tasks, 'notes') ).concat(_.flatten(_.map(facility.issues, 'notes') ))
              var is_valid = false
              for(var n of _notes){
                var nDate = moment(n.createdAt, "YYYY-MM-DD")
                is_valid = nDate.isBetween(startDate, endDate, 'days', true)
                if(is_valid) break
              }

              valid = valid && is_valid
              break
            }
            case "taskIssueDueDate": {
              var startDate = moment(f[k][0], "YYYY-MM-DD")
              var endDate = moment(f[k][1], "YYYY-MM-DD")
              var _dueDates = _.flatten(_.map(facility.tasks, 'dueDate') ).concat(_.flatten(_.map(facility.issues, 'dueDate') ))
              var is_valid = false

              if(_dueDates.length < 1){
                valid = valid && is_valid
                break

              }else{
                for(var dueDate of _dueDates){
                  var nDate = moment(dueDate, "YYYY-MM-DD")
                  is_valid = nDate.isBetween(startDate, endDate, 'days', true)
                  if(is_valid) break
                }
                valid = valid && is_valid
                break
              }

            }
            case "taskIssueOverdue": {
              var _isOverdues = _.flatten(_.map(facility.tasks, 'isOverdue') ).concat(_.flatten(_.map(facility.issues, 'isOverdue') ))
              var is_valid = false

              if(f[k][0] && f[k][0].name == "overdue"){
                valid = valid && _isOverdues.includes(true)
              }
              if(f[k][0] && f[k][0].name == "not overdue"){
                valid = valid && _isOverdues.includes(false)
              }
              
              break
            }
            
            case "progress": {
              let ranges = f[k].map(r => r.split("-").map(Number))
              let is_valid = false
              for (let range of ranges) {
                is_valid = range[1] !== undefined ? range[0] <= facility[k] && range[1] >= facility[k] : facility[k] == range[0]
                if (is_valid) break
              }
              valid = valid && is_valid
              break
            }
            case "taskTypeIds": {
              let ids = _.map(facility.tasks, 'taskTypeId').concat(_.flatten(_.map(facility.issues, 'taskTypeId') ))
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "issueTypeIds": {
              let ids = _.map(facility.issues, 'issueTypeId')
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "issueProgress":
            case "taskProgress": {
              let progressFor = k === 'taskProgress' ? facility.tasks : facility.issues
              let progress = _.uniq(_.map(progressFor, 'progress'))
              let ranges = f[k].map(r => r.split("-").map(Number))
              let is_valid = false
              for (let range of ranges) {
                let size = range[1] ? (range[1] - range[0]) + 1 : 1
                is_valid = _.intersection(progress, Array.from(Array(size), (_, i) => i + range[0])).length > 0
                if (is_valid) break
              }
              valid = valid && is_valid
              break
            }
            case "issueSeverityIds": {
              let ids = _.map(facility.issues, 'issueSeverityId')
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "issueStageIds": {
              let ids = _.map(facility.issues, 'issueStageId')
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "taskStageIds": {
              let ids = _.map(facility.tasks, 'taskStageId')
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "issueUserIds": {
              let ids = _.uniq(_.compact(_.flatten(_.map(facility.issues, 'userIds'))))
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "taskUserIds": {
              let ids = _.uniq(_.compact(_.flatten(_.map(facility.tasks, 'userIds'))))
              valid = valid && _.intersection(f[k], ids).length > 0
              break
            }
            case "facilityGroupIds": {
              valid = valid && f[k].includes(facility.facilityGroupId)
              break
            }
            case "ids": {
              valid = valid && f[k].includes(facility.id)
              break
            }
            case "statusIds": {
              valid = valid && f[k].includes(facility.statusId)
              break
            }
            case "myActions": {
              let is_valid = false
              for (let act of f[k]) {
                let userIds = act == "notes" ? _.uniq(_.map(facility[act], 'userId')) : _.compact(_.uniq([..._.flatten(_.map(facility[act], 'userIds')), ..._.map(_.flatten(_.map(facility[act], 'checklists')), 'userId')]))
                is_valid = is_valid || userIds.includes(Vue.prototype.$currentUser.id)
              }
              valid = valid && is_valid
              break
            }
            case "onWatch": {
              let is_valid = false
              for (let act of f[k]) {
                is_valid = is_valid || _.uniq(_.map(facility[act], 'watched')).includes(true)
              }
              valid = valid && is_valid
              break
            }
            default: {
              valid = valid && facility[k] == f[k]
              break
            }
          }
        })
        return valid
      })
    },
    filteredFacilityGroups: (state, getters) => {
      let ids = _.map(getters.filteredFacilities('active'), 'facilityGroupId')
      return _.filter(getters.facilityGroups, fg => ids.includes(fg.id) && fg.status == "active")
    },
    facilityCount: (state, getters) => {
      return getters.filteredFacilities('all').length
    },
    facilityProgress: (state, getters) => {
      let mean = _.meanBy(getters.filteredFacilities('active'), 'progress') || 0
      return Number(mean.toFixed(2))
    },
    filterFacilitiesWithActiveFacilityGroups: (state, getters) => {
      let ids = _.map(_.filter(state.facilityGroups, fg => fg.status === 'active'), 'id')
      return _.filter(getters.filteredFacilities('active'), (f) => ids.includes(f.facilityGroupId) && f.status === 'active')
    },
    unFilterFacilities: (state) => {
      let ids = _.map(_.filter(state.facilityGroups, fg => fg.status === 'active'), 'id')
      return _.filter(state.facilities, (f) => ids.includes(f.facilityGroupId) && f.status === 'active')
    },
    activeFacilityGroups: (state, getters) => (id=getters.currentProject.id) => {
      return _.filter(getters.facilityGroups, f => f.status === 'active' && f.projectIds.includes(id))
    },
    getTaskIssueOverdueOptions: (state, getters) => () => {
      return state.taskIssueOverdueOptions
    },

    currentTasks: (state, getters) => {
      return _.flatten(_.map(getters.filterFacilitiesWithActiveFacilityGroups, 'tasks'))
    },
    currentIssues: (state, getters) => {
      return _.flatten(_.map(getters.filterFacilitiesWithActiveFacilityGroups, 'issues'))
    },
    facilityGroupFacilities: (state, getters) => (group, status='active') => {
      return _.filter(getters.filteredFacilities(status), f => f.facilityGroupId == group.id && f.projectId == getters.currentProject.id)
    },

    // for gantt chart view
    ganttData: (state, getters) => {
      let hash = new Array

      // for project
      let p_id = `p_${getters.currentProject.id}`
      let _p_id = '1'
      let p_s_date = _.min(_.map(getters.currentTasks, 'startDate')) || 'N/A'
      let p_e_date = _.max(_.map(getters.currentTasks, 'dueDate')) || 'N/A'
      let p_duration = getSimpleDate(p_e_date) - getSimpleDate(p_s_date) || 0
      let p_progress = _.meanBy(getters.currentTasks, 'progress') || 0

      hash.push(
        {
          id: p_id,
          _id: _p_id,
          name: getters.currentProject.name,
          duration: p_duration,
          durationInDays: `${Math.ceil(p_duration / (1000 * 3600 * 24)) || 0} days`,
          percent: Number(p_progress.toFixed(2)),
          start: getSimpleDate(p_s_date),
          startDate: p_s_date,
          endDate: p_e_date,
          type: 'project'
        }
      )

      // for facility_groups
      let groups = _.groupBy(getters.filterFacilitiesWithActiveFacilityGroups, 'facilityGroupName')
      let group_count = 1
      for (let group in groups) {
        let _fg_id = _p_id + "." + group_count
        let fg_id = `${p_id}_fg_${group}`.replace(/ /i, '_')
        let fg_tasks = _.flatten(_.map(groups[group], 'tasks'))
        let fg_s_date = _.min(_.map(fg_tasks, 'startDate')) || 'N/A'
        let fg_e_date = _.max(_.map(fg_tasks, 'dueDate')) || 'N/A'
        let fg_duration = getSimpleDate(fg_e_date) - getSimpleDate(fg_s_date) || 0
        let fg_progress = _.meanBy(fg_tasks, 'progress') || 0

        hash.push(
          {
            id: fg_id,
            _id: _fg_id,
            parentId: p_id,
            name: group,
            duration: fg_duration,
            durationInDays: `${Math.ceil(fg_duration / (1000 * 3600 * 24)) || 0} days`,
            percent: Number(fg_progress.toFixed(2)),
            start: getSimpleDate(fg_s_date),
            startDate: fg_s_date,
            endDate: fg_e_date,
            type: 'milestone'
          }
        )

        let f_read = Vue.prototype.$permissions.overview.read || false
        // for facilities under facility_groups
        let facility_count = 1
        for (let facility of groups[group]) {
          let f_id = f_read ? `${fg_id}_f_${facility.id}` : fg_id
          let _f_id = _fg_id + "." + facility_count
          let f_s_date = _.min(_.map(facility.tasks, 'startDate')) || 'N/A'
          let f_e_date = _.max(_.map(facility.tasks, 'dueDate')) || 'N/A'
          let f_duration = getSimpleDate(f_e_date) - getSimpleDate(f_s_date) || 0
          let f_progress = _.meanBy(facility.tasks, 'progress') || 0

          hash.push(
            {
              id: f_id,
              _id: _f_id,
              parentId: fg_id,
              name: facility.facility.facilityName,
              duration: f_duration,
              durationInDays: `${Math.ceil(f_duration / (1000 * 3600 * 24)) || 0} days`,
              percent: Number(f_progress.toFixed(2)),
              start: getSimpleDate(f_s_date),
              startDate: f_s_date,
              endDate: f_e_date,
              type: 'milestone'
            }
          )

          if (Vue.prototype.$permissions.tasks.read)
          {
            // for task_types under facilities
            let types = _.groupBy(facility.tasks, 'taskType')
            let filteredTaskTypes = _.map(getters.taskTypeFilter, 'name')
            let types_count = 1
            for (let type in types) {
              if (filteredTaskTypes.length > 0 && !filteredTaskTypes.includes(type)) continue
              let tasks = types[type]
              let tt_id = `${f_id}_tt_${type}`.replace(/ /i, '_')
              let _tt_id = _f_id + "." + types_count
              let tt_s_date = _.min(_.map(tasks, 'startDate'))
              let tt_e_date = _.max(_.map(tasks, 'dueDate'))
              let tt_duration = getSimpleDate(tt_e_date) - getSimpleDate(tt_s_date)
              let tt_progress = _.meanBy(tasks, 'progress')

              hash.push(
                {
                  id: tt_id,
                  _id: _tt_id,
                  parentId: f_id,
                  name: type,
                  duration: tt_duration,
                  durationInDays: `${Math.ceil(tt_duration / (1000 * 3600 * 24))} days`,
                  percent: Number(tt_progress.toFixed(2)),
                  start: getSimpleDate(tt_s_date),
                  startDate: tt_s_date,
                  endDate: tt_e_date,
                  type: 'milestone'
                }
              )

              let ranges = getters.taskProgressFilter ? _.map(getters.taskProgressFilter, 'value').map(r => r.split("-").map(Number)) : false
              let stages = getters.taskStageFilter && getters.taskStageFilter.length ? _.map(getters.taskStageFilter, 'id') : []

              // for tasks under task_types
              let task_count = 1
              for (let task of tasks) {
                if (stages.length > 0 && !stages.includes(task.taskStageId)) continue
                if (_.map(getters.myActionsFilter, 'value').includes('tasks')) {
                  let userIds = [..._.map(task.checklists, 'userId'), ...task.userIds]
                  if (!userIds.includes(Vue.prototype.$currentUser.id)) continue
                }
                if (ranges && ranges.length > 0) {
                  let is_valid = false
                  for (let range of ranges) {
                    is_valid = range[1] !== undefined ? range[0] <= task.progress && range[1] >= task.progress : task.progress == range[0]
                    if (is_valid) break
                  }
                  if (!is_valid) continue
                }
                let t_id = `${tt_id}_t_${task.id}`
                let _t_id = _tt_id + "." + task_count
                let t_duration = getSimpleDate(task.dueDate) - getSimpleDate(task.startDate)

                hash.push(
                  {
                    taskUrl: `/projects/${getters.currentProject.id}/facilities/${facility.facility.id}/tasks/${task.id}`,
                    facilityId: facility.id,
                    projectId: getters.currentProject.id,
                    id: t_id,
                    _id: _t_id,
                    parentId: tt_id,
                    name: task.text,
                    duration: t_duration,
                    durationInDays: `${Math.ceil(t_duration / (1000 * 3600 * 24))} days`,
                    percent: Number(task.progress.toFixed(2)),
                    start: getSimpleDate(task.startDate),
                    startDate: task.startDate,
                    endDate: task.dueDate,
                    _users: task.users.map(_u => _u.fullName).join(","), 
                    type: 'task',
                    collapsed: true
                  }
                )

                // for checklists under tasks
                let checklist_count = 1
                for (let checklist of task.checklists) {
                  if (_.map(getters.myActionsFilter, 'value').includes('tasks') && checklist.userId !== Vue.prototype.$currentUser.id) continue
                  let c_id = `${t_id}_t_${checklist.id}`
                  let _c_id = _t_id + "." + checklist_count
                  hash.push(
                    {
                      id: c_id,
                      _id: _c_id,
                      parentId: t_id,
                      name: checklist.text,
                      dueDate: checklist.dueDate,
                      duration: t_duration,
                      durationInDays: `${Math.ceil(t_duration / (1000 * 3600 * 24))} days`,
                      percent: checklist.checked ? 100 : 0,
                      start: getSimpleDate(task.startDate),
                      startDate: task.startDate,
                      endDate: task.dueDate,
                      type: 'task',
                      dependentOn: [t_id],
                      _users: checklist.user ? [checklist.user.fullName] : null
                    }
                  )
                  checklist_count++
                }
                task_count++
              }
              types_count++
            }
          }
          facility_count++
        }
        group_count++
      }

      return hash
    },
    filteredAllTasks: (state, getters) => {
      let ids = getters.taskTypeFilter && getters.taskTypeFilter.length ? _.map(getters.taskTypeFilter, 'id') : []
      let stages = getters.taskStageFilter && getters.taskStageFilter.length ? _.map(getters.taskStageFilter, 'id') : []
      let taskIssueDueDates = getters.taskIssueDueDateFilter
      let taskIssueOverdue = getters.taskIssueOverdueFilter

      return _.filter(_.flatten(_.map(getters.filteredFacilities('active'), 'tasks')), t => {
        let valid = true
        if (ids.length > 0) valid = valid && ids.includes(t.taskTypeId)
        if (stages.length > 0) valid = valid && stages.includes(t.taskStageId)

        if(taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]){
          var startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
          var endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")
          
          var is_valid = true
          var nDate = moment(t.dueDate, "YYYY-MM-DD")
          is_valid = nDate.isBetween(startDate, endDate, 'days', true)                        
          valid = is_valid
        }
        if(taskIssueOverdue && taskIssueOverdue[0] && taskIssueOverdue[0].name == "overdue"){
          valid = (t.isOverdue == true)
        }

        if(taskIssueOverdue && taskIssueOverdue[0] && taskIssueOverdue[0].name == "not overdue"){
          valid = (t.isOverdue == false)
        }
        return valid
      })

    },
    filteredAllIssues: (state, getters) => {
      let taskTypeIds = getters.taskTypeFilter && getters.taskTypeFilter.length ? _.map(getters.taskTypeFilter, 'id') : []
      let ids = getters.issueTypeFilter && getters.issueTypeFilter.length ? _.map(getters.issueTypeFilter, 'id') : []
      let stages = getters.issueStageFilter && getters.issueStageFilter.length ? _.map(getters.issueStageFilter, 'id') : []
      let severities = getters.issueSeverityFilter && getters.issueSeverityFilter.length ? _.map(getters.issueSeverityFilter, 'id') : []
      let taskIssueDueDates = getters.taskIssueDueDateFilter
      let taskIssueOverdue = getters.taskIssueOverdueFilter

      return _.filter(_.flatten(_.map(getters.filteredFacilities('active'), 'issues')), t => {
        let valid = true
        if (ids.length > 0) valid = valid && ids.includes(t.issueTypeId)
        if (taskTypeIds.length > 0) valid = valid && taskTypeIds.includes(t.taskTypeId)
        if (stages.length > 0) valid = valid && stages.includes(t.issueStageId)
        if (severities.length > 0) valid = valid && severities.includes(t.issueSeverityId)

        if(taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]){
          var startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
          var endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")
          
          var is_valid = true
          var nDate = moment(t.dueDate, "YYYY-MM-DD")
          is_valid = nDate.isBetween(startDate, endDate, 'days', true)                        
          valid = is_valid
        }

        if(taskIssueOverdue && taskIssueOverdue[0] && taskIssueOverdue[0].name == "overdue"){
          valid = (t.isOverdue == true)
        }

        if(taskIssueOverdue && taskIssueOverdue[0] && taskIssueOverdue[0].name == "not overdue"){
          valid = (t.isOverdue == false)
        }

        return valid
      })
    },
    on_watched: (state, getters) => {
      let tasks = _.filter(getters.filteredAllTasks, t => t.watched)
      let issues = _.filter(getters.filteredAllIssues, t => t.watched)
      let ids = [..._.map(issues, 'facilityId'), ..._.map(tasks, 'facilityId')]
      let facilities = _.filter(getters.filteredFacilities('active'), t => ids.includes(t.id))

      return {tasks, issues, facilities}
    },
    viewPermit: () => (view, req) => {
      return Vue.prototype.$permissions[view][req]
    }
  },

  actions: {
    fetchFacilities({commit, dispatch}, id) {
      return new Promise((resolve, reject) => {
        http.get(`/projects/${id}/facilities.json`)
          .then((res) => {
            let facilities = []
            for (let facility of res.data.facilities) {
              facilities.push({...facility, ...facility.facility})
            }
            commit('setFacilities', facilities)
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },
    fetchCurrentProject({commit, dispatch}, id) {
      return new Promise((resolve, reject) => {
        http.get(`/projects/${id}.json`)
          .then((res) => {
            let facilities = []
            for (let facility of res.data.project.facilities) {
              facilities.push({...facility, ...facility.facility})
            }
            commit('setFacilities', facilities)
            commit('setCurrentProject', res.data.project)
            commit('setFacilityGroups', res.data.project.facilityGroups)
            commit('setProjectUsers', res.data.project.users)
            commit('setStatuses', res.data.project.statuses)
            commit('setTaskTypes', res.data.project.taskTypes)
            commit('setTaskStages', res.data.project.taskStages)
            commit('setIssueStages', res.data.project.issueStages)
            commit('setIssueTypes', res.data.project.issueTypes)
            commit('setIssueSeverities', res.data.project.issueSeverities)
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },
    fetchFacility({commit, dispatch, getters}, {projectId, facilityId}) {
      return new Promise((resolve, reject) => {
        http.get(`/projects/${projectId}/facilities/${facilityId}.json`)
          .then((res) => {
            let facility = Object.assign({}, {...res.data.facility, ...res.data.facility.facility})
            let index = getters.facilities.findIndex(f => f.id == facility.id)
            if (index > -1) commit('updateFacilities', {index, facility})
            return resolve(facility)
          })
          .catch((err) => {
            console.error(err)
            reject(err)
          })
      })
    },
    fetchProjects({commit}) {
      return new Promise((resolve, reject) => {
        http.get('/projects.json')
          .then((res) => {
            commit('setProjects', res.data.projects)
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },
    fetchFacilityGroups({commit}, id) {
      let url = '/api/facility_groups.json'
      if (id !== undefined) url = url + `?=project_id=${id}`
      return new Promise((resolve, reject) => {
        http.get(url)
          .then((res) => {
            commit('setFacilityGroups', res.data.facilityGroups)
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },

    async fetchDashboardData({dispatch, commit}, {id, cb}) {
      await dispatch('fetchProjects')
      await dispatch('fetchCurrentProject', id)
      commit('setContentLoaded', true)
      if (cb) return cb()
    },

    async taskUpdated({dispatch}, {projectId, facilityId, cb}) {
      return new Promise(async (resolve, reject) => {
        let facility = await dispatch('fetchFacility', {projectId, facilityId})
        if (cb) cb()
        if (facility instanceof Error) return reject(facility)
        return resolve(facility)
      })
    },

    // store actions watch_view
    updateWatchedTasks({commit}, task) {
      return new Promise((resolve, reject) => {
        http.put(`/projects/${task.projectId}/facilities/${task.facilityId}/tasks/${task.id}.json`, {task: task})
          .then((res) => {
            commit('updateTasksHash', {task: res.data.task})
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },
    updateWatchedIssues({commit}, issue) {
      return new Promise((resolve, reject) => {
        http.put(`/projects/${issue.projectId}/facilities/${issue.facilityId}/issues/${issue.id}.json`, {issue: issue})
          .then((res) => {
            commit('updateIssuesHash', {issue: res.data.issue})
            resolve()
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },

    // update_from_kanban_view
    updateKanbanTaskIssues({commit, getters}, {projectId, facilityId, data, type}) {
      return new Promise((resolve, reject) => {
        http.post(`/projects/${projectId}/facilities/${facilityId}/${type}/batch_update.json`, data)
          .then((res) => {
            let facility = Object.assign({}, {...res.data, ...res.data.facility})
            let index = getters.facilities.findIndex(f => f.id == facility.id)
            if (index > -1) commit('updateFacilities', {index, facility})
            return resolve(facility)
          })
          .catch((err) => {
            console.error(err)
            reject()
          })
      })
    },

    taskDeleted({commit}, task) {
      return new Promise((resolve, reject) => {
        http
          .delete(`/projects/${task.projectId}/facilities/${task.facilityId}/tasks/${task.id}.json`)
          .then((res) => {
            commit('updateTasksHash', {task: task, action: 'delete'})
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      })
    },
    noteDeleted({commit}, {note, projectId, facilityId, cb}) {
      return new Promise((resolve, reject) => {
        http
          .delete(`/projects/${projectId}/facilities/${facilityId}/notes/${note.id}.json`)
          .then((res) => {
            commit('updateNotesHash', {note: note, facilityId, action: 'delete'})
            if (cb) cb()
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      })
    },
    issueDeleted({commit}, issue) {
      return new Promise((resolve, reject) => {
        http
          .delete(`/projects/${issue.projectId}/facilities/${issue.facilityId}/issues/${issue.id}.json`)
          .then((res) => {
            commit('updateIssuesHash', {issue: issue, action: 'delete'})
            resolve()
          })
          .catch((err) => {
            console.log(err)
            reject()
          })
      })
    }
  },

  plugins: [
    createPersistedState({
      localStorage: {
        getState: key => Cookies.getJSON(key),
        setState: (key, state) => Cookies.set(key, state, { expires: 3 }),
        removeItem: key => Cookies.remove(key),
      },
      paths: [
        'projectStatusFilter',
        'taskTypeFilter',
        'facilityGroupFilter',
        'facilityNameFilter',
        'facilityProgressFilter',
        'facilityDueDateFilter',
        'noteDateFilter',
        'taskIssueDueDateFilter',
        'issueTypeFilter',
        'issueSeverityFilter',
        'issueStageFilter',
        'taskStageFilter',
        'issueProgressFilter',
        'taskProgressFilter',
        'myActionsFilter',
        'onWatchFilter',
        'taskUserFilter',
        'issueUserFilter',
        'progressFilter',
        'mapFilters'
      ]
    })
  ]
})
