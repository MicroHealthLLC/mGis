<template>
  <div id="tasks-index" data-cy="task_list" class="px-0" :class="{'map-v': isMapView}">
    <div v-if="_isallowed('read')">

       <div class="d-flex align-item-center justify-content-between w-100">        
        <div class="input-group w-100">        
          <div class="input-group-prepend d-inline">
            <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
          </div>
          <input 
            type="search"
            style="height:30px"
            class="form-control form-control-sm" 
            placeholder="Search Tasks.." 
            aria-label="Search" 
            aria-describedby="search-addon" 
            v-model="tasksQuery" 
            data-cy="search_tasks" />
        </div>
       </div>


        <div class="d-flex w-100 font-sm mt-2">
          <div class="simple-select w-50 mr-1">            
          <multiselect 
            v-model="C_taskTypeFilter"
            track-by="name" 
            label="name" 
            placeholder="Filter by Category" 
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

            <div class="simple-select w-50">          
            <multiselect 
              v-model="C_facilityManagerTaskFilter" 
              :options="getAdvancedFilterOptions" 
              track-by="name" label="name" 
              :multiple="true"
              select-label="Select" 
              deselect-label="Remove"
              :searchable="false" 
              :close-on-select="true" 
              :show-labels="false" 
              placeholder="Filter By Flags"
              >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
             </template>
             </multiselect>
            </div>
        </div>   

      <div class="my-2 d-flex">
        <button v-if="_isallowed('write')" class="btn btn-md btn-primary mr-3 addTaskBtn" @click.prevent="addNewTask">
          <font-awesome-icon icon="plus-circle" data-cy="new_task" />
          Add Task
        </button>
        <div class="ml-auto">
        <button v-tooltip="`Export to PDF`" @click.prevent="exportToPdf" class="btn btn-md mr-1 exportBtns text-light">
          <font-awesome-icon icon="file-pdf" />
        </button>
        <button v-tooltip="`Export to Excel`" @click.prevent="exportToExcel('table', 'Task List')" class="btn btn-md exportBtns mr-1 text-light">
          <font-awesome-icon icon="file-excel" />
        </button>
         <button
          v-tooltip="`Show More/Show Less`"
          @click.prevent="showAllToggle"
          class="btn btn-md mr-2 showAll text-light"          >
          <span v-if="getToggleRACI">
          <font-awesome-icon icon="user" />      
          </span>
           <span v-else>
          <font-awesome-icon icon="users"/>
           </span>    
         </button>
        </div>
      </div>
      <div style="height:55vh; overflow-y:auto;border-bottom:solid 1px #ededed" v-if="filteredTasks.length > 0">
        <hr class="my-1" />
         <table class="table table-sm table-bordered table-striped mt-2 stickyTableHeader">
          <tr style="background-color:#ededed;">
            <th class="sort-th" @click="sort('text')" >Task<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <!-- <th class="sort-th" @click="sort('taskType')">Category <span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span> </th>
              <th class="pl-1 sort-th" @click="sort('startDate')">Start Date<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="pl-1 sort-th" @click="sort('dueDate')">Due Date<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th> -->
              <th class="sort-th" @click="sort('userNames')">Assigned<br/>Users<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <!-- <th class="sort-th" @click="sort('progress')">Progress<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('dueDate')">Overdue<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('watched')">On Watch<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th> -->
              <th class="sort-th" @click="sort('notes')">Last Update<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
           </tr>
          </table>
        <TaskShowMap
          v-for="(task, i) in sortedTasks" 
          id="taskHover" 
          :load="log(task)"         
          :key="i" 
          :task="task" 
          :from-view="from" 
          @edit-task="editTask">
        </TaskShowMap>
         <div class="float-right my-2 font-sm">
           <span>Displaying </span>
           <div class="simple-select d-inline-block font-sm">          
            <multiselect 
              v-model="C_tasksPerPage" 
              track-by="value"
              label="name"      
              deselect-label=""                     
              :allow-empty="false"
              :options="getTasksPerPageFilterOptions">
                <template slot="singleLabel" slot-scope="{option}">
                      <div class="d-flex">
                        <span class='select__tag-name selected-opt'>{{option.name}}</span>
                      </div>
                </template>
            </multiselect>            
           </div>
          <span class="mr-1 pr-3" style="border-right:solid 1px lightgray">Per Page </span>
            <button class="btn btn-sm page-btns" @click="prevPage"><i class="fas fa-angle-left"></i></button>
            <button class="btn btn-sm page-btns" id="page-count"> {{ currentPage }} of {{ Math.ceil(this.filteredTasks.length / this.C_tasksPerPage.value) }} </button>
            <button class="btn btn-sm page-btns" @click="nextPage"><i class="fas fa-angle-right"></i></button>
        </div>       
      </div>
      <div v-else>
        <br />
        <h6 class="text-danger mt-2 ml-1">No Tasks found..</h6>
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
            <td >
           <span v-if="(task.responsibleUsers.length) > 0"> (R) {{task.responsibleUsers[0].name}} <br></span> 
           <span v-if="(task.accountableUsers.length) > 0"> (A) {{task.accountableUsers[0].name}}<br></span>   
          <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(task.consultedUsers.length) > 0"> (C) {{JSON.stringify(task.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, '')}}<br></span> 
             <span v-if="(task.informedUsers.length) > 0"> (I) {{JSON.stringify(task.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, '')}}</span>      
          </span>        
          </td>
          <td>{{task.progress + "%"}}</td>
          <td v-if="(task.dueDate) <= now">
            <h5>X</h5>
          </td>
          <td v-else></td>
          <td v-if="(task.notes.length) > 0">
            By: {{ task.notes[0].user.fullName}} on
            {{moment(task.notes[0].createdAt).format('DD MMM YYYY, h:mm a')}}: {{task.notes[0].body}}
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
import TaskShowMap from "./task_show_map"
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilePdf, faFileExcel, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
library.add(faFilePdf, faFileExcel, faPlusCircle)
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'TasksIndex',
  components: {
    TaskShowMap
  },
  props: ['facility', 'from'],
  data() {
    return {
      viewList: 'active',
      listOptions: ['active', 'all', 'completed'],
      now: new Date().toISOString(),
      tasksQuery: '',
      currentPage:1,
      currentSort:'text',
      currentSortDir:'asc',
      uri: 'data:application/vnd.ms-excel;base64,',
      template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/2018/SPSD-html401-20180327/"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64: function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
      format: function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    }
  },
  methods: {
    ...mapMutations([
      'setAdvancedFilter',
      'setTasksPerPageFilter',
      'setTaskIssueProgressStatusFilter',
      'setTaskIssueOverdueFilter',
      'setTaskTypeFilter',
      'setMyActionsFilter',
      'setOnWatchFilter',
      'setTaskForManager',
      'setToggleRACI',
    ]),
      sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
        this.currentSort = s;
      },
      nextPage:function() {
        if((this.currentPage*this.C_tasksPerPage.value) < this.filteredTasks.length) this.currentPage++;
      },
      prevPage:function() {
        if(this.currentPage > 1) this.currentPage--;
      },
    addNewTask() {
      if (this.from == "manager_view") {
        this.setTaskForManager({ key: 'task', value: {} })
      } else {
        this.$emit('show-hide')
      }
    },
    log(t){
      console.log(t)
    },
    showAllToggle() {
         this.setToggleRACI(!this.getToggleRACI)  ;              
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
    'getTasksPerPageFilterOptions',
    'getTasksPerPageFilter',
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
    'taskStageFilter',
    'getToggleRACI'
  ]),
  _isallowed() {
    return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
  },
   isMapView() {
    return this.$route.name === 'ProjectMapView'
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

      if (search_query) valid = valid && search_query.test(resource.text)

      return valid
    }), ['dueDate'])

    return tasks
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
   C_tasksPerPage: {
      get() {
        return this.getTasksPerPageFilter || {id: 15, name: '15', value: 15}
      },
      set(value) {
        this.setTasksPerPageFilter(value)
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
  },
    sortedTasks:function() {
          return this.filteredTasks.sort((a,b) => {
          let modifier = 1;
          if(this.currentSortDir === 'desc') modifier = -1;
          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
           }).filter((row, index) => {
          let start = (this.currentPage-1)*this.C_tasksPerPage.value;
          let end = this.currentPage*this.C_tasksPerPage.value;
          if(index >= start && index < end) return true;
          return this.end
        });
       }
      },    
}
</script>
<style lang="scss" scoped>
#tasks-index {
  height: 465px;
  background-color: #ffffff;
  z-index: 100;
}
table {
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0 !important;
  overflow: auto;
}

.new-tasks-btn {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
}

#total {
  float: right;
  margin-right: 0;
  text-align: right;
}
.stickyTableHeader {
    position: sticky;
    position: -webkit-sticky;
    justify-content: center;
    z-index: 10;
    left: 15;
    top: 0;
    width: 100%;
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
.exportBtns, 
.showAll {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
}

.exportBtns, .showAll {
  transition: all .2s ease-in-out;
  background-color: #41b883;
}

.exportBtns:hover, .showAll:hover {
  transform: scale(1.06);
}
  .page-btns {
    width: 20px;
    line-height: 1 !important;
    border: none !important;
    height: 25px;
    margin-right: 1px;
    background-color: white;  
    color: #383838;
    cursor: pointer;
 }
  .page-btns:hover {
    background-color: #ededed;
  }
  #page-count {
    width: auto !important;
    cursor: default;
  }
  .page-btns.active  {
    background-color: rgba(211, 211, 211, 10%);
    border:none !important;
 }

.myTasks {
  float: right !important;
  margin-top: 5px;
}

// #taskHover {
//  box-shadow: 1px 2.5px 5px rgba(56, 56, 56, 0.19), 1px 1.5px 1.5px rgba(56, 56, 56, 0.23);
//  border-left: solid 1.5px #fafafa;
// }

.map-v {
    width:34vw;
    margin-left: auto !important;
 }
</style>