<template>
  <div id="tasks-index" class="mt-2" data-cy="task_list">
    <div v-if="_isallowed('read')">

       <div class="d-flex align-item-center justify-content-between w-100 mb-1">        
        <div class="input-group w-100">        
          <div class="input-group-prepend d-inline">
            <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
          </div>
          <input 
            type="search"
            style="height:30px"
            class="form-control form-control-sm" 
            placeholder="Search by Task Name, Category or Assigned User" 
            aria-label="Search" 
            aria-describedby="search-addon" 
            v-model="tasksQuery" 
            data-cy="search_tasks" />
        </div>
       </div>

        <div class="w-100 font-sm d-flex my-2">            
        <div class="mr-1 font-sm w-50">
          <el-select 
           v-model="C_taskTypeFilter"                    
           class="w-100" 
           track-by="name" 
           value-key="id"
           multiple                                                                                                                                               
           placeholder="Select Category"
           >
          <el-option 
            v-for="item in taskTypes"                                                     
            :value="item"   
            :key="item.id"
            :label="item.name"                                                  
            >
          </el-option>
          </el-select>      
         </div>

         <div class="w-50 font-sm">          
          <el-select 
           v-model="C_facilityManagerTaskFilter"                    
           class="w-100" 
           track-by="name" 
           value-key="id"
           multiple                                                                                                                                               
           placeholder="Filter by Flags"
           >
          <el-option 
            v-for="item in getAdvancedFilterOptions"                                                     
            :value="item"   
            :key="item.id"
            :label="item.name"                                                  
            >
          </el-option>
          </el-select> 
         </div>

        </div>   

      <div class="mb-3 d-flex">
        <button v-if="_isallowed('write')" class="btn btn-md btn-primary mr-3 addTaskBtn" @click.prevent="addNewTask">
          <font-awesome-icon icon="plus-circle" data-cy="new_task" />
          Add Task
        </button>
        <button v-tooltip="`Export to PDF`" @click.prevent="exportToPdf" class="btn btn-md mr-2 exportBtns text-light">
          <font-awesome-icon icon="file-pdf" />
        </button>
        <button v-tooltip="`Export to Excel`" @click.prevent="exportToExcel('table', 'Task List')" class="btn btn-md exportBtns text-light">
          <font-awesome-icon icon="file-excel" />
        </button>
      </div>
      <div v-if="filteredTasks.length > 0">
        <hr />
        <task-show v-for="(task, i) in filteredTasks" id="taskHover" :class="{'b_border': !!filteredTasks[i+1]}" :key="task.id" :task="task" :from-view="from" @edit-task="editTask"></task-show>
      </div>
      <div v-else>
        <br />
        <h6 class="text-danger mt-2 ml-1">No tasks found..</h6>
      </div>
    </div>
    <p v-else class="text-danger mx-2"> You don't have permissions to read!</p>
    <table style="display:none" class="table table-sm table-bordered" ref="table" id="taskList1">
      <thead>
        <tr>
          <th></th>
          <th>Task</th>
          <th>Task Category</th>
          <th>Project</th>
          <th>Start Date</th>
          <th>Due Date</th>
          <th>Assigned Users</th>
          <th>Progress</th>
          <th>Overdue</th>
          <th>Last Update</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(task, i) in filteredTasks">
          <td class="text-center">{{i+1}}</td>
          <td>{{task.text}}</td>
          <td>{{task.taskType}}</td>
          <td>{{task.facilityName}}</td>
          <td>{{formatDate(task.startDate)}}</td>
          <td>{{formatDate(task.dueDate)}}</td>
          <td class="ten" v-if="(task.users.length) > 0">{{JSON.stringify(task.users.map(users => (users.fullName))).replace(/]|[['"]/g, '')}}</td>
          <td class="ten" v-else></td>
          <td>{{task.progress + "%"}}</td>
          <td v-if="(task.dueDate) <= now">
            <h5>X</h5>
          </td>
          <td v-else></td>
          <td v-if="(task.notes.length) > 0">
            By: {{ task.notes[0].user.fullName}} on
            {{moment(task.notes[0].createdAt).format('DD MMM YYYY, h:mm a')}}: {{task.notes[0].body.replace(/[^ -~]/g,'')}}
          </td>
          <td v-else>No Updates</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex"
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import TaskShow from "./task_show"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilePdf, faFileExcel, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faFilePdf, faFileExcel, faPlusCircle)
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'TasksIndex',
  components: {
    TaskShow
  },
  props: ['facility', 'from'],
  data() {
    return {
      viewList: 'active',
      listOptions: ['active', 'all', 'completed'],
      now: new Date().toISOString(),
      tasksQuery: '',
      uri: 'data:application/vnd.ms-excel;base64,',
      template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/2018/SPSD-html401-20180327/"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64: function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
      format: function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    }
  },
  methods: {
    ...mapMutations([
      'setAdvancedFilter',
      'setTaskIssueProgressStatusFilter',
      'setTaskIssueOverdueFilter',
      'setTaskTypeFilter',
      'setMyActionsFilter',
      'setOnWatchFilter',
      'setTaskForManager'
    ]),
    addNewTask() {
      this.setTaskForManager({key: 'task', value: {}})
      // Route to new task form page
      this.$router.push(
        `/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/tasks/new`
      );
    },
    editTask(task) {
      this.$emit('show-hide', task)
    },
    exportToPdf() {
      const doc = new jsPDF("l")
      const html = this.$refs.table.innerHTML
      doc.autoTable({ html: "#taskList1" })
      doc.text(150, 285, "Task List")
      doc.save("Task_List.pdf")
    },
    exportToExcel(table, name) {
      if (!table.nodeType) table = this.$refs.table
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
      window.location.href = this.uri + this.base64(this.format(this.template, ctx))
    }
},
computed: {
  ...mapGetters([
    'getAdvancedFilterOptions',
    'filterDataForAdvancedFilter',
    'getFilteredResources',
    'getTaskIssueUserFilter',
    'getAdvancedFilter',
    'getTaskIssueTabFilterOptions',
    'getTaskIssueProgressStatusOptions',
    'getTaskIssueProgressStatusFilter',
    'taskIssueProgressFilter',
    'getTaskIssueOverdueOptions',
    'taskIssueOverdueFilter',
    'taskTypeFilter',
    'noteDateFilter',
    'taskIssueDueDateFilter',
    'myActionsFilter',
    'onWatchFilter',
    'taskUserFilter',
    'taskTypes',
    'viewPermit',
    'taskStageFilter'
  ]),
  _isallowed() {
    return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
  },
  filteredTasks() {
    let typeIds = _.map(this.C_taskTypeFilter, 'id')
    let stageIds = _.map(this.taskStageFilter, 'id')
    const search_query = this.exists(this.tasksQuery.trim()) ? new RegExp(_.escapeRegExp(this.tasksQuery.trim().toLowerCase()), 'i') : null
    let noteDates = this.noteDateFilter
    let taskIssueDueDates = this.taskIssueDueDateFilter
    
    let taskIssueProgress = this.taskIssueProgressFilter

    let taskIssueUsers = this.getTaskIssueUserFilter
    var filterDataForAdvancedFilterFunction = this.filterDataForAdvancedFilter
    
    let tasks = _.sortBy(_.filter(this.facility.tasks, (resource) => {
      let valid = Boolean(resource && resource.hasOwnProperty('progress'))

      let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

      if(taskIssueUsers.length > 0){
        valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
      }

      //TODO: For performance, send the whole tasks array instead of one by one
      valid = valid && filterDataForAdvancedFilterFunction([resource], 'facilityManagerTasks')

      if (stageIds.length > 0) valid = valid && stageIds.includes(resource.taskStageId)
      if (typeIds.length > 0) valid = valid && typeIds.includes(resource.taskTypeId)

      if (noteDates && noteDates[0] && noteDates[1]) {
        var startDate = moment(noteDates[0], "YYYY-MM-DD")
        var endDate = moment(noteDates[1], "YYYY-MM-DD")
        var _notesCreatedAt = _.map(resource.notes, 'createdAt')
        var is_valid = resource.notes.length > 0
        for (var createdAt of _notesCreatedAt) {
          var nDate = moment(createdAt, "YYYY-MM-DD")
          is_valid = nDate.isBetween(startDate, endDate, 'days', true)
          if (is_valid) break
        }
        valid = valid && is_valid
      }

      if (taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]) {
        var startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
        var endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")

        var is_valid = true
        var nDate = moment(resource.dueDate, "YYYY-MM-DD")
        is_valid = nDate.isBetween(startDate, endDate, 'days', true)
        valid = valid && is_valid
      }

      if (taskIssueProgress && taskIssueProgress[0]) {
        var min = taskIssueProgress[0].value.split("-")[0]
        var max = taskIssueProgress[0].value.split("-")[1]
        valid = valid && (resource.progress >= min && resource.progress <= max)
      }

      if (search_query) valid = valid && search_query.test(resource.text) || 
      valid && search_query.test(resource.taskType) || 
      valid && search_query.test(resource.userNames)

      return valid
    }), ['dueDate'])

      if ( _.map(this.getAdvancedFilter, 'id') == 'draft' || _.map(this.getAdvancedFilter, 'id') == 'onHold') {   
        
        return tasks
        
       } else  {
        
        tasks  = tasks.filter(t => t.draft == false && t.onHold == false)
        return tasks
      
       }       


  },
  C_facilityManagerTaskFilter: {
    get() {
      return this.getAdvancedFilter
    },
    set(value) {
      this.setAdvancedFilter(value)
    }
  },
  C_taskIssueProgressStatusFilter: {
    get() {
      if (this.getTaskIssueProgressStatusFilter.length < 1) {
        this.setTaskIssueProgressStatusFilter([{ id: 'active', name: 'active' }])
      }
      return this.getTaskIssueProgressStatusFilter
    },
    set(value) {
      this.setTaskIssueProgressStatusFilter(value)
    }
  },
  C_taskIssueOverdueFilter: {
    get() {
      return this.taskIssueOverdueFilter
    },
    set(value) {
      this.setTaskIssueOverdueFilter(value)
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
  C_myTasks: {
    get() {
      return _.map(this.myActionsFilter, 'value').includes('tasks')
    },
    set(value) {
      if (value) this.setMyActionsFilter([...this.myActionsFilter, { name: "My Tasks", value: "tasks" }])
      else this.setMyActionsFilter(this.myActionsFilter.filter(f => f.value !== "tasks"))
    }
  }
}
}
</script>
<style lang="scss" scoped>
#tasks-index {
  height: 465px;
  background-color: #ffffff;
  z-index: 100;
}

.new-tasks-btn {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
}

#total {
  float: right;
  margin-right: 0;
  text-align: right;
}

.multiselect {
  border: #1d2124 !important;
}

#taskHover:hover {
  cursor: pointer;
  background-color: rgba(91, 192, 222, 0.3);
  border-left: solid rgb(91, 192, 222);
}

tfoot {
  text-align: right !important;
}

.flags {
  // background-color: #dc3545;
  // color:white;  
  background-color: lightgray;
  color: black; 
  margin-left:86%;
  padding: 1px 2px;
  font-size: .65rem;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;  
}

input[type=search] {
  color: #383838;
  text-align: left;
  cursor: pointer;
  display: block;
}

.addTaskBtn,
.exportBtns {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
}

.exportBtns {
  transition: all .2s ease-in-out;
  background-color: #41b883;
}

.exportBtns:hover {
  transform: scale(1.06);
}

.myTasks {
  float: right !important;
  margin-top: 5px;
}

#taskHover {
 box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
}
</style>
