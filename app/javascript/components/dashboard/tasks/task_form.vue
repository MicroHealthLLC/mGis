<template>
  <div>
    <form
      id="tasks-form"
      @submit.prevent="saveTask"
      class="mx-auto"
      :class="{'_disabled': loading}"
      accept-charset="UTF-8"
      >
       <div v-if="_isallowed('read')" class="d-flex form-group sticky mb-2 justify-content-start">
        <button
          v-if="_isallowed('write')"
          :disabled="!readyToSave"
          class="btn btn-sm sticky-btn btn-success"
          data-cy="task_save_btn"
          >
          Save
        </button>
        <button
          v-else
          disabled
          class="btn btn-sm sticky-btn btn-light"
          data-cy="task_read_only_btn"
          >
          Read Only
        </button>
        <button
          class="btn btn-sm sticky-btn btn-warning ml-2"
          @click.prevent="cancelSave"
          data-cy="task_close_btn"
          >
          Close
        </button>
        <button
          class="btn btn-sm sticky-btn btn-warning ml-2"
          @click.prevent="createDuplicate"
          data-cy="task_close_btn"
          :load="log(task)"
          v-if="DV_task.id"
        >
          Duplicate
        </button>
        <!-- <div class="btn-group">
           <button  
          v-if="_isallowed('write')"       
          class="btn btn-sm sticky-btn btn-light mr-1 scrollToChecklist"    
          @click.prevent="scrollToChecklist"            
          >
          <font-awesome-icon icon="plus-circle" />
          Checklists
        </button>
         <button  
          v-if="_isallowed('write')"       
          class="btn btn-sm sticky-btn btn-light scrollToChecklist"    
          @click.prevent="scrollToUpdates"            
          >
          <font-awesome-icon icon="plus-circle" />
          Updates
        </button>
        </div>         -->
        <button
          v-if="_isallowed('delete') && DV_task.id"
          @click.prevent="deleteTask"
          class="btn btn-sm btn-danger sticky-btn ml-auto"
          data-cy="task_delete_btn"
          >
          <i class="fas fa-trash-alt mr-2"></i>
          Delete
        </button>
      </div>
      <div v-if="_isallowed('read')" class="d-flex form-group pt-1 mb-1 justify-content-start">
          
      <custom-tabs :current-tab="currentTab" :tabs="tabs" @on-change-tab="onChangeTab" class="custom-tab" />       
      
      </div>
    
     <div class="formTitle pt-1">
      <div
        v-if="showErrors"
        class="text-danger mb-3"
        >
        Please fill the required fields before submitting
      </div>


<!-- Tabbed sections begin here -->

  <!-- TASK INFO TAB #1 -->
  <div v-if="currentTab == 'tab1'" class="paperLookTab tab1">
        
    <div class="form-group pt-3 mx-4">
        <label class="font-sm">*Task Name:</label>
            <span v-if="_isallowed('write')" class="watch_action clickable float-right" @click.prevent.stop="toggleWatched" data-cy="task_on_watch">
              <span v-show="DV_task.watched" class="check_box mr-1"><i class="far fa-check-square"></i></span>
              <span v-show="!DV_task.watched" class="empty_box mr-1"><i class="far fa-square"></i></span>
              <span><i class="fas fa-eye"></i></span><small style="vertical-align:text-top"> On Watch</small>
            </span>
            <input
              name="Name"
              v-validate="'required'"
              type="text"
              class="form-control form-control-sm"
              v-model="DV_task.text"
              placeholder="Task Name"
              :readonly="!_isallowed('write')"
              :class="{'form-control': true, 'error': errors.has('Name') }"
              data-cy="task_name"
            />
        <div v-show="errors.has('Name')" class="text-danger" data-cy="task_name_error">
          {{errors.first('Name')}}
        </div>
      </div>

        <div class="form-group mx-4">
        <label class="font-sm">Description:</label>
        <textarea
          class="form-control"
          placeholder="Task brief description"
          v-model="DV_task.description"
          rows="4"
          :readonly="!_isallowed('write')"
          data-cy="task_description"
        />
      </div>

  <!-- Row begins -->
       <div  class="w-100 d-flex mb-0 form-group">
         <div class="simple-select form-group w-100 ml-4">
        <label class="font-sm">*Project:</label>
        <multiselect
          v-model="selectedFacilityProject"
          v-validate="'required'"
          track-by="id"
          label="name"
          placeholder="Select Facility"
          :options="getFacilityProjectOptions"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write')"
          data-cy="facility_project_id"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
      </div>
      <div class="simple-select form-group w-100 mx-2">
        <label class="font-sm">*Task Category:</label>
        <multiselect
          v-model="selectedTaskType"
          v-validate="'required'"
          track-by="id"
          label="name"
          placeholder="Select Task Category"
          :options="taskTypes"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write')"
          data-cy="task_type"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
      </div>
      <div class="simple-select w-100 form-group mr-4">
        <label class="font-sm">Stage:</label>
        <multiselect
          v-model="selectedTaskStage"
          track-by="id"
          label="name"
          placeholder="Select Stage"
          :options="taskStages"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write') || !!fixedStage"
          data-cy="task_stage"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
      </div>
    </div>
    <!-- Row ends -->
    <div class="form-row mx-4">
        <div class="form-group col-md-6 pl-0">
          <label class="font-sm">*Start Date:</label>
          <v2-date-picker
            v-validate="'required'"
            v-model="DV_task.startDate"
            value-type="YYYY-MM-DD"
            format="DD MMM YYYY"
            placeholder="DD MM YYYY"
            name="Start Date"
            class="w-100 vue2-datepicker"
            :disabled="!_isallowed('write')"
            data-cy="task_start_date"
          />
          <div v-show="errors.has('Start Date')" class="text-danger" data-cy="task_start_date_error">
            {{errors.first('Start Date')}}
          </div>
        </div>
        <div class="form-group col-md-6 pr-0">
          <label class="font-sm">*Due Date:</label>
          <v2-date-picker
            v-validate="'required'"
            v-model="DV_task.dueDate"
            value-type="YYYY-MM-DD"
            format="DD MMM YYYY"
            placeholder="DD MM YYYY"
            name="Due Date"
            class="w-100 vue2-datepicker"
            :disabled="!_isallowed('write') || DV_task.startDate === '' || DV_task.startDate === null"
            :disabled-date="disabledDueDate"
            data-cy="task_due_date"
          />
          <div v-show="errors.has('Due Date')" class="text-danger" data-cy="task_due_date_error">
            {{errors.first('Due Date')}}
          </div>
        </div>
      </div>

      <div class="form-group user-select mx-4">
        <label class="font-sm mb-0">Assign Users:</label>
        <multiselect
          v-model="taskUsers"
          track-by="id"
          label="fullName"
          placeholder="Search and select users"
          :options="activeProjectUsers"
          :searchable="true"
          :multiple="true"
          select-label="Select"
          deselect-label="Enter to remove"
          :close-on-select="false"
          :disabled="!_isallowed('write')"
          data-cy="task_user"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.fullName}}</span>
            </div>
          </template>
        </multiselect>
      </div>
      <!-- closing div for tab1 -->
</div>


<!-- CHECKLIST TAB #2-->

<div v-if="currentTab == 'tab2'" class="paperLookTab tab2">
      
      <div class="form-group pt-3 mx-4">
        <label class="font-sm">Checklists:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addChecks">
          <i class="fas fa-plus-circle" ></i>
        </span>
        <div v-if="filteredChecks.length > 0">
        <draggable :move="handleMove" @change="(e) => handleEnd(e, DV_task.checklists)" :list="DV_task.checklists" :animation="100" ghost-class="ghost-card">
          <div v-for="(check, index) in DV_task.checklists" :key="index" class="d-flex w-100 mb-3 drag" v-if="!check._destroy && isMyCheck(check)">
            <div class="form-control h-100">
              <div class="row">
                <div class="col justify-content-start">
                  <input type="checkbox" name="check" :checked="check.checked" @change="updateCheckItem($event, 'check', index)" :key="`check_${index}`" :disabled="!_isallowed('write') || !check.text.trim()">
                  <input :value="check.text" name="text" @input="updateCheckItem($event, 'text', index)" :key="`text_${index}`" placeholder="Checkpoint name here" type="text" class="checklist-text pl-1" maxlength="80" :readonly="!_isallowed('write')">
                </div>
              </div>
              <div class="row justify-content-end">             
               <div class="simple-select form-group col mb-0">
                <label class="font-sm">Assigned To:</label>
                <multiselect
                  v-model="check.user"
                  track-by="id"
                  label="fullName"
                  placeholder="Search and select users"
                  :options="activeProjectUsers"
                  :searchable="true"
                  :disabled="!_isallowed('write') || !check.text"
                  select-label="Select"
                  deselect-label="Enter to remove"
                  >
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name'>{{option.fullName}}</span>
                    </div>
                  </template>
              </multiselect>
             </div>
               <div class="simple-select form-group col mb-0">
                 <div class="float-right">
                   <label class="font-sm dueDate">Due Date:</label>  
                   <br/>                    
                    <v2-date-picker                    
                      v-model="check.dueDate"
                      :value="check.dueDate" 
                      :disabled="!_isallowed('write') || !check.text"
                      @selected="updateCheckItem($event, 'dueDate', index)"
                      :key="`dueDate_${index}`"
                      value-type="YYYY-MM-DD"
                      format="DD MMM YYYY"
                      placeholder="DD MM YYYY"
                      name="dueDate"
                      class="w-100 vue2-datepicker d-flex ml-auto"
                      :disabled-date="disabledDateRange"
                      :class="{ disabled: disabled }"          
                    />
                 </div>
                </div>       
               </div>
            </div>             
            <span class="del-check clickable" v-if="_isallowed('write')" @click.prevent="destroyCheck(check, index)">
              <i class="fas fa-times"></i>
            </span>
          </div>
        </draggable>       
        </div>
        <p v-else class="text-danger font-sm">No checks..</p>
      </div>
 <!-- closing div for tab2 -->
</div>


   <!-- FILES TAB # 3-->
<div v-if="currentTab == 'tab3'" class="paperLookTab tab3">

      <div class="mx-4">
        <div class="input-group pt-3 mb-2">
          <div v-for="file in filteredFiles" class="d-flex mb-2 w-100">
            <div class="input-group-prepend">
              <div class="input-group-text clickable" :class="{'btn-disabled': !file.uri}" @click.prevent="downloadFile(file)">
                <i class="fas fa-file-image"></i>
              </div>
            </div>
            <input
              readonly
              type="text"
              class="form-control form-control-sm mw-95"
              :value="file.name || file.uri"
            />
            <div
              :class="{'_disabled': loading || !_isallowed('write') }"
              class="del-check clickable"
              @click.prevent="deleteFile(file)"
              >
              <i class="fas fa-times"></i>
            </div>
          </div>
        </div>
      </div>

      <div v-if="_isallowed('write')" class="form-group mx-4" >
        <label class="font-sm">Files:</label>
        <attachment-input
          @input="addFile"
          :show-label="true"
        ></attachment-input>
      </div>
<!-- closing div for tab3 -->
</div>


 <!-- RELATED TAB #4 -->  
<div v-if="currentTab == 'tab4'" class="paperLookTab tab4">
           
      <div class="form-group user-select pt-3 mx-4">
        <label class="font-sm mb-0">Related Tasks:</label>
        <multiselect
          v-model="relatedTasks"
          track-by="id"
          label="text"
          placeholder="Search and select Related-tasks"
          :options="filteredTasks"
          :searchable="true"
          :multiple="true"
          select-label="Select"
          deselect-label="Enter to remove"
          :close-on-select="false"
          :disabled="!_isallowed('write')"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.text}}</span>
            </div>
          </template>
        </multiselect>
      </div>

      <div class="form-group user-select mx-4">
        <label class="font-sm mb-0">Related Issues:</label>
        <multiselect
          v-model="relatedIssues"
          track-by="id"
          label="title"
          placeholder="Search and select Related-issues"
          :options="filteredIssues"
          :searchable="true"
          :multiple="true"
          select-label="Select"
          deselect-label="Enter to remove"
          :close-on-select="false"
          :disabled="!_isallowed('write')"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.title}}</span>
            </div>
          </template>
        </multiselect>
      </div>
    <!-- closing div for tab4 -->
 </div>


  <!-- UPDATE TAB 5 -->
  <div v-if="currentTab == 'tab5'" class="paperLookTab tab5">       
     
      <div class="form-group pt-3 mx-4">
        <label class="font-sm mb-0">Progress: (in %)</label>
        <span class="ml-3">
          <label class="font-sm mb-0 d-inline-flex align-items-center">
            <input type="checkbox" 
            v-model="DV_task.autoCalculate" 
            :disabled="!_isallowed('write')" 
            :readonly="!_isallowed('write')">
            <span>&nbsp;&nbsp;Auto Calculate Progress</span></label>
        </span>
        <vue-slide-bar
          v-model="DV_task.progress"
          :line-height="8"      
          :is-disabled="!_isallowed('write') || DV_task.autoCalculate"
          :draggable="_isallowed('write') && !DV_task.autoCalculate"
        ></vue-slide-bar>
      </div>      
    
     <div class="form-group mx-4 paginated-updates">
        <label class="font-sm">Updates:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addNote">
          <i class="fas fa-plus-circle"></i>
        </span>
        <paginate-links v-if="filteredNotes.length" for="filteredNotes" :show-step-links="true" :limit="2"></paginate-links>
        <paginate ref="paginator" name="filteredNotes" :list="filteredNotes" :per="5" class="paginate-list" :key="filteredNotes ? filteredNotes.length : 1">
          <div v-for="note in paginated('filteredNotes')" class="form-group">
            <span class="d-inline-block w-100"><label class="badge badge-secondary">Note by</label> <span class="font-sm text-muted">{{noteBy(note)}}</span>
              <span v-if="allowDeleteNote(note)" class="clickable font-sm delete-action float-right" @click.prevent.stop="destroyNote(note)">
                <i class="fas fa-trash-alt"></i>
              </span>
            </span>
            <textarea class="form-control" v-model="note.body" rows="3" placeholder="your note comes here." :readonly="!allowEditNote(note)"></textarea>
          </div>
        </paginate>
      </div>       
     </div>
     <!-- closing div for tab5 -->
  </div>






    
     

   

      
      
  



     <!-- <div ref="addCheckItem" class="pt-0 mt-0 mb-4"> </div> -->
      

      
    
     <h6 class="text-danger text-small pl-1 float-right">*Indicates required fields</h6>
       <!-- <div ref="addUpdates" class="pt-0 mt-0"> </div> -->
    </form>
    <div v-if="loading" class="load-spinner spinner-border text-dark" role="status"></div>    
  </div>
</template>

<script>
  import axios from 'axios'
  import Draggable from "vuedraggable"
  import CustomTabs from './../../shared/custom-tabs'
  import humps from 'humps'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import AttachmentInput from './../../shared/attachment_input'



  export default {
    name: 'TaskForm',
    props: ['facility', 'task', 'title', 'fixedStage'],
    components: {
      AttachmentInput, Draggable, CustomTabs
    },
    data() {
      return {
        DV_task: this.INITIAL_TASK_STATE(),
        paginate: ['filteredNotes'],
        destroyedFiles: [],
        selectedFacilityProject: null,
        selectedTaskType: null,
        selectedTaskStage: null,
        taskUsers: [],
        relatedIssues: [],
        relatedTasks: [],
        _ismounted: false,
        showErrors: false,
        loading: true,
        movingSlot: '',
        currentTab: 'tab1',
        tabs: [
          {
            label: 'TASK INFO',
            key: 'tab1',
            closable: false
          },
          {
            label: 'CHECKLIST',
            key: 'tab2',
            closable: false
          },
          {
            label: 'FILES',
            key: 'tab3',
            closable: false
          },
           {
            label: 'RELATED',
            key: 'tab4',
            closable: false,     
                      
          },          
           {
            label: 'UPDATES',
            key: 'tab5',
            closable: false,     
                      
          },          
        ]
      }
    },
    mounted() {
      if (!_.isEmpty(this.task)) {
        this.loadTask(this.task)
      }
      if (this.fixedStage) {
        this.selectedTaskStage = this.taskStages.find(t => t.id === this.fixedStage)
      }
      this.loading = false
      this._ismounted = true
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
      INITIAL_TASK_STATE() {
        return {
          text: '',
          startDate: '',
          dueDate: '',
          facilityProjectId: '',
          checklistDueDate: '',
          taskTypeId: '',
          taskStageId: '',
          userIds: [],
          subTaskIds: [],
          subIssueIds: [],
          description: '',
          progress: 0,
          autoCalculate: true,
          taskFiles: [],
          checklists: [],
          notes: []
        }
      },
      log(e){
      },
      scrollToChecklist(){
        this.$refs.addCheckItem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        this.DV_task.checklists.push({text: '', checked: false})
      },   
      scrollToUpdates(){
        this.$refs.addUpdates.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        this.DV_task.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },   
      handleMove(item) {
        this.movingSlot = item.relatedContext.component.$vnode.key
        return true
      },
      onChangeTab(tab) {
        this.currentTab = tab ? tab.key : 'tab1'
      },
      handleEnd(e, checklists){
        var cc = this.DV_task.checklists
        var count = 0
        for(var checklist of cc){
          checklist.position = count
          count++
        }
      },        
      deleteTask() {
        let confirm = window.confirm(`Are you sure you want to delete "${this.DV_task.text}"?`)
        if (!confirm) {return}
        this.taskDeleted(this.DV_task)
        this.cancelSave()
      },
      loadTask(task) {
        this.DV_task = {...this.DV_task, ..._.cloneDeep(task)}
        this.taskUsers = _.filter(this.activeProjectUsers, u => this.DV_task.userIds.includes(u.id))
        this.relatedIssues = _.filter(this.filteredIssues, u => this.DV_task.subIssueIds.includes(u.id))
        this.relatedTasks = _.filter(this.filteredTasks, u => this.DV_task.subTaskIds.includes(u.id))
        this.selectedTaskType = this.taskTypes.find(t => t.id === this.DV_task.taskTypeId)
        this.selectedTaskStage = this.taskStages.find(t => t.id === this.DV_task.taskStageId)
        this.selectedFacilityProject = this.getFacilityProjectOptions.find(t => t.id === this.DV_task.facilityProjectId)
        if (task.attachFiles) this.addFile(task.attachFiles)
        this.$nextTick(() => {
          this.errors.clear()
          this.$validator.reset()
        })
      },
      addFile(files) {
        let _files = [...this.DV_task.taskFiles]
        for (let file of files) {
          file.guid = this.guid()
          _files.push(file)
        }
        this.DV_task.taskFiles = _files
      },
      deleteFile(file) {
        if (!file) return;
        let confirm = window.confirm(`Are you sure you want to delete attachment?`)
        if (!confirm) return;

        if (file.uri) {
          let index = this.DV_task.taskFiles.findIndex(f => f.guid === file.guid)
          Vue.set(this.DV_task.taskFiles, index, {...file, _destroy: true})
          this.destroyedFiles.push(file)
        }
        else if (file.name) {
          this.DV_task.taskFiles.splice(this.DV_task.taskFiles.findIndex(f => f.guid === file.guid), 1)
        }
      },
       toggleWatched() {
        if (this.DV_task.watched) {
          let confirm = window.confirm(`Are you sure, you want to remove this task from on-watch?`)
          if (!confirm) {return}
        }
          this.DV_task = {...this.DV_task, watched: !this.DV_task.watched}
          this.updateWatchedTasks(this.DV_task)
      },
      cancelSave() {
        this.$emit('on-close-form')
        this.setTaskForManager({key: 'task', value: null})
      },
      createDuplicate(){

        let url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/tasks/${this.DV_task.id}/create_duplicate.json`
        let method = "POST"
        let callback = "task-created"

        this.loading = true
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
        })
        .catch((err) => {
          // var errors = err.response.data.errors
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      },
      saveTask() {
        if (!this._isallowed('write')) return
        this.$validator.validate().then((success) =>
        {
          if (!success || this.loading) {
            this.showErrors = !success
            return;
          }

          this.loading = true
          let formData = new FormData()
          formData.append('task[text]', this.DV_task.text)
          formData.append('task[due_date]', this.DV_task.dueDate)
          formData.append('task[start_date]', this.DV_task.startDate)
          formData.append('task[task_type_id]', this.DV_task.taskTypeId)
          formData.append('task[task_stage_id]', this.DV_task.taskStageId)
          formData.append('task[progress]', this.DV_task.progress)
          formData.append('task[auto_calculate]', this.DV_task.autoCalculate)
          formData.append('task[description]', this.DV_task.description)
          formData.append('task[facility_project_id]', this.DV_task.facilityProjectId)
          formData.append('task[destroy_file_ids]', _.map(this.destroyedFiles, 'id'))

          if (this.DV_task.userIds.length) {
            for (let u_id of this.DV_task.userIds) {
              formData.append('task[user_ids][]', u_id)
            }
          }
          else {
            formData.append('task[user_ids][]', [])
          }

          if (this.DV_task.subTaskIds.length) {
            for (let u_id of this.DV_task.subTaskIds) {
              formData.append('task[sub_task_ids][]', u_id)
            }
          }
          else {
            formData.append('task[sub_task_ids][]', [])
          }

          if (this.DV_task.subIssueIds.length) {
            for (let u_id of this.DV_task.subIssueIds) {
              formData.append('task[sub_issue_ids][]', u_id)
            }
          }
          else {
            formData.append('task[sub_issue_ids][]', [])
          }

          for (let i in this.DV_task.checklists) {
            let check = this.DV_task.checklists[i]
            if (!check.text && !check._destroy) continue
            for (let key in check) {         
              if (key === 'user') key = 'user_id'            
              let value = key == 'user_id' ? check.user ? check.user.id : null : check[key]
              // if (key === "dueDate"){
              //   key = "due_date"
              // }
              key = humps.decamelize(key)
              if(['created_at', 'updated_at'].includes(key)) continue
              formData.append(`task[checklists_attributes][${i}][${key}]`, value)
            }              
          }          

          for (let i in this.DV_task.notes) {
            let note = this.DV_task.notes[i]
            if (!note.body && !note._destroy) continue
            for (let key in note) {
              let value = key == 'user_id' ? note.user_id ? note.user_id : this.$currentUser.id : note[key]
              formData.append(`task[notes_attributes][${i}][${key}]`, value)
            }
          }

          for (let file of this.DV_task.taskFiles) {
            if (!file.id) {
              formData.append('task[task_files][]', file)
            }
          }

          let url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/tasks.json`
          let method = "POST"
          let callback = "task-created"

          if (this.task && this.task.id) {
            url = `/projects/${this.currentProject.id}/facilities/${this.task.facilityId}/tasks/${this.task.id}.json`
            method = "PUT"
            callback = "task-updated"
          }

          var beforeSaveTask = this.task

          axios({
            method: method,
            url: url,
            data: formData,
            headers: {
              'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
            }
          })
          .then((response) => {
            if(beforeSaveTask.facilityId && beforeSaveTask.projectId )
              this.$emit(callback, humps.camelizeKeys(beforeSaveTask))
            this.$emit(callback, humps.camelizeKeys(response.data.task))
          })
          .catch((err) => {
            // var errors = err.response.data.errors
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        })
      },
      addChecks() {
        var postion = this.DV_task.checklists.length
        this.DV_task.checklists.push({text: '', checked: false, position: postion})
      },
      addNote() {
        this.DV_task.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },
      destroyNote(note) {
        let confirm = window.confirm(`Are you sure you want to delete this update note?`)
        if (!confirm) return;
        let i = note.id ? this.DV_task.notes.findIndex(n => n.id === note.id) : this.DV_task.notes.findIndex(n => n.guid === note.guid)
        Vue.set(this.DV_task.notes, i, {...note, _destroy: true})
      },
      noteBy(note) {
        return note.user ? `${note.user.fullName} at ${new Date(note.createdAt).toLocaleString()}` : `${this.$currentUser.full_name} at (Now)`
      },
      downloadFile(file) {
        let url = window.location.origin + file.uri
        window.open(url, '_blank');
      },
      destroyCheck(check, index) {
        let confirm = window.confirm(`Are you sure you want to delete this checklist item?`)
        if (!confirm) return;

        let i = check.id ? this.DV_task.checklists.findIndex(c => c.id === check.id) : index
        Vue.set(this.DV_task.checklists, i, {...check, _destroy: true})
      },   
      disabledDueDate(date) {
        date.setHours(0,0,0,0)
        const startDate = new Date(this.DV_task.startDate)
        startDate.setHours(0,0,0,0)
        return date < startDate
      },
      calculateProgress(checks=null) {
        try {
          if (!checks) checks = this.DV_task.checklists
          let checked = _.filter(checks, v => !v._destroy && v.checked && v.text.trim()).length
          let total = _.filter(checks, v => !v._destroy && v.text.trim()).length
          this.DV_task.progress = Number((((checked / total) * 100) || 0).toFixed(2))
        } catch(err) {
          this.DV_task.progress = 0
        }
      },
      updateCheckItem(event, name, index) {
        if (name === 'text') {
          this.DV_task.checklists[index].text = event.target.value
          if (!event.target.value) this.DV_task.checklists[index].checked = false
        } else if (name === 'check' && this.DV_task.checklists[index].text) {
          this.DV_task.checklists[index].checked = event.target.checked
        } else if (name === 'dueDate' && this.DV_task.checklists[index].text) {
          this.DV_task.checklists[index].dueDate = event.target.value
        }
      },
      isMyCheck(check) {
        return this.C_myTasks && check.id ? (check.user && check.user.id == this.$currentUser.id) : true
      },
      allowDeleteNote(note) {
        return this._isallowed('delete') && note.guid || (note.userId == this.$currentUser.id)
      },
      allowEditNote(note) {
        return this._isallowed('write') && note.guid || (note.userId == this.$currentUser.id)
      },
      disabledDateRange(date) {
        var dueDate = new Date(this.DV_task.dueDate)
        dueDate.setDate(dueDate.getDate() + 1)

        return date < new Date(this.DV_task.startDate) || date > dueDate;
      },
    },
    computed: {
      ...mapGetters([
        'getFacilityProjectOptions',
        'currentProject',
        'taskTypes',
        'taskStages',
        'activeProjectUsers',
        'projectUsers',
        'myActionsFilter',
        'currentTasks',
        'currentIssues',
        'managerView'
      ]),
      readyToSave() {
        return (
          this.DV_task &&
          this.exists(this.DV_task.text) &&
          this.exists(this.DV_task.taskTypeId) &&
          this.exists(this.DV_task.dueDate) &&
          this.exists(this.DV_task.facilityProjectId) &&
          this.exists(this.DV_task.startDate)
        )
      },
      filteredChecks() {
        return _.filter(this.DV_task.checklists, c => !c._destroy)
      },
      filteredFiles() {
        return _.filter(this.DV_task.taskFiles, f => !f._destroy)
      },
      C_myTasks() {
        return _.map(this.myActionsFilter, 'value').includes('tasks')
      },
      filteredTasks() {
        return _.filter(this.currentTasks, t => t.id !== this.DV_task.id)
      },
      filteredIssues() {
        return this.currentIssues
      },
      filteredNotes() {
        return _.orderBy(_.filter(this.DV_task.notes, n => !n._destroy), 'createdAt', 'desc')
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.tasks[salut]
      },
      C_title() {
        return this._isallowed('write') ? this.task.id ? "Edit Task" : "Add Task" : "Task"
      }
    },
    watch: {
      selectedFacilityProject: {
        handler: function(value) {
          if(value){
            this.DV_task.facilityProjectId = value.id  
          }
        }, deep: true
      },
      task: {
        handler: function(value) {
          if (!('id' in value)) this.DV_task = this.INITIAL_TASK_STATE()
          this.DV_task.taskFiles = []
          this.destroyedFiles = []
          this.loadTask(value)
        }, deep: true
      },
      "DV_task.startDate"(value) {
        if (this._ismounted && !value) this.DV_task.dueDate = ''
      },
      "DV_task.dueDate"(value) {
        if (this._ismounted && this.facility.dueDate) {
          if (moment(value).isAfter(this.facility.dueDate, 'day')) {
            alert('Task Due Date is past Project Due Date!')
          }
        }
      },
      "DV_task.checklists": {
        handler: function(value) {
          if (this.DV_task.autoCalculate) this.calculateProgress(value)
        }, deep: true
      },
      "DV_task.autoCalculate"(value) {
        if (value) this.calculateProgress()
      },
      taskUsers: {
        handler: function(value) {
          if (value) this.DV_task.userIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedIssues: {
        handler: function(value) {
          if (value) this.DV_task.subIssueIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedTasks: {
        handler: function(value) {
          if (value) this.DV_task.subTaskIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      selectedTaskType: {
        handler: function(value) {
          this.DV_task.taskTypeId = value ? value.id : null
        }, deep: true
      },
      selectedTaskStage: {
        handler: function(value) {
          this.DV_task.taskStageId = value ? value.id : null
        }, deep: true
      },
      filteredTasks: {
        handler(value) {
          let ids = _.map(value, 'id')
          this.relatedTasks = _.filter(this.relatedTasks, t => ids.includes(t.id))
        }, deep: true
      },
      filteredIssues: {
        handler(value) {
          let ids = _.map(value, 'id')
          this.relatedIssues = _.filter(this.relatedIssues, t => ids.includes(t.id))
        }, deep: true
      },
      "filteredNotes.length"(value, previous) {
        this.$nextTick(() => {
          if (this.$refs.paginator && (value === 1 || previous === 0)) {
            this.$refs.paginator.goToPage(1)
          }
        })
      }
    }
  };
</script>

<style lang="scss">
  #tasks-form {
    z-index: 100;
    width: 100%;
    position: absolute;
    background-color: #ededed;
  }
  .form-control.error {
    border-color: #E84444;
  }
  .checklist-text {
    margin-left: 5px;
    border: 0;
    width: 95%;
    outline: none;
    border: solid #ededed 1px;
    border-radius: 4px;  
  }
  .drag {
    cursor: all-scroll;
  }
  .del-check {
    position: relative;
    top: -5px;
    display: flex;
    right: 10px;
    background: #fff;
    height: fit-content;
    color: red;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  .paperLook {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    padding-bottom: 20px;
    margin-bottom: 10px;
    position: relative;
  }
  .paginate-links.filteredNotes {
    list-style: none !important;
    user-select: none;
    text-decoration-line: none !important;
    margin-bottom: 18px;
    a {
      width: 20px;
      height: 25px;
      margin-right: 0;
      border-radius: 2px;
      background-color: white;
      box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
      color: #383838;
      padding: 5px 12px;
      cursor: pointer;
      text-decoration-line: none !important;
    }
    a:hover {
      background-color: #ededed;
    }
    li.active a {
      font-weight: bold;
      color: #383838;
      background-color: rgba(211, 211, 211, 10%);
    }
    a.active  {
      background-color: rgba(211, 211, 211, 10%);
    }
    li.next:before {
      content: ' | ';
      margin-right: 13px;
      color: #ddd;
    }
    li.disabled a {
      color: #ccc;
      cursor: no-drop;
    }
    li {
      display: inline !important;
      margin: 1px;
      color: #383838 !important;
    }
  }
  .sticky-btn {
    margin-top: 5px;
    margin-bottom: 5px;
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }
  .sticky {
    position: sticky;
    position: -webkit-sticky;
    justify-content: center;
    margin-bottom: -2.5rem;
    z-index: 1000;
    left: 15;
    top: 0;
    width: 100%;
    padding: 6px;
    background-color: rgba(237, 237, 237, 0.85);
    box-shadow: 0 10px 20px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  .scrollToChecklist {    
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }
  .check-due-date {
    text-align: end;
  }
  .btn-group{
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .disabled {
    opacity: 0.6;
  }
  .custom-tab {
    width: min-content;
    background-color: #fafafa;
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }

</style>
