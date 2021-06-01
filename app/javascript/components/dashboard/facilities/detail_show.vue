<template>
  <div class="mt-2">
    <div v-if="showDetails">
      <div>
        <task-index
          v-if="currentProject"
          :facility="facility"
          :from="from"
          @show-hide="detailShowHide"
        ></task-index>
      </div>
    </div>
    <div v-else-if="from != 'manager_view'">
      <task-form
        :facility="facility"
        :task="currentTask"
        :title="taskFormTitle"
        @on-close-form="showDetails=true"
        @task-created="taskCreated"
        @task-updated="taskUpdated"
      ></task-form>
    </div>
  </div>
</template>

<script>
  import http from './../../../common/http'
  import TaskIndex from './../tasks/task_index'
  import TaskForm from './../tasks/task_form'
  import {mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'DetailShow',
    props: ['facility', 'from'],
    components: {
      TaskIndex,
      TaskForm
    },
    data() {
      return {
        loading: true,
        DV_facility: {},
        currentTask: null,
        showDetails: true
      }
    },
    mounted() {
      if (this.facility) this.DV_facility = this.facility
    },
    methods: {
      ...mapMutations([
        'updateFacilityHash'
      ]),
      taskCreated(task) {
        this.DV_facility.tasks.unshift(task)
        this.showDetails = true
        this.$emit('refresh-facility')
      },
      taskUpdated(task, refresh=true) {
        let index = this.DV_facility.tasks.findIndex((t) => t.id == task.id)
        if (index > -1) Vue.set(this.DV_facility.tasks, index, task)
        if (refresh) {
          this.showDetails = true
          this.$emit('refresh-facility')
        } else {
          this.updateFacilityHash(this.DV_facility)
        }
      },
      detailShowHide(task=null) {
        this.currentTask = task
        this.showDetails = false
      }
    },
    computed: {
      ...mapGetters([
        'currentProject',
        'taskTypes'
      ]),
      taskFormTitle() {
        return this.currentTask ? "Edit Task" : "Add a new Task"
      }
    },
    watch: {
      showDetails(value) {
        if (value) {
          this.currentTask = null
        }
      },
      facility: {
        handler: function(value) {
          this.DV_facility = Object.assign({}, value)
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .f-notes {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    height: 20vh;
    overflow: scroll;
  }
  .project-name {
    font-size: 15px;
  }
  .facility-name {
    font-size: 17px;
  }
  .progress {
    position: relative;
    left: 55px;
    bottom: 20px;
    max-width: 80%;
  }
  .progress-icon {
    left: 22px;
    position: relative;
  }
  .progress-wrapper {
    position: inherit;
  }
</style>
