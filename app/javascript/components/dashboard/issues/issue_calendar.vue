
<template>
<div>
   <span class="filters-wrapper w-75">
      <div class="d-flex align-item-center justify-content-between mb-2 w-100">
        <div class="task-search-bar w-100">
          <label class="font-sm mb-0"><span style="visibility:hidden">L</span></label>
           <el-input
            type="search"          
            placeholder="Search Issues"
            aria-label="Search"            
            aria-describedby="search-addon"    
            v-model="issuesQuery"     
            data-cy="search_tasks"
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
           v-model="C_calendarIssueFilter"
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
          class="btn btn-md btn-primary mr-3 addTaskBtn"
          @click.prevent="addNewIssue"
          data-cy="add_issue"
       >
        <font-awesome-icon icon="plus-circle" />
        Add Issue
        </button>  
          <div    
            class="mr-3"
          >        
          <v-btn
            fab
            text
            small
            class="back-forth-btn"
            color="grey darken-2"
            @click="prev"
          >
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn
            fab
            text
            small
            class="back-forth-btn"
            color="grey darken-2"
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
        </v-toolbar>
      </v-sheet>    
      <v-sheet height="600" >     
         <v-calendar               
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :type="C_calendarView.id"        
          :key="componentKey"                    
          @click:event="editIssue"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
          @contextmenu:event="showSummary"  
          @mouseup.right="openContextMenu"    
        >         
        </v-calendar>
         <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          ref="menu"
          class="actionSummary"           
        >
          <v-card class="actionSummary p-2" min-width="265">       
           <v-list>
            <v-list-item>          
              <v-list-item-title>
                <span class="d-block"><small><b>Issue Name</b></small></span>
                {{ selectedEvent.name }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>            
                <span class="d-block"><small><b>Category</b></small></span>
                {{ selectedEvent.category }}            
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>          
                <span class="d-block"><small><b>Start Date</b></small></span>            
                {{ selectedEvent.start }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title> 
              <span class="d-block"><small><b>Due Date</b></small></span>  
                {{ selectedEvent.end }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <span class="d-block"><small><b>Progress</b></small></span>  
              {{ selectedEvent.progess }}%          
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
              <span class="d-block"><small><b>Flags</b></small></span>  
                  <span v-if="selectedEvent.watch == true"  v-tooltip="`On Watch`"><font-awesome-icon icon="eye" class="mr-1"  /></span>
                  <span v-if="selectedEvent.pastDue == true" v-tooltip="`Overdue`"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
                  <span v-if="selectedEvent.progess == 100" v-tooltip="`Completed Task`"><font-awesome-icon icon="clipboard-check" class="text-success"  /></span>   
                  <span v-if="selectedEvent.watch == false && selectedEvent.pastDue == false && selectedEvent.progess < 100">
                    No flags at this time
                    </span>                    
              </v-list-item-title>
            </v-list-item>        
           </v-list>
          <v-card-actions>
             <!-- <v-btn
            small
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
            @click.prevent="deleteTask"           
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
    name: 'IssueCalendar',
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
        focus: '',        
        type: this.C_calendarView,   
        issuesQuery: '',       
        issueNames: [], 
        componentKey: 0,  
        issueIds:[],  
        issueData: [],
        issueStartDates: [],
          colors: {
          onScheduleColor: '#5cb85c',
          defaultColor: 'rgba(214, 219, 223, .15)',
          warningColor: '#f0ad4e',
          pastDueColor: '#d9534f',
        },        
        issueEndDates: [],   
        selectedEventId: {},
        calendarIssue: {},
        selectedEvent: {},
        selectedElement: null,      
        selectedOpen: false,
        showContextMenu: false,
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
        'setShowAllEventsToggle',
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
      ...mapActions([
        'issueDeleted',
        'issueUpdated',
        'updateWatchedIssues'
      ]), 
      //TODO: change the method name of isAllowed
      // _isallowed(salut) {
      //   var programId = this.$route.params.programId;
      //   var projectId = this.$route.params.projectId
      //   let fPrivilege = this.$projectPrivileges[programId][projectId]
      //   let permissionHash = {"write": "W", "read": "R", "delete": "D"}
      //   let s = permissionHash[salut]
      //   return this.$currentUser.role == "superadmin" || fPrivilege.issues.includes(s); 
      // },
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
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      }, 
     addNewIssue() {
      this.setTaskForManager({key: 'issue', value: {}})
      // Route to new issue form page
      this.$router.push(
        `/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/issues/new`
        );
    },
     editIssue(event) {   
        let eventObj = event
        this.selectedEventId = eventObj.event.issueId;
        this.calendarIssue = eventObj.event.issue          
        this.$router.push(`/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/issues/${this.selectedEventId}`)        
      },
     openContextMenu(e) {
      e.preventDefault();
      this.$refs.menu.open(e);
     },
    showAllEvents(){
        this.setShowAllEventsToggle(!this.getShowAllEventsToggle)
        console.log(this.getShowAllEventsToggle)
        if (this.getShowAllEventsToggle == true) {
          this.reRenderCalendar()
        } else if (this.getShowAllEventsToggle == false){
           this.events = [];
           this.reRenderCalendar()
        }
      },
      detailsBtn() {  
      //  Opens Issue edit form in context-menu
        let issueId = this.selectedEvent.issue.id  
        this.$router.push(`/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/issues/${issueId}`)
     },
      deleteIssue() {
      let issue = this.selectedEvent.issue            
      this.$confirm(`Are you sure you want to delete ${issue.title}?`, 'Confirm Delete', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.issueDeleted(issue).then((value) => {
            if (value === 'Success') {
              this.$message({
                message: `${issue.title} was deleted successfully.`,
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
      updateRange ({ start, end }) {    
        // Mapping over Task Names, Start Dates, and Due Dates 
       if (this.filteredCalendar !== undefined && this.filteredCalendar.length > 0) {
       this.issueData = this.filteredCalendar.map(issue => issue)  
       this.issueNames = this.filteredCalendar.map(issue=> issue.title)    
       this.issueIds = this.filteredCalendar.map(issue => issue.id)      
       this.issueStartDates = this.filteredCalendar.map(issue => issue.startDate)     
       this.issueEndDates = this.filteredCalendar.map(issue => issue.dueDate)  
       this.categories = this.filteredCalendar.map(issue => issue.taskTypeName) 
       this.onWatch = this.filteredCalendar.map(issue => issue.watched)   
       this.overdue = this.filteredCalendar.map(issue => issue.isOverdue) 
       this.percentage = this.filteredCalendar.map(issue => issue.progress)            
        const events = []
        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000   
        // For loop to determine length of Tasks 
        for (let i = 0; i < this.filteredCalendar.length; i++) {
            events.push({            
            name: this.issueNames[i],
            start: this.issueStartDates[i],
            end: this.issueEndDates[i],         
            issueId: this.issueIds[i],
            issue: this.issueData[i],
            category: this.categories[i],  
            watch: this.onWatch[i],
            pastDue: this.overdue[i], 
            progess: this.percentage[i],
            color: this.colors.defaultColor,        
            // timed: !allDay,            
          })
        }       
        // This is the main Events array pushed into Calendar
        if (this.getShowAllEventsToggle == false && !(this.issuesQuery.length > 0) ) {
           this.events = []
         } else 
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
        "contentLoaded",
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
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.issues[salut]
      },
      filteredCalendar() {
        let typeIds = _.map(this.C_taskTypeFilter, 'id')
        const search_query = this.exists(this.issuesQuery.trim()) ? new RegExp(_.escapeRegExp(this.issuesQuery.trim().toLowerCase()), 'i') : null
        const filterDataForAdvancedFilterFunction = this.filterDataForAdvancedFilter
        let issues = _.sortBy(_.filter(this.facility.issues, (resource) => {
        let valid = Boolean(resource && resource.hasOwnProperty('progress'))        
        valid = valid && filterDataForAdvancedFilterFunction([resource], 'sheetsIssues')
        if (typeIds.length > 0) valid = valid && typeIds.includes(resource.taskTypeId)    
        if (search_query) valid = valid && search_query.test(resource.title)
         
         return valid
         }), ['dueDate'])
        
         return issues        
    }, 
      C_calendarIssueFilter: {
        get() {
          this.reRenderCalendar()
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
    C_taskTypeFilter: {
        get() {           
          return this.taskTypeFilter
        },
        set(value) {
          this.reRenderCalendar()     
          this.setTaskTypeFilter(value)
        }
      },
    C_showAllEventsToggle: {                  
        get() {
         return this.getShowAllEventsToggle                 
        },
        set(value) {
          this.setShowAllEventsToggle(value) ||  this.setShowAllEventsToggle(!this.getShowAllEventsToggle)
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
        if (this.$route.params.projectId && this.currentFacility.issues.length > 0) {
          this.reRenderCalendar()
          this.currentFacility = this.facilities.find(
            (facility) => facility.facilityId == this.$route.params.projectId
          );
        }
      },
    },
    issuesQuery: {
      handler() {
       if(this.issuesQuery.length > 0) {
          this.reRenderCalendar()
       } else if (!(this.issuesQuery.length > 0) && this.checkbox == false) {
         this.events = [];
         this.reRenderCalendar()
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
  }
</script>

<style scoped lang="scss">

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
.addTaskBtn, .exportBtns, .showAll, .todayBtn {
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

</style>
