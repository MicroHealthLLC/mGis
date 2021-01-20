<template>
  <div>
    <tabsbar></tabsbar>
    <filter-sidebar v-if="contentLoaded"></filter-sidebar>   
    <state-facility-sidebar v-if="isFacilityManagerView || isSheetsView || isKanbanView" ></state-facility-sidebar>    
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'
  import Tabsbar from './components/shared/tabsbar'
  import FilterSidebar from './components/shared/filter_sidebar'
  import StateFacilitySidebar from './components/shared/state_facility_sidebar'
  import Facility_form from './components/dashboard/facilities/facility_form.vue'

  export default {
    name: 'Dashboard',
    components: {
      Tabsbar,
      FilterSidebar,
      StateFacilitySidebar
    },
    mounted() {
      let id = this.$route.params.projectId
      this.fetchDashboardData({id})
    },
    methods: {
      ...mapActions([
        'fetchDashboardData'
      ])
    },
    computed: {
      ...mapGetters([
        'contentLoaded'
      ]),
      isSheetsView() {
        return this.$route.name === 'ProjectSheets'
      },
      isFacilityManagerView() {
        return this.$route.name === 'FacilityManagerView'
      },
      isKanbanView() {
        return this.$route.name === 'ProjectKanbanView'
      },
    }
  }
</script>
