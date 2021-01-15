<template>
  <div v-if="!loading" class="mt-4 risks-index" data-cy="risk_list">
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
          <multiselect v-model="C_facilityManagerRiskFilter" :options="getAdvancedFilterOptions" track-by="name" label="name" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="false" :close-on-select="true" :show-labels="false" placeholder="Filter by Flags">
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div> 
        <div class="simple-select w-50">
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
        <button v-tooltip="`Export to Excel`" @click.prevent="exportToExcel('table', 'Risks Log')" class="btn btn-md exportBtns text-light">
          <font-awesome-icon icon="file-excel" />
        </button>
        <div v-if="_isallowed('read')">
          <div v-if="filteredRisks.length > 0">
            <hr/>
            <risk-show
              v-for="(risk, i) in filteredRisks"
              :load="log(risk)"
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
          <th></th>
          <th>Risk Name</th>
          <th>Task Category</th>
          <th>Start Date</th>
          <th>Due Date</th>
          <th>Risk Owner(s)</th>
          <th>Priority Level</th>
          <th>Risk Approach</th>
          <th>Last Update</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(risk, i) in filteredRisks">
          <td class="text-center">{{i+1}}</td>
          <td>{{risk.text}}</td>
          <td>{{risk.taskType}}</td>
          <td>{{risk.startDate}}</td>
          <td>{{risk.dueDate}}</td>
          <td>{{risk.riskOwners}}</td>
          <td>{{risk.priorityLevel}}</td>
          <td>{{risk.riskApproach}}</td>
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
      log(r) {
        console.log(r)
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
      exportToPdf() {
        const doc = new jsPDF("l")
        const html = this.$refs.table.innerHTML
        doc.autoTable({ html: "#riskList1" })
        doc.text(150, 285, "Risks List")
        doc.save("Risks_List.pdf")
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

          if (search_query) valid = valid && search_query.test(resource.riskName)


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
