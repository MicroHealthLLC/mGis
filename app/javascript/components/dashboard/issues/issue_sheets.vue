<template>
  <div>
    <table class="table table-sm table-bordered table-striped">
      <tr v-if="!loading" class="issues_show mx-3 mb-3 mt-0 py-4 edit-action" @click.prevent="editIssue" data-cy="issue_row" @mouseup.right="openContextMenu" @contextmenu.prevent="">
        <td class="oneFive">{{issue.title}}</td>
        <td class="ten col-issue_type">{{issue.issueType}}</td>
        <td class="nine col-issue_severity">{{issue.issueSeverity}}</td>
        <td class="eight">{{formatDate(issue.startDate)}}</td>
        <td class="eight">{{formatDate(issue.dueDate)}}</td>       
         <td class="oneThree" >  
          <span v-if="(issue.responsibleUsers.length > 0) && (issue.responsibleUsers[0] !== null)"> <span class="badge mr-1 badge-secondary font-sm badge-pill">R</span>{{issue.responsibleUsers[0].name}} <br></span> 
          <span v-if="(issue.accountableUsers.length > 0) && (issue.accountableUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">A</span>{{issue.accountableUsers[0].name}}<br></span>   
      <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(issue.consultedUsers.length > 0) &&  (issue.consultedUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">C</span>{{JSON.stringify(issue.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, ' ')}}<br></span> 
             <span v-if="(issue.informedUsers.length > 0) &&  (issue.informedUsers[0] !== null)"> <span class="badge font-sm badge-secondary mr-1 badge-pill">I</span>{{JSON.stringify(issue.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g, ' ')}}</span>      
         </span>        
        </td>
        <td class="eight">{{issue.progress + "%"}}</td>
        <td class="eight" v-if="issue.isOverdue"><h5>x</h5></td>
        <td class="eight" v-else></td>
        <td class="eight" v-if="(issue.watched) == true"><h5>x</h5></td>
        <td class="eight" v-else></td>
         <td class="oneFive" v-if="(issue.notesUpdatedAt.length) > 0">
           <span class="toolTip" v-tooltip="('By: ' + issue.notes[0].user.fullName)"> 
           {{moment(issue.notesUpdatedAt[0]).format('DD MMM YYYY, h:mm a')}}
           </span>
           <br> {{issue.notes[0].body}}
        </td>
        <td class="oneFive" v-else>No Updates</td>
      </tr>
      <!-- The context-menu appears only if table row is right-clicked -->
      <IssueContextMenu
        :facilities="facilities"
        :facilityGroups="facilityGroups"
        :issue="issue"
        :display="showContextMenu"
        ref="menu"
        @open-issue="editIssue">  
      </IssueContextMenu>
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
  import IssueContextMenu from "../../shared/IssueContextMenu"
  import moment from 'moment'
  Vue.prototype.moment = moment

  export default {
    name: 'IssueSheets',
    components: {
      IssueForm,
      TaskForm,
      SweetModal,
      IssueContextMenu
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
        now: new Date().toISOString(),
        showContextMenu: false
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
          this.DV_edit_issue = this.DV_issue
          this.$router.push(`/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/issues/${this.DV_edit_issue.id}`)
      },
      onCloseForm() {
        this.$refs.issueFormModal && this.$refs.issueFormModal.close()
        this.has_issue = false
        this.DV_edit_task = {}
        this.DV_edit_issue = {}
      },
      updateRelatedTaskIssue(task) {
        this.taskUpdated({facilityId: task.facilityId, projectId: task.projectId})
      },
      openContextMenu(e) {
        e.preventDefault();
        this.$refs.menu.open(e);
      },
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
  .eight {
    width: 8%;
  }
  .nine {
    width: 9%;
  }
  .ten {
    width: 10%;
  }
  .elev {
    width: 11%;
  }
  .oneThree {
    width: 13%;
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
