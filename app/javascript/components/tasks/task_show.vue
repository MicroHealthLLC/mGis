<template>
  <div data-cy="tasks">
    <div v-if="C_editForManager" class="float-right blur_show">
      <div class="text-primary align-items-center float-right mb-3">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
    </div>
    <div v-if="!loading" class="mx-3 mb-3 mt-1 py-1" @click.prevent="editTask">
      <div class="row">
        <div class="col-md-9">
          <div class="font-sm d-flex mb-1">
           <h6>{{task.text}}</h6>

          </div>
          <div class="row mb-1 d-flex" v-if="fromView == 'watch_view'">
            <div class="font-sm col">
              <span class="fbody-icon"><i class="fa fa-bookmark"></i></span>
              {{facility.facilityName}}
            </div>
            <div class="font-sm col">
              <span class="fbody-icon"><i class="fa fa-object-group"></i></span>
              {{facilityGroup.name}}
            </div>
          </div>
          <div class="row d-flex mb-1">
            <div class="font-sm col">
              <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
              {{task.taskType}}
            </div>
          </div>
          <div class="row">
            <div class="font-sm col-md-6">
              <span class="fbody-icon"><i class="fas fa-calendar-alt"></i></span>
              {{formatDate(task.startDate)}}
            </div>
            <div class="font-sm col-md-6">
              <span class="fbody-icon"><i class="fas fa-calendar-alt"></i></span>
              {{formatDate(task.dueDate)}}
            </div>
          </div>
        </div>
        <div class="col-md-3 mt-2">
          <div class="t_actions my-3 float-left">
            <span v-if="(task.watched) == true">
              <span v-tooltip="`On Watch`"><i class="fas fa-eye text-md" data-cy="on_watch_icon"></i></span>
            </span>
          </div>
          <div class="t_actions my-3 float-right">
            <span v-show="is_overdue" v-tooltip="`overdue`" class="warning-icon"><i class="fa fa-exclamation-triangle"></i></span>
          </div>
          <div class="progress pg-content" :class="{'progress-0': task.progress <= 0}">
            <div class="progress-bar bg-info" :style="`width: ${task.progress}%`">{{task.progress}}%</div>
          </div>
        </div>
      </div>
      <div v-if="fromView == 'watch_view'" class="mt-3 font-sm row">
        <div class="col-6">
          <div class="text-info">Related Tasks: </div>
          <ol class="pl-4">
            <li v-for="subTask in DV_task.subTasks">
              <span class="btn btn-link btn-sm p-0 clickable" @click="openSubTask(subTask)">{{getTask(subTask).text}}</span>
            </li>
          </ol>
        </div>
        <div class="col-6">
          <div class="text-info">Related Issues: </div>
          <ol class="pl-4">
            <li v-for="subIssue in DV_task.subIssues">
              <span class="btn btn-link btn-sm p-0 clickable" @click="openSubIssue(subIssue)">{{getIssue(subIssue).title}}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>

    <sweet-modal
      class="task_form_modal"
      ref="taskFormModal"
      :hide-close-button="true"
      :blocking="true"
      >
      <div v-if="has_task" class="w-100">
        <task-form
          v-if="Object.entries(DV_edit_task).length"
          :facility="facility"
          :task="DV_edit_task"
          title="Edit Task"
          @task-updated="updateRelatedTaskIssue"
          @on-close-form="onCloseForm"
          class="form-inside-modal"
        ></task-form>

        <issue-form
          v-if="Object.entries(DV_edit_issue).length"
          :facility="facility"
          :issue="DV_edit_issue"
          @issue-updated="updateRelatedTaskIssue"
          @on-close-form="onCloseForm"
          class="form-inside-modal"
        ></issue-form>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import {SweetModal} from 'sweet-modal-vue'
  import TaskForm from "./task_form"
  import IssueForm from "../issues/issue_form"

  export default {
    name: 'TaskShow',
    components: {
      TaskForm,
      IssueForm,
      SweetModal,
    },
    props: {
      fromView: {
        type: String,
        default: 'map_view'
      },
      task: Object
    },
    data() {
      return {
        loading: true,
        DV_task: {},
        DV_edit_task: {},
        DV_edit_issue: {},
        has_task: false
      }
    },
    mounted() {
      if (this.task) {
        this.loading = false
        this.DV_task = this.task
      }
    },
    methods: {
      ...mapMutations([
        'updateTasksHash',
        'setTaskForManager'
      ]),
      ...mapActions([
        'taskDeleted',
        'taskUpdated',
        'updateWatchedTasks'
      ]),
      deleteTask() {
        let confirm = window.confirm(`Are you sure, you want to delete "${this.DV_task.text}"?`)
        if (!confirm) {return}
        this.taskDeleted(this.DV_task)
      },
      openSubTask(subTask) {
        let task = this.currentTasks.find(t => t.id == subTask.id)
        if (!task) return
        this.has_task = Object.entries(task).length > 0
        this.DV_edit_task = task
        this.$refs.taskFormModal && this.$refs.taskFormModal.open()
      },
      openSubIssue(subIssue) {
        let issue = this.currentIssues.find(t => t.id == subIssue.id)
        if (!issue) return
        this.has_task = Object.entries(issue).length > 0
        this.DV_edit_issue = issue
        this.$refs.taskFormModal && this.$refs.taskFormModal.open()
      },
      editTask() {
        if (this.fromView == 'map_view') {
          this.$emit('edit-task', this.DV_task)
        }
        else if (this.fromView == 'manager_view') {
          this.setTaskForManager({key: 'task', value: this.DV_task})
        }
        else {
          this.has_task = Object.entries(this.DV_task).length > 0
          this.DV_edit_task = this.DV_task
          this.$refs.taskFormModal && this.$refs.taskFormModal.open()
        }
      },
      onCloseForm() {
        this.$refs.taskFormModal && this.$refs.taskFormModal.close()
        this.has_task = false
        this.DV_edit_task = {}
        this.DV_edit_issue = {}
      },
      toggleWatched() {
        if (this.DV_task.watched) {
          let confirm = window.confirm(`Are you sure, you want to remove this task from on-watch?`)
          if (!confirm) {return}
        }
        this.DV_task = {...this.DV_task, watched: !this.DV_task.watched}
        this.updateWatchedTasks(this.DV_task)
      },
      updateRelatedTaskIssue(task) {
        this.taskUpdated({facilityId: task.facilityId, projectId: task.projectId})
        this.onCloseForm()
      },
      getTask(task) {
        return this.currentTasks.find(t => t.id == task.id) || {}
      },
      getIssue(issue) {
        return this.currentIssues.find(t => t.id == issue.id) || {}
      }
    },
    computed: {
      ...mapGetters([
        'facilities',
        'facilityGroups',
        'managerView',
        'currentTasks',
        'currentIssues',
        'viewPermit'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      is_overdue() {
        return this.DV_task.progress !== 100 && new Date(this.DV_task.dueDate).getTime() < new Date().getTime()
      },
      facility() {
        return this.facilities.find(f => f.id == this.DV_task.facilityId)
      },
      facilityGroup() {
        return this.facilityGroups.find(f => f.id == this.facility.facilityGroupId)
      },
      C_editForManager() {
        return this.managerView.task && this.managerView.task.id == this.DV_task.id
      }
    },
    watch: {
      task: {
        handler(value) {
          this.DV_task = Object.assign({}, value)
        },
        deep: true
      }
    }
  }
</script>

<style lang="scss" scoped>
  .t_actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      font-size: 13px;
    }
    .empty_box,
    .check_box {
      font-size: 16px;
    }
  }
  .pg-content {
    width: 100%;
    height: 20px;
    font-weight: bold;
  }
  .task_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .task_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
      min-width: 80vw;
      max-height: 80vh;
    .sweet-content {
      padding-top: 30px;
      text-align: unset;
    }
    .modal_close_btn {
      display: flex;
      position: absolute;
      top: 20px;
      right: 30px;
      font-size: 20px;
      cursor: pointer;
    }
    .fa-long-arrow-alt-right {
      margin-bottom: 1rem !important;
      margin-left: 1rem !important;
      height: .8em !important;
    }
    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
</style>

