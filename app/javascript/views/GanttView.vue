<template>
  <div data-cy="gantt_view">
    <div class="gantt_board">
      <div v-if="!loading">
        <gantt-elastic
          class="gantt_chart_view"
          :class="{'gantt_disabled': taskLoading}"
          :options="options"
          :tasks="ganttData"
          :dynamic-style="dynamicStyle"
          >
        </gantt-elastic>
        <div v-if="taskLoading" class="task_loader d-flex justify-content-center align-items-center h-75 mt-5">
          <loader :loading="true" color="black"></loader>
          <p class="__loading">Updating..</p>
        </div>
      </div>
      <div v-else class="d-flex justify-content-center align-items-center h-75 mt-5" data-cy="gantt_loading">
        <loader :loading="true" color="black"></loader>
        <p class="__loading">Loading</p>
      </div>
    </div>

    <sweet-modal
      class="task_form_modal"
      ref="taskFormModal"
      :hide-close-button="true"
      :blocking="true"
      >
      <div>
        <div v-if="tab == 'Start Date'" class="form-group">
          <label class="font-sm">Start Date:</label>
          <v2-date-picker
            class="modal-date-picker w-100"
            v-model="DV_task.startDate"
            value-type="YYYY-MM-DD"
            format="DD MMM YYYY"
            placeholder="DD MM YYYY"
            name="Start Date"
            :disabled-date="disabledStartDate"
          />
        </div>
        <div v-if="tab == 'End Date'" class="form-group">
          <label class="font-sm">Due Date:</label>
          <v2-date-picker
            class="modal-date-picker w-100"
            v-model="DV_task.dueDate"
            value-type="YYYY-MM-DD"
            format="DD MMM YYYY"
            placeholder="DD MM YYYY"
            name="Due Date"
            :disabled="DV_task.startDate === ''"
            :disabled-date="disabledDueDate"
          />
        </div>
        <div v-if="tab == '% Complete'" class="form-group">
          <label class="font-sm mb-0">Progress: (in %)</label>
          <vue-slide-bar
            v-model="DV_task.progress"
            :line-height="8"
          ></vue-slide-bar>
        </div>
        <div v-if="tab" class="float-right">
          <button class="btn btn-sm btn-light mr-2" @click="onCloseTask">Cancel</button>
          <button class="btn btn-sm btn-success" :disabled="!isUpdated" @click="onSaveTask">Save</button>
        </div>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
  import http from '../common/http'
  import {SweetModal} from 'sweet-modal-vue'
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: "GanttView",
    components: {SweetModal},
    data() {
      return {
        loading: true,
        DV_task: {},
        AC_task: {},
        taskLoading: false,
        tab: "",
        options: {
          times: {
            timeScale: 3800 * 1000,
            timeZoom: 20,
            stepDuration: 'week'
          },
          taskMapping: {
            progress: "percent"
          },
          maxRows: 1000,
          maxHeight: 620,
          title: {
            label: "Project Gantt Chart View",
            html: false
          },
          row: {
            height: 18
          },
          calendar: {
            hour: {
              display: false
            }
          },
          chart: {
            progress: {
              bar: true
            },
            expander: {
              display: true
            }
          },
          taskList: {
            expander: {
              straight: false
            },
            columns: [
              {
                id: 1,
                label: "Name",
                value: "name",
                width: 180,
                expander: true
              },
              {
                id: 2,
                label: "Duration",
                value: "durationInDays",
                width: 75,
                style: {
                  'task-list-header-label': {
                    'text-align': 'center',
                    width: '100%'
                  },
                  'task-list-item-value-container': {
                    'text-align': 'center',
                    width: '100%'
                  }
                }
              },
              {
                id: 3,
                label: "% Complete",
                value: "progress",
                width: 90,
                style: {
                  'task-list-header-label': {
                    'text-align': 'center',
                    width: '100%'
                  },
                  'task-list-item-value-container': {
                    'text-align': 'center',
                    width: '100%'
                  }
                },
                // events: {
                //   click: this.handleClick
                // }
              },
              {
                id: 4,
                label: "Start Date",
                value: "startDate",
                width: 90,
                value: task => this.formatDate(task.startDate),
                style: {
                  'task-list-header-label': {
                    'text-align': 'center',
                    width: '100%'
                  },
                  'task-list-item-value-container': {
                    'text-align': 'center',
                    width: '100%'
                  }
                },
                events: {
                  click: this.handleClick
                }
              },
              {
                id: 5,
                label: "End Date",
                value: "endDate",
                width: 90,
                value: task => this.formatDate(task.endDate),
                style: {
                  'task-list-header-label': {
                    'text-align': 'center',
                    width: '100%'
                  },
                  'task-list-item-value-container': {
                    'text-align': 'center',
                    width: '100%'
                  }
                },
                events: {
                  click: this.handleClick
                }
              },
              {
                id: 6,
                width: 100,
                label: "Assigned To",
                value: "_users",
                style: {
                  'task-list-item-column': {
                    // height: '200px'
                  },
                  'task-list-header-label': {
                    'text-align': 'center',
                    width: '100%'
                  },
                  'task-list-item-value': {
                    // 'white-space': 'unset'
                  }
                }
              }
            ]
          }
        },
        dynamicStyle: {
          'task-list-header-label': {
            'font-weight': 'bold'
          }
        }
      }
    },
    mounted() {
      this.loading = false
      this.updateZoom(this.ganttData)
    },
    computed: {
      ...mapGetters([
        'ganttData'
      ]),
      isUpdated() {
        return this.DV_task.dueDate != this.AC_task.endDate || this.DV_task.startDate != this.AC_task.startDate || this.DV_task.progress != this.AC_task.progress
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      }
    },
    methods: {
      ...mapActions([
        'taskUpdated'
      ]),
      handleClick({column, data}) {
        if (!this._isallowed("write")) return
        if (!data.taskUrl || !column.label) return
        this.tab = column.label
        this.DV_task = {startDate: data.startDate, dueDate: data.endDate, progress: data.progress}
        this.AC_task = Object.assign({}, data)
        this.$refs.taskFormModal.open()
      },
      disabledStartDate(date) {
        date.setHours(0,0,0,0)
        const today = new Date()
        today.setHours(0,0,0,0)
        return date < today
      },
      disabledDueDate(date) {
        date.setHours(0,0,0,0)
        const startDate = new Date(this.DV_task.startDate)
        startDate.setHours(0,0,0,0)
        return date < startDate
      },
      onCloseTask() {
        this.tab = ""
        this.$refs.taskFormModal && this.$refs.taskFormModal.close()
      },
      onSaveTask() {
        if (!this.isUpdated) return
        this.taskLoading = true
        let data = Object.assign({}, {task: new Object})
        let cb = () => this.taskLoading = false
        if (this.tab == 'Start Date') data.task.startDate = this.DV_task.startDate
        if (this.tab == 'End Date') data.task.dueDate = this.DV_task.dueDate
        if (this.tab == '% Complete') data.task.progress = this.DV_task.progress

        http
          .put(this.AC_task.taskUrl, data)
          .then((res) => {
            this.taskUpdated({facilityId: this.AC_task.facilityId, projectId: this.AC_task.projectId, cb})
            this.onCloseTask()
          })
          .catch((err) => console.log(err))
      },
      updateZoom(data) {
        if (data[0] && data[0].duration) {
          var zoom = Number(data[0].durationInDays.split(" ")[0]) * 0.06
          this.options.times.timeZoom = zoom > 20 ? 20 : (zoom < 10 ? 10 : zoom)
        }
      }
    },
    watch: {
      ganttData: {
        handler(value) {
          this.updateZoom(value)
        }, deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  .gantt_board {
    padding: 10px 70px;
  }
  .task_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
    width: 325px;
    top: 30%;
    .sweet-content {
      padding-top: 32px;
      text-align: unset;
    }
  }
  .task_loader {
    position: absolute;
    top: 60px;
    right: 50%;
  }
  .gantt_disabled {
    opacity: 0.4;
    pointer-events: none;
  }
  .gantt_chart_view /deep/ .gantt-elastic__main-view {
    .gantt-elastic__main-container-wrapper {
      min-height: 70px;
    }
    .gantt-elastic__task-list-header {
      min-height: 28px;
    }
    .gantt-elastic__task-list-item-column {
      min-height: 29px;
      height: max-content !important;
    }
  }
</style>
