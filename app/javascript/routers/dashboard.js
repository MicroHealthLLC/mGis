import MapView from './../views/MapView'
import GanttView from './../views/GanttView'
import WatchView from './../views/WatchView'
import MembersView from './../views/MembersView'
import FacilityManagerView from './../views/FacilityManagerView'
import SheetsView from './../views/SheetsView'
import KanbanView from './../views/KanbanView'

export default new VueRouter({
  routes: [
    {
      name: 'MapView',
      path: '/projects/:projectId',
      component: MapView
    },
    {
      name: 'GanttChart',
      path: '/projects/:projectId/gantt_chart',
      component: GanttView
    },
    {
      name: 'WatchView',
      path: '/projects/:projectId/watch_view',
      component: WatchView
    },
    {
      name: 'MembersView',
      path: '/projects/:projectId/member_list',
      component: MembersView
    },
    {
      name: 'FacilityManagerView',
      path: '/projects/:projectId/facility_manager',
      component: FacilityManagerView
    },
    {
      name: 'SheetsView',
      path: '/projects/:projectId/sheets',
      component: SheetsView
    },
    {
      name: 'KanbanView',
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
