
<template>
  <div id="task-sheets">
    <table v-if="!has_task" class="table table-sm table-bordered table-striped p-3">
      <tr v-if="!loading" class="mx-3 mb-3 mt-2 py-4 edit-action" @click.prevent="editTask" data-cy="task_row" @mouseup.right="openContextMenu" @contextmenu.prevent="">
        <td class="oneSix">{{task.text}}</td>
        <td class="ten">{{task.taskType}}</td>
        <td class="eight text-center">{{formatDate(task.startDate)}}</td>
        <td class="eigth text-center">
         <span v-if="task.ongoing" v-tooltip="`Ongoing`"><i class="far fa-retweet text-success"></i></span>
        <span v-else>
         {{formatDate(task.dueDate)}}
        </span>
       </td>
        <td class="fort" >
          <span v-if="(task.responsibleUsers.length > 0) && (task.responsibleUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">R</span>{{task.responsibleUsers[0].name}} <br></span> 
          <span v-if="(task.accountableUsers.length > 0) && (task.accountableUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">A</span>{{task.accountableUsers[0].name}}<br></span>   
          <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(task.consultedUsers.length > 0) && (task.consultedUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">C</span>{{JSON.stringify(task.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, ' ')}}<br></span> 
             <span v-if="(task.informedUsers.length > 0) && (task.informedUsers[0] !== null)"> <span class="badge font-sm badge-secondary mr-1 badge-pill">I</span>{{JSON.stringify(task.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g,' ')}}</span>      
         </span>        
        </td>
        <td class="eight text-center">
        <span v-if="task.ongoing" v-tooltip="`Ongoing`"><i class="far fa-retweet text-success"></i></span>
        <span v-else>{{task.progress + "%"}}</span>
        </td>
        <td class="fort text-center">
            <span v-if="task.watched == true"  v-tooltip="`On Watch`"><font-awesome-icon icon="eye" class="mr-1"  /></span>
            <span v-if="task.important == true"  v-tooltip="`Important`"> <i class="fas fa-star text-warning mr-1"></i></span>
            <span v-if="task.reportable" v-tooltip="`Briefings`"> <i class="fas fa-presentation mr-1 text-primary"></i></span>
            <span v-if="task.isOverdue" v-tooltip="`Overdue`"><font-awesome-icon icon="calendar" class="text-danger mr-1"  /></span>
            <span v-if="task.progress == 100" v-tooltip="`Completed`"><font-awesome-icon icon="clipboard-check" class="text-success"  /></span>   
            <span v-if="task.ongoing == true" v-tooltip="`Ongoing`"><i class="far fa-retweet text-success"></i></span>   
            <span v-if="task.onHold == true" v-tooltip="`On Hold`"> <i class="fas fa-pause-circle mr-1 text-primary"></i></span>   
            <span v-if="task.draft == true" v-tooltip="`Draft`"> <i class="fas fa-pencil-alt text-warning"></i></span>   
            <span v-if="
                      task.important == false &&
                      task.reportable == false &&
                      task.watched == false &&
                      task.ongoing == false && 
                      task.isOverdue == false &&
                      task.onHold == false &&  
                      task.draft == false && 
                      task.progress < 100 "             
                    >
                  No flags at this time         
            </span>
              
        </td>
        <td class="twentyTwo" v-if="task.notes.length > 0">
          <span v-if="(task.notesUpdatedAt.length) >= 2" >   
          <span  class="toolTip" v-tooltip="('By: ' + task.notes[task.notes.length - 1].user.fullName)" >
          {{moment(task.notesUpdatedAt[task.notesUpdatedAt.length - 1]).format('DD MMM YYYY, h:mm a')}}
           <br>
          </span>     
            {{task.notes[task.notes.length - 1].body}}
          </span>
      
          

         <span v-if="(task.notesUpdatedAt.length) === 1" >   
          <span  class="toolTip" v-tooltip="('By: ' + task.notes[task.notes.length - 1].user.fullName)" >
          {{moment(task.notesUpdatedAt[0]).format('DD MMM YYYY, h:mm a')}}
           <br>
          </span>     
            {{task.notes[task.notes.length - 1].body}}
          </span>
         
        <!-- <span v-else >No Updates</span>     -->
         
        </td>  
         <td class="twentyTwo" v-else >No Updates</td>     
       
      
      </tr>

      <!-- The context-menu appears only if table row is right-clicked -->
      <ContextMenu
        :facilities="facilities"
        :facilityGroups="facilityGroups"
        :task="task"
        :display="showContextMenu"
        ref="menu"
        @open-task="editTask">  
      </ContextMenu>
    </table>
    <div v-else class="w-100 action-form-overlay updateForm">
      <task-form
        v-if="Object.entries(DV_edit_task).length"
        :facility="facility"
        :task="DV_edit_task"
        title="Edit Task"
        @task-updated="updateRelatedTaskIssue"
        @on-close-form="onCloseForm"
        class="form-inside-modal"
      ></task-form>     
    </div>  
  </div>
</template>

<script src="https://kit.fontawesome.com/28fee60001.js" crossorigin="anonymous"></script>
<script>

import { mapGetters, mapMutations, mapActions } from "vuex";
import TaskForm from "./task_form";
import IssueForm from "./../issues/issue_form";
import ContextMenu from "../../shared/ContextMenu";
import moment from "moment";
Vue.prototype.moment = moment;

export default {
  name: "TaskSheets",
  components: {
    TaskForm,
    IssueForm,
    ContextMenu,
  },
  props:     
      {
    fromView: {
      type: String,
      default: "map_view",
    },
    task: Object,
    showToggle:Boolean,   
  },
  data() {
    return {
      loading: true,
      now: new Date().toISOString(),
      DV_task: {},       
      showALL:"none",  
      DV_edit_task: {},
      DV_edit_issue: {},
      has_task: false,
      showContextMenu: false
    };
  },
  mounted() {
    if (this.task) {
      this.loading = false;
      this.DV_task = this.task;
    }    
  },
  methods: {
    ...mapMutations(["updateTasksHash", "setTaskForManager", "setToggleRACI"]),
    ...mapActions(["taskDeleted", "taskUpdated", "updateWatchedTasks"]),
    openSubTask(subTask) {
      let task = this.currentTasks.find((t) => t.id == subTask.id);
      if (!task) return;
      this.has_task = Object.entries(task).length > 0;
      this.DV_edit_task = task;
      this.$refs.taskFormModal && this.$refs.taskFormModal.open();
    },
    openSubIssue(subIssue) {
      let issue = this.currentIssues.find((t) => t.id == subIssue.id);
      if (!issue) return;
      this.has_task = Object.entries(issue).length > 0;
      this.DV_edit_issue = issue;
      this.$refs.taskFormModal && this.$refs.taskFormModal.open();
    },  
    editTask() {
        this.DV_edit_task = this.DV_task;
        
        this.$router.push(`/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/tasks/${this.DV_edit_task.id}`)
    },
    onCloseForm() {
      this.$refs.taskFormModal && this.$refs.taskFormModal.close();
      this.has_task = false;
      this.DV_edit_task = {};
      this.DV_edit_issue = {};
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
    },
    getTask(task) {
      return this.currentTasks.find((t) => t.id == task.id) || {};
    },
    getIssue(issue) {
      return this.currentIssues.find((t) => t.id == issue.id) || {};
    },
    openContextMenu(e) {
      e.preventDefault();
      this.$refs.menu.open(e);
    },
    deleteTask() {
      let confirm = window.confirm(`Are you sure you want to delete "${this.DV_task.text}"?`)
      if (!confirm) {return}
      this.taskDeleted(this.DV_task)
    }
  },
  computed: {
    ...mapGetters([
      "facilities",
      "facilityGroups",
      "managerView",
      "currentTasks",
      "currentIssues",
      "viewPermit",
      "getToggleRACI",
      "currentProject",
      "getUnfilteredFacilities"
    ]),
    _isallowed() {
      return (salut) =>
        this.$currentUser.role == "superadmin" ||
        this.$permissions.tasks[salut];
    },
    facility() {
      return this.facilities.find((f) => f.id == this.DV_task.facilityId);
    },
    facilityGroup() {
      return this.facilityGroups.find(
        (f) => f.id == this.facility.facilityGroupId
      );
    },
    C_editForManager() {
      return (
        this.managerView.task && this.managerView.task.id == this.DV_task.id
      );
    }
  },
  watch: {
    task: {
      handler(value) {
        this.DV_task = Object.assign({}, value);
      },
      deep: true,
    },
    filterTree(value) {
      this.$refs.duplicatetree.filter(value);
      this.$refs.movetree.filter(value);
    }
  },
};
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
table {
  table-layout: fixed;
  width: 100%;
  margin-bottom: 0 !important;
  overflow: auto;
}
.eight {
  width: 8%;
}
.ten {
  width: 10%;
}
.fort {
  width: 14%;
}
.oneSix {
  width: 16%;
}
.twenty {
  width: 20%;
}
.twentyTwo {
  width: 22%;
}
.pg-content {
  width: 100%;
  height: 20px;
  font-weight: bold;
}
.action-form-overlay {
  position: absolute;
  top:0;
 } 
td {
  overflow-wrap: break-word;
}
// .task_form_modal.sweet-modal-overlay {
//   z-index: 10000001;
// }
.task_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
  min-width: 30vw;
  max-height: 80vh;
  .sweet-content {
    padding-top: 30px;
    text-align: unset;
  }
  .badge-pill {
    font-size: .85rem;
  }
  td {
    overflow-wrap: break-word;
  }
  // .task_form_modal.sweet-modal-overlay {
  //   z-index: 10000001;
  // }
  .task_form_modal.sweet-modal-overlay /deep/ .sweet-modal {
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
    // .show-all {
    //  color: red !important;
    // }
    .fa-long-arrow-alt-right {
      margin-bottom: 1rem !important;
      margin-left: 1rem !important;
      height: .8em !important;
    }
    .onHover:hover {
      cursor: pointer !important;
      background-color: rgba(91, 192, 222, 0.3) !important;
      border-left: solid rgb(91, 192, 222) !important;
    }
    .form-inside-modal {
      form {
        position: inherit !important;
      }
    }
  }
  .fa-long-arrow-alt-right {
    margin-bottom: 1rem !important;
    margin-left: 1rem !important;
    height: 0.8em !important;
  }
  .onHover:hover {
    cursor: pointer !important;
    background-color: rgba(91, 192, 222, 0.3) !important;
    border-left: solid rgb(91, 192, 222) !important;
  }
  .toolTip {
    background-color: #6c757d;
    font-size: .75rem;
    padding:1px;
    color: #fff;
    border-radius: 3px;
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
}
</style>
