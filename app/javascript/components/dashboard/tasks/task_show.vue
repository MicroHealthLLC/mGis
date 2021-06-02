<template>
  <div data-cy="tasks" @mouseup.right="openContextMenu" @contextmenu.prevent="">
    <div v-if="C_editForManager" class="float-right blur_show">
      <div class="text-primary align-items-center float-right mb-3">
        <i class="fas fa-long-arrow-alt-right"></i>
      </div>
    </div>
    <div v-if="!loading" class="mx-3 mb-1 mt-1 py-1" @click.prevent="editTask">
     
     <!-- ROW 1 -->
     <div class="row">
        <div class="col-md-9 font-lg d-flex pb-2 kanban-text">         
           {{task.text}}       
        </div>
          <div class="col-md-3">          
          <div class="t_actions float-right">
               <span v-if="(task.watched) == true">
              <span v-tooltip="`On Watch`"><i class="fas fa-eye text-md mr-1" data-cy="on_watch_icon"></i></span>
            </span>
              <span v-show="task.important" v-tooltip="`Important`" class="mr-1"> <i class="fas fa-star text-warning"></i></span>
            <span v-show="is_overdue" v-tooltip="`Cverdue`" class="warning-icon"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
          </div>
         
        </div>
      </div>
      
     <!-- ROW 2 -->
         <div class="row my-2">
             <div class="font-sm col-md-12 pt-1 pb-0">
               <span class="mr-2">
                 <span class="fbody-icon mr-0"><i class="fas fa-calendar-alt"></i></span>
                  {{formatDate(task.startDate)}}
               </span>
              
               <span >
                <span class="fbody-icon mr-0"><i class="fas fa-calendar-alt mr-0"></i></span>
                  {{formatDate(task.dueDate)}}
               </span>
             </div>
          </div>     
         
          <div class="row d-flex my-1">
            <div class="font-sm col-md-12 py-1">
              <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
              <span v-tooltip="`Category`">{{task.taskType}}</span>
            </div>
          </div>

        <div class="row d-flex">
            <div class="font-sm pt-1 pb-3 col">
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
    <!-- The context-menu appears only if table row is right-clicked -->
    <ContextMenu
        :facilities="facilities"
        :facilityGroups="facilityGroups"
        :task="task"
        :display="showContextMenu"
        ref="menu"
        @open-task="editTask">  
      </ContextMenu>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import ContextMenu from "../../shared/ContextMenu"

  export default {
    name: 'TaskShow',
    components: {
      ContextMenu
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
        has_task: false,
        showContextMenu: false
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
        'setTaskForManager'
      ]),
      ...mapActions([
        'taskDeleted',
        'taskUpdated',
        'updateWatchedTasks'
      ]),
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
        this.DV_edit_task = this.DV_task
        if (this.$route.path.includes("kanban")) {
          this.$router.push(`/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/tasks/${this.DV_edit_task.id}`)
        } else {
          this.$router.push(`/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/tasks/${this.DV_edit_task.id}`)
        }
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
        'currentProject',
        'viewPermit',
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      is_overdue() {
        return this.DV_task.isOverdue
      },
      facility() {
        return this.facilities.find(f => f.id == this.DV_task.facilityId)
      },
      facilityGroup() {
        return this.facilityGroups.find(f => f.id == this.facility.facilityGroupId)
      },
      C_editForManager() {
        return this.managerView.task && this.managerView.task.id == this.DV_task.id
      },
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

  hr {
    margin: 0;
  }
  .el-menu-item {
    padding: 10px;
    line-height: unset;
    height: unset;
    text-align: center;
    overflow-x: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &:hover {
      background-color: rgba(91, 192, 222, 0.3);
    }
  }
  .context-menu-btns, .filter-input {
    padding: 10px;
  }
  .el-menu-item {
    padding-right: 30px;
  }
  .el-tree {
    padding: 10px;
    max-width: 300px;
    max-height: 300px;
    overflow-y: auto;
  }
 .action-form-overlay {
    position: absolute;
    top:0;   
    form {
        position: inherit !important;
      }
  } 
  .menu-subwindow-title {
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }

</style>

