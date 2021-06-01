<template>
  <div data-cy="issues" @mouseup.right="openContextMenu" @contextmenu.prevent="">
    <div v-if="C_editForManager" class="float-right blur_show">
      <div class="text-primary align-items-center mb-3">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
    </div>
    <div v-if="!loading" class="issues_show mx-3 mb-1 mt-1 py-1" @click.prevent="editIssue">
      <div v-if="show">    

           <!-- ROW 1 -->
        <div class="row">            
              <div class=" col-md-9 font-lg d-flex pb-2 kanban-text">
                {{issue.title}}
              </div>
              <div class="col-md-3">
                
                <div class="t_actions float-right">
                   <span v-if="(issue.watched) == true">
                    <span v-tooltip="`On Watch`"><i class="fas fa-eye text-md mr-1" data-cy="on_watch_icon"></i></span>
                    </span>
                     <span v-show="issue.important" v-tooltip="`Important`" class="mr-1"> <i class="fas fa-star text-warning"></i></span>

                    
                  <span v-show="is_overdue" v-tooltip="`Overdue`" class="warning-icon"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
                </div>
             </div>        
         </div>

         <!-- ROW 2 -->



         <div class="row my-2">
                <div class="font-sm col-md-12 pt-1 pb-0">
                  <span class="mr-2">
                  <span class="fbody-icon mr-0"><i class="fas fa-calendar-alt"></i></span>
                  {{formatDate(issue.startDate)}}              
                    </span>
                  <span class="fbody-icon mr-0"><i class="fas fa-calendar-alt"></i></span>
                  {{formatDate(issue.dueDate)}}
                </div>
              </div>
   <!-- ROW 3 -->

            <div class="row mb-0">
                <div class="font-sm col-md-12 py-0" >
                  <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
                   <span v-tooltip="`Issue Type`">{{issue.issueType}}</span>
                </div>
               
            </div>

     
   <!-- ROW 4 -->
            <div class="row mb-1 d-flex">              
                <div class="font-sm col-md-12 py-0">
                  <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
                  <span v-tooltip="`Issue Severity`"> {{issue.issueSeverity}}</span>
                </div>
            </div>
                       


           <!-- LAST/BOTTOM ROW  -->

          <div class="row d-flex">
            <div class="font-sm col pt-1 pb-3">
                  <div class="progress pg-content" :class="{'progress-0': issue.progress <= 0}">
                  <div class="progress-bar bg-info" :style="`width: ${issue.progress}%`">{{issue.progress}}%

                  </div>
                  </div>
            </div>
          </div>
          


        <div v-if="fromView == 'watch_view'" class="mt-3 font-sm row">
          <div class="col-6">
            <div class="text-info">Related Tasks: </div>
            <ol class="pl-4">
              <li v-for="subTask in DV_issue.subTasks">
                <span class="btn btn-link btn-sm p-0 clickable" @click="openSubTask(subTask)">{{getTask(subTask).text}}</span>
              </li>
            </ol>
          </div>
          <div class="col-6">
            <div class="text-info">Related Issues: </div>
            <ol class="pl-4">
              <li v-for="subIssue in DV_issue.subIssues">
                <span class="btn btn-link btn-sm p-0 clickable" @click="openSubIssue(subIssue)">{{getIssue(subIssue).title}}</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
  
      </div>
    <!-- The context-menu appears only if table row is right-clicked -->
      <IssueContextMenu
        :facilities="facilities"
        :facilityGroups="facilityGroups"
        :issue="issue"
        :display="showContextMenu"
        ref="menu"
        @open-issue="editIssue">  
      </IssueContextMenu>

  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import IssueContextMenu from "../../shared/IssueContextMenu"

  export default {
    name: 'IssueShow',
    components: {
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
        'setTaskForManager'
      ]),
      ...mapActions([
        'issueDeleted',
        'taskUpdated',
        'updateWatchedIssues'
      ]),
      editIssue() {
        this.DV_edit_issue = this.DV_issue;
        if (this.$route.path.includes("kanban")) {
          this.$router.push(`/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/issues/${this.DV_edit_issue.id}`);
        } else {
          this.$router.push(`/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/issues/${this.DV_edit_issue.id}`);
        }      
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
      toggleWatched() {
        if (this.DV_issue.watched) {
          let confirm = window.confirm(`Are you sure, you want to remove this issue from on-watch?`)
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
        'viewPermit'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.issues[salut]
      },
      is_overdue() {
        return this.DV_issue.isOverdue
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
  .fa-long-arrow-alt-right {
    margin-bottom: 1rem !important;
    margin-left: 1rem !important;
    height: .8em !important;
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

    .action-form-overlay {
      position: absolute;
      top:0; 
    }  

    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
</style>
