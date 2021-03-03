<template>
  <div id="_wrapper" data-cy="map_view" class="p-0">
    <div class="container-fluid">    
        <div id="map-wrap" class="row">
          <div class="col-md-12 px-0">
          <div class="regions-bar">
            <facility-group-bar
              v-if="contentLoaded"
              :facility-groups="filteredFacilityGroups"
              :facilities="filteredFacilities('active')"
              :project="currentProject"
              @goto-facility-group="gotoFacilityGroup"
            ></facility-group-bar>
          </div>
          <GmapMap
            ref="googlemap"
            :center="center"
            :zoom="zoom"
            map-type-id="terrain"
            style="width: 100%; height: 100%"
            :control-size="5"
            :options="{
              rotateControl: true,
              minZoom: 2,
              maxZoom: 15,
              zoomControl: true,
              mapTypeControl: false,
              scaleControl: true,
              streetViewControl: false,
              fullscreenControl: true,
              restriction: {
                latLngBounds: {
                  north: 85,
                  south: -85,
                  west: -179.5,
                  east: 179.5,
                },
                strictBounds: false,
              },
            }"
            @click="resetView"
            @bounds_changed="captureMapBounds($event)"
          >
            <GmapCluster
              :averageCenter="true"
              :enableRetinaIcons="true"
              :ignoreHidden="true"
              :zoomOnClick="true"
            >
              <GmapMarker
                ref="marker"
                :key="`${facility.id}__${index}`"
                :animation="4"
                v-for="(
                  facility, index
                ) in filterFacilitiesWithActiveFacilityGroups"
                :position="getLatLngForFacility(facility)"
                @click="
                  showFacility(facility);
                  toggleTooltip(facility, `${facility.id}__${index}`);
                "
                @mouseover="
                  tooltipMouseOver(facility, `${facility.id}__${index}`)
                "
                @mouseout="tooltipMouseOut"
                :icon="{ url: getStatusIconLink(facility) }"
              />
            </GmapCluster>
            <GmapInfoWindow
              :options="tooltip.options"
              :position="tooltip.position"
              :opened="tooltip.opened"
              @closeclick="tooltip.opened = false"
            >
              {{ tooltip.content }}
            </GmapInfoWindow>
          </GmapMap>
          
          
         
          
          </div>
        </div>
           <div class="container-fluid project-sum pr-0" id="rollup-sidebar">
          <div>
            <div>
              <FacilityRollup id="fac-rollup" v-show="!openSidebar"  v-if="!currentFacility || !currentFacility.id"></FacilityRollup>

              <div class="knocker_side" >
                <!-- <button
                  v-if="currentFacility && currentFacility.id"
                  class="knocker btn btn-sm text-light p-1"
                  @click="toggleOpenSideBar"
                >
                  <small
                    ><span class="pr-1"><i class="fas fa-building"></i></span
                    >FACILITY SUMMARY</small
                  >
                </button> -->
                <div class="knocker_side">
                  <!-- <button
                    v-if="currentFacility && currentFacility.id"
                    class="knocker btn btn-sm text-light p-1"
                    @click="resetView"
                  >
                    <small
                      ><span class="pr-1"><i class="fas fa-building"></i></span
                      >PROJECT SUMMARY</small
                    >
                  </button> -->
                  <div id="map-sidebar" class="pt-2">
                    <facility-show
                      v-loading="!contentLoaded"
                        element-loading-spinner="el-icon-loading" 
                      v-if="currentFacility && currentFacility.id"
                      :facility="currentFacility"
                      :facility-group="currentFacilityGroup"
                      from="map_view"
                      @close-side-bar="closeSidebar"
                      @facility-update="updateFacility"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <sweet-modal
            class="facility_accordion_modal"
            ref="facilitiesAccordion"
            :hide-close-button="true"
            :blocking="true"
          >
            <div v-if="currentFacilityGroup && currentFacilityGroup.id">
              <div
                class="facility_grp_close_btn"
                @click.prevent="onCloseAccordion"
              >
                <i class="fa fa-times"></i>
              </div>
              <h3 class="mb-3 text-break">
                {{ currentFacilityGroup.name }}
                <span class="badge badge-secondary badge-pill">{{
                  facilityGroupFacilities(currentFacilityGroup).length
                }}</span>
              </h3>
              <div
                v-if="
                  facilityGroupFacilities(currentFacilityGroup) &&
                  facilityGroupFacilities(currentFacilityGroup).length == 0
                "
                class="mt-3 text-danger"
              >
                There is no facility under this group
                <h3 class="mb-3 text-break">
                  {{ currentFacilityGroup.name }}
                  <span class="badge badge-secondary badge-pill">{{
                    facilityGroupFacilities(currentFacilityGroup).length
                  }}</span>
                </h3>
                <div
                  v-if="
                    facilityGroupFacilities(currentFacilityGroup) &&
                    facilityGroupFacilities(currentFacilityGroup).length == 0
                  "
                  class="mt-3 text-danger"
                >
                  There is no project under this group
                </div>
                <div v-else>
                  <div
                    v-for="(facility, index) in facilityGroupFacilities(
                      currentFacilityGroup
                    )"
                    :key="index"
                  >
                    <accordion
                      :expanded="expandedFacility.id"
                      :facility="facility.facility"
                      :statuses="statuses"
                      :facility-group="currentFacilityGroup"
                      @update-expanded="updateExpanded"
                    ></accordion>
                  </div>
                </div>
              </div>
            </div>
          </sweet-modal>
        </div>
        <!-- BELOW THIS IS FAC VIEW -->
      
      </div>
  </div>
</template>

<script src="https://cdnjs.cloudflare.com/ajax/libs/markerclustererplus/2.1.4/markerclusterer.js"></script>
<script>
import FacilityShow from "./facilities/facility_show";
import FacilityGroupBar from "./../shared/facility_group_bar";
import Accordion from "./../shared/accordion";
import FacilityRollup from "./facilities/facility_rollup";
import { SweetModal } from "sweet-modal-vue";
import { mapGetters, mapMutations } from "vuex";
import * as Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
export default {
  name: "ProjectMapView",
  components: {
    FacilityShow,
    FacilityGroupBar,
    Accordion,
    FacilityRollup,
    SweetModal,
  },
  data() {
    return {
      center: { lat: 20, lng: 0 },
      zoom: 0,
      message: "it works",
      openSidebar: false,
      expandedFacility: {},
      tooltip: {
        position: null,
        content: null,
        opened: false,
        key: null,
        options: {
          pixelOffset: {
            width: 0,
            height: -30,
          },
        },
      },
      mapBounds: {
        south: 0,
        west: 0,
        north: 0,
        east: 0,
      },
      initialFacilities: [],
      facilitiesSet: false,
      mapFacilityCount: null,
      boundsCapturedCount: 0,
    };
  },
  computed: {
    ...mapGetters([
      "contentLoaded",
      "facilities",
      "facilityGroups",
      "statuses",
      "currentFacility",
      "currentFacilityGroup",
      "currentProject",
      "filteredFacilityGroups",
      "filterFacilitiesWithActiveFacilityGroups",
      "filteredFacilities",
      "facilityGroupFacilities",
      "getMapZoomFilter",
      "getUnfilteredFacilities",
      "getNewSession",
    ]),
    knockerStyle() {
      return this.openSidebar
        ? {}
        : { transform: "translateX(calc(105% - 20px))" };
    },
    rollupStyle() {
      return this.openSidebar ? { right: "1px" } : { right: "0" };
    },
  },
  methods: {
    ...mapMutations([
      "updateFacilities",
      "setCurrentFacilityGroup",
      "setCurrentFacility",
      "setMapZoomFilter",
      "setFacilities",
      "setUnfilteredFacilities",
      "setPreviousRoute",
      "setNewSession",
    ]),
    getLatLngForFacility(facility) {
      return { lat: Number(facility.lat), lng: Number(facility.lng) };
    },

    showFacility(facility) {
      this.openSidebar = true;
      if(this.currentFacility && !this.currentFacilityGroup){
        this.setCurrentFacilityGroup(
          this.facilityGroups.find((fg) => fg.id == facility.facilityGroupId)
        );
      }
      if (this.currentFacility && facility.id == this.currentFacility.id)
        return;
      this.setCurrentFacilityGroup(
        this.facilityGroups.find((fg) => fg.id == facility.facilityGroupId)
      );
      this.setCurrentFacility(facility);
    },
    closeSidebar() {
      this.openSidebar = false;
      this.center = this.getLatLngForFacility(this.currentFacility);
      this.setCurrentFacility(null);
    },
    gotoFacilityGroup(facilityGroup) {
      this.setCurrentFacilityGroup(facilityGroup);
      this.$refs.facilitiesAccordion.open();
    },
    updateFacility(facility) {
      this.setCurrentFacility(facility);
      let index = this.facilities.findIndex((f) => f.id == facility.id);
      if (index > -1) this.updateFacilities({ index, facility });
    },
    updateExpanded(facility) {
      if (facility.id === this.expandedFacility.id) this.expandedFacility = {};
      else this.expandedFacility = facility;
    },
    toggleOpenSideBar() {
      this.openSidebar = this.currentFacility ? !this.openSidebar : false;
    },
    getStatusIconLink(facility) {
      return (
        "https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=|" +
        facility.color.split("#")[1]
      );
    },
    resetView() {
      if (this.openSidebar) {
        this.setCurrentFacility(null);
        this.openSidebar = false;
        this.tooltip.opened = false;
      }
    },
    toggleTooltip(marker, key) {
      this.tooltip.position = this.getLatLngForFacility(marker);
      this.tooltip.content = marker.facilityName;
      this.tooltip.opened = true;
      this.tooltip.key = key;
    },
    tooltipMouseOut() {
      // Tooltip closes only if there is no current facility selected
      if (this.currentFacility === null) {
        this.tooltip.opened = false;
      }
    },
    tooltipMouseOver(marker, key) {
      // Tooltip only appears if appears if there is no current facility selected
      if (this.currentFacility === null) {
        this.tooltip.position = this.getLatLngForFacility(marker);
        this.tooltip.content = marker.facilityName;
        this.tooltip.opened = true;
        this.tooltip.key = key;
      }
    },
    onCloseAccordion() {
      this.$refs.facilitiesAccordion && this.$refs.facilitiesAccordion.close();
    },
    captureMapBounds(payload) {
      // Record initial facilities state and set flag
      if (!this.facilitiesSet && this.contentLoaded) {
        this.initialFacilities = this.facilities;
        this.facilitiesSet = true;
        this.mapFacilityCount = this.initialFacilities.length;
      }
      // Verify bounds_changed event payload is not undefined
      if (payload && this.facilitiesSet) {
        var bounds = JSON.parse(JSON.stringify(payload));
        this.mapBounds.south = bounds.south;
        this.mapBounds.west = bounds.west;
        this.mapBounds.north = bounds.north;
        this.mapBounds.east = bounds.east;
        // Update array of Ids of facilities that are visible on map
        this.setMapZoomFilter(this.visibleMarkers());
        // Set facilities at state level by filtering out non-visible facilities
        if (
          this.getMapZoomFilter.length !== this.mapFacilityCount &&
          this.boundsCapturedCount > 2
        ) {
          this.setFacilities(
            this.initialFacilities.filter((item) =>
              this.getMapZoomFilter.includes(item.id)
            )
          );
          this.mapFacilityCount = this.facilities.length;
        }
      }
      this.boundsCapturedCount++;
    },
    visibleMarkers() {
      return this.initialFacilities
        .filter(
          (item) =>
            Number(item.lng) > this.mapBounds.west &&
            Number(item.lng) < this.mapBounds.east &&
            Number(item.lat) < this.mapBounds.north &&
            Number(item.lat) > this.mapBounds.south
        )
        .map((item) => Number(item.id));
    },
    centerMapToFacilities() {
      var bounds = new google.maps.LatLngBounds();
      var markerPositions = this.facilities.map((facility) =>
        this.getLatLngForFacility(facility)
      );

      for (var i = 0; i < this.facilities.length; i++) {
        var location = new google.maps.LatLng(
          markerPositions[i].lat,
          markerPositions[i].lng
        );
        bounds.extend(location);
      }

      this.$refs.googlemap.fitBounds(bounds);
      this.$refs.googlemap.panToBounds(bounds);
      this.$refs.googlemap.fitBounds(bounds);
    },
  },
  mounted() {
    // Display notification if the Map Boundary Filter is still on
    if (this.facilities.length !== this.getUnfilteredFacilities.length) {
      this.$notify.info({
        title: "Filter Set",
        message:
          "A filter was set based on the previous map boundary. Reset the Map Boundary Filter in the Advanced Filters tab.",
        offset: 150,
        position: "bottom-left",
      });
    }
    // Store the map route name for check when redirecting to other pages
    this.setPreviousRoute(this.$route.name);
  },
  watch: {
    facilities: function () {
      if (!this.facilitiesSet) {
        this.centerMapToFacilities();
      }
      // This will fire off when Map Boundary Filter is reset due to facilities changing
      if (
        this.facilitiesSet &&
        this.facilities.length === this.getUnfilteredFacilities.length
      ) {
        this.initialFacilities = this.getUnfilteredFacilities;
        this.centerMapToFacilities();
      }
    },
    initialFacilities: function () {
      this.centerMapToFacilities();
    },
    facilitiesSet: function () {
      // Only runs once during session due to newSession from state
      if (
        Vue.prototype.$preferences.navigation_menu === "map" &&
        this.facilitiesSet &&
        Vue.prototype.$preferences.project_id &&
        this.getNewSession
      ) {
        var ff = this.facilities.find(
          (f) => f.id == Vue.prototype.$preferences.project_id
        );
        if(ff){
          // Set the facilities based on preference facility (project). Only one project so
          // map will automatically zoom on that facility due to watcher for facilities
          // above.
          this.setFacilities(
            this.getUnfilteredFacilities.filter(
              (facility) => facility.id === Vue.prototype.$preferences.project_id
            )
          );
          // var fg = this.filteredFacilityGroups.find(
          //   (f) => f.id == Vue.prototype.$preferences.project_group_id
          // );
          // this.setCurrentFacilityGroup(fg)
          console.log("facilitiesSet")
          
          
          console.log(this.filteredFacilityGroups)
          // Highlight preferred facility in right panel
          this.setCurrentFacility(ff);
          this.showFacility(ff);
          this.updateExpanded(ff);
          this.centerMapToFacilities();
          this.toggleTooltip(ff, "asdfafsdfawerasdf")
          // Sets newSession in state to false so this conditional doesn't pass again
          this.setNewSession();
        }

      }
     
    },
  },
};
</script>

<style scoped lang="scss">
#_wrapper {
  padding-top: 1px;
  height: calc(100vh - 94px);
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
#map-wrap {
  height: calc(100vh - 94px);
  width: 64vw;
  z-index: 1;
  position: relative;
}
.project-sum {
  position:absolute;
  top:11%;  
}
// #rollup-sidebar {
//   > div {
//     height: calc(100vh - 94px);
//     z-index: 1000;
//   }
//   position: absolute;
//   top: 0;
//   overflow-x: hidden;
//   overflow-y: auto;
// }
// #map-sidebar {
//   z-index: 1000;
//   height: calc(100vh - 94px);
//   overflow: auto;
//   background: white;
//   padding: 5px;
// }
#map-sidebar,  #rollup-sidebar {
  height: calc(100vh - 94px);
  overflow-y: auto;
   
}
// .knocker_side {
//   position: absolute;
//   width: 100%;
//   padding: 3px;
//   top: 0;
//   transition: 0.3s ease;
//   height: 100%;
// }
.knocker {
  cursor: pointer;
  z-index: 1000 !important;
  position: absolute;
  top: 70%;
  left: -63.8px;
  width: fit-content;
  display: flex;
  border-bottom-right-radius: 0 !important;
  border-bottom-left-radius: 0 !important;
  -moz-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  background-color: rgba(65, 184, 131, 0.85);
}
/* sidebar transitions */
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}
.roll-fade-enter-active {
  transition: all 0.2s ease;
}
.roll-fade-leave-active {
  transition: all 0.3s ease;
}
.roll-fade-enter,
.roll-fade-leave-to {
  opacity: 0;
  transform: translate(100px, 50px);
}
.regions-bar {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 800;
}
.facility_accordion_modal.sweet-modal-overlay /deep/ .sweet-modal {
  min-width: 50vw;
  .sweet-content {
    padding-top: 30px;
  }
  .facility_grp_close_btn {
    display: flex;
    position: absolute;
    top: 15px;
    left: 15px;
    cursor: pointer;
  }
}
// .knocker {
//   z-index: 9999999;
//   cursor: pointer;
//   position: absolute;
//   top: 40%;
//   left: -12px;
//   width: 12px;
//   border-top-left-radius: 12px;
//   border-bottom-left-radius: 12px;
//   height: 100px;
//   background: #ffa500;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }
.vue-map-container /deep/ button.gm-ui-hover-effect {
  display: none;
  visibility: hidden;
}
</style>