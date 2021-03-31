<template>
  <div>
    <tabsbar></tabsbar>
    <filter-sidebar v-if="contentLoaded"></filter-sidebar>
    <state-facility-sidebar v-if="isFacilityManagerView || isSheetsView || isKanbanView" ></state-facility-sidebar>
    <router-view></router-view>
  </div>
</template>

<script>
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import Tabsbar from './../shared/tabsbar'
  import FilterSidebar from './../shared/filter_sidebar'
  import StateFacilitySidebar from './../shared/state_facility_sidebar'
  import Facility_form from './facilities/facility_form.vue'

  export default {
    name: 'Dashboard',
    components: {
      Tabsbar,
      FilterSidebar,
      StateFacilitySidebar
    },
    mounted() {
      let id = this.$route.params.programId
      this.fetchDashboardData({id})
      // Prevent right-click context-menu from appearing accross whole app
      window.oncontextmenu = (e) => {
        if (e.target.nodeName !== "INPUT" && e.target.nodeName !== "TEXTAREA") {
          e.preventDefault()
        }   
      }
    },
    methods: {
      ...mapActions([
        'fetchDashboardData'
      ]),
      ...mapMutations([
        'setUnfilteredFacilities'
      ])
    },
    computed: {
      ...mapGetters([
        'contentLoaded',
        'facilities',
        'getUnfilteredFacilities'
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
    },
    updated() {
      if (this.contentLoaded && this.getUnfilteredFacilities.length === 0) {
        this.setUnfilteredFacilities(this.facilities)
      }
    }
  }
</script>
