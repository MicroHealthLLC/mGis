<template>
  <div data-cy="risks" @mouseup.right="openContextMenu" @contextmenu.prevent="">
    <div v-if="C_editForManager" class="float-right blur_show">
      <div class="text-primary align-items-center mb-3">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
    </div>
    <div v-if="!loading" class="risk_show mx-3 mb-1 mt-1 py-1" @click.prevent="editRisk">
      <div v-if="show">
       
       <!-- ROW 1 -->
       <div class="row" >
          <div class="col-md-9 font-lg d-flex mb-1 kanban-text">                       
               <b>{{DV_risk.text}}</b>                      
          </div>
          <div class="col-md-3">            
              <div class="t_actions float-right">
            <span v-show="risk.watched" v-tooltip="`On Watch`"><i class="fas fa-eye text-md mr-1" data-cy="on_watch_icon"></i></span>          
            <span v-show="risk.important" v-tooltip="`Important`" class="mr-1"> <i class="fas fa-star text-warning"></i></span>
            <span v-show="is_overdue" v-tooltip="`Overdue`" class="warning-icon"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
            <span v-show="risk.progress == 100" v-tooltip="`Completed`"><font-awesome-icon icon="clipboard-check" class="text-success mr-1"  /></span>   
            <span v-show="risk.ongoing" v-tooltip="`Ongoing`"><font-awesome-icon icon="retweet" class="text-success mr-1"  /></span>   
            <span v-show="risk.onHold" v-tooltip="`On Hold`"><font-awesome-icon icon="pause-circle" class="text-primary  mr-1"  /></span>   
            <span v-show="risk.draft" v-tooltip="`Draft`"><font-awesome-icon icon="pencil-alt" class="text-warning  mr-1"  /></span>   
              </div>
           </div>
         </div>


         <!-- ROW 2 -->
           <div class="row my-2">
                <div class="font-sm col-md-12 py-0">
                  <span class="mr-2">
                  <span class="fbody-icon mr-0">
                    <i class="fas fa-calendar-alt"></i>
                  </span>
                  {{formatDate(DV_risk.startDate)}}
                  </span>              
                  <span class="fbody-icon mr-0"><i class="fas fa-calendar-alt mr-0"></i></span>
                  {{formatDate(DV_risk.dueDate)}}
                </div>
            </div>

              <div class="row mb-1 d-flex">
                <div class="font-sm col py-0" >
                  <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
                 <span v-tooltip="`Category`">
                  {{DV_risk.taskType.name}}
                 </span>
                </div>               
              </div>

              <div class="row mb-2 d-flex">           
                <div class="font-sm col-5 py-0 text-left">
                    <font-awesome-icon
                                  icon="exclamation-triangle"
                                  class="mr-1"
                                  v-tooltip="`Risk Approach`"
                                />
                  <span class="upperCase">{{DV_risk.riskApproach}}</span>
                </div>

                <div class="font-sm col-7 py-0">
                  <span class="mr-1"><b>Priority:</b></span>
                   <span v-tooltip="`Priority`">             
                      <span v-if="(DV_risk.priorityLevelName) == 'Very Low'" class="gray2">{{DV_risk.priorityLevelName}}</span>              
                      <span v-if="(DV_risk.priorityLevelName) == 'Low'" class="green1">{{DV_risk.priorityLevelName}}</span> 
                      <span v-if="(DV_risk.priorityLevelName) == 'Moderate'" class="yellow1"> {{DV_risk.priorityLevelName}} </span> 
                      <span v-if="(DV_risk.priorityLevelName) == 'High'" class="orange1"> {{DV_risk.priorityLevelName}} </span> 
                      <span v-if="(DV_risk.priorityLevelName) == 'Extreme'" class="red1"> {{DV_risk.priorityLevelName}}</span> 
                       </span>
                </div>
              </div>
          
        
         
              <div class="font-sm col mt-3 p-0">
                <div class="progress pg-content" :class="{'progress-0': DV_risk.progress <= 0}">
                  <div class="progress-bar bg-info" :style="`width: ${DV_risk.progress}%`">{{DV_risk.progress}}%</div>
                </div>
              </div>
        
      </div>

       
    </div>
    <!-- The context-menu appears only if table row is right-clicked -->
    <RiskContextMenu
      :facilities="facilities"
      :facilityGroups="facilityGroups"
      :risk="risk"
      :display="showContextMenu"
      ref="menu"
      @open-risk="editRisk">  
    </RiskContextMenu>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import RiskContextMenu from "../../shared/RiskContextMenu"


  export default {
    name: 'RiskShow',
    components: {
      RiskContextMenu
    },
    props: {
      fromView: {
        type: String,
        default: 'map_view'
      },
      risk: Object
    },
    data() {
      return {
        show: true,
        loading: true,
        DV_risk: {},
        DV_edit_task: {},
        DV_edit_issue: {},
        DV_edit_risk: {},
        has_risk: false,
        showContextMenu: false
      }
    },
    mounted() {
      if (this.risk) {
        this.loading = false
        this.DV_risk = this.risk
      }
    },
    methods: {
      ...mapMutations([
        'updateRisksHash',
        'setTaskForManager',
        'SET_RISK_FORM_OPEN',
        'SET_SELECTED_RISK'
      ]),
      ...mapActions([
        'riskDeleted',
        'taskUpdated',
        'updateWatchedRisks'
      ]),
      editRisk() {
        this.DV_edit_risk = this.DV_risk;
        if (this.$route.path.includes("kanban")) {
          this.$router.push(`/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/risks/${this.DV_edit_risk.id}`);
        } else {
          this.$router.push(`/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/risks/${this.DV_edit_risk.id}`);
        }
      },
      openSubTask(subTask) {
        let task = this.currentTasks.find(t => t.id == subTask.id)
        if (!task) return
        this.has_risk = Object.entries(task).length > 0
        this.DV_edit_task = task
        this.$refs.riskFormModal && this.$refs.riskFormModal.open()
      },
      openSubIssue(subIssue) {
        let issue = this.currentIssues.find(t => t.id == subIssue.id)
        if (!issue) return
        this.has_risk = Object.entries(issue).length > 0
        this.DV_edit_issue = issue
        this.$refs.riskFormModal && this.$refs.riskFormModal.open()
      },
      onCloseForm() {
        this.$refs.riskFormModal && this.$refs.riskFormModal.close()
        this.has_risk = false
        this.DV_edit_task = {}
        this.DV_edit_issue = {}
        this.DV_edit_risk = {}
      },
      toggleWatched() {
        if (this.DV_risk.watched) {
          let confirm = window.confirm(`Are you sure, you want to remove this issue from on-watch?`)
          if (!confirm) {return}
        }
        this.DV_risk = {...this.DV_risk, watched: !this.DV_risk.watched}
        this.updateWatchedRisks(this.DV_risk)
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
        return this.DV_risk.isOverdue
      },
      facility() {
        return this.facilities.find(f => f.id == this.DV_risk.facilityId)
      },
      facilityGroup() {
        return this.facilityGroups.find(f => f.id == this.facility.facilityGroupId)
      },
      C_editForManager() {
        return this.managerView.risk && this.managerView.risk.id == this.DV_risk.id
      }
    },
    watch: {
      risk: {
        handler: function(value) {
          this.DV_risk = Object.assign({}, value)
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
  .risk_form_modal.sweet-modal-overlay {
    z-index: 10000001;
  }
  .risk_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
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
    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
  .red1 {
    background-color: #d9534f;
  }
  .yellow1 {
    background-color: yellow;  
    color:#383838;  
    display: block;
  }
  .orange1 {
    background-color: #f0ad4e;
  }
  .green1 {
    background-color: rgb(92,184,92);
  }  
  .gray2 {
    background-color: #ededed;
  }
  .green1, .orange1, .red1, .yellow1, .gray2 {
    display: inline;   
    border-radius: 2px; 
    padding: 1px 1px;
    box-shadow: 0 1px 2.5px rgba(56,56, 56,0.19), 0 1.5px 1.5px rgba(56,56,56,0.23);
  }
   .green1, .orange1, .red1 {   
    color:#fff;   
  }
  .upperCase {
    text-transform: capitalize;
  }
</style>
