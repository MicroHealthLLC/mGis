
<template>
<div>
   <span class="filters-wrapper w-75">
      <div class="d-flex align-item-center justify-content-between mb-2 w-100">
        <div class="task-search-bar w-100">
            <label class="font-sm mb-0"><span style="visibility:hidden">L</span></label>
           <el-input
            type="search"          
            placeholder="Search Risks"
            aria-label="Search"            
            aria-describedby="search-addon"    
            v-model="risksQuery"     
            data-cy="search_risks"
        >
          <el-button slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
        </div>
        <div class="mx-1 w-100">
         <label class="font-sm my-0">Category</label>
          <el-select
           v-model="C_taskTypeFilter"
          :key="componentKey"   
           class="w-100"          
           track-by="name"
           value-key="id"
           multiple
           placeholder="Select Category"
           collapse-tags
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
          <label class="font-sm my-0">Flags</label>
           <el-select
           v-model="C_calendarRiskFilter"
          :key="componentKey"   
           class="w-100"
           track-by="name"
           value-key="id"
           multiple
           placeholder="Filter by Flags"
           collapse-tags
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
   </span>
  <v-app id="app" class="mt-4 mr-2">
  <v-row class="fill-height">
    <v-col class="pt-0">
      <v-sheet height="64">
        <v-toolbar
          flat
        >
         <button
          v-if="_isallowed('write')"
          class="btn btn-md btn-primary mr-3 addRiskBtn"
          @click.prevent="addNewRisk"
          data-cy="add_risk"
       >
        <font-awesome-icon icon="plus-circle" />
        Add Risk
        </button>  
        <div
        class="mr-3"
        >        
          <v-btn
            fab
            text
            class="back-forth-btn"
            small           
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            class="back-forth-btn"
            small          
            @click="next"
          >
          <v-icon small>
            mdi-chevron-right
          </v-icon>
          </v-btn>
         </div>
          <v-toolbar-title v-if="$refs.calendar" class="monthTitle">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
           <v-checkbox
            v-model="C_showAllEventsToggle"
            class="mr-5 mt-6 mb-0"
            :key="componentKey"         
            @click.prevent="showAllEvents"
            :label="`Show All`"
          ></v-checkbox>
          
           <v-btn        
            class="mr-4 todayBtn"          
            @click="setToday"
            small
            elevation="0"
            >
            <font-awesome-icon icon="calendar-check" class="mr-1 today-icon"  />
            Today
            </v-btn>
          
           <v-btn-toggle
            v-model="C_calendarView"          
             >
             <v-btn    
              v-for="item in getCalendarViewFilterOptions"
              :value="item"
              :key="item.id"
              :label="item.name"
              small
            >
            <span v-if="item.id == 'day'"><font-awesome-icon icon="calendar-day" class="mr-1"  /> Day</span>
            <span v-if="item.id == 'week'"><font-awesome-icon icon="calendar-week" class="mr-1"  /> Week</span>
            <span v-if="item.id == 'month'"><font-awesome-icon icon="calendar-alt" class="mr-1"  /> Month</span>
            <span v-if="item.id == '4day'"><font-awesome-icon icon="calendar-minus" class="mr-1"  /> 4 Day</span>         
            </v-btn>        
           </v-btn-toggle>
          <button class="btn btn-sm btn-info ml-3 total-table-btns">
            Total: {{filteredCalendar.length}}
          </button> 
        </v-toolbar>
      </v-sheet>
    
      <v-sheet height="600" >     
         <v-calendar               
          ref="calendar"
          v-model="C_lastFocus"
          color="primary"
          :events="events"
          :key="componentKey"   
          :event-color="getEventColor"
          :type="C_calendarView.id"      
          :risk="events"                   
          @click:event="editRisk"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"        
          @contextmenu:event="showSummary"  
          @contextmenu.prevent="" 
          @mouseup.right="openContextMenu"             
        >           
        </v-calendar> 
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          ref="menu"          
        >
       <v-card class="actionSummary p-2" min-width="265">       
        <v-list>
        <v-list-item>          
          <v-list-item-title>
            <span class="d-inline mr-1"><small><b>Risk Name:</b></small></span>
             {{ selectedEvent.name }}
          </v-list-item-title>
        </v-list-item>
         <v-list-item>
          <v-list-item-title>            
            <span class="d-inline mr-1"><small><b>Category:</b></small></span>
            {{ selectedEvent.category }}            
          </v-list-item-title>
        </v-list-item>
     
         <v-list-item>
          <v-list-item-title> 
           <span class="d-inline mr-1"><small><b>Risk Approach:</b></small></span>  
           <span class="upperCase"> {{ selectedEvent.ra }} </span>
          </v-list-item-title>
        </v-list-item>
          <v-list-item>
          <v-list-item-title @click.prevent="scrollToStartDate" class="point">          
            <span class="d-inline mr-1"><small><b>Date Identified:</b></small></span>            
             {{ moment(selectedEvent.start).format('DD MMM YYYY') }}
          </v-list-item-title>
        </v-list-item>
          <v-list-item>
          <v-list-item-title class="point" @click.prevent="scrollToEndDate"> 
           <span class="d-inline mr-1">
               <span v-if="selectedEvent.isOngoing == true">
                 <small><b> Date Closed:</b></small>
               </span>
               <small v-else><b>RA Due Date:</b></small></span> 
               <span v-if="selectedEvent.isOngoing == true && 
               selectedEvent.end == '2099-01-01'" class="mr-2">
                <font-awesome-icon icon="retweet" class="text-success"  />
                </span>   
               <span v-else>  
            {{ moment(selectedEvent.end).format('DD MMM YYYY') }}
               </span>
          </v-list-item-title>
        </v-list-item>
         <v-list-item >
           <v-list-item-title>
              <span class=d-inline mr-1 ><small><b>Progress:</b></small></span> 
               <span v-if="selectedEvent.isOngoing == true && selectedEvent.end == '2099-01-01'" class="mr-2"> 
              <font-awesome-icon icon="retweet" class="text-success"  />   
              </span>   
               <span v-else>
               {{ selectedEvent.progess }}%    
               </span>   
          </v-list-item-title>
        </v-list-item>
         <v-list-item>
          <v-list-item-title>
           <span class="d-inline mr-1"><small><b>Flags:</b></small></span>  
              <span v-if="selectedEvent.watch == true"  v-tooltip="`On Watch`"><font-awesome-icon icon="eye" class="mr-1"  /></span>
              <span v-if="selectedEvent.hasStar == true"  v-tooltip="`Important`"> <i class="fas fa-star text-warning mr-1"></i></span>
              <span v-if="selectedEvent.pastDue == true" v-tooltip="`Overdue`"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
              <span v-if="selectedEvent.progess == 100" v-tooltip="`Completed`"><font-awesome-icon icon="clipboard-check" class="text-success"  /></span>
              <span v-if="selectedEvent.isOngoing == true" v-tooltip="`Ongoing`"><font-awesome-icon icon="retweet" class="text-success"  /></span> 
              <span v-if="selectedEvent.isOnHold == true" v-tooltip="`On Hold`"><font-awesome-icon icon="pause-circle" class="text-primary"  /></span>   
              <span v-if="selectedEvent.isDraft == true" v-tooltip="`Draft`"><font-awesome-icon icon="pencil-alt" class="text-warning"  /></span>     
                <span v-if="
                      selectedEvent.watch == false && 
                      selectedEvent.isOngoing == false && 
                      selectedEvent.pastDue == false && 
                      selectedEvent.isOnHold == false && 
                      selectedEvent.isDraft == false && 
                      selectedEvent.hasStar == false && 
                      selectedEvent.progess < 100">
                 No flags at this time
                </span>    
          </v-list-item-title>
        </v-list-item>
        
      </v-list>
        <v-card-actions>
           <!-- <v-btn
            small
            @click.prevent="showMore"
            class="mh-green text-light"
          >
             <font-awesome-icon icon="clipboard-list" class="mr-1" />
            See More
          </v-btn> -->
           <v-btn
            small
            @click.prevent="detailsBtn"
            color="primary"
          >
            <font-awesome-icon icon="edit" class="mr-1" />
            Details
          </v-btn>
            
          <v-btn
            color="error"
            small
            @click.prevent="deleteRisk"           
          >
          <font-awesome-icon icon="trash-alt" class="mr-1" />
          DELETE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>               
      </v-sheet>
    </v-col>
  </v-row>
  </v-app>
  </div>
</template>

<script>
 import {mapGetters, mapMutations, mapActions} from "vuex"
  export default {
    name: 'RiskCalendar',
    props:
      {
      fromView: {
        type: String,
        default: "map_view",
      },    
      facility: Object,     
     },
    data() {
      return {         
        type: this.C_calendarView,  
        focus: this.C_lastFocus,    
        risksQuery: '',    
        riskNames: [],  
        retweet: 'f2b9',
        componentKey: 0, 
        riskIds:[], 
        seeLess: true,     
        riskData: [],
        riskStartDates: [],
        riskEndDates: [],   
        selectedEventId: {},
        calendarRisk: {},
        colors: {
          onScheduleColor: '#5cb85c',
          defaultColor: 'rgba(214, 219, 223, .15)',
          warningColor: '#f0ad4e',
          pastDueColor: '#d9534f',
        }, 
        selectedElement: null, 
        selectedEvent: {},     
        selectedOpen: false,
        showContextMenu: false,
        checkbox: this.getShowAllEventsToggle, 
        events: [],
        names: [],           
      }
    },
    mounted () {   
     this.$refs.calendar.checkChange();   
    },
    methods: {
     ...mapMutations([
        'setAdvancedFilter',
        'setCalendarViewFilter',
        'setTaskIssueProgressStatusFilter',
        'setTaskIssueOverdueFilter',
        'setShowAllEventsToggle',
        'setRiskPriorityLevelFilter',
        'setLastFocusFilter',
        'setRiskApproachFilter',
        'setTaskTypeFilter',
        'setMyActionsFilter',
        'setOnWatchFilter',
        'setRiskForManager',     
        'setTaskForManager'
      ]),
      ...mapActions([
        'riskDeleted',
        'riskUpdated',
        'taskUpdated',
        'updateWatchedTasks'
      ]), 
      reRenderCalendar() {
        this.componentKey += 1;
      },
      viewDay ({ date }) {
        this.focus = date
        this.setCalendarViewFilter({id: 'day', name: 'Day', value: 'day'})
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = '' || this.setLastFocusFilter('')  
        // this.todayView = true 
        // this.setLastFocusFilter('')  
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      }, 
       scrollToEndDate() {
      if (this.selectedEvent.end !== '2099-01-01'){
        this.setLastFocusFilter(this.selectedEvent.end)  
       }
     },
      scrollToStartDate() {     
        this.setLastFocusFilter(this.selectedEvent.start)    
     },
      addNewRisk() {
        this.setRiskForManager({key: 'risk', value: {}})
        // Route to new risk form page
        this.$router.push(
          `/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/risks/new`
        );
    },
    editRisk(event) {   
      let eventObj = event
      this.selectedEventId = eventObj.event.riskId;
      this.calendarRisk = eventObj.event.risk        
      this.$router.push(`/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/risks/${this.selectedEventId}`)
              
    },
    detailsBtn() {  
      //  Opens Risk edit form in context-menu
      let riskId = this.selectedEvent.risk.id  
      this.$router.push(`/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/risks/${riskId}`)
     },
    deleteRisk() {
      let risk = this.selectedEvent.risk
      this.$confirm(`Are you sure you want to delete ${risk.text}?`, 'Confirm Delete', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.riskDeleted(risk).then((value) => {
            if (value === 'Success') {
              this.$message({
                message: `${risk.text} was deleted successfully.`,
                type: "success",
                showClose: true,
              });
            }
            this.reRenderCalendar()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
            showClose: true
          });          
        });
    },
    openContextMenu(e) {
      e.preventDefault();
      this.$refs.menu.open(e);
     },
     showSummary ({ nativeEvent, event }) {        
        const open = () => {
          this.selectedEvent = event   
          this.selectedElement = nativeEvent.target
          requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))         
        }        
        if (this.selectedOpen) {
          this.selectedOpen = false
          requestAnimationFrame(() => requestAnimationFrame(() => open()))
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
    showAllEvents(){
        this.setShowAllEventsToggle(!this.getShowAllEventsToggle)
        // console.log(this.getShowAllEventsToggle)
        if (this.getShowAllEventsToggle == true) {
        
          this.reRenderCalendar()
        } else if (this.getShowAllEventsToggle == false){
        
           this.events = [];
           this.reRenderCalendar()
        }
      },
    updateRange ({ start, end }) {    
      // Mapping over Risk Names, Start Dates, and Due Dates 
      if (this.filteredCalendar !== undefined && this.filteredCalendar.length > 0) {
      this.riskData = this.filteredCalendar.map(risk => risk)  
      this.riskNames = this.filteredCalendar.map(risk=> risk.text)    
      this.riskIds = this.filteredCalendar.map(risk => risk.id)      
      this.riskStartDates = this.filteredCalendar.map(risk =>risk.startDate)     
      this.riskEndDates = this.filteredCalendar.map(risk => risk.dueDate) 
      this.categories = this.filteredCalendar.map(risk => risk.taskType.name) 
      this.onWatch = this.filteredCalendar.map(risk => risk.watched)   
      this.overdue = this.filteredCalendar.map(risk => risk.isOverdue) 
      this.percentage = this.filteredCalendar.map(risk => risk.progress)  
      this.star = this.filteredCalendar.map(risk => risk.important)
      this.riskApproach = this.filteredCalendar.map(risk => risk.riskApproach)  
      this.ongoing = this.filteredCalendar.map(risk => risk.ongoing)    
      this.onhold = this.filteredCalendar.map(risk => risk.onHold)   
      this.draft = this.filteredCalendar.map(risk => risk.draft)       

      const events = []
      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000   
      // For loop to determine length of Tasks 
      for (let i = 0; i < this.filteredCalendar.length; i++) {    

      if(this.riskData[i].ongoing){
       this.riskNames[i] = this.riskNames[i] + " (Ongoing)"     
      }
      if(this.riskData[i].ongoing && (this.riskEndDates[i] == null || this.riskEndDates[i] == undefined)){    
       this.riskEndDates[i] = '2099-01-01'
      }
          events.push({            
          name: this.riskNames[i],
          start: this.riskStartDates[i],
          end: this.riskEndDates[i],        
          riskId: this.riskIds[i],
          risk: this.riskData[i],
          category: this.categories[i],  
          watch: this.onWatch[i],
          ra: this.riskApproach[i],    
          pastDue: this.overdue[i], 
          progess: this.percentage[i],
          // color: this.colors.defaultColor,   
          hasStar: this.star[i], 
          isOngoing: this.ongoing[i],
          isDraft: this.draft[i],
          isOnHold: this.onhold[i], 
                             
        })
      }
      // This is the main Events array pushed into Calendar
    if (this.getShowAllEventsToggle == false && !(this.risksQuery.length > 0)) {
           this.events = []
         } 
    else 
          this.events = events
      }
 
    },   
      
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },    
    },
    computed: {
     ...mapGetters([
        "facilities",
        "facilityGroups",
        'getCalendarViewFilterOptions',
        'getCalendarViewFilter',
        'calendarViewFilter',
        'getShowAllEventsToggle',
        'getRiskPriorityLevelFilter',
        'getRiskPriorityLevelFilterOptions',
        'getRisksPerPageFilterOptions',
        'getRisksPerPageFilter',
        'getLastFocusFilter',
        'getAdvancedFilterOptions',
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
        'taskTypeFilter',
         "contentLoaded",
        'getRiskApproachFilterOptions',
        'getRiskApproachFilter',
        'riskStageFilter',
         "currentProject",
        'myActionsFilter',
        'onWatchFilter',  
        'taskTypes',      
       ]),
       _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      filteredCalendar() {
        let milestoneIds = _.map(this.C_taskTypeFilter, 'id')
        let stageIds = _.map(this.riskStageFilter, 'id')
        let riskApproachIds = _.map(this.C_riskApproachFilter, 'id')
        let riskPriorityLevelFilterIds = _.map(this.C_riskPriorityLevelFilter, 'id')
        let riskPriorityLevelFilter = this.getRiskPriorityLevelFilter

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
          if (riskPriorityLevelFilterIds.length > 0) valid = valid && riskPriorityLevelFilterIds.includes(resource.priorityLevelName.toLowerCase())

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
     C_calendarRiskFilter: {           
        get() {
          this.reRenderCalendar()
          return this.getAdvancedFilter
        },
        set(value) {
          this.setAdvancedFilter(value)
        }
      },
     C_riskPriorityLevelFilter: {
        get() {
          return this.getRiskPriorityLevelFilter
        },
        set(value) {
          this.setRiskPriorityLevelFilter(value)
        }
      },
      C_showAllEventsToggle: {           
        get() {     
          return this.getShowAllEventsToggle        
        },
        set(value) {
          this.setShowAllEventsToggle(value)  ||  this.setShowAllEventsToggle(!this.getShowAllEventsToggle)
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
      C_riskApproachFilter: {
        get() {      
          return this.getRiskApproachFilter
        },
        set(value) {     
            this.setRiskApproachFilter(value)
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
          this.reRenderCalendar()     
          this.setTaskTypeFilter(value)
        }
      },
     C_lastFocus: {
      get() {         
        return this.getLastFocusFilter  || this.focus
      
      },
      set(value) {
        this.setLastFocusFilter(value) 
       }
      },   
    C_calendarView: {      
      get() {      
        return this.getCalendarViewFilter || {id: 'month', name: 'Month', value: 'month'}
      },
      set(value) {
        this.setCalendarViewFilter(value)
       }
      }      
    },
  watch: {
   contentLoaded: {
      handler() {
        if (this.$route.params.projectId && this.currentFacility.risks.length > 0) {
          this.reRenderCalendar()
          this.currentFacility = this.facilities.find(
            (facility) => facility.facilityId == this.$route.params.projectId
          );
        }
      },
    },
    risksQuery: {
      handler() {
       if(this.risksQuery.length > 0) {
        this.reRenderCalendar()
       } else if (!(this.risksQuery.length > 0) && this.checkbox == false) {
         this.events = [];
         this.reRenderCalendar()
       }
      },
    },
   filteredCalendar: {
      handler(value) {
        if (value) {         
          this.reRenderCalendar()        
        }
         if (value && this.filteredCalendar.length == 0)   {
          this.events = []
        }           
      },
    },
   currentFacility: {
      handler() {
        this.currentFacilityGroup = this.facilityGroups.find(
          (group) => group.id == this.currentFacility.facility.facilityGroupId
        );

        this.expanded.id = this.currentFacilityGroup.id;
      },
    },
    facilities: {
      handler() {
        this.currentFacility = this.facilities.find(
          (facility) => facility.facilityId == this.$route.params.projectId
        );
      },
    },
  },
    filterTree(value) {
      this.$refs.duplicatetree.filter(value);
      this.$refs.movetree.filter(value);
    }
  }
</script>

<style lang="scss" scoped>
/deep/.v-toolbar__content {
  padding-left: 0;
  padding-right: 0;
}
/deep/.v-event {
  color: #383838 !important;
}
/deep/.v-event:hover {
  background-color: rgba(214, 219, 223, .45) !important;
}
/deep/.v-event-start {
  border-left-color: #41b883 !important;
  border-left-width: thick;
  border-left-style: double;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  padding-left: 3px;
}
/deep/.v-event-end {
  border-right-color: #d9534f !important;
  border-right-width: thick;
  border-right-style: double;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  text-align: right;
  font-weight: 500;  
  padding-right: 3px;
}
.addRiskBtn, .showAll, .todayBtn {
   box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
 }
  .filters-wrapper {
  float: right;
  margin-top: -83.5px;
}
/deep/.v-event.v-event-start, /deep/.v-event.v-event-end {
  visibility: visible !important;
  font-weight: 500 !important;
}
/deep/.v-menu__content {
  position: absolute !important;
  z-index: 100;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
/deep/.v-input__slot {
  .v-label {
    margin-top: 0.5rem
  }
}
/deep/.v-list-item {
  min-height: 30px;
}
.monthTitle {
  font-weight: 500;
  font-size: 1.5rem;
}
input[type=search] {
    color: #383838;
    text-align: left;
    cursor: pointer;
    display: block;
 }
.contextTable {
   border: solid 1px lightgray;
   td {
    border: solid 1px lightgray;
   }
 }
 .upperCase {
   text-transform: capitalize;
 }
 .seeLess {
   display: none;
 }
 .point {
   cursor: pointer;  
 }
  .point:hover {
   background-color: rgba(214, 219, 223, .45);
 }


</style> 