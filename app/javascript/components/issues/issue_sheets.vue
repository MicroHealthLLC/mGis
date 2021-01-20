<template>
  <div>
    <table class="table table-sm table-bordered table-striped">
      <tr v-if="!loading" class="issues_show mx-3 mb-3 mt-0 py-4 edit-action" @click.prevent="editIssue" data-cy="issue_row">
        <td class="oneFive">{{issue.title}}</td>
        <td class="ten">{{issue.issueType}}</td>
        <td class="nine">{{issue.issueSeverity}}</td>
        <td class="eight">{{formatDate(issue.startDate)}}</td>
        <td class="eight">{{formatDate(issue.dueDate)}}</td>
        <td class="ten" v-if="(issue.responsibleUserNames.length) > 0">{{ issue.responsibleUserNames }}</td>
        <td class="ten" v-else></td>
        <td class="nine">{{issue.progress + "%"}}</td>
        <td class="nine" v-if="(issue.dueDate) <= now"><h5>x</h5></td>
        <td class="nine" v-else></td>
        <td class="nine" v-if="(issue.watched) == true"><h5>x</h5></td>
        <td class="nine" v-else></td>
        <td class="oneFive" v-if="(issue.notes.length) > 0">
          By: {{ issue.notes[0].user.fullName}} on
          {{moment(issue.notes[0].createdAt).format('DD MMM YYYY, h:mm a')}}: {{issue.notes[0].body}}
        </td>
        <td class="oneFive" v-else>No Updates</td>
      </tr>
    </table>

    <sweet-modal
      class="issue_form_modal"
      ref="issueFormModal"
      :hide-close-button="true"
      :blocking="true"
      >
      <div v-if="has_issue" class="w-100">
        <div class="modal_close_btn" @click="onCloseForm">
          <i class="fa fa-times"></i>
        </div>
        <task-form
          v-if="Object.entries(DV_edit_task).length"
          :facility="facility"
          :task="DV_edit_task"
          title="Edit Task"
          @task-updated="updateRelatedTaskIssue"
          class="form-inside-modal"
        ></task-form>

        <issue-form
          v-if="Object.entries(DV_edit_issue).length"
          :facility="facility"
          :issue="DV_edit_issue"
          @issue-updated="updateRelatedTaskIssue"
          class="form-inside-modal"
        ></issue-form>
      </div>
    </sweet-modal>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import {SweetModal} from 'sweet-modal-vue'
  import IssueForm from "./issue_form"
  import TaskForm from "../../components/tasks/task_form"
  import moment from 'moment'
  Vue.prototype.moment = moment

  export default {
    name: 'IssueSheets',
    components: {
      IssueForm,
      TaskForm,
      SweetModal,
    },
    props: {
      fromView: {
        type: String,
        default: 'map_view'
      },
      issue: Object
    },
    data() {
      return {
        show: true,
        loading: true,
        DV_issue: {},
        DV_edit_task: {},
        DV_edit_issue: {},
        has_issue: false,
        now: new Date().toISOString()
      }
    },
    mounted() {
      if (this.issue) {
        this.loading = false
        this.DV_issue = this.issue
      }
    },
    methods: {
      ...mapMutations([
        'updateIssuesHash',
        'setTaskForManager'
      ]),
      ...mapActions([
        'issueDeleted',
        'taskUpdated',
        'updateWatchedIssues'
      ]),
      editIssue() {
        if (this.fromView == 'map_view') {
          this.$emit('issue-edited', this.issue)
        }
        else if (this.fromView == 'manager_view') {
          this.setTaskForManager({key: 'issue', value: this.DV_issue})
        }
        else {
          this.DV_edit_issue = this.DV_issue
          this.has_issue = Object.entries(this.DV_issue).length > 0
          this.$refs.issueFormModal && this.$refs.issueFormModal.open()
        }
      },
      deleteIssue() {
        let confirm = window.confirm(`Are you sure, you want to delete this issue?`)
        if (!confirm) {return}
        this.issueDeleted(this.DV_issue)
      },
      openSubTask(subTask) {
        let task = this.currentTasks.find(t => t.id == subTask.id)
        if (!task) return
        this.has_issue = Object.entries(task).length > 0
        this.DV_edit_task = task
        this.$refs.issueFormModal && this.$refs.issueFormModal.open()
      },
      openSubIssue(subIssue) {
        let issue = this.currentIssues.find(t => t.id == subIssue.id)
        if (!issue) return
        this.has_issue = Object.entries(issue).length > 0
        this.DV_edit_issue = issue
        this.$refs.issueFormModal && this.$refs.issueFormModal.open()
      },
      onCloseForm() {
        this.$refs.issueFormModal && this.$refs.issueFormModal.close()
        this.has_issue = false
        this.DV_edit_task = {}
        this.DV_edit_issue = {}
      },
      toggleWatched() {
        if (this.DV_issue.watched) {
          var confirm = window.confirm(`Are you sure, you want to remove this issue from on-watch?`)
          if (!confirm) {return}
        }
        this.DV_issue = {...this.DV_issue, watched: !this.DV_issue.watched}
        this.updateWatchedIssues(this.DV_issue)
      },
      updateRelatedTaskIssue(task) {
        this.taskUpdated({facilityId: task.facilityId, projectId: task.projectId, cb: () => this.onCloseForm()})
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
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.issues[salut]
      },
      is_overdue() {
        return this.DV_issue.progress !== 100 && new Date(this.DV_issue.dueDate).getTime() < new Date().getTime()
      },
      facility() {
        return this.facilities.find(f => f.id == this.DV_issue.facilityId)
      },
      facilityGroup() {
        return this.facilityGroups.find(f => f.id == this.facility.facilityGroupId)
      },
      C_editForManager() {
        return this.managerView.issue && this.managerView.issue.id == this.DV_issue.id
      }
    },
    watch: {
      issue: {
        handler: function(value) {
          this.DV_issue = Object.assign({}, value)
        }, deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  table {
    table-layout: fixed;
    width: 100%;
    margin-bottom: 0 !important;
  }
  .eight {
    width: 8%;
  }
  .nine {
    width: 9%;
  }
  .ten {
    width: 10%;
  }
  .oneFive {
    width: 15%;
  }
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
  .issue_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .issue_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
    min-width: 30vw;
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
    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
</style>
