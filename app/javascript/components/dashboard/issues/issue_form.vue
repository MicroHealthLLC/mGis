<template>
  <div>
    <form
      id="issues-form"
      @submit.prevent="saveIssue"
      :class="{'_disabled': loading}"
      class="mx-auto"
      accept-charset="UTF-8"
      data-cy="issue_form"
      >
        <div v-if="_isallowed('read')" class="d-flex form-group sticky mb-2 justify-content-start">
        <button
          v-if="_isallowed('write')"
          :disabled="!readyToSave"
          class="btn btn-sm sticky-btn btn-success"
          data-cy="issue_save_btn"
          >
          Save
        </button>
        <button
          v-else
          disabled
          class="btn btn-sm sticky-btn btn-light"
          data-cy="issue_read_only_btn"
          >
          Read Only
        </button>
        <button
          class="btn btn-sm sticky-btn btn-warning ml-2"
          @click.prevent="cancelIssueSave"
          data-cy="issue_close_btn"
          >
          Close
        </button> 
        <div class="btn-group">
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
        </div>      
        <button
          v-if="_isallowed('delete') && DV_issue.id"
          @click.prevent="deleteIssue"
          class="btn btn-sm btn-danger sticky-btn ml-auto "
          data-cy="issue_delete_btn"
          >
          <i class="fas fa-trash-alt mr-2"></i>
          Delete
        </button>
      </div>
      <div class="paperLook formTitle ">
      <div
        v-if="showErrors"
        class="text-danger mb-3"
        >
        Please fill the required fields before submitting
      </div>
      <div class="form-group mx-4">
        <label class="font-sm"><h5>*Issue Name:</h5></label>
         <span v-if="_isallowed('write')" class="watch_action clickable float-right" @click.prevent.stop="toggleWatched" data-cy="issue_on_watch">
                <span v-show="DV_issue.watched" class="check_box mx-1"><i class="far fa-check-square font-md"></i></span>
                <span v-show="!DV_issue.watched" class="empty_box mr-1"><i class="far fa-square"></i></span>
               <span><i class="fas fa-eye mr-1"></i></span><small style="vertical-align:text-top">On Watch</small>
            </span>
        <input
          name="title"
          v-validate="'required'"
          type="text"
          class="form-control form-control-sm"
          v-model="DV_issue.title"
          placeholder="Issue Name"
          :readonly="!_isallowed('write')"
          :class="{'form-control': true, 'error': errors.has('title') }"
          data-cy="issue_title"
        />
        <div v-show="errors.has('title')" class="text-danger" data-cy="issue_title_error">
          {{errors.first('title')}}
        </div>
      </div>
        <div class="form-group mx-4">
        <label class="font-sm">Description:</label>
        <textarea
          class="form-control"
          placeholder="Issue brief description"
          v-model="DV_issue.description"
          rows="4"
          :readonly="!_isallowed('write')"
          data-cy="issue_description"
        />
      </div>
      <div class="simple-select form-group mx-4">
        <label class="font-sm">*Issue Type:</label>
        <multiselect
          v-model="selectedIssueType"
          v-validate="'required'"
          track-by="id"
          label="name"
          placeholder="Issue Type"
          :options="issueTypes"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write')"
          :class="{'error': errors.has('Issue Type')}"
          data-cy="issue_type"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
        <div v-show="errors.has('Issue Type')" class="text-danger" data-cy="issue_type_error">
          {{errors.first('Issue Type')}}
        </div>
      </div>
      <div class="simple-select form-group mx-4">
        <label class="font-sm">Task Category:</label>
        <multiselect
          v-model="selectedTaskType"
          track-by="id"
          label="name"
          placeholder="Task category"
          :options="taskTypes"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write')"
          :class="{'error': errors.has('Task Category')}"
          data-cy="task_type"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
        <div v-show="errors.has('Task Type')" class="text-danger" data-cy="task_type_error">
          {{errors.first('Task Type')}}
        </div>
      </div>
      <div class="simple-select form-group mx-4">
        <label class="font-sm">*Issue Severity:</label>
        <multiselect
          v-model="selectedIssueSeverity"
          v-validate="'required'"
          track-by="id"
          label="name"
          placeholder="Issue Severity"
          :options="issueSeverities"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write')"
          :class="{'error': errors.has('Issue Severity')}"
          data-cy="issue_severity"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
        <div v-show="errors.has('Issue Severity')" class="text-danger" data-cy="issue_severity_error">
          {{errors.first('Issue Severity')}}
        </div>
      </div>
      <div class="simple-select form-group mx-4">
        <label class="font-sm">Stage:</label>
        <multiselect
          v-model="selectedIssueStage"
          track-by="id"
          label="name"
          placeholder="Select Stage"
          :options="issueStages"
          :searchable="false"
          select-label="Select"
          deselect-label="Enter to remove"
          :disabled="!_isallowed('write') || !!fixedStage"
          data-cy="issue_stage"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.name}}</span>
            </div>
          </template>
        </multiselect>
      </div>
      <div class="form-row mx-4">
        <div class="form-group col-md-6 pl-0">
          <label class="font-sm">*Start Date:</label>
          <v2-date-picker
            v-validate="'required'"
            v-model="DV_issue.startDate"
            value-type="YYYY-MM-DD"
            format="DD MMM YYYY"
            placeholder="DD MM YYYY"
            name="Start Date"
            class="w-100 vue2-datepicker"
            :disabled="!_isallowed('write')"
            data-cy="issue_start_date"
          />
          <div v-show="errors.has('Start Date')" class="text-danger" data-cy="issue_start_date_error">
            {{errors.first('Start Date')}}
          </div>
        </div>
        <div class="form-group col-md-6 pr-0">
          <label class="font-sm">*Estimated Completion Date:</label>
          <v2-date-picker
            v-validate="'required'"
            v-model="DV_issue.dueDate"
            value-type="YYYY-MM-DD"
            format="DD MMM YYYY"
            placeholder="DD MM YYYY"
            name="Estimated Completion Date"
            class="w-100 vue2-datepicker"
            :disabled="!_isallowed('write') || DV_issue.startDate === '' || DV_issue.startDate === null"
            :disabled-date="disabledDueDate"
            data-cy="issue_due_date"
          />
          <div v-show="errors.has('Estimated Completion Date')" class="text-danger" data-cy="issue_due_date_error">
            {{errors.first('Estimated Completion Date')}}
          </div>
        </div>
      </div>
      <div class="form-group user-select mx-4">
        <label class="font-sm mb-0">Assign Users:</label>
        <multiselect
          v-model="issueUsers"
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
          data-cy="issue_user"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.fullName}}</span>
            </div>
          </template>
        </multiselect>
      </div>
      <div class="form-group mx-4">
        <label class="font-sm mb-0">Progress: (in %)</label>
        <span class="ml-3">
          <label class="font-sm mb-0 d-inline-flex align-items-center"><input type="checkbox" v-model="DV_issue.autoCalculate" :disabled="!_isallowed('write')" :readonly="!_isallowed('write')"><span>&nbsp;&nbsp;Auto Calculate Progress</span></label>
        </span>
        <vue-slide-bar
          v-model="DV_issue.progress"
          :line-height="8"
          :is-disabled="!_isallowed('write') || DV_issue.autoCalculate"
          :draggable="_isallowed('write') && !DV_issue.autoCalculate"
        ></vue-slide-bar>
      </div>
      <div class="form-group mx-4">
        <label class="font-sm">Checklists:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addChecks"><i class="fas fa-plus-circle"></i></span>
       
        <div v-if="filteredChecks.length > 0">
       <draggable :move="handleMove" @change="(e) => handleEnd(e, DV_issue.checklists)" :list="DV_issue.checklists" :animation="100" ghost-class="ghost-card">
          <div v-for="(check, index) in DV_issue.checklists" class="d-flex w-100 mb-3 drag" v-if="!check._destroy && isMyCheck(check)">
            <div class="form-control h-100" :key="index">
            <div class="row">
              <div class="col justify-content-start">
                <input type="checkbox" name="check" :checked="check.checked" @change="updateCheckItem($event, 'check', index)" :key="`check_${index}`" :disabled="!_isallowed('write') || !check.text.trim()">
                <input :value="check.text" name="text" @input="updateCheckItem($event, 'text', index)" :key="`text_${index}`" placeholder="Checkpoint name here"  type="text" maxlength="80" class="checklist-text pl-1" :readonly="!_isallowed('write')">
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
                      :disabled="!_isallowed('write')"
                      :value="check.dueDate"
                      @selected="updateCheckItem($event, 'dueDate', index)"
                      :key="`dueDate_${index}`"
                      value-type="YYYY-MM-DD"
                      format="DD MMM YYYY"
                      placeholder="DD MM YYYY"
                      name="dueDate"
                      class="w-100 vue2-datepicker d-flex ml-auto"
                    />
                  </div>
                </div>
               </div>
            </div>
            <span class="del-check clickable" v-if="_isallowed('write')" @click.prevent="destroyCheck(check, index)"><i class="fas fa-times"></i></span>
          </div>
       </draggable>
        </div>
        <p v-else class="text-danger font-sm">No checks..</p>
      </div>
      <div class="mx-4">
        <div class="input-group mb-2">
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
              :class="{'_disabled': loading || !_isallowed('write')}"
              class="del-check clickable"
              @click.prevent="deleteFile(file)"
              >
              <i class="fas fa-times"></i>
            </div>
          </div>
        </div>
      </div>   
      <div ref="addCheckItem" class="pt-0 mt-0 mb-4"> </div>
      <div v-if="_isallowed('write')" class="form-group mx-4" >
        <label class="font-sm">Files:</label>
        <attachment-input
          @input="addFile"
          :show-label="true"
        ></attachment-input>
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

      <div class="form-group user-select mx-4">
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
      <div class="form-group mx-4 paginated-updates">
        <label class="font-sm">Updates:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addNote">
          <i class="fas fa-plus-circle"></i>
        </span>
        <paginate-links v-if="filteredNotes.length" for="filteredNotes" :show-step-links="true" :limit="2"></paginate-links>
        <paginate ref="paginator" name="filteredNotes" :list="filteredNotes" :per="5" class="paginate-list" :key="filteredNotes ? filteredNotes.length : 1">
          <div v-for="note in paginated('filteredNotes')" class="form-group">
            <span class="d-inline-block w-100"><label class="badge badge-secondary">Note by</label> <span class="font-sm text-muted">{{noteBy(note)}}</span>
              <span v-if="allowDeleteNote(note)" class="clickable font-sm delete-action float-right" @click.stop="destroyNote(note)">
                <i class="fas fa-trash-alt"></i>
              </span>
            </span>
            <textarea class="form-control" v-model="note.body" rows="3" placeholder="your note comes here." :readonly="!allowEditNote(note)"></textarea>
          </div>
        </paginate>
      </div>
      </div>
       <h6 class="text-danger text-small pl-1 float-right">*Indicates required fields</h6>
        <div ref="addUpdates" class="pt-0 mt-0"> </div>
    </form>
    <div v-if="loading" class="load-spinner spinner-border text-dark" role="status"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import humps from 'humps'
  import Draggable from "vuedraggable"
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import AttachmentInput from './../../shared/attachment_input'

  export default {
    name: 'IssueForm',
    props: ['facility', 'issue', 'task', 'fixedStage'],
    components: {
      AttachmentInput, Draggable
    },
    data() {
      return {
        DV_issue: this.INITIAL_ISSUE_STATE(),
        paginate: ['filteredNotes'],
        destroyedFiles: [],
        selectedIssueType: null,
        selectedTaskType: null,
        selectedIssueSeverity: null,
        selectedIssueStage: null,
        issueUsers: [],
        relatedIssues: [],
        relatedTasks: [],
        showErrors: false,
        loading: true,
        movingSlot: ''
      }
    },
    mounted() {
      if (!_.isEmpty(this.issue)) {
        this.loadIssue(this.issue)
      } else {
        this.loading = false
      }
      if (this.fixedStage) {
        this.selectedIssueStage = this.issueStages.find(t => t.id === this.fixedStage)
      }
    },
    methods: {
      ...mapMutations([
        'setTaskForManager'
      ]),
       ...mapActions([
        'issueDeleted',
        'taskUpdated',
        'updateWatchedIssues'
      ]),
      INITIAL_ISSUE_STATE() {
        return {
          title: '',
          startDate: '',
          dueDate: '',
          issueTypeId: '',
          taskTypeId: '',
          progress: 0,
          issueSeverityId: '',
          issueStageId: '',
          description: '',
          autoCalculate: true,
          userIds: [],
          subTaskIds: [],
          subIssueIds: [],
          issueFiles: [],
          checklists: [],
          notes: []
        }
      },
      scrollToChecklist(){
        this.$refs.addCheckItem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        this.DV_issue.checklists.push({text: '', checked: false})
      },   
      scrollToUpdates(){
        this.$refs.addUpdates.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
         this.DV_issue.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },  
      handleMove(item) {
        this.movingSlot = item.relatedContext.component.$vnode.key
        return true
      },
      handleEnd(e, checklists){
        var cc = this.DV_issue.checklists
        var count = 0
        for(var checklist of cc){
          checklist.position = count
          count++
        }
      },
      loadIssue(issue) {
        this.DV_issue = {...this.DV_issue, ..._.cloneDeep(issue)}
        this.issueUsers = _.filter(this.activeProjectUsers, u => this.DV_issue.userIds.includes(u.id))
        this.relatedIssues = _.filter(this.currentIssues, u => this.DV_issue.subIssueIds.includes(u.id))
        this.relatedTasks = _.filter(this.currentTasks, u => this.DV_issue.subTaskIds.includes(u.id))
        this.selectedIssueType = this.issueTypes.find(t => t.id === this.DV_issue.issueTypeId)
        this.selectedTaskType = this.taskTypes.find(t => t.id === this.DV_issue.taskTypeId)
        this.selectedIssueSeverity = this.issueSeverities.find(t => t.id === this.DV_issue.issueSeverityId)
        this.selectedIssueStage = this.issueStages.find(t => t.id === this.DV_issue.issueStageId)
        if (issue.attachFiles) this.addFile(issue.attachFiles)
        this.$nextTick(() => {
          this.errors.clear()
          this.$validator.reset()
          this.loading = false
        })
      },
      addFile(files=[]) {
        let _files = [...this.DV_issue.issueFiles]
        for (let file of files) {
          file.guid = this.guid()
          _files.push(file)
        }
        this.DV_issue.issueFiles = _files
      },
      deleteIssue() {
        let confirm = window.confirm(`Are you sure you want to delete this issue?`)
        if (!confirm) {return}
        this.issueDeleted(this.DV_issue)
        this.cancelIssueSave()
      },
      deleteFile(file) {
        if (!file) return;
        let confirm = window.confirm(`Are you sure you want to delete attachment?`)
        if (!confirm) return;

        if (file.uri) {
          let index = this.DV_issue.issueFiles.findIndex(f => f.guid === file.guid)
          Vue.set(this.DV_issue.issueFiles, index, {...file, _destroy: true})
          this.destroyedFiles.push(file)
        }
        else if (file.name) {
          this.DV_issue.issueFiles.splice(this.DV_issue.issueFiles.findIndex(f => f.guid === file.guid), 1)
        }
      },
       toggleWatched() {
        if (this.DV_issue.watched) {
          let confirm = window.confirm(`Are you sure, you want to remove this issue from on-watch?`)
          if (!confirm) {return}
        }
        this.DV_issue = {...this.DV_issue, watched: !this.DV_issue.watched}
        this.updateWatchedIssues(this.DV_issue)
      },
      cancelIssueSave() {
        this.$emit('on-close-form')
        this.setTaskForManager({key: 'issue', value: null})
      },
      saveIssue() {
        this.$validator.validate().then((success) => {
          if (!success || this.loading) {
            this.showErrors = !success
            return;
          }

          this.loading = true
          let formData = new FormData()
          formData.append('issue[title]', this.DV_issue.title)
          formData.append('issue[due_date]', this.DV_issue.dueDate)
          formData.append('issue[start_date]', this.DV_issue.startDate)
          formData.append('issue[issue_type_id]', this.DV_issue.issueTypeId)
          formData.append('issue[task_type_id]', this.DV_issue.taskTypeId)
          formData.append('issue[issue_severity_id]', this.DV_issue.issueSeverityId)
          formData.append('issue[issue_stage_id]', this.DV_issue.issueStageId)
          formData.append('issue[progress]', this.DV_issue.progress)
          formData.append('issue[description]', this.DV_issue.description)
          formData.append('issue[auto_calculate]', this.DV_issue.autoCalculate)
          formData.append('issue[destroy_file_ids]', _.map(this.destroyedFiles, 'id'))


          if (this.DV_issue.userIds.length) {
            for (let u_id of this.DV_issue.userIds) {
              formData.append('issue[user_ids][]', u_id)
            }
          }
          else {
            formData.append('issue[user_ids][]', [])
          }

          if (this.DV_issue.subTaskIds.length) {
            for (let u_id of this.DV_issue.subTaskIds) {
              formData.append('issue[sub_task_ids][]', u_id)
            }
          }
          else {
            formData.append('issue[sub_task_ids][]', [])
          }

          if (this.DV_issue.subIssueIds.length) {
            for (let u_id of this.DV_issue.subIssueIds) {
              formData.append('issue[sub_issue_ids][]', u_id)
            }
          }
          else {
            formData.append('issue[sub_issue_ids][]', [])
          }

          for (let i in this.DV_issue.checklists) {
            let check = this.DV_issue.checklists[i]
            if (!check.text && !check._destroy) continue
            for (let key in check) {
              if (key === 'user') key = 'user_id'
              let value = key == 'user_id' ? check.user ? check.user.id : null : check[key]
              if (key === "dueDate"){
                  key = "due_date"
              }
              formData.append(`issue[checklists_attributes][${i}][${key}]`, value)
            }
          }

          for (let i in this.DV_issue.notes) {
            let note = this.DV_issue.notes[i]
            if (!note.body && !note._destroy) continue
            for (let key in note) {
              let value = key == 'user_id' ? note.user_id ? note.user_id : this.$currentUser.id : note[key]
              formData.append(`issue[notes_attributes][${i}][${key}]`, value)
            }
          }

          for (let file of this.DV_issue.issueFiles) {
            if (!file.id) {
              formData.append('issue[issue_files][]', file)
            }
          }

          let url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/issues.json`
          let method = "POST"
          let callback = "issue-created"

          if (this.issue && this.issue.id) {
            url = `/projects/${this.currentProject.id}/facilities/${this.issue.facilityId}/issues/${this.issue.id}.json`
            method = "PUT"
            callback = "issue-updated"
          }

          axios({
            method: method,
            url: url,
            data: formData,
            headers: {
              'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
            }
          })
          .then((response) => {
            this.$emit(callback, humps.camelizeKeys(response.data.issue))
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        })
      },
      addNote() {
        this.DV_issue.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },
      destroyNote(note) {
        let confirm = window.confirm(`Are you sure, you want to delete this update note?`)
        if (!confirm) return;
        let i = note.id ? this.DV_issue.notes.findIndex(n => n.id === note.id) : this.DV_issue.notes.findIndex(n => n.guid === note.guid)
        Vue.set(this.DV_issue.notes, i, {...note, _destroy: true})
      },
      noteBy(note) {
        return note.user ? `${note.user.fullName} at ${new Date(note.createdAt).toLocaleString()}` : `${this.$currentUser.full_name} at (Now)`
      },
      downloadFile(file) {
        let url = window.location.origin + file.uri
        window.open(url, '_blank');
      },
      disabledDueDate(date) {
        date.setHours(0,0,0,0)
        const startDate = new Date(this.DV_issue.startDate)
        startDate.setHours(0,0,0,0)
        return date < startDate
      },
      addChecks() {
        this.DV_issue.checklists.push({text: '', checked: false})
      },
      destroyCheck(check, index) {
        let confirm = window.confirm(`Are you sure, you want to delete this checklist item?`)
        if (!confirm) return;

        let i = check.id ? this.DV_issue.checklists.findIndex(c => c.id === check.id) : index
        Vue.set(this.DV_issue.checklists, i, {...check, _destroy: true})
      },
      calculateProgress(checks=null) {
        try {
          if (!checks) checks = this.DV_issue.checklists
          let checked = _.filter(checks, v => !v._destroy && v.checked && v.text.trim()).length
          let total = _.filter(checks, v => !v._destroy && v.text.trim()).length
          this.DV_issue.progress = Number((((checked / total) * 100) || 0).toFixed(2))
        } catch(err) {
          this.DV_issue.progress = 0
        }
      },
      updateCheckItem(event, name, index) {
        if (name === 'text') {
          this.DV_issue.checklists[index].text = event.target.value
          if (!event.target.value) this.DV_issue.checklists[index].checked = false
        } else if (name === 'check' && this.DV_issue.checklists[index].text) {
          this.DV_issue.checklists[index].checked = event.target.checked
        } else if (name === 'dueDate' && this.DV_task.checklists[index].text) {
          this.DV_task.checklists[index].dueDate = event.target.value
        }
      },
      isMyCheck(check) {
        return this.C_myIssues && check.id ? (check.user && check.user.id == this.$currentUser.id) : true
      },
      allowDeleteNote(note) {
        return this._isallowed('delete') && note.guid || (note.userId == this.$currentUser.id)
      },
      allowEditNote(note) {
        return this._isallowed('write') && note.guid || (note.userId == this.$currentUser.id)
      }
    },
    computed: {
      ...mapGetters([
        'currentProject',
        'projectUsers',
        'activeProjectUsers',
        'myActionsFilter',
        'issueTypes',
        'taskTypes',
        'issueStages',
        'issueSeverities',
        'currentTasks',
        'currentIssues',
        'managerView'
      ]),
      readyToSave() {
        return (
          this.DV_issue &&
          this.exists(this.DV_issue.title) &&
          this.exists(this.DV_issue.issueTypeId) &&
          this.exists(this.DV_issue.issueSeverityId) &&
          this.exists(this.DV_issue.dueDate) &&
          this.exists(this.DV_issue.startDate)
        )
      },
      filteredChecks() {
        return _.filter(this.DV_issue.checklists, c => !c._destroy)
      },
      filteredFiles() {
        return _.filter(this.DV_issue.issueFiles, f => !f._destroy)
      },
      C_myIssues() {
        return _.map(this.myActionsFilter, 'value').includes('issues')
      },
      title() {
        return this._isallowed('write') ? this.DV_issue.id ? 'Edit Issue' : 'Report an Issue' : 'Issue'
      },
      filteredTasks() {
        return this.currentTasks
      },
      filteredIssues() {
        return _.filter(this.currentIssues, t => t.id !== this.DV_issue.id)
      },
      filteredNotes() {
        return _.orderBy(_.filter(this.DV_issue.notes, n => !n._destroy), 'createdAt', 'desc')
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.issues[salut]
      }
    },
    watch: {
      issue: {
        handler: function(value) {
          if (!('id' in value)) this.DV_issue = this.INITIAL_ISSUE_STATE()
          this.DV_issue.issueFiles = []
          this.destroyedFiles = []
          this.loadIssue(value)
        }, deep: true
      },
      "DV_issue.startDate"(value) {
        if (!value) this.DV_issue.dueDate = ''
      },
      "DV_issue.checklists": {
        handler: function(value) {
          if (this.DV_issue.autoCalculate) this.calculateProgress(value)
        }, deep: true
      },
      "DV_issue.autoCalculate"(value) {
        if (value) this.calculateProgress()
      },
      issueUsers: {
        handler: function(value) {
          if (value) this.DV_issue.userIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedIssues: {
        handler: function(value) {
          if (value) this.DV_issue.subIssueIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedTasks: {
        handler: function(value) {
          if (value) this.DV_issue.subTaskIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      selectedIssueType: {
        handler: function(value) {
          this.DV_issue.issueTypeId = value ? value.id : null
        }, deep: true
      },
      selectedTaskType: {
        handler: function(value) {
          this.DV_issue.taskTypeId = value ? value.id : null
        }, deep: true
      },
      selectedIssueSeverity: {
        handler: function(value) {
          this.DV_issue.issueSeverityId = value ? value.id : null
        }, deep: true
      },
      selectedIssueStage: {
        handler: function(value) {
          this.DV_issue.issueStageId = value ? value.id : null
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
  }
</script>

<style lang="scss" scoped>
  #issues-form {
    z-index: 10;
    width: 100%;
    position: absolute;
    background-color: #fff;
  }
  .form-control.error {
    border-color: #E84444;
  }
  .title {
    font-size: 15px;
    margin-left: 65px;
  }
  .checklist-text {
    margin-left: 5px;
    border: 0;
    width: 95%;
    outline: none;
    border: solid #ededed 1px;
    border-radius: 4px;
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
  .drag {
    cursor: all-scroll;
  }
 .formTitle {
    padding-top: 25px;
  }
  .paperLook {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    padding-bottom: 20px;
    margin-bottom: 10px;
    position: relative;
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
  .btn-group{
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
  .check-due-date {
    text-align: end;
  }
</style>
