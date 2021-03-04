<template>
  <div>
    <table class="table table-sm table-bordered table-striped">
      <tr v-if="!loading" class="issues_show mt-0 py-4 edit-action" @click.prevent="editIssue" data-cy="issue_row">
        <td>{{issue.title}}</td>       
        <td>  
          <span v-if="(issue.responsibleUsers.length) > 0"> <span class="badge mr-1 badge-secondary font-sm badge-pill">R</span>{{issue.responsibleUsers[0].name}} <br></span> 
          <span v-if="(issue.accountableUsers.length) > 0"> <span class="badge mr-1 font-sm badge-secondary badge-pill">A</span>{{issue.accountableUsers[0].name}}<br></span>   
      <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(issue.consultedUsers.length) > 0"> <span class="badge mr-1 font-sm badge-secondary badge-pill">C</span>{{JSON.stringify(issue.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, '')}}<br></span> 
             <span v-if="(issue.informedUsers.length) > 0"> <span class="badge font-sm badge-secondary mr-1 badge-pill">I</span>{{JSON.stringify(issue.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, '')}}</span>      
         </span>        
        </td>
       
        <td  v-if="(issue.notes.length) > 0">
           <span class="toolTip" v-tooltip="('By: ' + issue.notes[0].user.fullName)"> 
           {{ moment(issue.notes[0].createdAt).format('DD MMM YYYY, h:mm a') }}</span><br> {{issue.notes[0].body}}
        </td>
        <td  v-else>No Updates</td>
      </tr>
    </table>
      <div v-if="has_issue" class="w-100 action-form-overlay  updateForm">
        <issue-form
          v-if="Object.entries(DV_edit_issue).length"
          :facility="facility"
          :issue="DV_edit_issue"
          @on-close-form="onCloseForm"
          @issue-updated="updateRelatedTaskIssue"
          class="form-inside-modal"
        ></issue-form>
      </div>

  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import {SweetModal} from 'sweet-modal-vue'
  import IssueForm from "./issue_form"
  import TaskForm from "./../tasks/task_form"
  import moment from 'moment'
  Vue.prototype.moment = moment

  export default {
    name: 'IssueShowMap',
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
        'setTaskForManager',
        'setToggleRACI'
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
        // else if (this.fromView == 'manager_view') {
        //   this.setTaskForManager({key: 'issue', value: this.DV_issue})
        // }
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
        this.taskUpdated({facilityId: task.facilityId, projectId: task.projectId})
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
        'viewPermit',
        'getToggleRACI',
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
  td {
  overflow-wrap: break-word;
  }
  .issue_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .toolTip {
    background-color: #6c757d;
    font-size: .75rem;
    padding:1px;
    color: #fff;
    border-radius: 3px;
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
    .badges {
      background-color: #fafafa;
      color: #383838;
      border: solid 1px #383838 !important;
    }
    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
</style>
