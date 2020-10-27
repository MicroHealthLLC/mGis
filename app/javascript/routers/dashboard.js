import ProjectMapView from './../components/dashboard/map_view'
import GanttChartView from './../components/dashboard/gantt_view'
import WatchView from './../components/dashboard/watch_view'
import MembersView from './../components/dashboard/members_view'

export default new VueRouter({
  routes: [
    {
      name: 'ProjectMapView',
      path: '/projects/:projectId',
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
    }
  ],
  hashbang: false,
  mode: 'history',
  base: '/',
  scrollBehavior () {
    return {x: 0, y: 0}
  }
})
