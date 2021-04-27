<template>
  <div
    v-loading="!contentLoaded"
    element-loading-text="Fetching your data. Please wait..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="row"
  >
    <div class="col-md-2">
      <ProjectSidebar
        :current-facility-group="currentFacilityGroup"
        :expanded="expanded"
        :current-facility="currentFacility"
        @on-expand-facility-group="expandFacilityGroup"
        @on-expand-facility="showFacility"
      />
    </div>
    <div class="col-md-10">
      <div class="right-panel">
        <div
          v-if="
            $route.name === 'KanbanProjectSelected' ||
              $route.name === 'KanbanTasks' ||
              $route.name === 'KanbanIssues' ||
              $route.name === 'KanbanRisks'
          "
          class="tabs mt-2 mr-3"
        >
          <router-link
            :to="
              `/programs/${$route.params.programId}/kanban/projects/${$route.params.projectId}/tasks`
            "
            class="tab mr-2"
            :class="{ active: $route.path.includes('tasks') }"
            data-cy="task_link"
            >Tasks</router-link
          >
          <router-link
            :to="
              `/programs/${$route.params.programId}/kanban/projects/${$route.params.projectId}/issues`
            "
            class="tab mr-2"
            :class="{ active: $route.path.includes('issues') }"
            data-cy="issue_link"
            >Issues</router-link
          >
          <router-link
            :to="
              `/programs/${$route.params.programId}/kanban/projects/${$route.params.projectId}/risks`
            "
            class="tab"
            :class="{ active: $route.path.includes('risks') }"
            data-cy="risk_link"
            >Risks</router-link
          >
        </div>
        <div class="pr-3">
          <router-view
            :key="$route.path"
            :facility="currentFacility"
            :facilityGroup="currentFacilityGroup"
          ></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ProjectSidebar from "../../shared/ProjectSidebar";

export default {
  name: "KanbanView",
  components: {
    ProjectSidebar,
  },
  data() {
    return {
      currentFacility: {},
      currentFacilityGroup: {},
      expanded: {
        id: "",
      },
    };
  },
  methods: {
    expandFacilityGroup(group) {
      if (group.id == this.expanded.id) {
        this.expanded.id = "";
      } else {
        this.expanded.id = group.id;
        this.currentFacilityGroup = group;
        // this.currentFacility = this.facilityGroupFacilities(group)[0] || {};
      }
    },
    showFacility(facility) {
      this.currentFacility = facility;
    },
  },
  computed: {
    ...mapGetters([
      "contentLoaded",
      "facilities",
      "facilityGroupFacilities",
      "facilityGroups",
    ]),
  },
  beforeMount() {
    if (this.contentLoaded && this.$route.params.projectId) {
      this.currentFacility = this.facilities.find(
        (facility) => facility.facilityId == this.$route.params.projectId
      );
    }
  },
  watch: {
    contentLoaded: {
      handler() {
        if (this.$route.params.projectId) {
          this.currentFacility = this.facilities.find(
            (facility) => facility.facilityId == this.$route.params.projectId
          );
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
};
</script>

<style scoped lang="scss">
.fa-building {
  font-size: large !important;
  color: #383838 !important;
}
.tabs {
  background-color: #ededed;
  border-top: solid 0.3px #ededed;
  padding: 7px 10px;
  box-shadow: 0 2.5px 2.5px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);
  .tab {
    cursor: pointer;
    padding: 7px 10px;
    border-radius: 0.1rem;
    font-weight: 500;
    letter-spacing: 1;
    transition: auto;
    font-size: 75%;
  }
  .active {
    color: #fff !important;
    background-color: #383838 !important;
  }
}
a {
  color: unset;
  text-decoration: unset;
}
.right-panel {
  height: calc(100vh - 100px);
  overflow-y: auto;
}
</style>
