import ProjectMapView from './../components/dashboard/map_view'
import GanttChartView from './../components/dashboard/gantt_view'
import WatchView from './../components/dashboard/watch_view'
import MembersView from './../components/dashboard/members_view'
import FacilityView from './../components/dashboard/facility_view'
import Sheets from './../components/dashboard/sheets'
import KanbanView from './../components/dashboard/kanban_view'
import Test from './../components/Test'

export default new VueRouter({
  routes: [
    {
      name : 'TestRoute',
      path: '/test',
      component: Test
    },
    {
      name: 'ProjectMapView',
      path: '/projects/:projectId/',
      component: ProjectMapView
    },
    {
      name: 'ProjectMapView',
      path: '/projects/:projectId/map',
      component: ProjectMapView
    },
    {
      name: 'ProjectGanttChart',
      path: '/projects/:projectId/gantt_chart',
      component: GanttChartView
    },
    {
      name: 'ProjectWatchView',
      path: '/projects/:projectId/watch_view',
      component: WatchView
    },
    {
      name: 'TeamMembersView',
      path: '/projects/:projectId/member_list',
      component: MembersView
    },
    {
      name: 'FacilityManagerView',
      path: '/projects/:projectId/facility_manager',
      component: FacilityView
    },
    {
      name: 'ProjectSheets',
      path: '/projects/:projectId/sheet',
      component: Sheets
    },
    {
      name: 'ProjectKanbanView',
      path: '/projects/:projectId/kanban',
      component: KanbanView
    }
  ],
  hashbang: false,
  mode: 'history',
  base: '/',
  scrollBehavior () {
    return {x: 0, y: 0}
  }
})
