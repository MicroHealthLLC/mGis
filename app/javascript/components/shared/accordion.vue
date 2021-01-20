<template>
  <div>
    <div @click.stop="toggleAccordion" class="p-2 my-3 accordion_header" :class="{'accordion_active': expand}">
      <div>{{facility.facilityName}}</div>
    </div>
    <transition name="slide-fade">
      <div v-if="expand" class="accordion_body">
        <facility-show
          from="map_view"
          :facility="facility"
          :facility-group="facilityGroup"
          :extras="false"
        ></facility-show>
      </div>
    </transition>
  </div>
</template>

<script>
  import FacilityShow from '../facilities/facility_show'
  export default {
    name: 'Accordion',
    props: ['facility', 'facilityGroup', 'expanded', 'statuses'],
    components: {
      FacilityShow
    },
    data() {
      return {
        expand: this.expanded == this.facility.id
      }
    },
    methods: {
      toggleAccordion() {
        this.$emit('update-expanded', this.facility)
      }
    },
    watch: {
      expanded(value) {
        this.expand = value == this.facility.id
      }
    }
  }
</script>

<style lang="scss" scoped>
  .accordion_header {
    cursor: pointer;
    background: #F2F2F2;
    border: 1px solid #ccc;
    font-weight: 600;
  }
  .accordion_body {
    text-align: initial;
  }
  .accordion_header:hover,
  .accordion_active {
    color: #fff;
    background: #7092BF;
  }
  .slide-fade-enter-active {
    transition: all .4s ease;
  }
  .slide-fade-enter {
    transform: translateY(50%);
  }
  .slide-fade-leave-to {
    transform: translateY(-300px);
  }
</style>
