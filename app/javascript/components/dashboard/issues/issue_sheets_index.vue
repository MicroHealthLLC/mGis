<template>
  <div v-if="!loading" class="mt-1 ml-1 issues-index" data-cy="issue_sheet_index">
    <div v-if="_isallowed('read')">
      <div class="d-flex align-item-center w-75 float-right filters-wrapper">
        <div class="ml-2 task-search-bar w-100">
        <label class="font-sm mb-0"><span style="visibility:hidden">|</span></label>
          <el-input
            type="search"          
            placeholder="Search by Issue, Category, or Assigned User"
            aria-label="Search"            
            aria-describedby="search-addon"    
            v-model="issuesQuery"     
            data-cy="search_issues"
        >
          <el-button slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
        </div>
        <div class="mx-1 w-75">
          <label class="font-sm my-0">Category</label>
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
  <div class="w-75" style="position:relative">  
  <label class="font-sm my-0">Filters</label>      
  <el-collapse class="issuesFilter w-100"  style="position:absolute">
  <el-collapse-item name="1">
    <template slot="title" class="text-right">
      <font-awesome-icon icon="sliders-h"  class="d-inline mr-2" />
    MORE ISSUE FILTERS
    </template>
    <div class="mr-1 w-100 d-unset p-2">
      <label class="mb-0">Flags</label>
      <el-select
           v-model="C_sheetsIssueFilter"
           class="w-100 mb-1"
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
           <label class="mb-0">Issue Types</label>
      <el-select
        v-model="C_issueTypeFilter"
        class="w-100 mr-1 mb-1"
        track-by="name"
        value-key="id"
        multiple
        placeholder="Filter by Issue Types"
      >
      <el-option
        v-for="item in issueTypes"
        :value="item"
        :key="item.id"
        :label="item.name"
        >
      </el-option>
      </el-select>
       <label class="mb-0">Issue Severity</label>
      <el-select
        v-model="C_issueSeverityFilter"
        class="w-100"
        track-by="name"
        value-key="id"
        multiple
        placeholder="Filter by Issue Severities"
      >
      <el-option
        v-for="item in issueSeverities"
        :value="item"
        :key="item.id"
        :label="item.name"
        >
      </el-option>
      </el-select>
    </div>
        </el-collapse-item>
      </el-collapse>  
            
    </div>
      
       </div>
  
     <div class="wrapper mt-4 p-3">
        <button v-if="_isallowed('write')"
          class="addIssueBtn btn btn-md mr-3 btn-primary"
          @click.prevent="addNewIssue" data-cy="add_issue">
          <i class="fas fa-plus-circle mr-2"></i>
          Add Issue
        </button>
      <div class="float-right mb-2">
          <button
           v-tooltip="`Export to PDF`"
           @click.prevent="exportToPdf"
           class="btn btn-md mr-1 exportBtns text-light">
           <font-awesome-icon icon="file-pdf" />
         </button>
         <button
          v-tooltip="`Export to Excel`"
          @click.prevent="exportToExcel('table', 'Issue Log')"
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
         <button class="btn btn-md btn-info ml-2 total-table-btns" data-cy="issue_total">
          Total: {{filteredIssues.length}}
         </button>
      </div>

          <div v-if="filteredIssues.length > 0">
            <div style="margin-bottom:50px" data-cy="issues_table">
              <table class="table table-sm table-bordered stickyTableHeader mt-3">
                <colgroup>
                  <col class="oneFive" />
                  <col class="ten" />
                  <col class="nine" />
                  <col class="eight" />
                  <col class="eight" />
                  <col class="oneThree" />
                  <col class="eight" />
                  <col class="fort" />                
                  <col class="oneSeven" />
                </colgroup>
                <tr class="thead" style="background-color:#ededed">
                  <th class="sort-th" @click="sort('title')">Issue
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'title'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'title'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'title'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'title'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'title'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>
                  <th class="sort-th" @click="sort('issueType')">Issue Type
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'issueType'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'issueType'">
                  <font-awesome-icon icon="sort-up" /></span>
                   <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'issueType'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'issueType'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'issueType'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>
                  <th class="sort-th" @click="sort('issueSeverity')">Issue Severity
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'issueSeverity'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'issueSeverity'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'issueSeverity'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'issueSeverity'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'issueSeverity'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>
                  <th class="pl-1 sort-th" @click="sort('startDate')">Start Date
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'startDate'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'startDate'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'startDate'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'startDate'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'startDate'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>
                  <th class="pl-1 sort-th" @click="sort('dueDate')">Due Date
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'dueDate'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'dueDate'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'dueDate'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'dueDate'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'dueDate'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>

             <th class="sort-th p-1 w-100">
              <span class="py-2 d-inline-block">Assigned Users</span><br>
              <span class="btn-group">
                 <button
                :class="{'activeFirstName': sortedResponsibleUser === 'responsibleUsersFirstName' || sortedAccountableUser === 'accountableUsersFirstName'}"
                class="btn-group-btns outerLeftBtn first inactiveFirstName px-2"
                @click.prevent="firstNameSort"
                >First
                </button>
              <button
                :class="{'activeLastName': sortedResponsibleUser  === 'responsibleUsersLastName'  || sortedAccountableUser === 'accountableUsersLastName'}"
                class="btn-group-btns inactiveLastName outerRightBtn last px-2"
                @click.prevent="lastNameSort"
                >Last
                </button>

              </span>
                 <span class="btn-group">
              <button
                :class="{'activeResponsible':currentSort === sortedResponsibleUser }"
                class="btn-group-btns outerLeftBtn inactiveResponsible px-2"
                @click="sort(sortedResponsibleUser)"
                data-cy="responsibleUsers"
                >R
                </button>
              <button
                :class="{'activeAccountable':currentSort === sortedAccountableUser }"
                class="btn-group-btns outerRightBtn inactiveAccountable px-2"
                @click="sort(sortedAccountableUser)"
                >A
                </button>
              </span>
               <span class="inactive-sort-icon scroll" v-if="currentSort !== sortedResponsibleUser || sortedAccountableUser">
              <font-awesome-icon icon="sort" /></span>
                <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === sortedResponsibleUser">
                <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === sortedResponsibleUser">
                <font-awesome-icon icon="sort-up" /></span>
                 <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === sortedResponsibleUser">
                <font-awesome-icon icon="sort-down" /></span>
                 <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === sortedResponsibleUser">
                <font-awesome-icon icon="sort-down" /></span>
                <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === sortedAccountableUser">
                <font-awesome-icon icon="sort-up" /></span>
                 <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === sortedAccountableUser">
                <font-awesome-icon icon="sort-up" /></span>
                 <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === sortedAccountableUser">
                <font-awesome-icon icon="sort-down" /></span>
                 <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === sortedAccountableUser">
                <font-awesome-icon icon="sort-down" /></span>
                  </th>

                  <th class="sort-th" @click="sort('progress')">Progress
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'progress'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'progress'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'progress'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'progress'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'progress'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>

                   <th class="non-sort-th">Flags               
                  </th>

                  <th class="sort-th" @click="sort('notesUpdatedAt')">Last Update
                  <span class="inactive-sort-icon scroll" v-if="currentSort !== 'notesUpdatedAt'">
                  <font-awesome-icon icon="sort" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir === 'asc' && currentSort === 'notesUpdatedAt'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !== 'asc' && currentSort === 'notesUpdatedAt'">
                  <font-awesome-icon icon="sort-up" /></span>
                  <span class="sort-icon scroll" v-if="currentSortDir ==='desc' && currentSort === 'notesUpdatedAt'">
                  <font-awesome-icon icon="sort-down" /></span>
                  <span class="inactive-sort-icon scroll" v-if="currentSortDir !=='desc' && currentSort === 'notesUpdatedAt'">
                  <font-awesome-icon icon="sort-down" /></span>
                  </th>
                </tr>
              </table>
                <issue-sheets
                  v-for="issue in sortedIssues"
                  id="issueHover"
                  :key="issue.id"
                  :issue="issue"
                  :from-view="from"
                  @toggle-watch-issue="toggleWatched"
                />
               <div class="float-right mb-4 mt-2 font-sm">
               <div class="simple-select d-inline-block text-right font-sm">
                <span>Displaying </span>
                   <el-select
                    v-model="C_issuesPerPage"
                    class="w-33"
                    track-by="value"
                    value-key="id"
                    >
                    <el-option
                    v-for="item in getIssuesPerPageFilterOptions"
                    :value="item"
                    :key="item.id"
                    :label="item.name"
                    >
                    </el-option>
                    </el-select>
                </div>
                <span class="mr-1 pr-3" style="border-right:solid 1px lightgray">Per Page </span>
                  <button class="btn btn-sm page-btns" @click="prevPage"><i class="fas fa-angle-left"></i></button>
                  <button class="btn btn-sm page-btns" id="page-count"> {{ currentPage }} of {{ Math.ceil(this.filteredIssues.length / this.C_issuesPerPage.value) }} </button>
                  <button class="btn btn-sm page-btns" @click="nextPage"><i class="fas fa-angle-right"></i></button>

            </div>

            </div>

          </div>
           <h6 v-else class="text-danger alt-text" data-cy="no_issue_found">No Issues found...</h6>

     </div>

      </div>
        <p v-else class="text-danger mx-2"> You don't have permissions to read!</p>



      <table
        class="table table-sm table-bordered table-striped"
        ref="table" id="issueSheetsList1"
        style="display:none">
        <thead>
          <tr style="background-color:#ededed">
            <th>Issue</th>
            <th>Issue Type</th>
            <th>Project</th>
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
            <td >
             <span v-if="(issue.responsibleUsers.length > 0) && (issue.responsibleUsers[0] !== null)"> (R) {{issue.responsibleUsers[0].name}} <br></span>
              <span v-if="(issue.accountableUsers.length > 0) && (issue.accountableUsers[0] !== null)"> (A) {{issue.accountableUsers[0].name}}<br></span>
          <!-- Consulted Users and Informed Users are toggle values         -->
              <span :class="{'show-all': getToggleRACI }" >
             <span v-if="(issue.consultedUsers.length > 0) &&  (issue.consultedUsers[0] !== null)"> (C) {{JSON.stringify(issue.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, ' ')}}<br></span>
             <span v-if="(issue.informedUsers.length > 0) &&  (issue.informedUsers[0] !== null)"> (I) {{JSON.stringify(issue.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, ' ')}}</span>
         </span>
            </td>
            <td>{{issue.progress + "%"}}</td>
            <td v-if="(issue.dueDate) <= now"><h5>X</h5></td>
            <td v-else></td>
            <td v-if="(issue.watched) <= now"><h5>X</h5></td>
            <td v-else></td>
            <td v-if="(issue.notesUpdatedAt.length) > 0">
               By: {{ issue.notes[0].user.fullName}} on
              {{moment(issue.notesUpdatedAt[0]).format('DD MMM YYYY, h:mm a')}}: {{issue.notes[0].body.replace(/[^ -~]/g,'')}}
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
        sortedResponsibleUser: 'responsibleUsersFirstName',
        sortedAccountableUser: 'accountableUsersFirstName',
        issuesQuery: '',
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
        'setIssuesPerPageFilter',
        'setTaskIssueOverdueFilter',
        'setIssueTypeFilter',
        'setIssueSeverityFilter',
        'setTaskTypeFilter',
        'setMyActionsFilter',
        'setToggleRACI',
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
        if((this.currentPage*this.C_issuesPerPage.value) < this.filteredIssues.length) this.currentPage++;
      },
      prevPage:function() {
        if(this.currentPage > 1) this.currentPage--;
      },
      firstNameSort(){
        this.sortedResponsibleUser = 'responsibleUsersFirstName'
        this.sortedAccountableUser = 'accountableUsersFirstName'
      },
      lastNameSort(){
        this.sortedResponsibleUser = 'responsibleUsersLastName'
        this.sortedAccountableUser = 'accountableUsersLastName'
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
      showAllToggle() {
         this.setToggleRACI(!this.getToggleRACI)  ;
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
      addNewIssue() {
        this.setTaskForManager({key: 'issue', value: {}})
        // Route to new issue form page
        this.$router.push(
          `/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/issues/new`
        );
      },
   },
    computed: {
      ...mapGetters([
        'getAdvancedFilterOptions',
        'getIssuesPerPageFilterOptions',
        'getIssuesPerPageFilter',
        'filterDataForAdvancedFilter',
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
        'viewPermit',
        'getToggleRACI'
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
        let taskIssueProgress = this.taskIssueProgressFilter
        let taskIssueUsers = this.getTaskIssueUserFilter
        var filterDataForAdvancedFilterFunction = this.filterDataForAdvancedFilter
        let issues = _.sortBy(_.filter(this.facility.issues, ((resource) => {
          let valid = Boolean(resource && resource.hasOwnProperty('progress'))
          let userIds = [..._.map(resource.checklists, 'userId'), ...resource.userIds]
          if (taskIssueUsers.length > 0) {
            if(taskIssueUsers.length > 0){
              valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
            }
          }
          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && filterDataForAdvancedFilterFunction([resource], 'sheetsIssues')
          if (typeIds.length > 0) valid = valid && typeIds.includes(resource.issueTypeId)
          if (taskTypeIds.length > 0) valid = valid && taskTypeIds.includes(resource.taskTypeId)
          if (severityIds.length > 0) valid = valid && severityIds.includes(resource.issueSeverityId)
          if (stageIds.length > 0) valid = valid && stageIds.includes(resource.issueStageId)
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

          if (search_query) valid = valid && search_query.test(resource.title) ||
            valid && search_query.test(resource.issueType) ||
            valid && search_query.test(resource.issueSeverity) ||
            valid && search_query.test(resource.userNames)
          return valid;
        })), ['dueDate'])
      if ( _.map(this.getAdvancedFilter, 'id') == 'draft' || _.map(this.getAdvancedFilter, 'id') == 'onHold') {   
        
        return issues
        
       } else  {
        
        issues  = issues.filter(t => t.draft == false && t.onHold == false)
        return issues
      
       }   
      },
      C_sheetsIssueFilter: {
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
      C_issuesPerPage: {
        get() {
          return this.getIssuesPerPageFilter || {id: 15, name: '15', value: 15}
        },
        set(value) {
          this.setIssuesPerPageFilter(value)
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
          let start = (this.currentPage-1)*this.C_issuesPerPage.value;
          let end = this.currentPage*this.C_issuesPerPage.value;
          if(index >= start && index < end) return true;
          return this.end
        });
      },
    }
  }
</script>

<style scoped lang="scss">
// Most datatable css located in app/assets/stylesheets/common.scss file
  table {
    table-layout: fixed ;
    width: 100% ;
    margin-bottom: 0 !important;
  }
  .task-search-bar {
    height: 31px;
    width: 310px;
    border-radius: 5px;
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
  .nine {
    width: 9%;
  }
  .ten {
    width: 10%;
  }
  .elev {
    width: 11%;
  }
  .oneThree {
    width: 13%;
  }
  .fort {
    width: 14%;
  }
  .oneFive {
    width: 15%;
  }
  .oneSeven {
    width: 17%;
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
 .alt-text {
    position: relative;
    margin-top: 50px;
    margin-left: 2px;
  }
  #issueHover:hover {
    cursor: pointer;
    background-color: rgba(91, 192, 222, 0.3);
  }
  .floatRight {
    text-align: right;
    position: absolute;
    right: 0px
  }
  .multiselect__tags {
    min-height: 25px !important;
  }
  .rediconcolor {
    color: red;
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
  .addIssueBtn, .exportBtns, .showAll  {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  .exportBtns, .showAll  {
    transition: all .2s ease-in-out;
    background-color: #41b883;
  }
  .filter-second-row {
    width: 66.8%;
  }
  .exportBtns:hover, .showAll:hover { transform: scale(1.06); }
  .btn-group-btns {
    border: solid 1px lightgray;
    line-height: 1 !important;
  }
  .activeLastName, .activeFirstName, .activeResponsible, .activeAccountable {
    background-color: lightgray;
  }
  .inactiveLastName:hover, .inactiveFirstName:hover, .inactiveResponsible:hover, .inactiveAccountable:hover {
    background-color: lightgray;
  }
  .outerLeftBtn {
    border-top-left-radius: .15rem;
    border-bottom-left-radius: .15rem;
    // background-color:#383838;
    // color:#fff;
  }
  .outerRightBtn {
    border-top-right-radius: .15rem;
    border-bottom-right-radius: .15rem;
  }
  .sort-btn-group {
    position: absolute;
    top: 2px;
    right: 1px;
  }
  .filters-wrapper {
    float: right;
    margin-top: -85px;
  }
/deep/.el-collapse   {
  border-bottom: none !important;
  }
  
  
</style>
