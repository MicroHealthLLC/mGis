<!-- NOTE: This file is used Global filter view in left side -->
<template>

  <div id="filterbar" :style="filterBarStyle" v-click-outside="handleOutsideClick" data-cy="filter_bar">

    <div id="filter_bar" class="container shadow-sm" data-cy="filter_info">

      <!-- First row: Filter View Title/Header -->
      <div class="row mt-3">
        <div class="col-md-12">
           <h5 class="d-inline"><i class="fas fa-sliders-h pr-2"></i>ADVANCED FILTERS</h5>
          <button class="btn btn-sm btn-link float-right d-inline-block clear-btn" @click.prevent="onClearFilter" data-cy="clear_filter"><i class="fas fa-redo pr-1"></i>CLEAR</button>
        </div>
      </div>
      <!-- Next row for Facilities label with border div -->
      <div class="filter-border filter-sections px-3 pb-2">
        <div class="row">
          <div class="col-md-12">
            <h5 class="mb-0">Facilities</h5>
          </div>
        </div>

        <!-- Next row for two columns that will contain Facilities-related menus -->
        <div class="row justify-content-between">
          <div class="col-md-6">
            <div>
              <label class="font-sm mb-0">Facility Group</label>
              <multiselect v-model="C_facilityGroupFilter" track-by="name" label="name" :options="C_activeFacilityGroups" :multiple="true" select-label="Select" deselect-label="Remove" :searchable="true" data-cy="facility_group">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>
           <label class="font-sm mb-0">Facility Name</label>
              <multiselect v-model="C_facilityNameFilter" label="facilityName" track-by="id" :multiple="true" data-cy="facility_name" :options="facilities" :searchable="true" :loading="isLoading" :preserve-search="true" select-label="Select" deselect-label="Remove" @search-change="findFacility">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.facilityName}}</span>
                  </div>
                </template>
                <span slot="noOptions">...</span>
              </multiselect>
            <div>
               <label class="font-sm mb-0">Facility % Progress Range</label>
              <div class="form-row">
                <div class="form-group col mb-0">
                  <input type="number" class="form-control" placeholder="Min." min="0" max="100" @input="onChangeProgress($event, {variable: 'facility', type: 'min'})" :value="C_facilityProgress.min">
                </div>
                <div class="form-group col mb-0">
                  <input type="number" class="form-control" placeholder="Max." min="0" max="100" @input="onChangeProgress($event, {variable: 'facility', type: 'max'})" :value="C_facilityProgress.max">
                </div>
              </div>
              <span class="font-sm text-danger ml-1" v-if="C_facilityProgress.error">{{C_facilityProgress.error}}</span>
            </div>
            </div>
            <div class="">
            
          </div>
          <div class="col-md-6">
             <label class="font-sm mb-0">Project Status</label>
              <multiselect v-model="C_projectStatusFilter" track-by="name" label="name" :options="statuses" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="project_status">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>      
            <div>
              <!-- Available row for filter -->
            </div>
            <div>
              <label class="font-sm mb-0">Project Completion Date Range</label>
              <v2-date-picker v-model="C_facilityDueDateFilter" class="datepicker dp" placeholder="Select Date Range" @open="datePicker=true" range />
            </div>
          </div>
        </div>
      </div>
      <!-- Next Set of Rows for Tasks and Issues Columns -->
      <div class="filter-sections filter-border mb-1 px-3 py-2" style="margin-top:12.75px">
        <div class="row">
          <div class="col-md-4" style="border-right:solid lightgray .8px">
            <h5>Tasks</h5>
            <div>
              <label class="font-sm mb-0">Task Category</label>
              <multiselect v-model="C_taskTypeFilter" track-by="name" label="name" :options="taskTypes" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="task_category">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>
            <div v-if="viewPermit('kanban_view', 'read')">
              <label class="font-sm mb-0">Task Stages</label>
              <multiselect v-model="C_taskStageFilter" track-by="name" label="name" placeholder="Filter by task stages" :options="taskStages" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="task_stage">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>
            <hr/>
             <h5>Risks</h5>
            <div v-if="viewPermit('kanban_view', 'read')">
              <label class="font-sm mb-0">Risk Stages</label>
              <multiselect v-model="C_riskStageFilter" track-by="name" label="name" placeholder="Filter by risk stages" :options="riskStages" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="risk_stage">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>
          </div>

          <div class="col-md-4" style="border-right:solid lightgray .8px">
           <h5>Issues</h5>
            <div>
              <label class="font-sm mb-0">Issue Type</label>
              <multiselect v-model="C_issueTypeFilter" track-by="name" label="name" :options="issueTypes" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="issue_type">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>
            <div>
              <label class="font-sm mb-0">Issue Stages</label>
              <multiselect v-model="C_issueStageFilter" track-by="name" label="name" :options="issueStages" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="issue_stage">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>
            <div>
              <label class="font-sm mb-0">Issue Severity</label>
              <multiselect v-model="C_issueSeverityFilter" track-by="name" label="name" :options="issueSeverities" :searchable="false" :multiple="true" select-label="Select" deselect-label="Remove">
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div>            
          </div>

          <div class="col-md-4">
              <h5>Combined</h5>
               <div>
                <label class="font-sm mb-0">Action Users</label>
                <multiselect v-model="C_taskIssueUserFilter" track-by="id" label="fullName" :options="activeProjectUsers" :searchable="true" :multiple="true" select-label="Select" deselect-label="Remove" data-cy="issue_user">
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name'>{{option.fullName}}</span>
                    </div>
                  </template>
                </multiselect>
              </div>

              <div>
                <label class="font-sm mb-0">Flags</label>
                <multiselect v-model="C_advancedFilter" track-by="name" label="name" :options="getAdvancedFilterOptions" :searchable="false"  :multiple="true"  :allow-empty="true" select-label="Select">
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name selected-opt'>{{option.name}}</span>
                    </div>
                  </template>
                </multiselect>
              </div>
            <div>
              <label class="font-sm mb-0">Action Due Date Range</label>
              <v2-date-picker v-model="C_taskIssueDueDateFilter" placeholder="Select Date Range" class="datepicker" @open="datePicker=true" range />
            </div>
            <div>
              <label class="font-sm mb-0">Updates Date Range</label>
              <v2-date-picker v-model="C_noteDateFilter" class="datepicker" placeholder="Select Date Range" @open="datePicker=true" range />
            </div>

            <div>
              <label class="font-sm mb-0">Action % Progress Range</label>
              <div class="form-row">
                <div class="form-group col mb-0">
                  <input type="number" class="form-control" placeholder="Min." min="0" max="100" @input="onChangeProgress($event, {variable: 'taskIssue', type: 'min'})" :value="C_taskIssueProgress.min">
                </div>
                <div class="form-group col mb-0">
                  <input type="number" class="form-control" placeholder="Max." min="0" max="100" @input="onChangeProgress($event, {variable: 'taskIssue', type: 'max'})" :value="C_taskIssueProgress.max">
                </div>
              </div>
              <span class="font-sm text-danger ml-1" v-if="C_taskIssueProgress.error">{{C_taskIssueProgress.error}}</span>
            </div>             
          </div>        
        </div>
      </div>
    </div>
    <div class="knocker" @click.prevent="toggleFilters" data-cy="advanced_filter">
        <button class="btn btn-sm ml-0 knocker-btn text-light p-1"><small><span class="pr-1"><i class="fas fa-sliders-h"></i></span>ADVANCED  FILTERS</small></button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import XLSX from 'xlsx'
export default {
  name: 'FilterSidebar',
  data() {
    return {
      isLoading: false,
      exporting: false,
      showFilters: false,
      datePicker: false,
      
      facilities: [],
      myActions: [
        { name: 'My Tasks', value: 'tasks' },
        { name: 'My Issues', value: 'issues' },
        { name: 'My Notes', value: 'notes' }
      ],
      onWatch: [
        { name: 'On Watch Tasks', value: 'tasks' },
        { name: 'On Watch Issues', value: 'issues' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'getTaskIssueUserFilter',
      'getTaskIssueProgressStatusFilter',
      'getAdvancedFilterOptions',
      'getAdvancedFilter',
      'projectStatusFilter',

      'taskTypes',
      'taskStages',
      'taskTypeFilter',
      'taskStageFilter',
      'taskUserFilter',

      'riskStages',
      'riskStageFilter',

      'issueSeverities',
      'issueTypes',
      'issueStages',
      'issueStageFilter',
      'issueUserFilter',
      'issueTypeFilter',
      'issueSeverityFilter',

      'facilityGroupFilter',
      'facilityNameFilter',
      'facilityProgressFilter',
      'facilityDueDateFilter',
      'noteDateFilter',
      'taskIssueDueDateFilter',
      'taskIssueProgressFilter',
      'projects',
      'currentProject',
      'activeProjectUsers',
      'statuses',
      'getTaskIssueOverdueOptions',
      'taskIssueOverdueFilter',
      'activeFacilityGroups',
      'unFilterFacilities',
      'filterFacilitiesWithActiveFacilityGroups',
      'ganttData',
      'myActionsFilter',
      'onWatchFilter',
      'progressFilter',
      'viewPermit'
    ]),
    C_taskIssueProgress: {
      get() {
        return this.progressFilter.taskIssue
      },
    },
    C_advancedFilter: {
      get() {
        // Note: This code will be useful if want active as default select and never want advanced filter blank
        // if (this.getAdvancedFilter.length == 0) {
        //   // return [{ id: 'active', name: 'Active' }]
        //   this.setAdvancedFilter([{id: 'active', name: 'Active', value: 'active', filterCategoryId: 'progressStatusFilter', filterCategoryName: 'Progress Status'}])
        //   return this.getAdvancedFilter
        // }else{
        //   return this.getAdvancedFilter
        // }
        return this.getAdvancedFilter
      },
      set(value) {
        if (!value) {
          this.setAdvancedFilter([])
        } else {
          this.setAdvancedFilter(value)
        }
      }
    },
    enableExport() {
      return this.filterFacilitiesWithActiveFacilityGroups.length > 0
    },
    C_activeFacilityGroups() {
      let id = Number(this.$route.params.projectId)
      return this.activeFacilityGroups(id)
    },
    C_projectStatusFilter: {
      get() {
        return this.projectStatusFilter
      },
      set(value) {
        this.setProjectStatusFilter(value)
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

    C_riskStageFilter: {
      get() {
        return this.riskStageFilter
      },
      set(value) {
        this.setRiskStageFilter(value)
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
    C_taskStageFilter: {
      get() {
        return this.taskStageFilter
      },
      set(value) {
        this.setTaskStageFilter(value)
      }
    },

    C_facilityGroupFilter: {
      get() {
        return this.facilityGroupFilter
      },
      set(value) {
        this.setFacilityGroupFilter(value)
      }
    },
    C_facilityNameFilter: {
      get() {
        return this.facilityNameFilter
      },
      set(value) {
        this.setFacilityNameFilter(value)
      }
    },
    C_facilityDueDateFilter: {
      get() {
        if (!this.facilityDueDateFilter) return this.facilityDueDateFilter
        return this.facilityDueDateFilter.map(d => d ? new Date(d) : d)
      },
      set(value) {
        this.setFacilityDueDateFilter(value)
      }
    },
    C_noteDateFilter: {
      get() {
        if (!this.noteDateFilter) return this.noteDateFilter
        return this.noteDateFilter.map(d => d ? new Date(d) : d)
      },
      set(value) {
        this.setNoteDateFilter(value)
      }
    },
    C_taskIssueDueDateFilter: {
      get() {
        if (!this.taskIssueDueDateFilter) return this.taskIssueDueDateFilter
        return this.taskIssueDueDateFilter.map(d => d ? new Date(d) : d)
      },
      set(value) {
        this.setTaskIssueDueDateFilter(value)
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
    C_issueSeverityFilter: {
      get() {
        return this.issueSeverityFilter
      },
      set(value) {
        this.setIssueSeverityFilter(value)
      }
    },
    C_issueStageFilter: {
      get() {
        return this.issueStageFilter
      },
      set(value) {
        this.setIssueStageFilter(value)
      }
    },

    C_taskIssueUserFilter: {
      get() {
        return this.getTaskIssueUserFilter
      },
      set(value) {
        this.setTaskIssueUserFilter(value)
      }
    },

    C_myActionsFilter: {
      get() {
        return this.myActionsFilter
      },
      set(value) {
        value = value ? value : []
        this.setMyActionsFilter(value)
      }
    },
    C_onWatchFilter: {
      get() {
        return this.onWatchFilter
      },
      set(value) {
        value = value ? value : []
        this.setOnWatchFilter(value)
      }
    },
    C_facilityProgress: {
      get() {
        return this.progressFilter.facility
      }
    },

    filterBarStyle() {
      if (this.showFilters) return {}
      return {
        transform: 'translateX(-685px)'
      }
    },
    isMapView() {
      return this.$route.name === 'ProjectMapView'
    },
    isGanttView() {
      return this.$route.name === 'ProjectGanttChart'
    }
  },
  methods: {
    ...mapMutations([
      'setTaskIssueUserFilter',
      'setTaskIssueProgressStatusFilter',
      'setTaskIssueProgressFilter',
      'setAdvancedFilter',
      'updateMapFilters',
      'setTaskIssueOverdueFilter',
      'setProjectStatusFilter',
      'setTaskTypeFilter',
      'setFacilityGroupFilter',
      'setFacilityNameFilter',
      'setFacilityProgressFilter',
      'setFacilityDueDateFilter',
      'setNoteDateFilter',
      'setTaskIssueDueDateFilter',
      'setIssueTypeFilter',
      'setIssueSeverityFilter',
      'setMyActionsFilter',
      'setOnWatchFilter',
      'setMapFilters',
      'setTaskUserFilter',
      'setIssueUserFilter',
      'setProgressFilters',
      'clearProgressFilters',
      'setTaskStageFilter',
      'setIssueStageFilter',
      'setRiskStageFilter'
    ]),
    handleOutsideClick() {
      if (this.showFilters && !this.datePicker) this.showFilters = false
    },
    toggleFilters() {
      this.showFilters = !this.showFilters
    },
    updateProjectQuery(selected, index) {
      window.location.pathname = "/projects/" + selected.id
    },
    findFacility(query) {
      this.isLoading = true
      if (query) {
        const resp = new RegExp(_.escapeRegExp(query.toLowerCase()), 'i')
        const isMatch = (result) => resp.test(result.facilityName)
        this.facilities = _.filter(this.unFilterFacilities, isMatch)
        this.isLoading = false
      } else {
        this.facilities = this.unFilterFacilities
        this.isLoading = false
      }
    },
    onClearFilter() {
      this.setTaskIssueUserFilter([])
      this.setTaskIssueProgressStatusFilter([])
      this.setAdvancedFilter([])
      this.setProjectStatusFilter(null)
      this.setTaskIssueOverdueFilter([])
      this.setTaskTypeFilter(null)
      this.setFacilityGroupFilter(null)
      this.setFacilityProgressFilter(null)
      this.setFacilityDueDateFilter([null])
      this.setNoteDateFilter([null])
      this.setTaskIssueDueDateFilter([null])
      this.setFacilityNameFilter(null)
      this.setIssueTypeFilter(null)
      this.setIssueSeverityFilter(null)
      this.setIssueStageFilter(null)
      this.setTaskStageFilter(null)
      this.setRiskStageFilter(null)
      this.setTaskIssueProgressFilter(null)
      this.setMyActionsFilter([])
      this.setOnWatchFilter([])
      this.setMapFilters([])
      this.clearProgressFilters()
      this.setIssueUserFilter([])
      this.setTaskUserFilter(null)
    },
    exportData() {
      if (!this.enableExport || this.exporting) return;
      this.exporting = true
      if (this.isMapView) this.exportMapData()
      else if (this.isGanttView) this.exportGanttData()
    },
    exportMapData() {
      try {
        let filters = [`Map Filters: ${this.currentProject.name} \n
            Facility Group: ${this.facilityGroupFilter ? _.map(this.facilityGroupFilter, 'name').join() : 'all'}\n
            Facility Name: ${this.facilityNameFilter ? _.map(this.facilityNameFilter, 'facilityName').join() : 'all'}\n
            Project Status: ${this.projectStatusFilter ? _.map(this.projectStatusFilter, 'name').join() : 'all'}\n
            Facility % Progress Range: ${this.facilityProgressFilter ? _.map(this.facilityProgressFilter, 'name').join() : 'all'}\n
            Facility Due Date: ${this.facilityDueDateFilter && this.facilityDueDateFilter[0] ? this.formatDate(this.facilityDueDateFilter[0]) + ' to ' + this.formatDate(this.facilityDueDateFilter[1]) : 'all'}\n
            Milestones: ${this.taskTypeFilter ?  _.map(this.taskTypeFilter, 'name').join() : 'all'}\n
            Task % Progress Range: ${this.taskIssueProgressFilter ?  _.map(this.taskIssueProgressFilter, 'name').join() : 'all'}\n
            Issue Type: ${this.issueTypeFilter ?  _.map(this.issueTypeFilter, 'name').join() : 'all'}\n
            Issue % Progress Range: ${this.taskIssueProgressFilter ?  _.map(this.taskIssueProgressFilter, 'name').join() : 'all'}\n
            Issue severity: ${this.issueSeverityFilter ?  _.map(this.issueSeverityFilter, 'name').join() : 'all'}\n
          `]
        let header = ["Facility Name", "Facility Group", "Project Status", "Due Date", "Percentage Complete", "Point of Contact Name", "Point of Contact Phone", "Point of Contact Email"]
        let ex_data = []
        for (let facility of this.filterFacilitiesWithActiveFacilityGroups) {
          ex_data.push({
            "Facility Name": facility.facilityName || 'N/A',
            "Facility Group": facility.facilityGroupName || 'N/A',
            "Project Status": facility.projectStatus || 'N/A',
            "Due Date": facility.dueDate || 'N/A',
            "Percentage Complete": facility.progress || 0,
            "Point of Contact Name": facility.pointOfContact || 'N/A',
            "Point of Contact Phone": facility.phoneNumber || 'N/A',
            "Point of Contact Email": facility.email || 'N/A'
          })
        }
        let wb = XLSX.utils.book_new()
        let ws = XLSX.utils.aoa_to_sheet(new Array(filters))
        XLSX.utils.sheet_add_json(ws, ex_data, { header: header, origin: "A3" })
        XLSX.utils.book_append_sheet(wb, ws, "MGIS")
        XLSX.writeFile(wb, `${this.random()}.xlsx`)
        this.exporting = false
      } catch (err) {
        console.error(err)
      }
    },
    exportGanttData() {
      try {
        let header = ["WBS", "Name", "Duration", "% Complete", "Start Date", "End Date", "Assigned To"]
        let ex_data = []
        for (let row of this.ganttData) {
          ex_data.push({
            "WBS": row._id,
            "Name": row.name,
            "Duration": row.durationInDays,
            "% Complete": row.progress,
            "Start Date": this.formatDate(row.startDate),
            "End Date": this.formatDate(row.endDate),
            "Assigned To": row._users ? row._users.join(', ') : ''
          })
        }
        let wb = XLSX.utils.book_new()
        let ws = XLSX.utils.json_to_sheet(ex_data, { header: header })
        XLSX.utils.book_append_sheet(wb, ws, "MGIS")
        XLSX.writeFile(wb, `${this.random()}.xlsx`)
        this.exporting = false
      } catch (err) {
        console.error(err)
      }
    },
    onChangeProgress(event, option) {
      let user_input = event.target.value
      let input = event.target.value
      let hash = Object.assign({}, this.progressFilter[option.variable])
      let error = ""
      if (this.exists(input)) {
        if (input < 0 || input === "") input = 0
        if (input > 100) input = 100
        if ( (option.type == 'min' && input > hash.max) || (option.type == 'max' && input < hash.min)) {
          error = "Min should not be greator than Max."
        }
        if (( option.type == 'min' &&  hash.max == "") || ( option.type == 'max' &&  hash.min == "")) {
          error = "Both fields are required."
        }
      }
      
      hash[option.type] = (input <= 0 ? 0 : Number(input) )
      if (hash.max < 0 || hash.min < 0) error = "Both fields are required."
      if (hash.max == "" && hash.min == "") error = ""
      hash.error = error
      if((input === 0 || input === "" ) && user_input === "" && option.type == 'min') hash.min = ""
      if((input === 0 || input === "" ) && option.type == 'max') hash.max = ""

      this.setProgressFilters({ key: option.variable, value: hash })
    }
  },
  watch: {
    getAdvancedFilter(value) {
      this.updateMapFilters({ key: 'advancedFilter', filter: value, same: true })
    },
    getTaskIssueProgressStatusFilter(value){
      this.updateMapFilters({ key: 'taskIssueProgressStatus', filter: value, same: true })
    },
    facilityDueDateFilter(value) {
      this.updateMapFilters({ key: 'dueDate', filter: value, same: true })
    },
    noteDateFilter(value) {
      this.updateMapFilters({ key: 'noteDate', filter: value, same: true })
    },
    taskIssueDueDateFilter(value) {
      this.updateMapFilters({ key: 'taskIssueDueDate', filter: value, same: true })
    },
    taskIssueOverdueFilter(value) {
      this.updateMapFilters({ key: 'taskIssueOverdue', filter: value, same: true })
    },
    facilityGroupFilter(value) {
      this.updateMapFilters({ key: 'facilityGroupIds', filter: value })
    },
    facilityNameFilter(value) {
      this.updateMapFilters({ key: 'ids', filter: value })
    },
    projectStatusFilter(value) {
      this.updateMapFilters({ key: 'statusIds', filter: value })
    },
    facilityProgressFilter(value) {
      this.updateMapFilters({ key: 'progress', filter: value, _k: 'value' })
    },
    taskTypeFilter(value) {
      this.updateMapFilters({ key: 'taskTypeIds', filter: value })
    },
    taskIssueProgressFilter(value) {
      this.updateMapFilters({ key: 'taskIssueProgress', filter: value, _k: 'value' })
    },
    issueTypeFilter(value) {
      this.updateMapFilters({ key: 'issueTypeIds', filter: value })
    },
    issueSeverityFilter(value) {
      this.updateMapFilters({ key: 'issueSeverityIds', filter: value })
    },
    issueStageFilter(value) {
      this.updateMapFilters({ key: 'issueStageIds', filter: value })
    },
    taskStageFilter(value) {
      this.updateMapFilters({ key: 'taskStageIds', filter: value })
    },
    riskStageFilter(value) {
      this.updateMapFilters({ key: 'riskStageIds', filter: value })
    },
    getTaskIssueUserFilter(value) {
      this.updateMapFilters({ key: 'taskIssueUsers', filter: value })
    },
    myActionsFilter(value) {
      this.updateMapFilters({ key: 'myActions', filter: value, _k: 'value' })
    },
    onWatchFilter(value) {
      this.updateMapFilters({ key: 'onWatch', filter: value, _k: 'value' })
    },
    "progressFilter.facility": {
      handler(value) {
       if (value.error == "" && value.min !== "" && value.max !== ""  && value.min <= value.max) {
          value = { name: value.min + "-" + value.max, value: value.min + "-" + value.max }
          this.setFacilityProgressFilter([value])
        } else if (value.min == "" && value.max == "") {
          this.setFacilityProgressFilter([])
        }
      },
      deep: true
    },
    "progressFilter.taskIssue": {
      handler(value) {
        if (value.error == "" && value.min !== "" && value.max !== ""  && value.min <= value.max) {
          value = { name: value.min + "-" + value.max, value: value.min + "-" + value.max }
          this.setTaskIssueProgressFilter([value])
        } else if (value.min == "" && value.max == "") {
          this.setTaskIssueProgressFilter([])
        }
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
#filterbar {
  position: absolute;
  z-index: 1000;
  transition: .4s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.19), 0 24px 24px rgba(0, 0, 0, 0.23);
}
.vdp-datepicker.dp {
  height: 42.8px !important;
}
#filter_bar {
  overflow-y: auto;
  border-radius: 4px;
  background-color: #fafafa;
  height: calc(100vh - 94px);
  max-height: calc(100vh - 94px);
  width: 685px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.19), 0 24px 24px rgba(0, 0, 0, 0.23);
}
.filter-sections {
  background-color: #fff;
  border-top:solid #41b883 3.5px;
}
.filters_wrap {
  width: 90%;
  margin: 0 auto;
}
.fac-group-filter {
  min-height: 48px !important;
  margin-right: 0px !important;
  width: 100%;
}
.issueUser-select /deep/ .multiselect,
.taskUser-select /deep/ .multiselect,
.actions-select /deep/ .multiselect,
.issetype-select /deep/ .multiselect,
.issueSeverity-select /deep/ .multiselect,
.issueProgress-select /deep/ .multiselect,
.taskProgress-select /deep/ .multiselect,
.tasktype-select /deep/ .multiselect,
.progress-ranges-select /deep/ .multiselect,
.facilityname-search /deep/ .multiselect,
.facilitygroup-select /deep/ .multiselect,
.status-select /deep/ .multiselect {
  font-size: 14px;
  width: 280px;
  .multiselect__placeholder {
    margin-bottom: 10px;
    padding-top: 3px;
  }
  .select__tag-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 170px;
  }
  .multiselect__option {
    white-space: normal;
  }
  .multiselect__option--selected:after {
    content: unset;
  }
  .multiselect__tags {
    padding-top: 6px;
  }
}
.facilitygroup-select,
.duedate-range {
  display: flex;
}
.project-select /deep/ .multiselect {
  font-size: 14px;
  width: 280px;
  .multiselect__tags {
    min-height: 20px;
  }
  .multiselect__placeholder {
    margin-bottom: 2px;
    padding-top: 2px;
  }
  .select__tag-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: fit-content;
  }
  .multiselect__option {
    white-space: normal;
  }
  .multiselect__option--selected:after {
    content: unset;
  }
}
.taskissueoverdue-select /deep/ .multiselect {
  font-size: 14px;
  width: 280px;
  .multiselect__tags {
    min-height: 20px;
  }
  .multiselect__placeholder {
    margin-bottom: 2px;
    padding-top: 2px;
  }
  .select__tag-name {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: fit-content;
  }
  .multiselect__option {
    white-space: normal;
  }
  .multiselect__option--selected:after {
    content: unset;
  }
}
a.disabled {
  pointer-events: none;
  cursor: default;
  opacity: 0.8;
}
.clear_btn {
  position: relative;
  top: -50px;
  left: 120px;
}
.filter-header {
  height: 30px;
}
.duedate-range /deep/ .mx-datepicker-range {
  width: 280px;
  .mx-input {
    display: inline-block;
    box-sizing: border-box;
    box-shadow: none;
    width: 100%;
    height: 40px;
    padding: 6px 30px;
    padding-left: 8px;
    line-height: 1.4;
    background-color: #fff;
    border-radius: 4px;
    min-height: 40px;
    border: 1px solid #e8e8e8;
    font-size: 14px;
    &::placeholder {
      color: #adadad;
    }
  }
}
.notedate-range /deep/ .mx-datepicker-range {
  width: 280px;
  .mx-input {
    display: inline-block;
    box-sizing: border-box;
    box-shadow: none;
    width: 100%;
    height: 40px;
    padding: 6px 30px;
    padding-left: 8px;
    line-height: 1.4;
    background-color: #fff;
    border-radius: 4px;
    min-height: 40px;
    border: 1px solid #e8e8e8;
    font-size: 14px;
    &::placeholder {
      color: #adadad;
    }
  }
}
.taskissueduedate-range /deep/ .mx-datepicker-range {
  width: 280px;
  .mx-input {
    display: inline-block;
    box-sizing: border-box;
    box-shadow: none;
    width: 100%;
    height: 40px;
    padding: 6px 30px;
    padding-left: 8px;
    line-height: 1.4;
    background-color: #fff;
    border-radius: 4px;
    min-height: 40px;
    border: 1px solid #e8e8e8;
    font-size: 14px;
    &::placeholder {
      color: #adadad;
    }
  }
}
.datepicker,
.milestones {
  width: 100% !important;
}
.knocker {
  cursor: pointer;
  position: absolute;
  bottom: 10%;
  right: -85px;
  width: 140px;
  -moz-transform:rotate(-90deg);
  -ms-transform:rotate(-90deg);
  -o-transform:rotate(-90deg);
  -webkit-transform:rotate(-90deg);
}
.knocker-btn {
  // Bootstrap success color rgba with transparency
   background-color: rgba(65, 184, 131, .85);
}
.filter-border {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19), 0 3px 3px rgba(56, 56, 56, 0.23);
  border-radius: 5px;
  padding: 6px
}
.selected-opt {
  position: relative;
  display: inline-block;
  padding: 5px 25px 5px 10px;
  border-radius: 5px;
  margin-right: 10px;
  color: #fff;
  line-height: 1;
  background: #41b883;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}
.progress_ranges {
  label {
    margin-left: 0.5em;
    font-size: 14px;
    color: #adadad;
  }
  input {
    border-color: #e8e8e8;
  }
  ::placeholder {
    color: #adadad;
  }
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
  height: 34px;
}
/deep/.mx-input {
  font-size: .75rem !important;
}
.clear-btn {
  text-decoration-line: none !important;
}
</style>
