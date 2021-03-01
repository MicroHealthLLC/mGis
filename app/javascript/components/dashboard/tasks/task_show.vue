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
        <div class="col-md-9 font-lg d-flex mb-1 kanban-text">         
           {{task.text}}       
        </div>
          <div class="col-md-3">
          <div class="t_actions float-left">
            <span v-if="(task.watched) == true">
              <span v-tooltip="`On Watch`"><i class="fas fa-eye text-md" data-cy="on_watch_icon"></i></span>
            </span>
          </div>
          <div class="t_actions float-right">
            <span v-show="is_overdue" v-tooltip="`overdue`" class="warning-icon"><i class="fa fa-exclamation-triangle"></i></span>
          </div>
         
        </div>
      </div>
      
     <!-- ROW 2 -->
         <div class="row my-2">
             <div class="font-sm col-md-12">
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
         
          <div class="row d-flex mb-1">
            <div class="font-sm col-md-12">
              <span class="fbody-icon"><i class="fas fa-tasks"></i></span>
              <span v-tooltip="`Category`">{{task.taskType}}</span>
            </div>
          </div>

        <div class="row d-flex mt-2">
            <div class="font-sm col">
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
    <!-- The context-menu appears only if table row is right-clicked -->
    <context-menu :display="showContextMenu" ref="menu">
      <el-menu collapse>
        <el-menu-item @click="editTask">Open</el-menu-item>
        <hr>
        <el-menu-item @click="createDuplicate" :disabled="!$permissions.tasks.write">Duplicate</el-menu-item>
        <el-submenu index="1" :disabled="!$permissions.tasks.write">
          <template slot="title">
            <span slot="title">Duplicate to...</span>
          </template>
          <div>
            <div class="menu-subwindow-title">Duplicate to...</div>
            <el-input class="filter-input" placeholder="Filter Projects..." v-model="filterTree"></el-input>
            <el-tree
              :data="treeFormattedData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              @check-change="toggleSubmitBtn"
              show-checkbox
              ref="duplicatetree"
              node-key="id"
            >
            </el-tree>
            <div class="context-menu-btns">
              <button class="btn btn-sm btn-success ml-2" @click="duplicateSelectedTasks" :disabled="submitDisabled">Submit</button>
              <button class="btn btn-sm btn-primary ml-2" @click="selectAllNodes">Select All</button>
              <button class="btn btn-sm btn-outline-secondary ml-2" @click="clearAllNodes">Clear All</button>         
            </div>
          </div>
        </el-submenu>
        <hr>
        <el-submenu index="2" :disabled="!$permissions.tasks.write">
          <template slot="title">
            <span slot="title">Move to...</span>
          </template>
          <div>
            <div class="menu-subwindow-title">Move to...</div>
            <el-input class="filter-input" placeholder="Filter Projects..." v-model="filterTree"></el-input>
            <el-tree
              :data="treeFormattedData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              ref="movetree"
              @node-click="move"
            >
            </el-tree>
          </div>
        </el-submenu>
        <hr>
        <el-menu-item @click="deleteTask" :disabled="!$permissions.tasks.delete">Delete</el-menu-item>
      </el-menu>
    </context-menu>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from "vuex"
  import {SweetModal} from 'sweet-modal-vue'
  import TaskForm from "./task_form"
  import IssueForm from "./../issues/issue_form"
  import ContextMenu from "../../shared/ContextMenu"
  import axios from "axios"
  import humps from "humps"

  export default {
    name: 'TaskShow',
    components: {
      TaskForm,
      IssueForm,
      SweetModal,
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
        showContextMenu: false,
        defaultProps: {
          children: "children",
          label: "label",
          disabled: "disabled"
        },
        filterTree: '',
        submitted: true
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
      moveTask(task, facilityProjectId) {
        if (!this._isallowed("write")) return;
        this.$validator.validate().then((success) => {
          if (!success || this.loading) {
            this.showErrors = !success;
            return;
          }

          this.loading = true;
          let formData = new FormData();

          formData.append("task[facility_project_id]", facilityProjectId);

          let url = `/projects/${this.currentProject.id}/facilities/${task.facilityId}/tasks/${task.id}.json`;
          let method = "PUT";
          let callback = "task-updated";

          axios({
            method: method,
            url: url,
            data: formData,
            headers: {
              "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
                .attributes["content"].value,
            },
          })
            .then((response) => {
              this.$emit(callback, humps.camelizeKeys(response.data.task));
              this.updateFacilities(
                humps.camelizeKeys(response.data.task),
                facilityProjectId
              );
              if (response.status === 200) {
                this.$message({
                  message: `${task.text} was moved successfully.`,
                  type: 'success',
                  showClose: true
                });
              }
            })
            .catch((err) => {
              this.$message({
                message: `Unable to move ${task.text}. Please try again.`,
                type: 'error',
                showClose: true
              });
              // var errors = err.response.data.errors
              console.log(err);
            })
            .finally(() => {
              this.loading = false;
              this.updateTasksHash({ task: task, action: "delete" });
            });
        });
      },
      updateFacilities(updatedTask, id) {
        var facilities = this.getUnfilteredFacilities;

        facilities.forEach((facility) => {
          if (facility.facilityProjectId === id) {
            facility.tasks.push(updatedTask);
          }
        });
      },
      updateFacilityTask(task) {
        var facilities = this.getUnfilteredFacilities;

        var facilityIndex = facilities.findIndex(item => item.facilityProjectId === task.facilityProjectId);

        facilities[facilityIndex].tasks.push(task);
      },
      createDuplicate() {
        let url = `/projects/${this.currentProject.id}/facilities/${this.DV_task.facilityId}/tasks/${this.DV_task.id}/create_duplicate.json`
        let method = "POST"
        let callback = "task-created"

        let formData = new FormData()
        formData.append('id', this.DV_task.id)

        axios({
          method: method,
          url: url,
          data: formData,
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
          }
        })
        .then((response) => {
          this.$emit(callback, humps.camelizeKeys(response.data.task))
          this.updateFacilityTask(
            humps.camelizeKeys(response.data.task),
            this.DV_task.facilityProjectId
          );

          if (response.status === 200) {
            this.$message({
              message: `${this.DV_task.text} was duplicated successfully.`,
              type: 'success',
              showClose: true
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: `Unable to duplicate ${this.DV_task.text}. Please try again.`,
            type: 'error',
            showClose: true
          });
          // var errors = err.response.data.errors
          console.log(err)
        })
        .finally(() => {
          // this.loading = false
        })
      },
      selectAllNodes() {
        this.$refs.duplicatetree.setCheckedNodes(this.treeFormattedData)
      },
      clearAllNodes() {
        this.$refs.duplicatetree.setCheckedNodes([])
      },
      move(node) {
        if (!node.hasOwnProperty('children')) {
          this.moveTask(this.task, node.id)
        }    
      },
      duplicateSelectedTasks() {
        this.submitted = true;

        var facilityNodes = this.$refs.duplicatetree.getCheckedNodes().filter(item => !item.hasOwnProperty('children'));
        
        var ids = facilityNodes.map(facility => facility.id)

        let url = `/projects/${this.currentProject.id}/facilities/${this.DV_task.facilityId}/tasks/${this.DV_task.id}/create_bulk_duplicate?`
        let method = "POST"
        let callback = "task-created"

        ids.forEach((id, index) => {
          if (index === 0) {
            url += `facility_project_ids[]=${id}`
          } else {
            url += `&facility_project_ids[]=${id}`
          }  
        })

        let formData = new FormData()
        formData.append('id', this.DV_task.id)
        formData.append('facility_project_ids', ids)

        axios({
          method: method,
          url: url,
          data: formData,
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
          }
        })
        .then((response) => {
          this.$emit(callback, humps.camelizeKeys(response.data.task))

          response.data.tasks.forEach(task => {
            this.updateFacilityTask(humps.camelizeKeys(task), task.facilityProjectId)
          })

          if (response.status === 200) {
            this.$message({
              message: `${this.DV_task.text} was duplicated successfully to selected projects.`,
              type: 'success',
              showClose: true
            });
          }
        })
        .catch((err) => {
          this.$message({
            message: `Unable to duplicate ${this.DV_task.text} to selected projects. Please try again.`,
            type: 'error',
            showClose: true
          });
          // var errors = err.response.data.errors
          console.log(err)
        })
        .finally(() => {
          // this.loading = false
        })
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.toLowerCase().indexOf(value.toLowerCase()) !== -1;
      },
      toggleSubmitBtn() {
        this.submitted = false
      },
      deleteTask() {
        let confirm = window.confirm(`Are you sure you want to delete "${this.DV_task.text}"?`)
        if (!confirm) {return}
        this.taskDeleted(this.DV_task)
      }
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
        'getUnfilteredFacilities'
      ]),
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      isMapView() {
        return this.$route.name === 'ProjectMapView'
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
      },
      treeFormattedData() {
        var data = [];

        this.facilityGroups.forEach((group, index) => {
          data.push({
            id: index,
            label: group.name,
            children: [...group.facilities.filter(facility => facility.facility.id !== this.DV_task.facilityId).map(facility => {
              return {
                id: facility.facilityProjectId,
                label: facility.facilityName
              }
            })],
          });
        });

        return [...data]    
      },
      submitDisabled() {
        if (this.$refs.duplicatetree) {
          return this.$refs.duplicatetree.getCheckedNodes().length === 0 || this.submitted
        } else {
          return this.submitted
        }  
      },
    },
    watch: {
      task: {
        handler(value) {
          this.DV_task = Object.assign({}, value)
        },
        deep: true
      },
      filterTree(value) {
        this.$refs.duplicatetree.filter(value);
        this.$refs.movetree.filter(value);
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
  .menu-subwindow-title {
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
  .map-v {
    width:31vw;
    // float:right;
  }
</style>

