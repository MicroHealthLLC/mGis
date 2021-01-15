<template>
  <div>
    <form
      id="risks-form"
      @submit.prevent="validateThenSave"
      :class="{'_disabled': loading}"
      class="mx-auto"
      accept-charset="UTF-8"
      >
        <div v-if="_isallowed('read')" class="d-flex form-group sticky mb-2 justify-content-start">
        <button
          v-if="_isallowed('write')"
          :disabled="!readyToSave"
          class="btn btn-sm sticky-btn btn-success"
          data-cy="risk_save_btn"
          >
          Save
        </button>
        <button
          v-else
          disabled
          class="btn btn-sm sticky-btn btn-light"
          data-cy="risk_read_only_btn"
          >
          Read Only
        </button>
        <button
          class="btn btn-sm sticky-btn btn-warning ml-2"
          @click.prevent="cancelRiskSave"
          data-cy="risk_close_btn"
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
          v-if="_isallowed('delete') && DV_risk.id"
          @click.prevent="deleteRisk"
          class="btn btn-sm btn-danger sticky-btn ml-auto "
          data-cy="risk_delete_btn"
          >
          <i class="fas fa-trash-alt mr-2"></i>
          Delete
        </button>
      </div>

      <div class="paperLook formTitle">
        <div v-if="showErrors" class="text-danger mb-3">
          Please fill the required fields before submitting
        </div>
        <div class="form-group mx-4">
          <span v-if="_isallowed('write')" class="watch_action clickable float-right" @click.prevent.stop="toggleWatched" data-cy="risk_on_watch">
            <span v-show="DV_risk.watched" class="check_box mx-1">
              <i class="far fa-check-square font-md"></i>
            </span>
            <span v-show="!DV_risk.watched" class="empty_box mr-1"><i class="far fa-square"></i></span>
            <span><i class="fas fa-eye mr-1"></i></span>
            <small style="vertical-align:text-top">On Watch</small>
          </span>

          <label class="font-sm"><h5>*Risk Name:</h5></label>
          <textarea
            v-validate="'required'"
            class="form-control"
            placeholder="Risk title"
            v-model="DV_risk.text"
            rows="1"
            :readonly="!_isallowed('write')"
            data-cy="risk_name"
            name="Risk Name"
            :class="{'form-control': true, 'error': errors.has('Risk Name') }"
          />
          <div v-show="errors.has('Risk Name')" class="text-danger" data-cy="risk_name_error">
            {{errors.first('Risk Name')}}
          </div>
        </div>

        <div class="form-group mx-4">
          <label class="font-sm">*Risk Description:</label>
          <textarea
            v-validate="'required'"
            class="form-control"
            placeholder="Risk brief description"
            v-model="DV_risk.riskDescription"
            rows="4"
            :readonly="!_isallowed('write')"
            data-cy="risk_description"
            name="risk_description"
            :class="{'form-control': true, 'error': errors.has('risk_description') }"
          />
          <div v-show="errors.has('risk_description')" class="text-danger" data-cy="risk_description_error">
            {{errors.first('risk_description')}}
          </div>
        </div>

        <div class="form-group mx-4">
          <label class="font-sm">*Impact Description:</label>
          <textarea
            v-validate="'required'"
            class="form-control"
            placeholder="Risk impact description"
            v-model="DV_risk.impactDescription"
            rows="4"
            :readonly="!_isallowed('write')"
            data-cy="impact_description"
            name="impact_description"
            :class="{'form-control': true, 'error': errors.has('impact_description') }"
          />
          <div v-show="errors.has('impact_description')" class="text-danger" data-cy="impact_description_error">
            {{errors.first('impact_description')}}
          </div>
        </div>

        <div class="form-row mx-4">
          <div class="form-group col-md-6 pl-0">
            <label class="font-sm">*Start Date:</label>
            <v2-date-picker
              v-validate="'required'"
              v-model="DV_risk.startDate"
              value-type="YYYY-MM-DD"
              format="DD MMM YYYY"
              placeholder="DD MM YYYY"
              name="Start Date"
              class="w-100 vue2-datepicker"
              :disabled="!_isallowed('write')"
              data-cy="risk_start_date"
            />
            <div v-show="errors.has('Start Date')" class="text-danger" data-cy="risk_start_date_error">
              {{errors.first('Start Date')}}
            </div>
          </div>
          <div class="form-group col-md-6 pr-0">
            <label class="font-sm">*Estimated Completion Date:</label>
            <v2-date-picker
              v-validate="'required'"
              v-model="DV_risk.dueDate"
              value-type="YYYY-MM-DD"
              format="DD MMM YYYY"
              placeholder="DD MM YYYY"
              name="Estimated Completion Date"
              class="w-100 vue2-datepicker"
              :disabled="!_isallowed('write') || DV_risk.startDate === '' || DV_risk.startDate === null"
              :disabled-date="disabledDueDate"
              data-cy="risk_due_date"
            />
            <div v-show="errors.has('Estimated Completion Date')" class="text-danger" data-cy="risk_due_date_error">
              {{errors.first('Estimated Completion Date')}}
            </div>
          </div>
        </div>
      <div class="form-group user-select mx-4">
        <label class="font-sm mb-0">Assign Users:</label>
        <multiselect
          v-model="riskUsers"
          :load="log(riskUsers)"
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
          data-cy="risk_owner"
          >
          <template slot="singleLabel" slot-scope="{option}">
            <div class="d-flex">
              <span class='select__tag-name'>{{option.fullName}}</span>
            </div>
          </template>
        </multiselect>
      </div>

        <div class="simple-select form-group mx-4">
          <label class="font-sm">*Task Category:</label>
          <multiselect
            v-model="selectedTaskType"
            v-validate="'required'"
            track-by="id"
            label="name"
            placeholder="Task Category"
            :options="taskTypes"
            :searchable="false"
            select-label="Select"
            deselect-label="Enter to remove"
            :disabled="!_isallowed('write')"
            :class="{'error': errors.has('Task Category')}"
            data-cy="risk_milestone"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
          <div v-show="errors.has('Task Category')" class="text-danger" data-cy="risk_milestone_error">
            {{errors.first('Task Category')}}
          </div>
        </div>
        <div class="simple-select form-group mx-4">
          <label class="font-sm">Stage:</label>
          <multiselect
            v-model="selectedRiskStage"
            track-by="id"
            label="name"
            placeholder="Select Stage"
            :options="riskStages"
            :searchable="false"
            select-label="Select"
            deselect-label="Enter to remove"
            :disabled="!_isallowed('write') || !!fixedStage"
            data-cy="risk_stage"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.name}}</span>
              </div>
            </template>
          </multiselect>
        </div>
        <div class="simple-select form-group mx-4">
          <label class="font-sm">*Probablity:</label>
          <multiselect
            v-model="DV_risk.probability"
            v-validate="'required'"
            placeholder="Risk Probablity"
            :options="probabilities"
            :searchable="false"
            :allow-empty="false"
            select-label="Select"
            :disabled="!_isallowed('write')"
            :class="{'error': errors.has('Risk Probability')}"
            data-cy="risk_probability"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option}}</span>
              </div>
            </template>
          </multiselect>
          <div v-show="errors.has('Risk Probability')" class="text-danger" data-cy="risk_probability_error">
            {{errors.first('Risk Probability')}}
          </div>
        </div>

        <div class="simple-select form-group mx-4">
          <label class="font-sm">*Impact Level:</label>
          <multiselect
            v-model="DV_risk.impactLevel"
            v-validate="'required'"
            placeholder="Impact Level"
            :options="impactLevels"
            :searchable="false"
            select-label="Select"
            :disabled="!_isallowed('write')"
            :allow-empty="false"
            :class="{'error': errors.has('Impact Level')}"
            data-cy="impact_level"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option}}</span>
              </div>
            </template>
          </multiselect>
          <div v-show="errors.has('Impact Level')" class="text-danger" data-cy="impact_level_error">
            {{errors.first('Impact Level')}}
          </div>
        </div>

        <div class="simple-select form-group mx-4">
          <label class="font-sm">*Risk Approach:</label>
          <multiselect
            v-model="DV_risk.riskApproach"
            v-validate="'required'"
            :allow-empty="false"
            placeholder="Risk Approach"
            :options="riskApproaches"
            :searchable="false"
            select-label="Select"
            :disabled="!_isallowed('write')"
            :class="{'error': errors.has('Risk Approach')}"
            data-cy="risk_approach"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option}}</span>
              </div>
            </template>
          </multiselect>
          <div v-show="errors.has('Risk Approach')" class="text-danger" data-cy="risk_approach_error">
            {{errors.first('Risk Approach')}}
          </div>
        </div>

        <div class="form-group mx-4">
          <label class="font-sm">*Risk Approach Description:</label>
          <textarea
            v-validate="'required'"
            class="form-control"
            placeholder="Risk Approach description"
            v-model="DV_risk.riskApproachDescription"
            rows="4"
            :readonly="!_isallowed('write')"
            data-cy="approach_description"
            name="approach_description"
            :class="{'form-control': true, 'error': errors.has('approach_description') }"
          />
          <div v-show="errors.has('approach_description')" class="text-danger" data-cy="approach_description_error">
            {{errors.first('approach_description')}}
          </div>
        </div>

        <div class="form-group mx-4">
          <label class="font-sm mb-0">Progress: (in %)</label>
          <span class="ml-3">
            <label class="font-sm mb-0 d-inline-flex align-items-center">
              <input type="checkbox" v-model="DV_risk.autoCalculate" :disabled="!_isallowed('write')" :readonly="!_isallowed('write')">
              <span>&nbsp;&nbsp;Auto Calculate Progress</span>
            </label>
          </span>
          <vue-slide-bar
            v-model="DV_risk.progress"
            :line-height="8"
            :is-disabled="!_isallowed('write') || DV_risk.autoCalculate"
            :draggable="_isallowed('write') && !DV_risk.autoCalculate"
          ></vue-slide-bar>
        </div>

        <div class="form-group mx-4">
          <label class="font-sm">Checklists:</label>
          <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addChecks">
            <i class="fas fa-plus-circle"></i>
          </span>
          <div v-if="filteredChecks.length > 0">
            <draggable :move="handleMove" @change="(e) => handleEnd(e, DV_risk.checklists)" :list="DV_risk.checklists" :animation="100" ghost-class="ghost-card" class="drag">
              <div v-for="(check, index) in DV_risk.checklists" class="d-flex w-100 mb-3 drag-item" v-if="!check._destroy && isMyCheck(check)">
                <div class="form-control h-100" :key="index">
                  <div class="row">
                    <div class="col justify-content-start">
                      <input type="checkbox" name="check" :checked="check.checked" @change="updateCheckItem($event, 'check', index)" :key="`check_${index}`" :disabled="!_isallowed('write') || !check.text.trim()">
                      <input :value="check.text" name="text" @input="updateCheckItem($event, 'text', index)" :key="`text_${index}`" placeholder="Checkpoint name here"  type="text" class="checklist-text pl-1" :readonly="!_isallowed('write')">
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
                          @selected="updateCheckItem($event, 'dueDate', index)"
                          :disabled="!_isallowed('write')"
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

        <div class="form-group user-select mx-4">
          <label class="font-sm mb-0">Related Risks:</label>
          <multiselect
            v-model="relatedRisks"
            track-by="id"
            label="text"
            placeholder="Search and select Related-risks"
            :options="filteredRisks"
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
        <hr class="my-4"/>
        <label class="font-sm mb-2">Updates:</label>
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
    name: 'RiskForm',
    props: ['facility', 'risk', 'fixedStage'],
    components: {
      AttachmentInput,
      Draggable
    },
    data() {
      return {
        DV_risk: this.INITIAL_RISK_STATE(),
        probabilities: [1,2,3,4,5],
        impactLevels: [1,2,3,4,5],
        paginate: ['filteredNotes'],
        destroyedFiles: [],
        riskUsers: [],
        selectedTaskType: null,
        selectedRiskStage: null,
        relatedIssues: [],
        relatedTasks: [],
        relatedRisks: [],
        showErrors: false,
        loading: true,
        movingSlot: ''
      }
    },
    mounted() {
      if (!_.isEmpty(this.risk)) {
        this.loadRisk(this.risk)
      } else {
        this.loading = false
      }
      if (this.fixedStage) {
        this.selectedRiskStage = this.riskStages.find(t => t.id === this.fixedStage)
      }
    },
    methods: {
      ...mapMutations([
        'setTaskForManager'
      ]),
      ...mapActions([
        'riskDeleted',
        'taskUpdated',
        'updateWatchedRisks'
      ]),
      INITIAL_RISK_STATE() {
        return {
          text: '',
          riskDescription: '',
          impactDescription: '',
          probability: 1,
          impactLevel: 1,
          riskApproach: 'avoid',
          riskApproachDescription: '',
          taskTypeId: '',
          riskStageId: '',
          progress: 0,
          startDate: '',
          dueDate: '',
          autoCalculate: true,
          userIds: [],
          riskFiles: [],
          subTaskIds: [],
          subIssueIds: [],
          subRiskIds: [],
          checklists: [],
          notes: []
        }
      },
      scrollToChecklist(){
        this.$refs.addCheckItem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
        this.DV_risk.checklists.push({text: '', checked: false})
      }, 
      scrollToUpdates(){
        this.$refs.addUpdates.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        this.DV_risk.notes.unshift({body: '', user_id: '', guid: this.guid()})        
      },   
      handleMove(item) {
        this.movingSlot = item.relatedContext.component.$vnode.key
        return true
      },
      log(r) {
        console.log(r)
      },
      handleEnd(e, checklists) {
        let cc = this.DV_risk.checklists
        let count = 0
        for (let checklist of cc) {
          checklist.position = count
          count++
        }
      },
      loadRisk(risk) {
        this.DV_risk = {...this.DV_risk, ..._.cloneDeep(risk)}
        this.riskUsers = _.filter(this.activeProjectUsers, u => this.DV_risk.userIds.includes(u.id))
        this.relatedIssues = _.filter(this.currentIssues, u => this.DV_risk.subIssueIds.includes(u.id))
        this.relatedTasks = _.filter(this.currentTasks, u => this.DV_risk.subTaskIds.includes(u.id))
        this.relatedRisks = _.filter(this.currentRisks, u => this.DV_risk.subRiskIds.includes(u.id))
        this.selectedTaskType = this.taskTypes.find(t => t.id === this.DV_risk.taskTypeId)
        this.selectedRiskStage = this.riskStages.find(t => t.id === this.DV_risk.riskStageId)
        if (risk.attachFiles) this.addFile(risk.attachFiles)
        this.$nextTick(() => {
          this.errors.clear()
          this.$validator.reset()
          this.loading = false
        })
      },
      addFile(files=[]) {
        let _files = [...this.DV_risk.riskFiles]
        for (let file of files) {
          file.guid = this.guid()
          _files.push(file)
        }
        this.DV_risk.riskFiles = _files
      },
      deleteRisk() {
        let confirm = window.confirm(`Are you sure you want to delete this issue?`)
        if (!confirm) {return}
        this.riskDeleted(this.DV_risk)
        this.cancelRiskSave()
      },
      deleteFile(file) {
        if (!file) return;
        let confirm = window.confirm(`Are you sure you want to delete attachment?`)
        if (!confirm) return;

        if (file.uri) {
          let index = this.DV_risk.riskFiles.findIndex(f => f.guid === file.guid)
          Vue.set(this.DV_risk.riskFiles, index, {...file, _destroy: true})
          this.destroyedFiles.push(file)
        }
        else if (file.name) {
          this.DV_risk.riskFiles.splice(this.DV_risk.riskFiles.findIndex(f => f.guid === file.guid), 1)
        }
      },
      toggleWatched() {
        if (this.DV_risk.watched) {
          let confirm = window.confirm(`Are you sure, you want to remove this risk from on-watch?`)
          if (!confirm) {return}
        }
        this.DV_risk = {...this.DV_risk, watched: !this.DV_risk.watched}
        this.updateWatchedRisks(this.DV_risk)
      },
      cancelRiskSave() {
        this.$emit('on-close-form')
        this.setTaskForManager({key: 'risk', value: null})
      },
      validateThenSave() {
        this.$validator.validate().then((success) => {
          if (!success || this.loading) {
            this.showErrors = !success
            return;
          }

          this.loading = true
          let formData = new FormData()
          formData.append('risk[text]', this.DV_risk.text)
          formData.append('risk[risk_description]', this.DV_risk.riskDescription)
          formData.append('risk[impact_description]', this.DV_risk.impactDescription)
          formData.append('risk[probability]', this.DV_risk.probability)
          formData.append('risk[impact_level]', this.DV_risk.impactLevel)
          formData.append('risk[risk_approach]', this.DV_risk.riskApproach)
          formData.append('risk[risk_approach_description]', this.DV_risk.riskApproachDescription)
          formData.append('risk[task_type_id]', this.DV_risk.taskTypeId)
          formData.append('risk[risk_stage_id]', this.DV_risk.riskStageId)
          formData.append('risk[progress]', this.DV_risk.progress)
          formData.append('risk[start_date]', this.DV_risk.startDate)
          formData.append('risk[due_date]', this.DV_risk.dueDate)
          formData.append('risk[auto_calculate]', this.DV_risk.autoCalculate)
          formData.append('risk[destroy_file_ids]', _.map(this.destroyedFiles, 'id'))

         if (this.DV_risk.userIds.length) {
            for (let u_id of this.DV_risk.userIds) {
              formData.append('risk[user_ids][]', u_id)
            }
          }
          else {
            formData.append('risk[user_ids][]', [])
          }

          if (this.DV_risk.subTaskIds.length) {
            for (let u_id of this.DV_risk.subTaskIds) {
              formData.append('risk[sub_task_ids][]', u_id)
            }
          }
          else {
            formData.append('risk[sub_task_ids][]', [])
          }

          if (this.DV_risk.subIssueIds.length) {
            for (let u_id of this.DV_risk.subIssueIds) {
              formData.append('risk[sub_issue_ids][]', u_id)
            }
          }
          else {
            formData.append('risk[sub_issue_ids][]', [])
          }

          if (this.DV_risk.subRiskIds.length) {
            for (let u_id of this.DV_risk.subRiskIds) {
              formData.append('risk[sub_risk_ids][]', u_id)
            }
          }
          else {
            formData.append('risk[sub_risk_ids][]', [])
          }

          for (let i in this.DV_risk.checklists) {
            let check = this.DV_risk.checklists[i]
            if (!check.text && !check._destroy) continue
            for (let key in check) {
              if (key === 'user') key = 'user_id'
              let value = key == 'user_id' ? check.user ? check.user.id : null : check[key]
              if (key === "dueDate") key = "due_date"
              formData.append(`risk[checklists_attributes][${i}][${key}]`, value)
            }
          }

           for (let i in this.DV_risk.notes) {
            let note = this.DV_risk.notes[i]
            if (!note.body && !note._destroy) continue
            for (let key in note) {
              let value = key == 'user_id' ? note.user_id ? note.user_id : this.$currentUser.id : note[key]
              formData.append(`risk[notes_attributes][${i}][${key}]`, value)
            }
          }


          for (let file of this.DV_risk.riskFiles) {
            if (!file.id) {
              formData.append('risk[risk_files][]', file)
            }
          }

          let url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/risks.json`
          let method = "POST"
          let callback = "risk-created"

          if (this.risk && this.risk.id) {
            url = `/projects/${this.currentProject.id}/facilities/${this.risk.facilityId}/risks/${this.risk.id}.json`
            method = "PUT"
            callback = "risk-updated"
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
            this.$emit(callback, humps.camelizeKeys(response.data.risk))
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        })
      },
      downloadFile(file) {
        let url = window.location.origin + file.uri
        window.open(url, '_blank');
      },
      disabledDueDate(date) {
        date.setHours(0,0,0,0)
        const startDate = new Date(this.DV_risk.startDate)
        startDate.setHours(0,0,0,0)
        return date < startDate
      },
      destroyNote(note) {
        let confirm = window.confirm(`Are you sure you want to delete this update note?`)
        if (!confirm) return;
        let i = note.id ? this.DV_risk.notes.findIndex(n => n.id === note.id) : this.DV_risk.notes.findIndex(n => n.guid === note.guid)
        Vue.set(this.DV_risk.notes, i, {...note, _destroy: true})
      },
      addChecks() {
        this.DV_risk.checklists.push({text: '', checked: false})
      },
      noteBy(note) {
        return note.user ? `${note.user.fullName} at ${new Date(note.createdAt).toLocaleString()}` : `${this.$currentUser.full_name} at (Now)`
      },
      addNote() {
        this.DV_risk.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },
      destroyCheck(check, index) {
        let confirm = window.confirm(`Are you sure, you want to delete this checklist item?`)
        if (!confirm) return;

        let i = check.id ? this.DV_risk.checklists.findIndex(c => c.id === check.id) : index
        Vue.set(this.DV_risk.checklists, i, {...check, _destroy: true})
      },
      calculateProgress(checks=null) {
        try {
          if (!checks) checks = this.DV_risk.checklists
          let checked = _.filter(checks, v => !v._destroy && v.checked && v.text.trim()).length
          let total = _.filter(checks, v => !v._destroy && v.text.trim()).length
          this.DV_risk.progress = Number((((checked / total) * 100) || 0).toFixed(2))
        } catch(err) {
          this.DV_risk.progress = 0
        }
      },
      updateCheckItem(event, name, index) {
        if (name === 'text') {
          this.DV_risk.checklists[index].text = event.target.value
          if (!event.target.value) this.DV_risk.checklists[index].checked = false
        } else if (name === 'check' && this.DV_risk.checklists[index].text) {
          this.DV_risk.checklists[index].checked = event.target.checked
        } else if (name === 'dueDate' && this.DV_risk.checklists[index].text) {
          this.DV_risk.checklists[index].dueDate = event.target.value
        }
      },
      isMyCheck(check) {
        return this.C_myRisks && check.id ? (check.user && check.user.id == this.$currentUser.id) : true
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
        'taskTypes',
        'riskStages',
        'riskApproaches',
        'currentTasks',
        'currentIssues',
        'currentRisks',
        'managerView'
      ]),
      readyToSave() {
        return (
          this.DV_risk &&
          this.exists(this.DV_risk.text) &&
          this.exists(this.DV_risk.riskDescription) &&
          this.exists(this.DV_risk.impactDescription) &&
          this.exists(this.DV_risk.probability) &&
          this.exists(this.DV_risk.impactLevel) &&
          this.exists(this.DV_risk.riskApproach) &&
          this.exists(this.DV_risk.riskApproachDescription) &&
          this.exists(this.DV_risk.taskTypeId) &&
          this.exists(this.DV_risk.startDate) &&
          this.exists(this.DV_risk.dueDate)
        )
      },
      filteredChecks() {
        return _.filter(this.DV_risk.checklists, c => !c._destroy)
      },
      filteredFiles() {
        return _.filter(this.DV_risk.riskFiles, f => !f._destroy)
      },
      C_myRisks() {
        return _.map(this.myActionsFilter, 'value').includes('risks')
      },
      title() {
        return this._isallowed('write') ? this.DV_risk.id ? 'Edit Risk' : 'Create Risk' : 'Risk'
      },
      filteredTasks() {
        return this.currentTasks
      },
      filteredIssues() {
        return this.currentIssues
      },
      filteredRisks() {
        return _.filter(this.currentRisks, t => t.id !== this.DV_risk.id)
      },
      filteredNotes() {
        return _.orderBy(_.filter(this.DV_risk.notes, n => !n._destroy), 'createdAt', 'desc')
      },
      _isallowed() {
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.risks[salut]
      }
    },
    watch: {
      risk: {
        handler: function(value) {
          if (!('id' in value)) this.DV_risk = this.INITIAL_RISK_STATE()
          this.DV_risk.riskFiles = []
          this.destroyedFiles = []
          this.loadRisk(value)
        }, deep: true
      },
      "DV_risk.startDate"(value) {
        if (!value) this.DV_risk.dueDate = ''
      },
      "DV_risk.checklists": {
        handler: function(value) {
          if (this.DV_risk.autoCalculate) this.calculateProgress(value)
        }, deep: true
      },
      "DV_risk.autoCalculate"(value) {
        if (value) this.calculateProgress()
      },
      riskUsers: {
        handler: function(value) {
          if (value) this.DV_risk.userIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedIssues: {
        handler: function(value) {
          if (value) this.DV_risk.subIssueIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedTasks: {
        handler: function(value) {
          if (value) this.DV_risk.subTaskIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      relatedRisks: {
        handler: function(value) {
          if (value) this.DV_risk.subRiskIds = _.uniq(_.map(value, 'id'))
        }, deep: true
      },
      selectedTaskType: {
        handler: function(value) {
          this.DV_risk.taskTypeId = value ? value.id : null
        }, deep: true
      },
      selectedRiskStage: {
        handler: function(value) {
          this.DV_risk.riskStageId = value ? value.id : null
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
      filteredRisks: {
        handler(value) {
          let ids = _.map(value, 'id')
          this.relatedRisks = _.filter(this.relatedRisks, t => ids.includes(t.id))
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
  #risks-form {
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
  .check-due-date {
    text-align: end;
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
   .btn-group{
      position: absolute;
      top: 50%;
      left: 50%;
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
  }
  .scrollToChecklist {      
      box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }
</style>
