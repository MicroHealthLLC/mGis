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
            $route.name !== 'SheetRollup' &&
              $route.name !== 'SheetTaskForm' &&
              $route.name !== 'SheetIssueForm' &&
              $route.name !== 'SheetRiskForm' &&
              $route.name !== 'SheetNoteForm'
          "
          class="d-flex align-items-center my-2"
        >
          <span class="fbody-icon"><i class="fas fa-building"></i></span>
          <h5 class="f-head mb-0">
            {{ currentFacility.facilityName || "Loading..." }}
          </h5>
        </div>
        <div class="pr-3">
          <ProjectTabs
            v-if="
              $route.name !== 'SheetRollup' &&
                $route.name !== 'SheetTaskForm' &&
                $route.name !== 'SheetIssueForm' &&
                $route.name !== 'SheetRiskForm' &&
                $route.name !== 'SheetNoteForm'
            "
          />
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
import ProjectTabs from "../../shared/ProjectTabs";

export default {
  name: "SheetView",
  components: {
    ProjectSidebar,
    ProjectTabs,
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
    changeTab(tab) {
      console.log(tab);
      this.$router.push(tab.path);
    },
  },
  computed: {
    ...mapGetters([
      "contentLoaded",
      "currentProject",
      "facilities",
      "facilityGroupFacilities",
      "facilityGroups",
      "getPreviousRoute",
      "getUnfilteredFacilities",
    ]),
  },
  mounted() {
    // Display notification when leaving map view to another page and conditions met
    if (
      this.getPreviousRoute.includes("Map") &&
      this.facilities.length !== this.getUnfilteredFacilities.length
    ) {
      this.$notify.info({
        title: "Filter Set",
        message:
          "A filter was set based on the map boundary. Reset the Map Boundary Filter in the Advanced Filters tab.",
        offset: 150,
        position: "bottom-left",
      });
    }
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
            (facility) => facility.id == this.$route.params.projectId
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
    "$route.path": {
      handler() {
        if (this.$route.params.projectId) {
          this.currentFacility = this.facilities.find(
            (facility) => facility.id == this.$route.params.projectId
          );
        }
      },
    },
  },
};
</script>

<style scoped>
.fa-building {
  font-size: large !important;
  color: #383838 !important;
}
.right-panel {
  height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
