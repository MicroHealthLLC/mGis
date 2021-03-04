<template>
  <div v-if="!loading" class="issues-index px-0" data-cy="issue_list" :class="{'map-v': isMapView}">
    <div v-if="newIssue && from != 'manager_view'">
      <issue-form :facility="facility" :issue="currentIssue" @on-close-form="newIssue=false" @issue-created="issueCreated" @issue-updated="issueUpdated" class="issue-form-modal" />
    </div>
    <div v-else>
      <div class="d-flex align-item-center justify-content-between w-100 mb-2">
        <div class="input-group w-100">
          <div class="input-group-prepend d-inline">
            <span class="input-group-text" id="search-addon"><i class="fa fa-search"></i></span>
          </div>
          <input type="search" style="height:30px" class="form-control form-control-sm" placeholder="Search Issues" aria-label="Search" aria-describedby="search-addon" v-model="issuesQuery" data-cy="search_issues">
        </div>        
      </div>

      <div class="d-flex align-item-center font-sm justify-content-between mt-2 w-100">
       <div class="simple-select w-50 mr-1 font-sm">
          <multiselect v-model="C_taskTypeFilter" track-by="name" label="name" placeholder="Filter by Category" :options="taskTypes" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div>
       
        <div class="simple-select w-50">
          <multiselect v-model="C_facilityManagerIssueFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div>
      </div>

      <div class="d-flex align-item-center justify-content-between w-100">
        <div class="simple-select w-100 mr-1">
          <multiselect v-model="C_issueTypeFilter" track-by="name" label="name" placeholder="Filter by Issue Type" :options="issueTypes" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div>
        <div class="simple-select w-100">
          <multiselect v-model="C_issueSeverityFilter" track-by="name" label="name" placeholder="Filter by Issue Severity" :options="issueSeverities" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div>
      </div>
      <div class="mt-1">
        <button v-if="_isallowed('write')" class="btn btn-md btn-primary addIssueBtn mr-3" @click.prevent="addNewIssue">
          <font-awesome-icon icon="plus-circle" data-cy="new_issue" />
          Add Issue
        </button>
        <div class="float-right">
        <button v-tooltip="`Export to PDF`" @click.prevent="exportToPdf" class="btn btn-md mr-1 exportBtns text-light">
          <font-awesome-icon icon="file-pdf" />
        </button>
        <button v-tooltip="`Export to Excel`" @click.prevent="exportToExcel('table', 'Issue Log')" class="btn btn-md exportBtns text-light">
          <font-awesome-icon icon="file-excel" />
        </button>
         <button
          v-tooltip="`Show More/Show Less`"
          @click.prevent="showAllToggle"
          class="btn btn-md showAll text-light"          >
          <span v-if="getToggleRACI">
          <font-awesome-icon icon="user" />      
          </span>
           <span v-else>
          <font-awesome-icon icon="users"/>
           </span>    
         </button>
        </div>
        <div v-if="_isallowed('read')">
          <div v-if="filteredIssues.length > 0" style="height:53vh; overflow-y:auto;border-bottom:solid 1px #ededed" >         
            <hr class="my-1"/>
          <table class="table table-sm table-bordered table-striped mt-2 stickyTableHeader">
            <tr style="background-color:#ededed;">
              <th class="sort-th" @click="sort('text')" >Issue<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
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
            <IssueShowMap
            v-for="issue in sortedIssues" 
            id="issueHover"                     
            :key="issue.id" 
            :issue="issue" 
            :from-view="from" 
            @issue-edited="issueEdited" />
             <div class="float-right mb-4 mt-2 font-sm">
                <span>Displaying </span>
                <div class="simple-select d-inline-block font-sm">          
                  <multiselect 
                    v-model="C_issuesPerPage" 
                    track-by="value"
                    label="name"      
                    deselect-label=""                     
                    :allow-empty="false"
                    :options="getIssuesPerPageFilterOptions">
                      <template slot="singleLabel" slot-scope="{option}">
                            <div class="d-flex">
                              <span class='select__tag-name selected-opt'>{{option.name}}</span>
                            </div>
                      </template>
                  </multiselect>            
                </div>
                <span class="mr-1 pr-3" style="border-right:solid 1px lightgray">Per Page </span>
                  <button class="btn btn-sm page-btns" @click="prevPage"><i class="fas fa-angle-left"></i></button>
                  <button class="btn btn-sm page-btns" id="page-count"> {{ currentPage }} of {{ Math.ceil(this.filteredIssues.length / this.C_issuesPerPage.value) }} </button>
                  <button class="btn btn-sm page-btns" @click="nextPage"><i class="fas fa-angle-right"></i></button>
         
            </div>  
          </div>

          <div v-else>
            <br />
            <h6 class="text-danger ml-1 mt-4">No issues found..</h6>
          </div>
        </div>
        <p v-else class="text-danger mx-2"> You don't have permissions to read!</p>
      </div>
    </div>
    <table style="display:none" class="table table-sm table-bordered" ref="table" id="issueList1">
      <thead>
        <tr>
          <th></th>
          <th>Issue</th>
          <th>Issue Type</th>
          <th>Project</th>
          <th>Issue Severity</th>
          <th>Start Date</th>
          <th>Due Date</th>
          <th>Assigned Users</th>
          <th>Progress</th>
          <th>Overdue</th>
          <th>Last Update</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="issue in filteredIssues" :key="issue.id">
          <td class="text-center">{{i+1}}</td>
          <td>{{issue.title}}</td>
          <td>{{issue.issueType}}</td>
          <td>{{issue.facilityName}}</td>
          <td>{{issue.issueSeverity}}</td>
          <td>{{formatDate(issue.startDate)}}</td>
          <td>{{formatDate(issue.dueDate)}}</td>
         <td>
           
          <span v-if="(issue.responsibleUsers.length) > 0"> (R) {{issue.responsibleUsers[0].name}} <br></span> 
          <span v-if="(issue.accountableUsers.length) > 0"> (A) {{issue.accountableUsers[0].name}}<br></span>   
      <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(issue.consultedUsers.length) > 0"> (C) {{JSON.stringify(issue.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, '')}}<br></span> 
             <span v-if="(issue.informedUsers.length) > 0"> (I) {{JSON.stringify(issue.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, '')}}</span>      
         </span>        
         </td>
          <td>{{issue.progress + "%"}}</td>
          <td v-if="(issue.dueDate) <= now">X</td>
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
</template>
<script>
import http from './../../../common/http'
import { jsPDF } from "jspdf"
import 'jspdf-autotable'
import { mapGetters, mapMutations } from 'vuex'
import IssueForm from './issue_form'
import IssueShowMap from './issue_show_map'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilePdf } from '@fortawesome/free-solid-svg-icons'
library.add(faFilePdf)
import * as Moment from 'moment'
import { extendMoment } from 'moment-range'
const moment = extendMoment(Moment)

export default {
  name: 'IssueIndex',
  props: ['facility', 'from'],
  components: {
    IssueForm,
    IssueShowMap
  },
  data() {
    return {
      loading: true,
      newIssue: false,
      currentIssue: null,
      now: new Date().toISOString(),
      issuesQuery: '',
      currentPage:1,
      currentSort:'title',
      currentSortDir:'asc',
      uri: 'data:application/vnd.ms-excel;base64,',
      template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="https://www.w3.org/TR/2018/SPSD-html401-20180327/"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64: function(s) { return window.btoa(unescape(encodeURIComponent(s))) },
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
      'setIssuesPerPageFilter',
      'setIssueTypeFilter',
      'setTaskTypeFilter',
      'setIssueSeverityFilter',
      'setMyActionsFilter',
      'updateFacilityHash',
      'setTaskForManager',
      'setOnWatchFilter',
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
        if((this.currentPage*this.C_issuesPerPage.value) < this.filteredIssues.length) this.currentPage++;
      },
      prevPage:function() {
        if(this.currentPage > 1) this.currentPage--;
      },
    issueCreated(issue) {
      this.facility.issues.unshift(issue)
      this.newIssue = false
      this.$emit('refresh-facility')
    },
    issueUpdated(issue, refresh = true) {
      let index = this.facility.issues.findIndex((t) => t.id == issue.id)
      if (index > -1) Vue.set(this.facility.issues, index, issue)
      if (refresh) {
        this.newIssue = false
        this.$emit('refresh-facility')
      } else {
        this.updateFacilityHash(this.facility)
      }
    },
    issueDeleted(issue) {
      http
        .delete(`/projects/${this.currentProject.id}/facilities/${this.facility.id}/issues/${issue.id}.json`)
        .then((res) => {
            let issues = [...this.facility.issues]
            _.remove(issues, (t) => t.id == issue.id)
            this.$emit('refresh-facility')
          }).catch((err) => console.log(err))
    },
    exportToPdf() {
      const doc = new jsPDF("l")
      const html = this.$refs.table.innerHTML
      doc.autoTable({ html: "#issueList1" })
      doc.save("Issue_Log.pdf")
    },
    exportToExcel(table, name) {
      if (!table.nodeType) table = this.$refs.table
      var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
      window.location.href = this.uri + this.base64(this.format(this.template, ctx))
    },
    issueEdited(issue) {
      this.currentIssue = issue
      this.newIssue = true
    },
    showAllToggle() {
         this.setToggleRACI(!this.getToggleRACI)  ;              
     },
    addNewIssue() {
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
    'getAdvancedFilterOptions',
    'filterDataForAdvancedFilter',
    'getTaskIssueUserFilter',
    'getAdvancedFilter',
    'getTaskIssueTabFilterOptions',
    'getIssuesPerPageFilterOptions',
    'getIssuesPerPageFilter',
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
    'taskTypeFilter',
    'issueSeverityFilter',
    'issueUserFilter',
    'myActionsFilter',
    'managerView',
    'onWatchFilter',
    'issueStageFilter',
    'viewPermit', 
     'getToggleRACI'
  ]),
  _isallowed() {
    return salut => this.$currentUser.role == "superadmin" || this.$permissions.issues[salut]
  },
   isMapView() {
    return this.$route.name === 'ProjectMapView'
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
      valid = valid && filterDataForAdvancedFilterFunction([resource], 'facilityManagerIssues')

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

      if (search_query) valid = valid && search_query.test(resource.title)

      return valid;
    })), ['dueDate'])

    return issues
  },
  C_facilityManagerIssueFilter: {
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
      if (value) this.setMyActionsFilter([...this.myActionsFilter, { name: "My Issues", value: "issues" }])
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
<style lang="scss" scoped>
.issues-index {
  height: 465px;
}

 table {
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0 !important;
  overflow: auto;
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
 

.addIssueBtn,
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

#issueHover:hover {
  cursor: pointer;
  background-color: rgba(91, 192, 222, 0.3);
  border-left: solid rgb(91, 192, 222);
}

.alt-text {
  position: relative;
  padding-top: 80px !important;
}

input[type=search] {
  color: #383838;
  text-align: left;
  cursor: pointer;
  display: block;
}

.myIssues {
  float: right;
  margin-top: 5px;
}

.map-v {
    width:34vw;
    margin-left: auto !important;
 }
</style>