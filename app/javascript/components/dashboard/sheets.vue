<template>
  <div class="row">
    <div class="col-md-2 facility-groups-tab pl-0">
      <FacilitySidebar
        :current-facility-group="currentFacilityGroup"
        :expanded="expanded"
        :current-facility="currentFacility"
        @on-expand-facility-group="expandFacilityGroup"
        @on-expand-facility="showFacility"
      ></FacilitySidebar>
    </div>
    <div
      class="col-md-10 facility-show-tab px-0"
      data-cy="sheets_view"
      style="background-color: solid #ededed 15px"
      v-if="isSheetsView"
      v-loading="!contentLoaded"
      element-loading-text="Fetching your data. Please wait..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <div v-show="isSheetsView && !getRiskFormOpen" class="mt-3 px-3">
        <FacilitySheets
          v-if="C_showFacilityTab"
          from="manager_view"
          :facility="currentFacility"
          :facility-group="currentFacilityGroup"
        ></FacilitySheets>
        <FacilityRollup v-else></FacilityRollup>
      </div>

      <div
        v-if="
          (isSheetsView && getRiskFormOpen) ||
            managerView.task ||
            managerView.issue ||
            managerView.risk ||
            managerView.note
        "
      >
        <div class="w-100 action-form-overlay">
          <risk-form
            v-if="getRiskFormOpen"
            :facility="currentFacility"
            :risk="getSelectedRisk"
            @on-close-form="onCloseForm"
            @risk-created="handleNewRisk"
            @risk-updated="handleNewRisk"
            class="form-inside-modal"
          ></risk-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import FacilityRollup from "../dashboard/facilities/facility_rollup";
import FacilitySidebar from "../dashboard/facilities/facility_sidebar";
import FacilitySheets from "../dashboard/facilities/facility_sheets"
import RiskForm from "../dashboard/risks/risk_form"

export default {
  name: "ProjectSheets",
  components: {
    FacilityRollup,
    FacilitySidebar,
    FacilitySheets,
    RiskForm
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
  computed: {
    ...mapGetters(["contentLoaded", "facilityGroupFacilities", "getRiskFormOpen", "getSelectedRisk", "managerView"]),
    isSheetsView() {
      return this.$route.name === "ProjectSheets";
    },
    C_showFacilityTab() {
      return (
        !_.isEmpty(this.currentFacility) &&
        !_.isEmpty(this.currentFacilityGroup)
      );
    },
  },
  methods: {
    expandFacilityGroup(group) {
      if (group.id == this.expanded.id) {
        this.expanded.id = "";
        //this.currentFacilityGroup = {}
      } else {
        this.expanded.id = group.id;
        this.currentFacilityGroup = group;
        this.currentFacility = this.facilityGroupFacilities(group)[0] || {};
      }
      //this.currentFacility = {}
    },
    showFacility(facility) {
      this.currentFacility = facility;
    },
  },
  mounted() {},
};
</script>

<style lang="scss"></style>
