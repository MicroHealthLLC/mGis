<template>
  <div v-if="!loading" class="risks-index px-0" :class="{'map-v': isMapView}" data-cy="risk_list">
    <div v-if="newRisk && from != 'manager_view'">
      <risk-form
        :facility="facility"
        :risk="currentRisk"
        @on-close-form="newRisk=false"
        @risk-created="riskCreated"
        @risk-updated="riskUpdated"
        class="risk-form-modal"
      ></risk-form>
    </div>
    <div v-else>
      <div class="d-flex align-item-center justify-content-between w-100">
        <div class="input-group w-100">
          <div class="input-group-prepend d-inline">
            <span class="input-group-text" id="search-addon">
              <i class="fa fa-search"></i>
            </span>
          </div>
          <input
            type="search"
            style="height:30px"
            class="form-control form-control-sm"
            placeholder="Search Risks"
            aria-label="Search"
            aria-describedby="search-addon"
            v-model="risksQuery"
            data-cy="search_risks"
          />
        </div>
      </div>

      <div class="d-flex font-sm w-100 mt-2">
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
          <multiselect v-model="C_facilityManagerRiskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div> 
        
      </div>

       <div class="d-flex font-sm w-100 mt-1">
        <div class="simple-select w-50 mr-1">
          <multiselect
            v-model="C_riskApproachFilter"
            track-by="name"
            label="name"
            placeholder="Filter by Risk Approach"
            :options="getRiskApproachFilterOptions"
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
        <div>
        <!-- Another filter fits here -->
        </div>
      </div>
      <div class="my-2">
        <button v-if="_isallowed('write')"
          class="btn btn-md btn-primary addRiskBtn mr-3"
          @click.prevent="addNewRisk">
         <font-awesome-icon icon="plus-circle" data-cy="new_risk" />
          Add Risk
        </button>
        <div class="float-right">
         <button v-tooltip="`Export to PDF`" @click.prevent="exportToPdf" class="btn btn-md mr-1 exportBtns text-light">
          <font-awesome-icon icon="file-pdf" />
        </button>
        <button v-tooltip="`Export to Excel`" @click.prevent="exportToExcel('table', 'Risk Register')" class="btn btn-md exportBtns mr-1 text-light">
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
          <div style="height:52.5vh; overflow-y:auto;border-bottom:solid 1px #ededed" v-if="filteredRisks.length > 0">
            <hr class="mt-2 mb-1" />
            <table class="table table-sm table-bordered table-striped mt-2 stickyTableHeader">
            <tr style="background-color:#ededed;">
              <th class="sort-th" @click="sort('text')" >Risk<span class="sort-icon scroll"><font-awesome-icon icon="sort" /></span></th>
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
            <RiskShowMap
              v-for="risk in sortedRisks"         
              class="riskHover"            
              :key="risk.id"
              :risk="risk"             
              :from-view="from"   
              @risk-edited="riskEdited" 
            ></RiskShowMap>
           <div class="float-right my-2 font-sm">
           <span>Displaying </span>
           <div class="simple-select d-inline-block font-sm">          
              <multiselect 
                v-model="C_risksPerPage" 
                track-by="value"
                label="name"      
                deselect-label=""                     
                :allow-empty="false"
                :options="getRisksPerPageFilterOptions">
                  <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name selected-opt'>{{option.name}}</span>
                        </div>
                  </template>
              </multiselect>            
            </div>
              <span class="mr-1 pr-3" style="border-right:solid 1px lightgray">Per Page </span>
                <button class="btn btn-sm page-btns" @click="prevPage"><i class="fas fa-angle-left"></i></button>
                <button class="btn btn-sm page-btns" id="page-count"> {{ currentPage }} of {{ Math.ceil(this.filteredRisks.length / this.C_risksPerPage.value) }} </button>
                <button class="btn btn-sm page-btns" @click="nextPage"><i class="fas fa-angle-right"></i></button>
            </div>       
          </div>
          <div v-else>
            <br/>
            <h6 class="text-danger ml-1 mt-4">No Risks found..</h6>
          </div>
        </div>
        <p v-else class="text-danger mx-2"> You don't have permissions to read!</p>
         <table style="display:none" class="table table-sm table-bordered" ref="table" id="riskList1">
      <thead>
        <tr>          
          <th>Risk</th>
          <th>Project</th>
          <th>Risk Approach</th>
          <th>Priority Level</th>         
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
        <tr v-for="(risk, i) in filteredRisks" :key="i">
          <td>{{risk.text}}</td>
          <td>{{risk.facilityName}}</td>
          <td>{{risk.riskApproach.charAt(0).toUpperCase() + risk.riskApproach.slice(1)}}</td>
          <td>{{risk.priorityLevel}}</td>         
          <td>{{formatDate(risk.startDate)}}</td>
          <td>{{formatDate(risk.dueDate)}}</td>
          <td>
          <span v-if="(risk.responsibleUsers.length) > 0">(R) {{risk.responsibleUsers[0].name}} <br></span> 
          <span v-if="(risk.accountableUsers.length) > 0"> (A) {{risk.accountableUsers[0].name}}<br></span>   
           <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(risk.consultedUsers.length) > 0"> (C) {{JSON.stringify(risk.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, '')}}<br></span> 
             <span v-if="(risk.informedUsers.length) > 0"> (I) {{JSON.stringify(risk.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, '')}}</span>      
          </span>        
          </td>
          <td>{{risk.progress + "%"}}</td>
          <td v-if="(risk.dueDate) <= now"><h5>X</h5></td>
          <td v-else></td>
          <td v-if="(risk.watched) == true"><h5>X</h5></td>
          <td v-else></td>
          <td v-if="(risk.notes.length) > 0">
             By: {{ risk.notes[0].user.fullName}} on
            {{moment(risk.notes[0].createdAt).format('DD MMM YYYY, h:mm a')}}: {{risk.notes[0].body}}
          </td>
          <td v-else>No Updates</td>
        </tr>
      </tbody>
    </table>
      </div>
    </div>
  </div>
</template>

<script>
  import {jsPDF} from "jspdf"
  import 'jspdf-autotable'
  import {mapGetters, mapMutations} from 'vuex'
  import RiskForm from './risk_form'
  import RiskShowMap from './risk_show_map'
  import {library} from '@fortawesome/fontawesome-svg-core'
  import {faFilePdf} from '@fortawesome/free-solid-svg-icons'
  import * as Moment from 'moment'
  import {extendMoment} from 'moment-range'

  const moment = extendMoment(Moment)
  library.add(faFilePdf)

  export default {
    name: 'RiskIndex',
    props: ['facility', 'from'],
    components: {
      RiskForm,
      RiskShowMap
    },
    data() {
      return {
        loading: true,
        newRisk: false,
        currentRisk: null,
        currentPage:1,     
        currentSort:'text',
        currentSortDir:'asc',
        now: new Date().toISOString(),
        risksQuery: '',
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
        'setTaskTypeFilter',
        'setRisksPerPageFilter',
        'setToggleRACI',
        'setRiskApproachFilter',
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
        if((this.currentPage*this.C_risksPerPage.value) < this.filteredRisks.length) this.currentPage++;
      },
      prevPage:function() {
        if(this.currentPage > 1) this.currentPage--;
      },
      riskCreated(risk) {
        this.facility.risks.unshift(risk)
        this.newRisk = false
        this.$emit('refresh-facility')
      },
      riskUpdated(risk, refresh=true) {
        let index = this.facility.risks.findIndex((t) => t.id == risk.id)
        if (index > -1) Vue.set(this.facility.risks, index, risk)
        if (refresh) {
          this.newRisk = false
          this.$emit('refresh-facility')
        } else {
          this.updateFacilityHash(this.facility)
        }
      },
      showAllToggle() {
         this.setToggleRACI(!this.getToggleRACI)  ;              
      },
      exportToPdf() {
        const doc = new jsPDF("l")
        const html = this.$refs.table.innerHTML
        doc.autoTable({ html: "#riskList1" })
        doc.text(150, 285, "Risk Register")
        doc.save("Risk Register.pdf")
      },
     exportToExcel(table, name) {
        if (!table.nodeType) table = this.$refs.table
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = this.uri + this.base64(this.format(this.template, ctx))
      },
      // editRisk(risk) {
      //   this.$emit('show-hide', risk)
      // },
      riskEdited(risk) {
        this.currentRisk = risk
        this.newRisk = true
      },
      addNewRisk() {
        if (this.from == "manager_view") {
          this.setTaskForManager({key: 'risk', value: {}})
        } else {
          this.currentRisk = null
          this.newRisk = true
        }
      }
    },
    computed: {
      ...mapGetters([
        'getAdvancedFilterOptions',
        'getRiskApproachFilterOptions',
        'getRiskApproachFilter',
        'filterDataForAdvancedFilter',
        'getRisksPerPageFilterOptions',
        'getRisksPerPageFilter',
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
        'taskTypes',
        'riskStageFilter',
        'riskUserFilter',
        'currentProject',
        'taskTypeFilter',
        'riskApproach',
        'riskApproaches',
        'myActionsFilter',
        'managerView',
        'onWatchFilter',
        'viewPermit',
        'getToggleRACI'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.risks[salut]
      },
      isMapView() {
        return this.$route.name === 'ProjectMapView'
      },
      filteredRisks() {

        let milestoneIds = _.map(this.C_taskTypeFilter, 'id')
        let stageIds = _.map(this.riskStageFilter, 'id')
        let riskApproachIds = _.map(this.C_riskApproachFilter, 'id')

        const search_query = this.exists(this.risksQuery.trim()) ? new RegExp(_.escapeRegExp(this.risksQuery.trim().toLowerCase()), 'i') : null
        let noteDates = this.noteDateFilter
        let taskIssueDueDates = this.taskIssueDueDateFilter
        let taskIssueProgress = this.taskIssueProgressFilter
        let taskIssueUsers = this.getTaskIssueUserFilter
        var filterDataForAdvancedFilterFunction = this.filterDataForAdvancedFilter

        let risks = _.sortBy(_.filter(this.facility.risks, ((resource) => {
          let valid = Boolean(resource && resource.hasOwnProperty('progress'))

          let userIds = [..._.map(resource.checklists, 'userId'), resource.userIds]
          if(taskIssueUsers.length > 0){
            valid = valid && userIds.some(u => _.map(taskIssueUsers, 'id').indexOf(u) !== -1)
          }

          //TODO: For performance, send the whole tasks array instead of one by one
          valid = valid && filterDataForAdvancedFilterFunction([resource], 'facilityManagerRisks')

          if (stageIds.length > 0) valid = valid && stageIds.includes(resource.riskStageId)

          if (taskIssueProgress && taskIssueProgress[0]) {
            var min = taskIssueProgress[0].value.split("-")[0]
            var max = taskIssueProgress[0].value.split("-")[1]
            valid = valid && (resource.progress >= min && resource.progress <= max)
          }

          if (milestoneIds.length > 0) valid = valid && milestoneIds.includes(resource.taskTypeId)

          if (riskApproachIds.length > 0) valid = valid && riskApproachIds.includes(resource.riskApproach)

          if (search_query) valid = valid && search_query.test(resource.text)


          return valid;
        })), ['dueDate'])

        return risks
      },
      C_facilityManagerRiskFilter: {
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
      C_riskApproachFilter: {
        get() {      
          return this.getRiskApproachFilter
        },
        set(value) {     
            this.setRiskApproachFilter(value)
        }
      },
      C_myRisks: {
        get() {
          return _.map(this.myActionsFilter, 'value').includes('risks')
        },
        set(value) {
          if (value) this.setMyActionsFilter([...this.myActionsFilter, {name: "My Risks", value: "risks"}])
          else this.setMyActionsFilter(this.myActionsFilter.filter(f => f.value !== "risks"))
        }
      },
      C_onWatchRisks: {
        get() {
          return _.map(this.onWatchFilter, 'value').includes('risks')
        },
        set(value) {
          if (value) this.setOnWatchFilter([...this.onWatchFilter, {name: "On Watch Risks", value: "risks"}])
          else this.setOnWatchFilter(this.onWatchFilter.filter(f => f.value !== "risks"))
        }
      },
      C_risksPerPage: {
        get() {    
          return this.getRisksPerPageFilter || {id: 15, name: '15', value: 15}
        },
        set(value) {
          this.setRisksPerPageFilter(value)
        }
     },
      sortedRisks:function() {
          return this.filteredRisks.sort((a,b) => {
          let modifier = 1;
          if(this.currentSortDir === 'desc') modifier = -1;
          if(a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
          if(a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
          return 0;
           }).filter((row, index) => {
          let start = (this.currentPage-1)*this.C_risksPerPage.value;
          let end = this.currentPage*this.C_risksPerPage.value;
          if(index >= start && index < end) return true;
          return this.end
        });
       }
      },
  }
</script>

<style lang="scss" scoped>
  .risks-index {
     z-index: 100;
    height: 500px
  }
  table {
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0 !important;
  overflow: auto;
}
  .riskHover:hover {
    cursor: pointer;   
    background-color: rgba(91, 192, 222, 0.3);
    border-left: solid rgb(91, 192, 222);
  }
 .alt-text {
    position: relative;
    padding-top: 80px !important;
  }
  .exportBtns, .showAll {
    transition: all .2s ease-in-out;
    background-color: #41b883;
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
  .exportBtns:hover, .showAll:hover {
    transform: scale(1.06);
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
 
 .addRiskBtn,
.exportBtns, 
.showAll {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
}
  .map-v {
    width:34vw;
    margin-left: auto !important;
 }
</style>
