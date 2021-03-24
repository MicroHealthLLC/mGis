<template>
  <div id="tasks-index" class="my-4" data-cy="task_sheet_index">
    <div v-if="_isallowed('read')">
      <div class="d-flex align-item-center justify-content-between mb-2 w-100">
        <div class="input-group task-search-bar w-100">
          <div class="input-group-prepend">
            <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
          </div>
            <input type="search"
            class="form-control form-control-sm"
            placeholder="Search by Task Name, Category, or Assigned User"
            aria-label="Search"
            aria-describedby="search-addon"
            v-model="tasksQuery"
            data-cy="search_tasks">
        </div>
        <div class="mx-1 w-100">
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

        <div class="w-100">
           <el-select 
           v-model="C_sheetsTaskFilter"                    
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
    <div class="wrapper p-3">
      <button v-if="_isallowed('write')"
         class="btn btn-md btn-primary mr-3 addTaskBtn"
        @click.prevent="addNewTask"
        data-cy="add_task"
      >
        <font-awesome-icon icon="plus-circle" /> 
        Add Task
      </button>
       <div class="float-right mb-2">
       <button
          v-tooltip="`Export to PDF`"
          @click.prevent="exportToPdf"
          class="btn btn-md mr-1 exportBtns text-light">
          <font-awesome-icon icon="file-pdf"/>          
        </button>
        <button
          v-tooltip="`Export to Excel`"
          @click.prevent="exportToExcel('table', 'Task List')"
          class="btn btn-md mr-1 exportBtns text-light">
          <font-awesome-icon icon="file-excel"/>         
        </button>
         <button
          v-tooltip="`Show More/Show Less`"
          @click.prevent="showAllToggle"
          class="btn btn-md mr-1 showAll text-light"          >
          <span v-if="getToggleRACI">
          <font-awesome-icon icon="user" />      
          </span>
           <span v-else>
          <font-awesome-icon icon="users"/>
           </span>    
         </button>
        
      <button class="btn btn-md btn-info ml-2 total-table-btns" data-cy="task_total">
        Total: {{filteredTasks.length}}
      </button>
       </div>
      <div v-if="filteredTasks.length > 0">
        <div  style="margin-bottom:50px" data-cy="tasks_table">
          <table class="table table-sm table-bordered table-striped mt-3 stickyTableHeader">
            <colgroup>
              <col class="sixteen" />
              <col class="ten" />
              <col class="eight" />
              <col class="eight" />
              <col class="fort" />
              <col class="eight" />
              <col class="eight" />
              <col class="eight" />
              <col class="twenty" />
            </colgroup>
            <tr class="thead" style="background-color:#ededed;">
              <th class="sort-th" @click="sort('text')" >Task<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('taskType')">Category <span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span> </th>
              <th class="pl-1 sort-th" @click="sort('startDate')">Start Date<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="pl-1 sort-th" @click="sort('dueDate')">Due Date<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('userNames')">Assigned<br/>Users<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('progress')">Progress<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('dueDate')">Overdue<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('watched')">On Watch<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
              <th class="sort-th" @click="sort('notes')">Last Update<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
            </tr>
          </table>
             <task-sheets
              v-for="(task, i) in sortedTasks"
              class="taskHover"
              href="#"       
              :load="log(task)"    
              :key="task.id"
              :task="task"
              :from-view="from"                       
            />
     
          <div class="float-right mb-4 mt-2 font-sm">
           <div class="simple-select d-inline-block text-right font-sm"> 
           <span class="mr-1">Displaying </span>                   
            <el-select 
            v-model="C_tasksPerPage"                    
            class="w-33" 
            track-by="value" 
            value-key="id"                                                                                                                               
            >
            <el-option 
              v-for="item in getTasksPerPageFilterOptions"                                                     
              :value="item"   
              :key="item.id"
              :label="item.name"                                                  
              >
            </el-option>                
            </el-select>          
           </div>
          <span class="mr-1 pr-3" style="border-right:solid 1px lightgray">Per Page </span>
            <button class="btn btn-sm page-btns" @click="prevPage"><i class="fas fa-angle-left"></i></button>
            <button class="btn btn-sm page-btns" id="page-count"> {{ currentPage }} of {{ Math.ceil(this.filteredTasks.length / this.C_tasksPerPage.value) }} </button>
            <button class="btn btn-sm page-btns" @click="nextPage"><i class="fas fa-angle-right"></i></button>
        </div>       
        </div>
      </div>
      <h6 v-else class="text-danger alt-text" data-cy="no_task_found">No Tasks found...</h6>
    </div>
      </div>
    <p v-else class="text-danger mx-2"> You don't have permissions to read!</p>
      <!-- debug: sort={{currentSort}}, dir={{currentSortDir}}, page={{currentPage}}  sum={{pageSize}} -->
  
    <table
      class="table table-sm table-bordered table-striped"
      ref="table" id="taskSheetsList1"
      style="display:none"
      >
      <thead>
        <tr style="background-color:#ededed">
          <th>Task</th>
          <th>Category</th>
          <th>Project</th>
          <th>Start Date</th>
          <th>Due Date</th>
          <th>Assigned Users</th>
          <th>Progress</th>
          <th>Overdue</th>
          <th>On Watch</th>
          <th>Last Update</th>
        </tr>
      </thead>
      <tbody>
        <tr  v-for="(task, i) in filteredTasks" :key="i" :load="log(task)">
          <td>{{task.text}}</td>
          <td>{{task.taskType}}</td>
          <td>{{task.facilityName}}</td>
          <td>{{formatDate(task.startDate)}}</td>
          <td>{{formatDate(task.dueDate)}}</td>
          <td>
          <span v-if="(task.responsibleUsers.length > 0) && (task.responsibleUsers[0] !== null)"> (R) {{task.responsibleUsers[0].name}} <br></span> 
          <span v-if="(task.accountableUsers.length > 0) && (task.accountableUsers[0] !== null)"> (A) {{task.accountableUsers[0].name}}<br></span>   
          <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(task.consultedUsers.length > 0) && (task.consultedUsers[0] !== null)"> (C) {{JSON.stringify(task.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, ' ')}}<br></span> 
             <span v-if="(task.informedUsers.length > 0) && (task.informedUsers[0] !== null)"> (I) {{JSON.stringify(task.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, ' ')}}</span>      
          </span>        
          </td>
          <td>{{task.progress + "%"}}</td>
          <td v-if="(task.dueDate) <= now"><h5>X</h5></td>
          <td v-else></td>
          <td v-if="(task.watched) == true"><h5>X</h5></td>
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
  import {mapGetters, mapMutations} from "vuex"
  import {jsPDF} from "jspdf"
  import 'jspdf-autotable'
  import TaskSheets from "./task_sheets"
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
  library.add(faFilePdf)  
  import * as Moment from 'moment'
  import {extendMoment} from 'moment-range'
  const moment = extendMoment(Moment)

  export default {
    name: 'TasksSheetsIndex',
    components: {
      TaskSheets   
    },
    props: ['facility', 'from'],
    data() {
      return {
        tasks: Object,
        now: new Date().toISOString(),       
        tasksQuery: '',         
        currentPage:1,
        currentSort:'text',
        currentSortDir:'asc',
        uri :'data:application/vnd.ms-excel;base64,',
        template:'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/2018/SPSD-html401-20180327/"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64: function(s){ return window.btoa(unescape(encodeURIComponent(s))) },
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
        'setToggleRACI',
        'setTaskForManager'
      ]),
      log(t){
        console.log(t)
      },
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
          this.setTaskForManager({key: 'task', value: {}})
        } else {
          this.$emit('show-hide')
        }
      },
      showAllToggle() {
         this.setToggleRACI(!this.getToggleRACI)  ;              
      },
      exportToPdf() {
        const doc = new jsPDF("l")
        const html =  this.$refs.table.innerHTML
        doc.autoTable({html: "#taskSheetsList1"})
        doc.save("Task_List.pdf")
      },
      exportToExcel(table, name){      
        if (!table.nodeType) table = this.$refs.table
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = this.uri + this.base64(this.format(this.template, ctx))
      }
    },
    computed: {
      ...mapGetters([
        'getAdvancedFilterOptions',
        'filterDataForAdvancedFilter',
        'getTasksPerPageFilterOptions',
        'getTasksPerPageFilter',
        'getTaskIssueUserFilter',
        'getAdvancedFilter',
        'getTaskIssueTabFilterOptions',
        'getTaskIssueProgressStatusOptions',
        'getTaskIssueProgressStatusFilter',
        'taskIssueProgressFilter',
        'getTaskIssueOverdueOptions',
        'taskIssueOverdueFilter',
        'noteDateFilter',
        'taskIssueDueDateFilter',
        'taskTypeFilter',
        'taskStageFilter',
        'myActionsFilter',
        'onWatchFilter',
        'taskUserFilter',
        'taskTypes',
        'viewPermit',
        'getToggleRACI'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      filteredTasks() {
        let typeIds = _.map(this.C_taskTypeFilter, 'id')
        let stageIds = _.map(this.taskStageFilter, 'id')
        const search_query = this.exists(this.tasksQuery.trim()) ? new RegExp(_.escapeRegExp(this.tasksQuery.trim().toLowerCase()), 'i') : null
        const taskCategory_query = this.exists(this.tasksQuery.trim()) ? new RegExp(_.escapeRegExp(this.tasksQuery.trim().toLowerCase()), 'i') : null
        let noteDates = this.noteDateFilter
        let taskIssueDueDates = this.taskIssueDueDateFilter
        
        let taskIssueProgress = this.taskIssueProgressFilter

        let taskIssueUsers = this.getTaskIssueUserFilter
        var filterDataForAdvancedFilterFunction = this.filterDataForAdvancedFilter

        let tasks = _.sortBy(_.filter(this.facility.tasks, (resource) => {
          let valid = Boolean(resource && resource.hasOwnProperty('progress'))

          let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]

          if (taskIssueUsers.length > 0) {  
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }

          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && filterDataForAdvancedFilterFunction([resource], 'sheetsTasks')

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
          // if (taskCategory_query) valid = valid && taskCategory_query.test(resource.taskType)

          return valid
        }), ['dueDate'])
        return tasks
      },
      C_sheetsTaskFilter: {
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
          if (value) this.setMyActionsFilter([...this.myActionsFilter, {name: "My Tasks", value: "tasks"}])
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
    };
</script>



<style lang="scss">
// Most datatable css located in app/assets/stylesheets/common.scss file
  #tasks-index {
    background-color: #ffffff;
    z-index: 100;
    height: 500px
  }
  .task-search-bar {
    height: 31px;
    width: 310px;
    border-radius: 5px;
  }

  input[type=search] {
    color: #383838;
    text-align: left;
    cursor: pointer;
    display: block;
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
  .alt-text {
    position: relative;
    margin-top: 50px;
    margin-left: 2px;
  }
  #printBtn, .addBtns {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  #total {
    margin-right: 18px;
    line-height: 3 !important;
  }
  .show-all {
   color: red !important;
  }
  .filter {
    color: #ced4da !important;
    border: solid #ced4da .8px !important;
    padding: 4px;
    font-size: 2rem;
    border-radius: 4px;
    padding: 4px;
  }
 
  .taskHover:hover {
    cursor: pointer;
    background-color: rgba(91, 192, 222, 0.3);
  }
  table {
    table-layout: fixed;
    width: 100%;
    position: relative;
    margin-bottom: 0 !important;
  }
  .stickyTableHeader {
    position: sticky;
    position: -webkit-sticky;
    z-index: 10;
    justify-content: center;
    left: 15;
    top: 0;
    width: 100%;
  }
  .eight {
    width: 8%;
  }
  .ten {
    width: 10%;
  }
  .fort {
    width: 14%;
  }
  .sixteen {
    width: 16%;
  }
  .twenty {
    width: 20%;
  }
  .floatRight {
    text-align: right;
    right: 0px;
  }
  .pagination {
    margin-bottom: 50px !important;
  }
  .addTaskBtn, .exportBtns, .showAll {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
 }
 .total-label {
    margin-top: 20px;
 }
.exportBtns, .showAll { 
    background-color: #41b883; 
    transition: all .2s ease-in-out;  
 }
 .exportBtns:hover, .showAll:hover { transform: scale(1.06); }
</style>
