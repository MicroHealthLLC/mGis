import GanttChartView from "./../components/dashboard/gantt_view";
import MembersView from "./../components/dashboard/members_view";
import LessonsIndex from "./../components/views/lessons/LessonsIndex";
import LessonForm from "./../components/views/lessons/LessonForm";

// Map Routes Components
import MapView from "./../components/views/map/MapView";
import MapOverview from "./../components/views/map/MapOverview";
import MapTasks from "./../components/views/map/MapTasks";
import MapTaskForm from "./../components/views/map/MapTaskForm";
import MapIssues from "./../components/views/map/MapIssues";
import MapIssueForm from "./../components/views/map/MapIssueForm";
import MapRisks from "./../components/views/map/MapRisks";
import MapRiskForm from "./../components/views/map/MapRiskForm";
import MapNotes from "./../components/views/map/MapNotes";
import MapNoteForm from "./../components/views/map/MapNoteForm";
//Sheet Routes Components
import SheetView from "./../components/views/sheet/SheetView";
import ProjectRollup from "./../components/shared/ProjectRollup";
import SheetOverview from "./../components/views/sheet/SheetOverview";
import SheetTasks from "./../components/views/sheet/SheetTasks";
import SheetTaskForm from "./../components/views/sheet/SheetTaskForm";
import SheetIssues from "./../components/views/sheet/SheetIssues";
import SheetIssueForm from "./../components/views/sheet/SheetIssueForm";
import SheetRisks from "./../components/views/sheet/SheetRisks";
import SheetRiskForm from "./../components/views/sheet/SheetRiskForm";
import SheetNotes from "./../components/views/sheet/SheetNotes";
import SheetNoteForm from "./../components/views/sheet/SheetNoteForm";
// Kanban Routes Components
import KanbanView from "./../components/views/kanban/KanbanView";
import KanbanDefault from "./../components/views/kanban/KanbanDefault";
import KanbanTasks from "./../components/views/kanban/KanbanTasks";
import KanbanTaskForm from "./../components/views/kanban/KanbanTaskForm";
import KanbanIssues from "./../components/views/kanban/KanbanIssues";
import KanbanIssueForm from "./../components/views/kanban/KanbanIssueForm";
import KanbanRisks from "./../components/views/kanban/KanbanRisks";
import KanbanRiskForm from "./../components/views/kanban/KanbanRiskForm";
//Calendar Routes Components
// import CalendarView from "./../components/views/calendar/CalendarView";
// import CalendarRollup from "./../components/shared/ProjectRollup";
// import CalendarOverview from "./../components/views/calendar/CalendarOverview";
// import CalendarTasks from "./../components/views/calendar/CalendarTasks";
// import CalendarTaskForm from "./../components/views/calendar/CalendarTaskForm";
// import CalendarIssues from "./../components/views/calendar/CalendarIssues";
// import CalendarIssueForm from "./../components/views/calendar/CalendarIssueForm";
// import CalendarRisks from "./../components/views/calendar/CalendarRisks";
// import CalendarRiskForm from "./../components/views/calendar/CalendarRiskForm";
// import CalendarNotes from "./../components/views/calendar/CalendarNotes";
// import CalendarNoteForm from "./../components/views/calendar/CalendarNoteForm";

export default new VueRouter({
  routes: [
    {
      name: "MapView",
      path: "/programs/:programId/",
      component: MapView,
    },
    {
      name: "MapView",
      path: "/programs/:programId/map",
      component: MapView,
      children: [
        {
          name: "MapRollup",
          path: "",
          component: ProjectRollup,
        },
        {
          name: "MapOverview",
          path: "projects/:projectId",
          component: MapOverview,
        },
        {
          name: "MapTasks",
          path: "projects/:projectId/tasks",
          component: MapTasks,
        },
        {
          name: "MapTaskForm",
          path: "projects/:projectId/tasks/:taskId",
          component: MapTaskForm,
        },
        {
          name: "MapIssues",
          path: "projects/:projectId/issues",
          component: MapIssues,
        },
        {
          name: "MapIssueForm",
          path: "projects/:projectId/issues/:issueId",
          component: MapIssueForm,
        },
        {
          name: "MapRisks",
          path: "projects/:projectId/risks",
          component: MapRisks,
        },
        {
          name: "MapRiskForm",
          path: "projects/:projectId/risks/:riskId",
          component: MapRiskForm,
        },
        {
          name: "MapNotes",
          path: "projects/:projectId/notes",
          component: MapNotes,
        },
        {
          name: "MapNoteForm",
          path: "projects/:projectId/notes/:noteId",
          component: MapNoteForm,
        },
      ],
    },
    {
      name: "GanttChartView",
      path: "/programs/:programId/gantt_chart",
      component: GanttChartView,
    },
    {
      name: "TeamMembersView",
      path: "/programs/:programId/member_list",
      component: MembersView,
    },
    {
      name: "LessonsIndex",
      path: "/programs/:programId/lessons",
      component: LessonsIndex,
    },
    {
      name: "LessonForm",
      path: "/programs/:programId/lessons/new",
      component: LessonForm,
    },
    {
      name: "LessonForm",
      path: "/programs/:programId/lessons/:lessonId",
      component: LessonForm,
    },
    {
      name: "SheetView",
      path: "/programs/:programId/sheet",
      component: SheetView,
      children: [
        {
          name: "SheetRollup",
          path: "",
          component: ProjectRollup,
        },
        {
          name: "SheetOverview",
          path: "projects/:projectId",
          component: SheetOverview,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              confirm("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["overview"].hide ){
              next()  
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetTasks",
          path: "projects/:projectId/tasks",
          component: SheetTasks,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["tasks"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetTaskForm",
          path: "projects/:projectId/tasks/:taskId",
          component: SheetTaskForm,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["tasks"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetIssues",
          path: "projects/:projectId/issues",
          component: SheetIssues,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["issues"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetIssueForm",
          path: "projects/:projectId/issues/:issueId",
          component: SheetIssueForm,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["issues"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetRisks",
          path: "projects/:projectId/risks",
          component: SheetRisks,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["risks"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetRiskForm",
          path: "projects/:projectId/risks/:riskId",
          component: SheetRiskForm,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["risks"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["notes"].hide ){
              next({ name: 'SheetNotes', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetNotes",
          path: "projects/:projectId/notes",
          component: SheetNotes,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["notes"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });

            }
          }
        },
        {
          name: "SheetNoteForm",
          path: "projects/:projectId/notes/:noteId",
          component: SheetNoteForm,
          beforeEnter: (to, from, next) => {
            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }
            if( fPrivilege["overview"].hide && fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide && fPrivilege["notes"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            if( !fPrivilege["notes"].hide ){
              next()  
            
            }else if( !fPrivilege["overview"].hide ){
              next({ name: 'SheetOverview', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'SheetTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'SheetIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'SheetRisks', params: { programId: programId, projectId: projectId } });

            }
          }
        },
      ],
    },
    // {
    //   name: "CalendarView",
    //   path: "/programs/:programId/calendar",
    //   component: CalendarView,
    //   children: [
    //     {
    //       name: "CalendarRollup",
    //       path: "",
    //       component: CalendarRollup,
    //     },
    //     {
    //       name: "CalendarOverview",
    //       path: "projects/:projectId",
    //       component: CalendarOverview,
    //     },
    //     {
    //       name: "CalendarTasks",
    //       path: "projects/:projectId/tasks",
    //       component: CalendarTasks,
    //     },
    //     {
    //       name: "CalendarTaskForm",
    //       path: "projects/:projectId/tasks/:taskId",
    //       component: CalendarTaskForm,
    //     },
    //     {
    //       name: "CalendarIssues",
    //       path: "projects/:projectId/issues",
    //       component: CalendarIssues,
    //     },
    //     {
    //       name: "CalendarIssueForm",
    //       path: "projects/:projectId/issues/:issueId",
    //       component: CalendarIssueForm,
    //     },
    //     {
    //       name: "CalendarRisks",
    //       path: "projects/:projectId/risks",
    //       component: CalendarRisks,
    //     },
    //     {
    //       name: "CalendarRiskForm",
    //       path: "projects/:projectId/risks/:riskId",
    //       component: CalendarRiskForm,
    //     },
    //     {
    //       name: "CalendarNotes",
    //       path: "projects/:projectId/notes",
    //       component: CalendarNotes,
    //     },
    //     {
    //       name: "CalendarNoteForm",
    //       path: "projects/:projectId/notes/:noteId",
    //       component: CalendarNoteForm,
    //     },
    //   ],
    // },
    {
      name: "KanbanView",
      path: "/programs/:programId/kanban",
      component: KanbanView,
      children: [
        {
          name: "KanbanDefault",
          path: "",
          component: KanbanDefault,
        },
        {
          name: "KanbanProjectSelected",
          path: "projects/:projectId",
          component: KanbanDefault,
        },
        {
          name: "KanbanTasks",
          path: "projects/:projectId/tasks",
          component: KanbanTasks,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            
            if( !fPrivilege["tasks"].hide ){
              next();
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'KanbanIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'KanbanRisks', params: { programId: programId, projectId: projectId } });
            
            }
          }
        },
        {
          name: "KanbanTaskForm",
          path: "projects/:projectId/tasks/:taskId",
          component: KanbanTaskForm,
          props: true,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            
            if( !fPrivilege["tasks"].hide ){
              next();
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'KanbanIssues', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'KanbanRisks', params: { programId: programId, projectId: projectId } });
            
            }
          }
        },
        {
          name: "KanbanIssues",
          path: "projects/:projectId/issues",
          component: KanbanIssues,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            
            if( !fPrivilege["issues"].hide ){
              next();
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'KanbanTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'KanbanRisks', params: { programId: programId, projectId: projectId } });
            
            }
          }
        },
        {
          name: "KanbanIssueForm",
          path: "projects/:projectId/issues/:issueId",
          component: KanbanIssueForm,
          props: true,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            
            if( !fPrivilege["issues"].hide ){
              next();
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'KanbanTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["risks"].hide ){
              next({ name: 'KanbanRisks', params: { programId: programId, projectId: projectId } });
            
            }
          }
        },
        {
          name: "KanbanRisks",
          path: "projects/:projectId/risks",
          component: KanbanRisks,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            
            if( !fPrivilege["risks"].hide ){
              next();
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'KanbanTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'KanbanIssues', params: { programId: programId, projectId: projectId } });
            
            }
          }
        },
        {
          name: "KanbanRiskForm",
          path: "projects/:projectId/risks/:riskId",
          component: KanbanRiskForm,
          props: true,
          beforeEnter: (to, from, next) => {

            var programId = to.params.programId;
            var projectId = to.params.projectId
            var fPrivilege = _.filter(Vue.prototype.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
            if(!fPrivilege){
              next()
              return
            }

            if( fPrivilege["tasks"].hide && fPrivilege["issues"].hide && fPrivilege["risks"].hide){
              alert("You don't have access to see any tabs. Please contact administrator")
            }
            
            if( !fPrivilege["risks"].hide ){
              next();
            
            }else if( !fPrivilege["tasks"].hide ){
              next({ name: 'KanbanTasks', params: { programId: programId, projectId: projectId } });
            
            }else if( !fPrivilege["issues"].hide ){
              next({ name: 'KanbanIssues', params: { programId: programId, projectId: projectId } });
            
            }
          }
        },
      ],
    },
  ],
  hashbang: false,
  mode: "history",
  base: "/",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
