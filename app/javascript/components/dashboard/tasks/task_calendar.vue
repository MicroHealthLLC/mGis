
<template>
<div>
   <span class="filters-wrapper w-75">
      <div class="d-flex align-item-center justify-content-between mb-2 w-100">
        <div class="task-search-bar w-100">
          <label class="font-sm mb-0"><span style="visibility:hidden">L</span></label>
           <el-input
            type="search"          
            placeholder="Search Tasks"
            aria-label="Search"            
            aria-describedby="search-addon"    
            v-model="tasksQuery"     
            data-cy="search_tasks"
        >
          <el-button slot="prepend" icon="el-icon-search"></el-button>
        </el-input>
        </div>
        <div class="mx-1 w-100">
         <label class="font-sm mb-0">Category</label>

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
            <label class="font-sm mb-0">Flags</label>
 
           <el-select
           v-model="C_calendarTaskFilter"
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
          @click.prevent="addNewTask"
          data-cy="add_task"
       >
        <font-awesome-icon icon="plus-circle" />
        Add Task
        </button>  
        <div
          class="mr-3"
          >        
      
        </div>
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
            class="back-forth-btn"
            small
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
          <button class="btn btn-sm btn-info ml-3 total-table-btns">
          Total: {{filteredCalendar.length}}
         </button>

        </v-toolbar>
      </v-sheet>
    
      <v-sheet height="600">     
         <v-calendar                      
          ref="calendar"        
          v-model="C_lastFocus"      
          color="primary"            
          :events="events"         
          :event-color="getEventColor"
          :type="C_calendarView.id"    
          :key="componentKey"                      
          @click:event="editTask"
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
        <v-card class="p-2" min-width="265">   
          <v-list>
          <v-list-item>          
            <v-list-item-title>
              <span class="d-inline mr-1"><small><b>Task Name:</b></small></span>
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
            <v-list-item-title @click.prevent="scrollToStartDate" class="point">     
              <span v-if="selectedEvent.isOngoing == true" class="d-inline mr-1">
                <small><b>Date Identified:</b></small>
              </span>                 
              <span v-else class="d-inline mr-1"><small><b>Start Date:</b></small></span>              
              {{ moment(selectedEvent.start).format('DD MMM YYYY') }}              
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title @click.prevent="scrollToEndDate" class="point"> 
            <span v-if="selectedEvent.isOngoing == true" class="d-inline mr-1">
              <small><b>Date Closed:</b></small>
            </span> 
            <span v-else class="d-inline mr-1">
              <small><b>Due Date:</b></small>
            </span> 
             <span v-if="selectedEvent.isOngoing == true && 
               selectedEvent.end == '2099-01-01'" class="mr-1">
               <i class="far fa-retweet text-success"></i>
                </span>                
               <span v-else> 
              {{ moment(selectedEvent.end).format('DD MMM YYYY') }}
               </span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
              <span class=d-inline mr-1 ><small><b>Progress:</b></small></span> 
               <span v-if="selectedEvent.isOngoing == true && selectedEvent.end == '2099-01-01'" class="mr-1">
            <i class="far fa-retweet text-success"></i>
                </span>   
               <span v-else>
               {{ selectedEvent.progess }}%    
               </span>   
            </v-list-item-title>
            <!-- class="d-none mr-1"  :class="{ 'd-inline mr-1': showMore}" -->
          </v-list-item>
          <v-list-item>
            <v-list-item-title>
            <span class="d-inline mr-1"><small><b>Flags:</b></small></span>  
                <span v-if="selectedEvent.watch == true"  v-tooltip="`On Watch`"><font-awesome-icon icon="eye" class="mr-1"  /></span>
                 <span v-if="selectedEvent.hasStar == true"  v-tooltip="`Important`"> <i class="fas fa-star text-warning mr-1"></i></span>
                <span v-if="selectedEvent.pastDue == true" v-tooltip="`Overdue`"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
                <span v-if="selectedEvent.progess == 100" v-tooltip="`Completed`"><font-awesome-icon icon="clipboard-check" class="text-success"  /></span>   
                <span v-if="selectedEvent.isOngoing == true" v-tooltip="`Ongoing`"><i class="far fa-retweet text-success"></i></span>   
                <span v-if="selectedEvent.isOnHold == true" v-tooltip="`On Hold`"><font-awesome-icon icon="pause-circle" class="text-primary"  /></span>   
                <span v-if="selectedEvent.isDraft == true" v-tooltip="`Draft`"><font-awesome-icon icon="pencil-alt" class="text-warning"  /></span>   
                <span v-if="
                      selectedEvent.watch == false && 
                      selectedEvent.isOngoing == false && 
                      selectedEvent.pastDue == false &&     
                      selectedEvent.hasStar == false && 
                      selectedEvent.isOnHold == false && 
                      selectedEvent.isDraft == false && 
                      selectedEvent.progess < 100">
                      No flags at this time
                </span> 
            </v-list-item-title>
          </v-list-item>        
          </v-list>
          <v-card-actions>      
          
          <!-- <v-btn
            small
            class="mh-green text-light"
            @click.prevent="showM"
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
 import { library } from '@fortawesome/fontawesome-svg-core'
 import { faCalendarAlt, faCalendarCheck, faCalendarDay, faCalendarWeek, faEye, faCalendar, faClipboardCheck, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
 import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
 library.add(faCalendarDay, faCalendarWeek, faCalendarAlt, faCalendarCheck, faEye, faCalendar, faClipboardCheck, faTrashAlt)
 Vue.component('font-awesome-icon', FontAwesomeIcon)

  export default {
    name: 'TaskCalendar',
    props:{        
      facility: Object, 
      task: Object,
     },
    data() {
      return {         
        focus: this.C_lastFocus,
        showMore: false,    
        type: this.C_calendarView,     
        tasksQuery: '',
        taskNames: [], 
        taskIds:[],       
        checkbox: this.C_showAllEventsToggle,
        taskData: [],     
        componentKey: 0,
        taskStartDates: [],       
        taskEndDates: [],   
        selectedEventId: {},
        selectedEvent: {},
        calendarTask: {},
        colors: {
          onScheduleColor: '#5cb85c',
          defaultColor: 'rgba(214, 219, 223, .15)',
          warningColor: '#f0ad4e',
          pastDueColor: '#d9534f',
        },        
        selectedElement: null,      
        selectedOpen: false,
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
        'setTaskIssueProgressStatusFilter',
        'setCalendarViewFilter',
        'setLastFocusFilter',
        'setTaskIssueOverdueFilter',
        'setTaskTypeFilter',
        'setShowAllEventsToggle',
        'setMyActionsFilter',
        'setOnWatchFilter',     
        'setTaskForManager',
        'updateTasksHash'
      ]),
       ...mapActions([
        'taskDeleted',
        'taskUpdated',
        'updateWatchedTasks'
      ]), 
      // log(e){
      //   console.log("Focus: " + e)
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
      showM(){
        this.showMore = !this.showMore
      }, 
      scrollToEndDate() {
      if (this.selectedEvent.end !== '2099-01-01'){
        this.setLastFocusFilter(this.selectedEvent.end)  
       }
     },
      scrollToStartDate() {     
        this.setLastFocusFilter(this.selectedEvent.start)    
     },
      setToday (resource) {
       this.focus = '' || this.setLastFocusFilter('')  
       console.log("Resource: " + resource)
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      }, 
      addNewTask() {
      this.setTaskForManager({key: 'task', value: {}})
      // Route to new task form page
      this.$router.push(
        `/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/tasks/new`
        );
      },
      editTask(event) {  
        console.log("This is the edit task event: " + event)
        let eventObj = event     
        this.selectedEventId = eventObj.event.taskId;
        this.calendarTask = eventObj.event.task 
        this.$router.push(`/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/tasks/${this.selectedEventId}`) 
      },
     detailsBtn() {  
      //  Opens task edit form in context-menu
        let taskId = this.selectedEvent.task.id  
        this.$router.push(`/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/tasks/${taskId}`) 
     },
      deleteTask() {
      let task = this.selectedEvent.task             
      this.$confirm(`Are you sure you want to delete ${task.text}?`, 'Confirm Delete', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.taskDeleted(task).then((value) => {
            if (value === 'Success') {
              this.$message({
                message: `${task.text} was deleted successfully.`,
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
        if (this.getShowAllEventsToggle == true) {
        
          this.reRenderCalendar()
        } else if (this.getShowAllEventsToggle == false){
           this.events = [];
         
           this.reRenderCalendar()
        }
      },
      updateRange ({ start, end }) {    
        // Mapping over Task Names, Start Dates, and Due Dates 
      if (this.filteredCalendar !== undefined && this.filteredCalendar.length > 0) {
        this.taskData = this.filteredCalendar.map(task => task)  
        this.taskNames = this.filteredCalendar.map(task => task.text)    
        this.taskIds = this.filteredCalendar.map(task => task.id)      
        this.taskStartDates = this.filteredCalendar.map(task => task.startDate)     
        this.taskEndDates = this.filteredCalendar.map(task => task.dueDate) 
        this.categories = this.filteredCalendar.map(task => task.taskType) 
        this.onWatch = this.filteredCalendar.map(task => task.watched)   
        this.overdue = this.filteredCalendar.map(task => task.isOverdue) 
        this.star = this.filteredCalendar.map(task => task.important)
        this.ongoing = this.filteredCalendar.map(task => task.ongoing)
        this.percentage = this.filteredCalendar.map(task => task.progress)
        this.onhold = this.filteredCalendar.map(task => task.onHold)
        this.draft = this.filteredCalendar.map(task => task.draft)
           
        const events = []
        const min = new Date(`${start.date}T00:00:00`)
        const max = new Date(`${end.date}T23:59:59`)
        const days = (max.getTime() - min.getTime()) / 86400000   
        // For loop to determine length of Calendar Tasks 
        for (let i = 0; i < this.filteredCalendar.length; i++) {

            if(this.taskData[i].ongoing && this.taskEndDates[i] == null || this.taskEndDates[i] == undefined ) {        
            this.taskEndDates[i] = '2099-01-01'
            }
            if(this.taskData[i].ongoing) {
            this.taskNames[i] = this.taskNames[i] + " (Ongoing)"          
            }
            events.push({            
            name: this.taskNames[i],
            start: this.taskStartDates[i],
            end: this.taskEndDates[i],         
            taskId: this.taskIds[i],
            task: this.taskData[i] ,
            category: this.categories[i],  
            watch: this.onWatch[i],
            pastDue: this.overdue[i], 
            progess: this.percentage[i],
            // color: this.colors.defaultColor,  
            hasStar: this.star[i], 
            isOngoing: this.ongoing[i], 
            isDraft: this.draft[i],
            isOnHold: this.onhold[i]           
          })
        }
          // This is the main Events array pushed into Calendar
        //  this.events = events

         if (this.getShowAllEventsToggle == false && !(this.tasksQuery.length > 0) ) {
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
        'getAdvancedFilterOptions',
        'filterDataForAdvancedFilter', 
        'getCalendarViewFilterOptions',
        'getTaskIssueUserFilter',
        'calendarViewFilter',  
        'getCalendarViewFilter',
        'getLastFocusFilter',
        'getShowAllEventsToggle',
        'getShowAllToggle',      
        'getAdvancedFilter',     
        'getTaskIssueProgressStatusOptions',
        'getTaskIssueProgressStatusFilter',
        'taskIssueProgressFilter',
        'getTaskIssueOverdueOptions',
        'taskIssueOverdueFilter',
        'noteDateFilter',
        'taskIssueDueDateFilter',
        'taskTypeFilter', 
        'myActionsFilter',
        'onWatchFilter',
        "currentTasks",
        "contentLoaded",
        'taskStageFilter',
        "currentIssues",
        "viewPermit",
        "currentProject",
        'taskUserFilter',
        'taskTypes',    
     
     
       ]),
       _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      filteredCalendar() {
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

      
          // //TODO: For performance, send the whole tasks array instead of one by one
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
          if ( _.map(this.getAdvancedFilter, 'id') == 'draft' || _.map(this.getAdvancedFilter, 'id') == 'onHold') {   
        
        return tasks
        
       } else  {        
        tasks  = tasks.filter(t => t.draft == false && t.onHold == false)
        return tasks     
       }       
    }, 
     C_calendarTaskFilter: {           
        get() {
          this.reRenderCalendar()
          return this.getAdvancedFilter
        },
        set(value) {
          this.setAdvancedFilter(value)
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
        if (this.$route.params.projectId && this.currentFacility.tasks.length > 0) {
          this.reRenderCalendar()
          this.currentFacility = this.facilities.find(
            (facility) => facility.facilityId == this.$route.params.projectId
          );
        }
      },
    },
   filteredCalendar: {
      handler(value) {
        if (value) {
          this.reRenderCalendar()        
        } if (value && this.filteredCalendar.length == 0)   {
          this.events = []
        }           
      },
    },
    tasksQuery: {
      handler() {
       if(this.tasksQuery.length > 0) {
         this.reRenderCalendar()
       } else if (!(this.tasksQuery.length > 0) && this.checkbox == false) {
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
.addTaskBtn, .exportBtns, .showAll {
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
/deep/.v-list-item {
  min-height: 30px;
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
 .point{
   cursor: pointer;
 }
 .point:hover {
   background-color: rgba(214, 219, 223, .45);
 }
</style> 