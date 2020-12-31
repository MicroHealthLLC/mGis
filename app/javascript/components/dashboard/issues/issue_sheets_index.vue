<template>
  <div v-if="!loading" class="mt-4 issues-index" data-cy="issue_sheet_index">
    <div v-if="newIssue && from != 'manager_view'">
      <issue-form
        :facility="facility"
        :issue="currentIssue"
        @on-close-form="newIssue=false"
        @issue-created="issueCreated"
        @issue-updated="issueUpdated"
        class="issue-form-modal"
      />
    </div>
     <div v-else>      
      <div class="d-flex align-item-center w-100">
        <div class="input-group mb-2 mr-1 task-search-bar w-100">
          <div class="input-group-prepend">
            <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
          </div>
          <input type="search" 
            class="form-control form-control-sm" 
            placeholder="Search Issues" 
            aria-label="Search" 
            aria-describedby="search-addon" 
            v-model="issuesQuery"
            data-cy="search_issues"
            >
        </div>
        <div class="simple-select mr-1 w-100 justify-content-start">
            <multiselect
              v-model="C_taskTypeFilter"                
              track-by="name"
              label="name"
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
          </div>
        <div class="simple-select mr-1 w-100" v-tooltip="`Flags`">
          <multiselect v-model="C_sheetsIssueFilter" :options="getTaskIssueTabFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Task Status">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div>  
       </div>
      <div class="d-flex align-item-center justify-content-start filter-second-row">          
       <div class="simple-select mr-1 d-inline w-100">        
          <multiselect
            v-model="C_issueTypeFilter"
            track-by="name"        
            label="name"
            class="issueTypeMs"
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
        <div class="simple-select mr-1 d-flex w-100">
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
  
      <div class="mt-2">
        <button v-if="_isallowed('write')"
          class="addIssueBtn btn btn-md mr-3 btn-primary"
          @click.prevent="reportNew" data-cy="add_issue">
          <i class="fas fa-plus-circle mr-2"></i>
          Add Issue
        </button>
          <button
           v-tooltip="`Export to PDF`"
           @click.prevent="exportToPdf"
           class="btn btn-md mr-1 exportBtns text-light">
           <font-awesome-icon icon="file-pdf" />        
         </button>
         <button
          v-tooltip="`Export to Excel`"
          @click.prevent="exportToExcel('table', 'Issue Log')"
          class="btn btn-md exportBtns text-light">
          <font-awesome-icon icon="file-excel"/>         
        </button>
       <label class="form-check-label text-primary float-right mr-2 total-label" data-cy="issue_total">
        <h5>Total: {{filteredIssues.length}}</h5>
       </label>
        <div v-if="_isallowed('read')">
          <div v-if="filteredIssues.length > 0">      
            <div style="margin-bottom:50px" data-cy="issues_table">
              <table class="table table-sm table-bordered stickyTableHeader mt-3">
                <colgroup>
                  <col class="oneFive" />
                  <col class="ten" />
                  <col class="nine" />
                  <col class="eight" />
                  <col class="eight" />
                  <col class="ten" />
                  <col class="nine" />
                  <col class="nine" />
                  <col class="nine" />
                  <col class="oneFive" />
                </colgroup>
                <tr style="background-color:#ededed">
                  <th class="sort-th" @click="sort('title')">Issue<i class="fas fa-sort scroll"></i></th>
                  <th class="sort-th" @click="sort('issueType')">Issue Type <i class="fas fa-sort scroll"></i> </th>
                  <th class="sort-th" @click="sort('issueSeverity')">Issue Severity<i class="fas fa-sort scroll ml-2"></i></th>
                  <th class="sort-th" @click="sort('startDate')">Start<br/> Date<i class="fas fa-sort scroll"></i></th>
                  <th class="sort-th" @click="sort('dueDate')">Due<br/>Date<i class="fas fa-sort scroll" ></i></th>
                  <th class="sort-th" @click="sort('responsibleUserNames')">Assigned Users<i class="fas fa-sort scroll"></i></th>
                  <th class="sort-th" @click="sort('progress')">Progress<i class="fas fa-sort scroll"></i></th>
                  <th class="sort-th" @click="sort('dueDate')">Overdue<i class="fas fa-sort scroll"></i></th>
                  <th class="sort-th" @click="sort('watched')">Onwatch<i class="fas fa-sort scroll"></i></th>
                  <th class="sort-th" @click="sort('notes')">Last Update<i class="fas fa-sort scroll"></i></th>               
                </tr>
              </table>            
                <issue-sheets
                  v-for="(issue, i) in sortedIssues"      
                  id="issueHover"
                  :class="{'b_border': !!filteredIssues[i+1]}"
                  :key="issue.id"
                  :issue="issue"
                  :from-view="from"
                  @issue-edited="issueEdited"
                  @toggle-watch-issue="toggleWatched"
                />
              <div class="float-right mb-4">
                <button class="btn btn-sm page-btns" @click="prevPage"><i class="fas fa-angle-left"></i></button> 
                  <button class="btn btn-sm page-btns" id="page-count">Page {{ currentPage }} of {{ Math.ceil(this.filteredIssues.length / pageSize) }}  </button> 
                <button class="btn btn-sm page-btns" @click="nextPage"><i class="fas fa-angle-right"></i></button>          
              </div>             
            </div>
          </div>
          <h6 v-if="filteredIssues.length == 0" class="text-danger" id="altText" data-cy="no_issue_found">No issues found..</h6>
        </div>
        <p v-else class="text-danger mx-2"> You don't have permissions to read!</p>
      </div>
    </div>
    <div>
      <table
        class="table table-sm table-bordered table-striped"
        ref="table" id="issueSheetsList1"
        style="display:none">
        <thead>
          <tr style="background-color:#ededed">
            <th>Issue</th>
            <th>Issue Type</th>
            <th>Facility</th>
            <th>Issue Severity</th>
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
          <tr v-for="(issue, i) in filteredIssues">
            <td>{{issue.title}}</td>
            <td>{{issue.issueType}}</td>
            <td>{{issue.facilityName}}</td>
            <td>{{issue.issueSeverity}}</td>
            <td>{{formatDate(issue.startDate)}}</td>
            <td>{{formatDate(issue.dueDate)}}</td>
            <td v-if="(issue.responsibleUserNames.length) > 0">{{ issue.responsibleUserNames }}</td>
            <td v-else></td>
            <td>{{issue.progress + "%"}}</td>
            <td v-if="(issue.dueDate) <= now"><h5>X</h5></td>
            <td v-else></td>
            <td v-if="(issue.watched) <= now"><h5>X</h5></td>
            <td v-else></td>
            <td v-if="(issue.notes.length) > 0">
               By: {{ issue.notes[0].user.fullName}} on
              {{moment(issue.notes[0].createdAt).format('DD MMM YYYY, h:mm a')}}: {{issue.notes[0].body}}
            </td>
            <td v-else>No Updates</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import http from './../../../common/http'
  import {jsPDF} from "jspdf"
  import 'jspdf-autotable'
  import {mapGetters, mapMutations} from 'vuex'
  import IssueForm from './issue_form'
  import IssueSheets from './issue_sheets'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
  library.add(faFilePdf)
  import * as Moment from 'moment'
  import {extendMoment} from 'moment-range'
  const moment = extendMoment(Moment)
  export default {
    name: 'IssueSheetsIndex',
    props: ['facility', 'from'],
    components: {
      IssueForm,
      IssueSheets
    },
    data() {
      return {
        listOptions: ['active','all', 'completed'],
        loading: true,
        newIssue: false,
        viewList: 'active',
        currentIssue: null,
        now: new Date().toISOString(),
        issuesQuery: '',
        pageSize:15,
        currentPage:1,
        currentSort:'title',
        currentSortDir:'asc',
        uri :'data:application/vnd.ms-excel;base64,',
        template:'<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/2018/SPSD-html401-20180327/"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64: function(s){ return window.btoa(unescape(encodeURIComponent(s))) },
        format: function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
      }
    },
    mounted() {
      this.loading = false
    },
    methods: {
      ...mapMutations([
        'setAdvancedFilter',
        'setTaskIssueProgressStatusFilter',
        'setTaskIssueOverdueFilter',
        'setIssueTypeFilter',
        'setIssueSeverityFilter',
        'setTaskTypeFilter',
        'setMyActionsFilter',
        'updateFacilityHash',
        'setTaskForManager',
        'setOnWatchFilter'
      ]),
      sort:function(s) {
      //if s == current sort, reverse
      if(s === this.currentSort) {
        this.currentSortDir = this.currentSortDir==='asc'?'desc':'asc';
      }
        this.currentSort = s;
      },
      nextPage:function() {
        if((this.currentPage*this.pageSize) < this.filteredIssues.length) this.currentPage++;
      },
      prevPage:function() {
        if(this.currentPage > 1) this.currentPage--;
      },
      issueCreated(issue) {
        this.facility.issues.unshift(issue)
        this.newIssue = false
        this.$emit('refresh-facility')
      },
      issueUpdated(issue, refresh=true) {
        let index = this.facility.issues.findIndex((t) => t.id == issue.id)
        if (index > -1) Vue.set(this.facility.issues, index, issue)
        if (refresh) {
          this.newIssue = false
          this.$emit('refresh-facility')
        } else {
          this.updateFacilityHash(this.facility)
        }
      },
      toggleWatched(issue) {
        http
          .put(`/projects/${this.currentProject.id}/facilities/${this.facility.id}/issues/${issue.id}.json`, {issue: issue})
          .then((res) => {
            this.issueUpdated(res.data.issue, false)
          })
          .catch((err) => console.log(err))
      },
       exportToPdf() {
        const doc = new jsPDF("l")
        const html =  this.$refs.table.innerHTML
        doc.autoTable({html: "#issueSheetsList1"})
        doc.save("Issue_Log.pdf")
      },
      exportToExcel(table, name){      
        if (!table.nodeType) table = this.$refs.table
        var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
        window.location.href = this.uri + this.base64(this.format(this.template, ctx))
      },
      issueEdited(issue) {
        this.currentIssue = issue
        this.newIssue = true
      },
      reportNew() {
        if (this.from == "manager_view") {
          this.setTaskForManager({key: 'issue', value: {}})
        } else {
          this.currentIssue = null
          this.newIssue = true
        }
      }
   },
    computed: {
      ...mapGetters([
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
        'currentProject',
        'issueTypes',
        'taskTypes',
        'issueSeverities',
        'issueTypeFilter',
        'issueSeverityFilter',
        'issueStageFilter',
        'taskTypeFilter',
        'issueUserFilter',
        'myActionsFilter',
        'managerView',
        'onWatchFilter',
        'viewPermit'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.issues[salut]
      },
      filteredIssues() {
        let typeIds = _.map(this.C_issueTypeFilter, 'id')
        let taskTypeIds = _.map(this.C_taskTypeFilter, 'id')
        let severityIds = _.map(this.C_issueSeverityFilter, 'id')
        let stageIds = _.map(this.issueStageFilter, 'id')
        const search_query = this.exists(this.issuesQuery.trim()) ? new RegExp(_.escapeRegExp(this.issuesQuery.trim().toLowerCase()), 'i') : null
        let noteDates = this.noteDateFilter
        let taskIssueDueDates = this.taskIssueDueDateFilter
        let taskIssueOverdue = this.taskIssueOverdueFilter
        let taskIssueProgressStatus = this.getTaskIssueProgressStatusFilter
        let taskIssueProgress = this.taskIssueProgressFilter
        let taskIssueOnWatch = this.onWatchFilter
        let taskIssueMyAction = this.myActionsFilter
        let taksIssueNotOnWatch = _.map(this.getAdvancedFilter(), 'id').includes("notOnWatch")
        let taksIssueNotMyAction = _.map(this.getAdvancedFilter(), 'id').includes("notMyAction")
        let taskIssueUsers = this.getTaskIssueUserFilter

        let issues = _.sortBy(_.filter(this.facility.issues, ((issue) => {
          let valid = Boolean(issue && issue.hasOwnProperty('progress'))

          if (taskIssueProgressStatus && taskIssueProgressStatus.length > 0) {
            var taskIssueProgressStatusNames = _.map(taskIssueProgressStatus, 'id')
            if (taskIssueProgressStatusNames.includes("active") && taskIssueProgressStatusNames.includes("completed")) {
              valid = true
            }else{
              if (taskIssueProgressStatusNames.includes("active")) {
                valid = (issue.progressStatus == "active")
              }
              if (taskIssueProgressStatusNames.includes("completed")) {
                valid = (issue.progressStatus == "completed")
              }
            }
          }

          let userIds = [..._.map(issue.checklists, 'userId'), ...issue.userIds]

          if (taskIssueUsers.length > 0) {  
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }

          if(taskIssueMyAction.length > 0 && taksIssueNotMyAction == true){
            valid = true
          }else{
            if (taskIssueMyAction.length > 0) {  
              valid = valid && userIds.includes(this.$currentUser.id)
            }
            if(taksIssueNotMyAction == true){
              if (taksIssueNotMyAction ==  true) valid = valid && !userIds.includes(this.$currentUser.id)
            }
          }

          if (taskIssueOnWatch && taskIssueOnWatch.length > 0) {
            var onWatchFilterNames = _.map(taskIssueOnWatch, 'id')
            if (onWatchFilterNames.includes("onWatch") && onWatchFilterNames.includes("notOnWatch")) {
              valid = true
            }else{
              if (onWatchFilterNames.includes("onWatch")) {
                valid = (issue.watched == true)
              }
              if (onWatchFilterNames.includes("notOnWatch")) {
                valid = (issue.watched == false)
              }
            }
          }

          if (typeIds.length > 0) valid = valid && typeIds.includes(issue.issueTypeId)
          if (taskTypeIds.length > 0) valid = valid && taskTypeIds.includes(issue.taskTypeId)
          if (severityIds.length > 0) valid = valid && severityIds.includes(issue.issueSeverityId)
          if (stageIds.length > 0) valid = valid && stageIds.includes(issue.issueStageId)
          if(noteDates && noteDates[0] && noteDates[1]){
            var startDate = moment(noteDates[0], "YYYY-MM-DD")
            var endDate = moment(noteDates[1], "YYYY-MM-DD")
            var _notesCreatedAt = _.map(issue.notes, 'createdAt')
            var is_valid = issue.notes.length > 0
            for(var createdAt of _notesCreatedAt){
              var nDate = moment(createdAt, "YYYY-MM-DD")
              is_valid = nDate.isBetween(startDate, endDate, 'days', true)
              if(is_valid) break
            }
            valid = is_valid
          }
          if(taskIssueDueDates && taskIssueDueDates[0] && taskIssueDueDates[1]){
            var startDate = moment(taskIssueDueDates[0], "YYYY-MM-DD")
            var endDate = moment(taskIssueDueDates[1], "YYYY-MM-DD")
            var is_valid = true
            var nDate = moment(issue.dueDate, "YYYY-MM-DD")
            is_valid = nDate.isBetween(startDate, endDate, 'days', true)
            valid = is_valid
          }
          if (taskIssueOverdue) {
            var overdueFilterNames = _.map(taskIssueOverdue, 'id')
            if (overdueFilterNames.includes("overdue") && overdueFilterNames.includes("not overdue")) {
              valid = true
            }else{
              if (overdueFilterNames.includes("overdue")) {
                valid = (issue.isOverdue == true)
              }
              if (overdueFilterNames.includes("not overdue")) {
                valid = (issue.isOverdue == false)
              }
            }

          }
        
          if (taskIssueProgress && taskIssueProgress[0]) {
            var min = taskIssueProgress[0].value.split("-")[0]
            var max = taskIssueProgress[0].value.split("-")[1]
            valid = valid && (issue.progress >= min && issue.progress <= max)
          }

          if (search_query) valid = valid && search_query.test(issue.title)

          return valid;
        })), ['dueDate'])
        return issues
      },
      C_sheetsIssueFilter: {
        get() {
          return this.getAdvancedFilter()
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
      C_issueTypeFilter: {
        get() {
          return this.issueTypeFilter
        },
        set(value) {
          this.setIssueTypeFilter(value)
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
      sortedIssues:function() {
          return this.filteredIssues.sort((a,b) => {
          let modifier = 1;
          if(this.currentSortDir === 'desc') modifier = -1;
          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
           }).filter((row, index) => {
          let start = (this.currentPage-1)*this.pageSize;
          let end = this.currentPage*this.pageSize;
          if(index >= start && index < end) return true;
          return this.end
        });
      },
    }
  }
</script>

<style lang="scss">
  table {
    table-layout: fixed ;
    width: 100% ;
    margin-bottom: 0 !important;
  }
  .eight {
    width: 8%;
  }
  .nine {
    width: 9%;
  }
  .ten {
    width: 10%;
  }
  .oneFive {
    width: 15%;
  }
  th {
    font-size: .70rem !important;
  }
  .floatRight {
    text-align: right;
    right: 0px;
  }
  .issues-index {
    height: 465px;
  }
  #altText {
    position: absolute;
    margin-top: 50px
  }
  #issueHover:hover {
    cursor: pointer;
    background-color: rgba(91, 192, 222, 0.3);
    border-left: solid rgb(91, 192, 222);
  }
  .floatRight {
    text-align: right;
    position: absolute;
    right: 0px
  }
  .multiselect__tags {
    min-height: 25px !important;
  }
    .page-btns {
    width: 30px;
    border: none !important;
    height: 36px;
    margin-right: 1px;
    background-color: white;
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 6px 6px rgba(56,56,56,0.23);
    color: #383838;
    padding: 10px 24px;
    padding-bottom: 10px !important;
    cursor: pointer;
 }
  .page-btns:hover {
    background-color: #ededed
  }
  .page-btns.active  {
    background-color: rgba(211, 211, 211, 10%);
    border:none !important;
 }
   #page-count {
    width: auto !important;
    cursor: default;
  }
  .my-issues {
    float: right !important;
    right: 0;
  }
  .addIssueBtn, .exportBtns {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  .exportBtns { 
    transition: all .2s ease-in-out; 
    background-color: #41b883; 
  }
  .filter-second-row {
    width: 66.8%;
  }
  .exportBtns:hover { transform: scale(1.06); }
</style>