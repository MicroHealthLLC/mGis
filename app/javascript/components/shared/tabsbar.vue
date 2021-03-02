<template>
  <div id="tabbar" data-cy="main_tab">
    <!-- <router-link v-if="permitted('facility_manager_view')" :to="facilityManagerView" tag="div">
      <div class="badge" :class="{'active': isFacilityManagerView}" data-cy="facility_manager_tab">Project Manager</div>
    </router-link> -->
    <router-link v-if="permitted('map_view')" :to="mapView" tag="div">
      <div class="badge" :class="{'active': isMapView}" data-cy="map_tab">Map</div>
    </router-link>
     <router-link v-if="permitted('sheets_view')" :to="sheetsView" tag="div">
      <div class="badge" :class="{'active': isSheetsView}" data-cy="sheets_tab">Sheet</div>
    </router-link>
    <router-link v-if="permitted('kanban_view')" :to="kanbanView" tag="div">
      <div class="badge" :class="{'active': isKanbanView}" data-cy="kanban_tab">Kanban</div>
    </router-link>
    <router-link v-if="permitted('gantt_view')" :to="ganttView" tag="div">
      <div class="badge" :class="{'active': isGanttView}" data-cy="gantt_tab">Gantt</div>
    </router-link>
    <!-- <router-link v-if="permitted('watch_view')" :to="watchView" tag="div">
      <div class="badge" :class="{'active': isWatchView}" data-cy="on_watch_tab">On Watch</div>
    </router-link> -->

    <div v-if="permitted('issues')" class="badge disabled">Mindmap (Coming Soon)</div>
    <div v-if="permitted('documents')" class="badge disabled">Documents (Coming Soon)</div>
    <router-link v-if="permitted('members')" :to="membersView" tag="div">
      <div class="badge" :class="{'active': isMembersView}" data-cy="team_tab">Team</div>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'Tabsbar',
    computed: {
      isSheetsView() {
        return this.$route.name === 'ProjectSheets'
      },
      isMapView() {
        return this.$route.name === 'ProjectMapView'
      },
      isGanttView() {
        return this.$route.name === 'ProjectGanttChart'
      },
      // isWatchView() {
      //   return this.$route.name === 'ProjectWatchView'
      isKanbanView() {
        return this.$route.name === 'ProjectKanbanView'
      },
      isMembersView() {
        return this.$route.name === 'TeamMembersView'
      },
      // isFacilityManagerView() {
      //   return this.$route.name === 'FacilityManagerView'
      // },
      sheetsView() {
        return `/projects/${this.$route.params.projectId}/sheet`
      },
      mapView() {
        return `/projects/${this.$route.params.projectId}/`
      },
      ganttView() {
        return `/projects/${this.$route.params.projectId}/gantt_chart`
      },
      // watchView() {
      //   return `/projects/${this.$route.params.projectId}/watch_view`
      // },
      kanbanView() {
        return `/projects/${this.$route.params.projectId}/kanban`
      },
      membersView() {
        return `/projects/${this.$route.params.projectId}/member_list`
      },
      // facilityManagerView() {
      //   return `/projects/${this.$route.params.projectId}/facility_manager`
      // },
      permitted() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions[salut]['read']
      }
    },
    watch: {
      $route (to, from) {
        this.$store && this.$store.commit('nullifyTasksForManager')
      }
    }
  }
</script>

<style scoped lang="scss">
  #tabbar {
    padding: 4px 70px;
    z-index: 100 !important;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.02), 0 2px 5px 0 rgba(0,0,0,0.03);
    .badge {
      border-radius: 0.15rem;
      cursor: pointer;
      padding: 5px;
      margin: 2px 10px;
      transition: auto;
      &.active {
        color: #fff;
        font-weight: 200;
        padding: 5px;
        background-color: #17a2b8;
      }
      &.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        border: 0 !important;
        padding: 5px !important;
      }
      &:hover {
        padding: 4px;
        border: 1px solid #17a2b8;
      }
    }
  }
</style>
