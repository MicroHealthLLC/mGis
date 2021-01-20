<template>
  <div id="facility_sidebar" data-cy="facility_list">
    <h4 class="mt-4 text-info text-center" v-if="title">{{title}}</h4>
    <div class="my-3 ml-2">
      <div v-if="contentLoaded">
        <div v-for="group in filteredFacilityGroups" class="my-2">
          <div class="d-flex expandable" @click="expandFacilityGroup(group)" :class="{'active': group.id == currentFacilityGroup.id}" data-cy="facility_groups">
            <span v-show="expanded.id != group.id">
              <i class="fa fa-angle-right font-sm mr-2 clickable"></i>
            </span>
            <span v-show="expanded.id == group.id">
             <i class="fa fa-angle-down font-md mr-2 clickable"></i>
            </span>
            <h5 class="clickable">{{group.name}}</h5>
          </div>
          <div v-show="expanded.id == group.id" class="ml-2">
            <div v-for="item in facilityGroupFacilities(group)">
              <div class="d-flex align-items-center expandable fac-name" @click="showFacility(item)" :class="{'active': item.id == currentFacility.id}">
              <p class="facility-header" data-cy="facilities">{{item.facility.facilityName}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <loader type="code"></loader>
        <loader type="code"></loader>
        <loader type="code"></loader>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Loader from '../shared/loader'

  export default {
    name: 'FacilitySidebar',
    components: {
      Loader
    },
    props: ['title', 'currentFacilityGroup', 'expanded', 'currentFacility'],
    computed: {
      ...mapGetters([
        'contentLoaded',
        'filteredFacilityGroups',
        'facilityGroupFacilities'
      ]),
    },
    methods: {
      expandFacilityGroup(group) {
        this.$emit('on-expand-facility-group', group)
      },
      showFacility(facility) {
        this.$emit('on-expand-facility', facility)
      }
    }
  }
</script>

<style lang="scss" scoped>
   #facility_sidebar {
    .facility-header {
      padding: 0 8px;
      cursor: pointer;    
      &:hover {
        font-weight: bold;        
      }
    }
    .fac-name {
      border-bottom: solid lightgray .5px;
      border-radius: 2px;
      margin: 1px;
      cursor: pointer;
    }
    .fac-name:hover {
      background-color: rgba(91, 192, 222, 0.3);
      cursor: pointer;
    }
    .fac-name {
      &.active {        
          background-color: rgba(211, 211, 211, 10%);        
      }
      &.active,
      &:hover {
        h5, h6 {
          font-weight: 900 !important;
        }
      }
    }
  }
</style>
