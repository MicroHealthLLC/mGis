<template>
  <div v-if="!loading" class="mt-2 risks-index px-0" data-cy="risk_list">
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
          <el-input
            type="search"
            style="height:30px"
            placeholder="Search by Risk Name, Risk Approach, Priority Level or Assigned User"
            aria-label="Search"
            aria-describedby="search-addon"
            v-model="risksQuery"
            data-cy="search_risks"
          >
            <el-button slot="prepend" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </div>

      <div class="d-flex font-sm w-100 my-2">
        <div class="w-50 mr-1">
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
        <div class="w-50">
          <el-select 
           v-model="C_facilityManagerRiskFilter"                    
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

       <div class="d-flex font-sm w-100">
        <div class="w-50 mr-1">
           <el-select 
           v-model="C_riskApproachFilter"                    
           class="w-100" 
           track-by="name" 
           value-key="id"
           multiple                                                                                                                                               
           placeholder="Filter by Risk Approach"
           >
          <el-option 
            v-for="item in getRiskApproachFilterOptions"                                                     
            :value="item"   
            :key="item.id"
            :label="item.name"
            >
          </el-option>
          </el-select>          
        </div>
        <div>
        <!-- Another filter fits here -->
        </div>
      </div>
      <div class="mt-3">
        <button v-if="_isallowed('write')"
          class="btn btn-md btn-primary addRiskBtn mr-3"
          @click.prevent="addNewRisk">
         <font-awesome-icon icon="plus-circle" data-cy="new_risk" />
          Add Risk
        </button>
         <button v-tooltip="`Export to PDF`" @click.prevent="exportToPdf" class="btn btn-md mr-1 exportBtns text-light">
          <font-awesome-icon icon="file-pdf" />
        </button>
        <button v-tooltip="`Export to Excel`" @click.prevent="exportToExcel('table', 'Risk Register')" class="btn btn-md exportBtns text-light">
          <font-awesome-icon icon="file-excel" />
        </button>
        <div v-if="_isallowed('read')">
          <div v-if="filteredRisks.length > 0">
            <hr/>
            <risk-show
              v-for="(risk, i) in filteredRisks"         
              class="riskHover"        
              :class="{'b_border': !!filteredRisks[i+1]}"
              :key="risk.id"
              :risk="risk"
              :from-view="from"
              @risk-edited="riskEdited"
            ></risk-show>
          </div>
          <div v-else>
            <br/>
            <h6 class="text-danger ml-1 mt-4">No risks found..</h6>
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
          <td v-if="(risk.userNames.length) > 0">{{ risk.userNames }}</td>
          <td v-else></td>
          <td>{{risk.progress + "%"}}</td>
          <td v-if="(risk.dueDate) <= now"><h5>X</h5></td>
          <td v-else></td>
          <td v-if="(risk.watched) == true"><h5>X</h5></td>
          <td v-else></td>
           <td v-if="risk.notes.length > 0">
          <span v-if="(risk.notesUpdatedAt.length) >= 2" >   
          <span  class="toolTip" v-tooltip="('By: ' + risk.notes[risk.notes.length - 1].user.fullName)" >
          {{moment(risk.notesUpdatedAt[risk.notesUpdatedAt.length - 1]).format('DD MMM YYYY, h:mm a')}}
           <br>
          </span>     
            {{risk.notes[risk.notes.length - 1].body}}
          </span>
           <span v-if="(risk.notesUpdatedAt.length) === 1" >   
          <span  class="toolTip" v-tooltip="('By: ' + risk.notes[risk.notes.length - 1].user.fullName)" >
          {{moment(risk.notesUpdatedAt[0]).format('DD MMM YYYY, h:mm a')}}
           <br>
          </span>     
            {{risk.notes[risk.notes.length - 1].body}}
          </span>
         
        <!-- <span v-else >No Updates</span>     -->
         
        </td>  
         <td v-else >No Updates</td> 
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
  import RiskShow from './risk_show'
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
      RiskShow
    },
    data() {
      return {
        loading: true,
        newRisk: false,
        currentRisk: null,
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
        'setRiskApproachFilter',
        'setIssueSeverityFilter',
        'setMyActionsFilter',
        'updateFacilityHash',
        'setTaskForManager',
        'setOnWatchFilter'
      ]),
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
      riskEdited(risk) {
        this.currentRisk = risk
        this.newRisk = true
      },
      addNewRisk() {
        this.setTaskForManager({key: 'risk', value: {}})
        // Route to new risk form page
        this.$router.push(
          `/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/risks/new`
        );
      }
    },
    computed: {
      ...mapGetters([
        'getAdvancedFilterOptions',
        'getRiskApproachFilterOptions',
        'getRiskApproachFilter',
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
        'viewPermit'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.risks[salut]
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

        
          if (search_query) valid = valid && search_query.test(resource.text) ||
          valid && search_query.test(resource.text) ||
          valid && search_query.test(resource.riskApproach) ||
          valid && search_query.test(resource.priorityLevelName) ||  
          valid && search_query.test(resource.taskType.name) || 
          valid && search_query.test(resource.userNames)


          return valid;
        })), ['dueDate'])

      if ( _.map(this.getAdvancedFilter, 'id') == 'draft' || _.map(this.getAdvancedFilter, 'id') == 'onHold') {   
        
        return risks
        
       } else  {
        
        risks  = risks.filter(t => t.draft == false && t.onHold == false)
        return risks
      
       }   
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .risks-index {
    height: 465px;
  }
  .riskHover:hover {
    cursor: pointer;
    box-shadow: 0.5px 0.5px 1px 1px rgba(56,56, 56,0.29), 0 2px 2px rgba(56,56,56,0.23);
    background-color: rgba(91, 192, 222, 0.3);
    border-left: solid rgb(91, 192, 222);
  }
 .alt-text {
    position: relative;
    padding-top: 80px !important;
  }
  .exportBtns {
    transition: all .2s ease-in-out;
    background-color: #41b883;
  }

  .exportBtns:hover {
    transform: scale(1.06);
  }
  input[type=search] {
    color: #383838;
    text-align: left;
    cursor: pointer;
    display: block;
  }
  .addRiskBtn,
  .export2pdf,
  .exportBtns,
  .riskHover {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
</style>
