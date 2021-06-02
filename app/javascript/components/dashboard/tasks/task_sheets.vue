
<template>
  <div id="task-sheets">
    <table v-if="!has_task" class="table table-sm table-bordered table-striped p-3">
      <tr v-if="!loading" class="mx-3 mb-3 mt-2 py-4 edit-action" @click.prevent="editTask" data-cy="task_row" @mouseup.right="openContextMenu" @contextmenu.prevent="">
        <td class="sixteen">{{task.text}}</td>
        <td class="ten">{{task.taskType}}</td>
        <td class="eight">{{formatDate(task.startDate)}}</td>
        <td class="eight">{{formatDate(task.dueDate)}}</td>
        <td class="fort" >
          <span v-if="(task.responsibleUsers.length > 0) && (task.responsibleUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">R</span>{{task.responsibleUsers[0].name}} <br></span> 
          <span v-if="(task.accountableUsers.length > 0) && (task.accountableUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">A</span>{{task.accountableUsers[0].name}}<br></span>   
          <!-- Consulted Users and Informed Users are toggle values         -->
          <span :class="{'show-all': getToggleRACI }" >             
             <span v-if="(task.consultedUsers.length > 0) && (task.consultedUsers[0] !== null)"> <span class="badge mr-1 font-sm badge-secondary badge-pill">C</span>{{JSON.stringify(task.consultedUsers.map(consultedUsers => (consultedUsers.name))).replace(/]|[['"]/g, ' ')}}<br></span> 
             <span v-if="(task.informedUsers.length > 0) && (task.informedUsers[0] !== null)"> <span class="badge font-sm badge-secondary mr-1 badge-pill">I</span>{{JSON.stringify(task.informedUsers.map(informedUsers => (informedUsers.name))).replace(/]|[['"]/g,' ')}}</span>      
         </span>        
        </td>
        <td class="eight">{{task.progress + "%"}}</td>
        <td class="eight" v-if="task.isOverdue"><h5>x</h5></td>
        <td class="eight" v-else></td>
        <td class="eight" v-if="task.watched == true"><h5>x</h5></td>
        <td class="eight" v-else></td>
        <td class="twenty" v-if="(task.notesUpdatedAt.length) > 0">
           <span class="toolTip" v-tooltip="('By: ' + task.notes[0].user.fullName)">              
          {{moment(task.notesUpdatedAt[0]).format('DD MMM YYYY, h:mm a')}}
            </span>
            <br> {{task.notes[0].body}}
           
        </td>       
        <td v-else class="twenty">No Updates</td>
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
.sixteen {
  width: 16%;
}
.twenty {
  width: 20%;
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
