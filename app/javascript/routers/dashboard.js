import ProjectMapView from './../components/dashboard/map_view'
import GanttChartView from './../components/dashboard/gantt_view'
import WatchView from './../components/dashboard/watch_view'
import MembersView from './../components/dashboard/members_view'
import FacilityView from './../components/dashboard/facility_view'
import Sheets from './../components/dashboard/sheets'
import KanbanView from './../components/dashboard/kanban_view'

export default new VueRouter({
  routes: [
    {
      name: "ProjectMapView",
      path: "/programs/:programId/",
      component: ProjectMapView,
    },
    {
      name: "ProjectMapView",
      path: "/programs/:programId/map",
      component: ProjectMapView,
    },
    {
      name: "ProjectMapView",
      path: "/programs/:programId/map",
      component: ProjectMapView,
    },
    {
      name: "ProjectGanttChart",
      path: "/programs/:programId/gantt_chart",
      component: GanttChartView,
    },
    {
      name: "ProjectWatchView",
      path: "/programs/:programId/watch_view",
      component: WatchView,
    },
    {
      name: "TeamMembersView",
      path: "/programs/:programId/member_list",
      component: MembersView,
    },
    {
      name: "FacilityManagerView",
      path: "/programs/:programId/facility_manager",
      component: FacilityView,
    },
    {
      name: "ProjectSheets",
      path: "/programs/:programId/sheet",
      component: Sheets,
    },
    {
      name: "ProjectKanbanView",
      path: "/programs/:programId/kanban",
      component: KanbanView,
    },
  ],
  hashbang: false,
  mode: "history",
  base: "/",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
