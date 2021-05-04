<template>
  <div>
    <form
      id="tasks-form"
      @submit.prevent="saveLesson"    
      class="mx-auto tasks-form"
      accept-charset="UTF-8"
      :class="{'fixed-form-mapView':isMapView, _disabled: loading, 'kanban-form':isKanbanView }"
    >
      <div class="mt-2 mx-4 d-flex align-items-center">
        <div>
          <h5 class="mb-0">
            <span style="font-size: 16px; margin-right: 10px"
              ><i class="fas fa-building"></i
            ></span>
            <router-link :to="projectNameLink" :load="log(projectNameLink)">{{ currentProject.name  }}</router-link>
            <el-icon
              class="el-icon-arrow-right"
              style="font-size: 12px"
            ></el-icon>
            <span v-if="DV_lesson.title.length > 0">{{ DV_lesson.title }}</span>
            <span v-else style="color: gray" >(Lesson Name)</span>
          </h5>
        </div>
        <div class="ml-auto d-flex" v-if="_isallowed('read')">
          <button
            v-if="_isallowed('write')"
            class="btn btn-sm sticky-btn btn-primary text-nowrap mr-2"
            data-cy="task_save_btn" @click="saveLesson()"
          >
            Save Lesson
          </button>
          <button
            v-else
            disabled
            class="btn btn-sm sticky-btn btn-primary mr-2"
            data-cy="task_read_only_btn"
          >
            Read Only
          </button>
          <button            
            class="btn btn-sm sticky-btn btn-outline-secondary"
            @click.prevent="cancelSave"
            data-cy="task_close_btn"
          >
            Close
          </button>
          <button
            v-if="DV_lesson.id && _isallowed('delete')"
            class="btn btn-sm sticky-btn btn-outline-secondary"
            @click.prevent="deleteLesson"
            data-cy="task_close_btn"
          >
            Delete
          </button>
        </div>
      </div>

      <hr class="mx-4 mb-6 mt-2" />

      <div v-if="_isallowed('read')" class="d-flex form-group pt-1 mb-1 justify-content-start">

        <FormTabs
          :current-tab="currentTab"
          :tabs="tabs"
          :allErrors="errors"
          @on-change-tab="onChangeTab"
        />
      </div>
      <h6 class="mx-4 mt-4 mb-0" style="color: gray; font-size: 13px">
        <span style="color: #dc3545; font-size: 15px">*</span> Indicates
        required fields
      </h6>
      <!-- fixed-form class covers entire tab form.  CSS properties can be found in app/assets/stylesheets/common.scss file -->
      <div class="formTitle fixed-form pt-1">

      <div v-if="errors.items.length > 0" class="text-danger mx-4">
        Please fill the required fields before submitting
        <ul class="error-list mx-4">
          <li
            v-for="(error, index) in errors.all()"
            :key="index"
            v-tooltip="{
              content: 'Field is located on Lesson Info',
              placement: 'left',
            }"
          >
            {{ error }}
          </li>
        </ul>
      </div>

  <!-- Lesson INFO TAB #1 -->
  <div v-show="currentTab == 'tab1'" class="paperLookTab tab1">
    <div class="form-group pt-3 mx-4">
      <label class="font-md">Lesson Name <span style="color: #dc3545">*</span></label>
          <input
            name="Lesson Name"
            v-validate="'required'"
            type="text"
            class="form-control form-control-sm"
            v-model="DV_lesson.title"
            placeholder="Lesson Name"
            :readonly="!_isallowed('write')"
            :class="{'form-control': true, 'error': errors.has('Lesson Name') }"
            data-cy="task_name"
          />
      <div v-show="errors.has('Lesson Name')" class="text-danger" data-cy="task_name_error">
        {{errors.first('Lesson Name')}}
      </div>
    </div>
        <div class="form-group mx-4">
        <label class="font-md">Description</label>
        <textarea
          class="form-control"
          placeholder="Lesson brief description"
          v-model="DV_lesson.description"
          rows="4"
          :readonly="!_isallowed('write')"
          data-cy="task_description"
        />
      </div>

    <!-- Stages Row ends -->

    <div class="form-row mx-4">
        <div class="form-group col-md-6 pl-0">
          <label class="font-md" >Date <span style="color: #dc3545">*</span></label>
          <div :class="{ 'error-border': errors.has('Date') }">
            <v2-date-picker
              v-model="DV_lesson.date"
              value-type="YYYY-MM-DD"
              format="DD MMM YYYY"
              placeholder="DD MM YYYY"
              name="Date"
              class="w-100 vue2-datepicker"
              :disabled="!_isallowed('write')"
              data-cy="task_start_date"
            />
          </div>
          <div v-show="errors.has('Date')" class="text-danger" data-cy="task_start_date_error">
            {{errors.first('Date')}}
          </div>
        </div>
      </div>
               
    <div class="mx-4 mt-2 mb-4" v-if='false'>
      <div v-if="selectedTaskStage !== undefined">       
      <div style="position:relative"><label class="font-md mb-0">Stage</label>               
        <button v-if="_isallowed('write')" @click.prevent="clearStages" class="btn btn-sm btn-danger font-sm float-right d-inline-block clearStageBtn">Clear Stages</button>  
      </div>    
    <el-steps 
      class="exampleOne mt-3" 
      :active="selectedTaskStage.id - 1"                      
      finish-status="success"  
      :class="{'overSixSteps': taskStages.length >= 6 }" 
      :disabled="!_isallowed('write') || !!fixedStage"
      v-model="selectedTaskStage"
      track-by="id" 
      value-key="id"
      >         
      <el-step
      v-for="item in taskStages"
      :key="item.id"             
      :value="item"
      style="cursor:pointer"
      v-if="_isallowed('write')"
      @click.native="selectedStage(item)"
      :title="item.name"   
      description=""                    
    ></el-step>          
      </el-steps>          
    </div>
  </div>

  <div class="mx-4 mt-2 mb-4"  v-if='false'>
    <label class="font-md">Select Stage</label>                           
    <el-steps 
      class="exampleOne"              
      finish-status="success"
      :class="{'overSixSteps': taskStages.length >= 6 }"   
      :disabled="!_isallowed('write') || !!fixedStage"
      v-model="selectedTaskStage"  
      track-by="id" 
      value-key="id"
      >         
      <el-step
      v-for="item in taskStages"
      :key="item.id"            
      :value="item"
      style="cursor:pointer"     
      :load="log( taskStages.length )"
      v-if="_isallowed('write')"
      @click.native="selectedStage(item)"        
      :title="item.name"   
      description=""                    
    ></el-step>          
      </el-steps>
  </div>
</div>

  <div v-show="currentTab == 'tab2'" class="paperLookTab tab2">
  <div class="form-group mb-0 pt-3 d-flex w-100">
        <div class="form-group user-select ml-4 mr-1 w-100">
          <!-- 'Responsible' field was formally known as 'Assign Users' field -->
          <label class="font-md mb-0">Assign To:</label>
          <el-select
           v-model="users"
           class="w-100"
           filterable
           clearable
           track-by="id"
           value-key="id"
           placeholder="Search and select User"
           :disabled="!_isallowed('write')"
           multiple
           data-cy="task_owner"
           >
          <el-option
            v-for="item in activeProjectUsers"
            :value="item"
            :key="item.id"
            :label="item.fullName"
            >
          </el-option>
          </el-select>

          <label class="font-md mb-0">Projects:</label>
          <el-select
           v-model="selectedFacilityProjects"
           class="w-100"
           filterable
           clearable
           track-by="id"
           value-key="id"
           placeholder="Search and select Project"
           :disabled="!_isallowed('write')"
           multiple
           data-cy="task_owner"
           >
          <el-option
            v-for="item in activeFacilityProjects"
            :value="item"
            :key="item.id"
            :label="item.name"
            >
          </el-option>
          </el-select>

        </div>
  </div>

  </div>


   <!-- FILES TAB # 4-->
<div v-show="currentTab == 'tab3'" class="paperLookTab tab4">
          <div class="container-fluid mx-4 mt-2">
           <div class="row">
               <div class="col-5 pr-4 links-col">
                  <div v-if="_isallowed('write')" class="form-group">
                  <attachment-input
                    @input="addFile"
                    :show-label="true"
                  ></attachment-input>
                </div>
                <div
                  v-for="file in filteredFiles.slice().reverse()"
                  class="d-flex mb-2 w-100"
                   v-if="!file.link"
                 >
                <div
                  class="input-group-text  d-inline clickable px-1 w-100 hover"
                  :class="{ 'btn-disabled': !file.uri }"
                  @click.prevent="downloadFile(file)"
                >
                  <span><font-awesome-icon icon="file" class="mr-1"/></span>

                  <input
                    readonly
                    type="text"
                    style="border:none; cursor:pointer;background-color:transparent"
                    class="w-100 mr-1 file-link"
                    :value="file.name || file.uri"
                  />
                </div>
                  <span
                    :class="{ _disabled: loading || !_isallowed('write') }"
                    class="del-check mt-2 clickable"
                    @click.prevent="deleteFile(file)"
                  >
                    <i class="fas fa-times"></i>
                  </span>
                 </div>
              </div>
              <div class="col-6 mb-2 pl-4 links-col">

                 <div class="input-group mb-1">
                    <div v-if="_isallowed('write')" class="d-block mt-1">
                    <label class="font-lg">Add link</label>
                    <span
                      class="ml-2 clickable"                      
                      @click.prevent="addFilesInput"
                    >
                      <i class="fas fa-plus-circle"></i>
                    </span>
                   </div>

                  <div
                    v-for="(file, index) in DV_lesson.lessonFiles.slice().reverse()"
                    :key="index"
                    class="d-flex mb-2 w-75"
                    v-if="!file.id && file.link"
                  >
                    <div class="input-group-append" >
                      <div
                        class="input-group-text clickable"
                        :class="{ 'btn-disabled': !file.uri }"
                        @click.prevent="downloadFile(file)"
                      >
                        <!-- <i class="fas fa-link"></i> -->
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter link to a site or file"
                      class="form-control form-control-sm mw-95"
                      @input="updateFileLinkItem($event, 'text', file)"
                    />
                    <div
                      :class="{ _disabled: loading || !_isallowed('write') }"
                      class="del-check clickable"
                      @click.prevent="deleteFile(file)"
                    >
                      <i class="fas fa-times"></i>
                    </div>
                  </div>

                  <div
                   v-for="(file, index) in filteredFiles.slice().reverse()"
                   :key="index"
                   class="d-flex mb-2 w-100 px-1 hover"
                   v-if="file.link && file.id"
                >

                  <input
                    readonly
                    type="text"
                    class="form-control form-control-sm mw-95"
                    :value="file.name || file.uri"
                    v-if="!file.link"
                  />
                  <a :href="file.uri" target="_blank" v-if="file.link" class="no-text-decoration">
                    <span v-if="file.link"> <i class="fas fa-link mr-1"></i></span>{{ urlShortener(file.uri, 68) }}
                  </a>
                  <div
                    :class="{ _disabled: loading || !_isallowed('write') }"
                    class="del-check clickable"
                    @click.prevent="deleteFile(file)"
                  >
                    <i class="fas fa-times"></i>
                  </div>
                </div>
                </div>

              </div>
            </div>

</div>
<!-- closing div for tab4 -->
</div>


 <!-- RELATED TAB #5 -->
<div v-show="currentTab == 'tab4'" class="paperLookTab tab5">

      <div class="form-group user-select pt-3 mx-4">
        <label class="font-md" >Category</span></label >
        <el-select
          v-model="selectedTaskType"
          class="w-100"
          track-by="id"
          value-key="id"
          :disabled="!_isallowed('write')"
          data-cy="task_type"
          name="Category"
          :class="{ 'error-border': errors.has('Category') }"
          placeholder="Select Category"
           >
          <el-option
            v-for="item in taskTypes"
            :value="item"
            :key="item.id"
            :label="item.name"
            >
          </el-option>
          </el-select>
          <div
          v-show="errors.has('Category')"
          class="text-danger"
          data-cy="task_category_error"
        >
          {{ errors.first("Category") }}
        </div>
      </div>

      <div class="form-group user-select pt-3 mx-4">
        <label class="font-md mb-0">Related Task</label>
         <el-select
          v-model="selectedTask"
          class="w-100"
          track-by="id"
          value-key="id"
          filterable
         :disabled="!_isallowed('write')"
          placeholder="Search and select Related-tasks"

          >
         <el-option
          v-for="item in filteredTasks"
          :value="item"
          :key="item.id"
          :label="item.text"
           >
          </el-option>
          </el-select>

      </div>

      <div class="form-group user-select mx-4">
        <label class="font-md mb-0">Related Issue</label>
          <el-select
          v-model="selectedIssue"
          class="w-100"
          track-by="id"
          value-key="id"
          filterable
          :disabled="!_isallowed('write')"
          placeholder="Search and select Related-issues"

          >
         <el-option
          v-for="item in filteredIssues"
          :value="item"
          :key="item.id"
          :label="item.title"
           >
          </el-option>
          </el-select>

      </div>
        <div class="form-group user-select mx-4">
        <label class="font-md mb-0">Related Risk</label>
         <el-select
          v-model="selectedRisk"
          class="w-100"
          track-by="id"
          value-key="id"
          filterable
         :disabled="!_isallowed('write')"
          placeholder="Search and select Related-risks"

          >
         <el-option
          v-for="item in filteredRisks"
          :value="item"
          :key="item.id"
          :label="item.text"
           >
          </el-option>
          </el-select>
      </div>


    <!-- closing div for tab4 -->
 </div>


  <!-- UPDATE TAB 5 -->
  <div v-show="currentTab == 'tab5'" class="paperLookTab tab5">


     <div class="form-group mx-4 paginated-updates">
        <label class="font-sm">Successes:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addSuccess">
          <i class="fas fa-plus-circle"></i>
        </span>
        <paginate-links v-if="filterLessonDetailSuccess.length" for="filterLessonDetailSuccess"  class="paginate float-right" :show-step-links="true" :limit="2"></paginate-links>
        <paginate ref="paginator" name="filterLessonDetailSuccess" :list="filterLessonDetailSuccess" :per="5" class="paginate-list" :key="filterLessonDetailSuccess ? filterLessonDetailSuccess.length : 1">
          <div v-for="lessonDetail in paginated('filterLessonDetailSuccess')" class="form-group">
            <span class="d-inline-block w-100"><label class="badge badge-secondary">Success by</label> <span class="font-sm text-muted">{{noteBy(lessonDetail)}}</span>
              <span v-if="allowDeleteNote(lessonDetail)" class="clickable font-sm delete-action float-right" @click.prevent.stop="destroyLessonDetail(lessonDetail)">
                <i class="fas fa-trash-alt"></i>
              </span>
            </span>
            <textarea class="form-control mb-2" v-model="lessonDetail.finding" rows="3" placeholder="Enter findings..."></textarea>
            <textarea class="form-control" v-model="lessonDetail.recommendation" rows="3" placeholder="Enter recommendations.."></textarea>
          </div>
        </paginate>
      </div>
  </div>

  <!-- UPDATE TAB 6 -->
  <div v-show="currentTab == 'tab6'" class="paperLookTab tab6">


     <div class="form-group mx-4 paginated-updates">
        <label class="font-sm">Failures:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addFailure">
          <i class="fas fa-plus-circle"></i>
        </span>
        <paginate-links v-if="filterLessonDetailFailure.length" for="filterLessonDetailFailure" class="paginate float-right" :show-step-links="true" :limit="2"></paginate-links>
        <paginate ref="paginator" name="filterLessonDetailFailure" :list="filterLessonDetailFailure" :per="5" class="paginate-list" :key="filterLessonDetailFailure ? filterLessonDetailFailure.length : 1">
          <div v-for="lessonDetail in paginated('filterLessonDetailFailure')" class="form-group">
            <span class="d-inline-block w-100"><label class="badge badge-secondary">Failure by</label> <span class="font-sm text-muted">{{noteBy(lessonDetail)}}</span>
              <span v-if="_isallowed('delete')" class="clickable font-sm delete-action float-right" @click.prevent.stop="destroyLessonDetail(lessonDetail)">
                <i class="fas fa-trash-alt"></i>
              </span>
            </span>
            <textarea class="form-control mb-2" v-model="lessonDetail.finding" rows="3" placeholder="Enter findings..."></textarea>
            <textarea class="form-control" v-model="lessonDetail.recommendation" rows="3" placeholder="Enter recommendations.."></textarea>
          </div>
        </paginate>
      </div>
  </div>

  <!-- UPDATE TAB 7 -->
  <div v-show="currentTab == 'tab7'" class="paperLookTab tab5">


     <div class="form-group mx-4 paginated-updates">
        <label class="font-sm">Updates:</label>
        <span class="ml-2 clickable" v-if="_isallowed('write')" @click.prevent="addNote">
          <i class="fas fa-plus-circle"></i>
        </span>
        <paginate-links v-if="filteredNotes.length" for="filteredNotes" class="float-right" :show-step-links="true" :limit="2"></paginate-links>
        <paginate ref="paginator" name="filteredNotes" :list="filteredNotes" :per="5" class="paginate-list" :key="filteredNotes ? filteredNotes.length : 1">
          <div v-for="note in paginated('filteredNotes')" class="form-group" :key="note.id">
            <span class="d-inline-block w-100"><label class="badge badge-secondary">Update by</label> <span class="font-sm text-muted">{{noteBy(note)}}</span>
              <span v-if="allowDeleteNote(note)" class="clickable font-sm delete-action float-right" @click.prevent.stop="destroyNote(note)">
                <i class="fas fa-trash-alt"></i>
              </span>
            </span>
            <textarea class="form-control" v-model="note.body" rows="3" placeholder="Enter your update here..." :readonly="!allowEditNote(note)"></textarea>
          </div>
        </paginate>
      </div>
     </div>
     <!-- closing div for tab5 -->
  </div>

  <!-- TABBED OUT SECTION END HERE -->

    </form>
    <div v-if="loading" class="load-spinner spinner-border text-dark" role="status"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import Draggable from "vuedraggable"
  import FormTabs from './../../shared/FormTabs'
  import humps from 'humps'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import AttachmentInput from './../../shared/attachment_input'
  import * as Moment from 'moment'
  import {extendMoment} from 'moment-range'
  const moment = extendMoment(Moment)
  export default {
    name: 'LessonForm',
    props: ['facility', 'facilities', 'title', 'fixedStage', 'projectId'],
    components: {
      AttachmentInput, Draggable, FormTabs
    },
    data() {
      return {
        DV_lesson: this.INITIAL_LESSON_STATE(),
        paginate: ['filteredNotes', 'filterLessonDetailSuccess', 'filterLessonDetailFailure'],
        destroyedFiles: [],
        selectedTaskType: null,
        selectedTaskStage: null,
        selectedTask: null,
        selectedIssue: null,
        selectedRisk: null,
        selectedFacilityProjects: [],
        users: [],
        activeFacilityProjects: [],
        showErrors: false,
        loading: true,
        movingSlot: '',
        currentTab: 'tab1',
        tabs: [
          {
            label: "Lesson Info",
            key: "tab1",
            closable: false,
            form_fields: [
              "Lesson Name",
              "Description",
              "Start Date",
              "Category",
              "Stage"
            ],
          },
          {
            label: "Assignments",
            key: "tab2",
            closable: false,
            form_fields: ["Responsible", "Accountable", "Consulted", "Informed"],
          },
          {
            label: "Files & Links",
            key: "tab3",
            closable: false,
            form_fields: ["Files"],
          },
          {
            label: "Related",
            key: "tab4",
            closable: false,
            form_fields: ["Related Task", "Related Issue", "Related Risk"],
          },
          {
            label: "Successes",
            key: "tab5",
            closable: false,
            form_fields: ["Files"],
          },
          {
            label: "Failures",
            key: "tab6",
            closable: false,
            form_fields: ["Files"],
          },
          {
            label: "Updates",
            key: "tab7",
            closable: false,
            form_fields: ["Progress", "Updates"],
          }
        ],
      }
    },
    mounted() {
      if (this.contentLoaded && this.$route.params.lessonId !== "new") {
        this.lesson = this.currentProject.lessons.find(
          (lesson) => lesson.id == parseInt(this.$route.params.lessonId)
        );
        this.activeFacilityProjects = _.flatten(_.map(this.currentProject.facilities, f => [{id: f.facilityProjectId, name: f.facilityName}] ) )
      }
      if (!_.isEmpty(this.lesson)) {
        this.loadLesson(this.lesson)
      }else{
        this.loadLesson(this.DV_lesson)
      }

      this.loading = false
      this._ismounted = true
     },
    methods: {
      ...mapMutations([
        'setLessonForManager',
        'updateTasksHash'
      ]),
      ...mapActions([
        'taskDeleted',
        'taskUpdated',
        'updateWatchedTasks'
      ]),
      INITIAL_LESSON_STATE() {
        return {
          title: '',
          date: '',
          taskTypeId: '',
          taskId: '',
          riskId: '',
          issueId: '',
          issueTypeId: '',
          userIds: [],
          facilityProjectIds: [],
          subTaskIds: [],
          subIssueIds: [],
          subRiskIds: [],
          description: '',
          lessonFiles: [],
          notes: [],
          lessonDetails: []
        }
      },
      log(e){
        //console.log("This is the currentProject: " + e)
      },
      allowDeleteNote(note) {
        return this._isallowed('delete') && note.guid || (note.userId == this.$currentUser.id)
      },
      allowEditNote(note) {
        return this._isallowed('write') && note.guid || (note.userId == this.$currentUser.id)
      },
      selectedStage(item){    
        this.selectedTaskStage = item
      },  
      clearStages() {
        this.selectedTaskStage = null
        this.taskStageId = ""
      },
      urlShortener(str, length, ending) {
        if (length == null) {
          length = 70;
        }
        if (ending == null) {
          ending = '...';
        }
        if (str.length > length) {
          return str.substring(0, length - ending.length) + ending;
        } else {
          return str;
        }
      },
      scrollToUpdates(){
        this.$refs.addUpdates.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        this.DV_lesson.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },
      handleMove(item) {
        this.movingSlot = item.relatedContext.component.$vnode.key
        return true
      },
      onChangeTab(tab) {
        this.currentTab = tab ? tab.key : 'tab1'
      },
      deleteTask() {
        let confirm = window.confirm(`Are you sure you want to delete "${this.DV_lesson.title}"?`)
        if (!confirm) {return}
        this.taskDeleted(this.DV_lesson)
        this.cancelSave()
      },
      progressListTitleText(progressList){
        if(!progressList.id) return;
        var date = moment(progressList.createdAt).format("MM/DD/YYYY")
        var time = moment(progressList.createdAt).format("hh:mm:ss a")
        return `${progressList.user.fullName} at ${date} ${time} `
      },
      loadLesson(lesson) {
        this.DV_lesson = {...this.DV_lesson, ..._.cloneDeep(lesson)}
        this.users = _.filter(this.activeProjectUsers, u => this.DV_lesson.userIds.includes(u.id))
        this.selectedFacilityProjects = _.filter(this.activeFacilityProjects, u => this.DV_lesson.facilityProjectIds.includes(u.id) )
        this.selectedIssue = _.filter(this.filteredIssues, u => this.DV_lesson.issueId = u.id)[0]
        this.selectedTask = _.filter(this.filteredTasks, u => this.DV_lesson.taskId == u.id)[0]
        this.selectedRisk = _.filter(this.filteredRisks, u => this.DV_lesson.riskId == u.id)[0]
        if (this.DV_lesson.attachFiles) this.addFile(this.DV_lesson.attachFiles, false)
        this.$nextTick(() => {
          this.errors.clear()
          this.$validator.reset()
        })
      },
      fetchLesson(){
        var lessonId = this.$route.params.lessonId
        var programId = this.$route.params.programId
        let url = `/projects/${programId}/lessons/${lessonId}.json`
        let method = "GET"

        axios({
          method: method,
          url: url,
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
          }
        })
        .then((response) => {
          this.DV_lesson = humps.camelizeKeys(response.data.lesson)
          this.loadLesson(humps.camelizeKeys(response.data.lesson))
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
      },
      addFile(files, append = true) {
        let _files = append ? [...this.DV_lesson.lessonFiles] : []
        for (let file of files) {
          file.guid = this.guid()
          _files.push(file)
        }
        this.DV_lesson.lessonFiles = _files
      },
      deleteFile(file) {
        if (!file) return;
        let confirm = window.confirm(`Are you sure you want to delete attachment?`)
        if (!confirm) return;

        if (file.uri || file.link) {
          let index = this.DV_lesson.lessonFiles.findIndex(f => f.guid === file.guid)
          if(file.id){
            Vue.set(this.DV_lesson.lessonFiles, index, {...file, _destroy: true})
            this.destroyedFiles.push(file)
          }
          this.DV_lesson.lessonFiles.splice(this.DV_lesson.lessonFiles.findIndex(f => f.guid === file.guid), 1)
        }
        else if (file.name) {
          this.DV_lesson.lessonFiles.splice(this.DV_lesson.lessonFiles.findIndex(f => f.guid === file.guid), 1)
        }
      },
      cancelSave() {
        this.$router.push(
          `/programs/${this.$route.params.programId}/lessons`
        );
      },
      deleteLesson() {
        let confirm = window.confirm(`Are you sure you want to delete "${this.lesson.title}"?`)
        if (!confirm) {return}

        axios({
          method: "DELETE",
          url: `/projects/${this.currentProject.id}/lessons/${this.lesson.id}.json`,
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').attributes['content'].value
          }
        })
        .then((response) => {
          var lessonId = response.data.lesson.id
          _.remove(this.currentProject.lessons, lesson => lesson.id == lessonId)

          this.$message({
             message: `Lesson was deleted successfully.`,
            type: "success",
            showClose: true,
          });
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loading = false
        })
        this.cancelSave()
      },
      saveLesson() {
        if (!this._isallowed('write')) return
        this.$validator.validate().then((success) =>
        {
          if (!success || this.loading) {
            this.showErrors = !success
            return;
          }
          this.editToggle = !this.editToggle
          this.loading = true
          let formData = new FormData()

          if(this.DV_lesson.id)
            formData.append('lesson[id]', this.DV_lesson.id)

          formData.append('lesson[title]', this.DV_lesson.title)
          formData.append('lesson[description]',  this.DV_lesson.description)
          formData.append('lesson[date]',  this.DV_lesson.date)

          formData.append('lesson[task_type_id]', 1)
          formData.append('lesson[issue_type_id]', 1)

          if(this.DV_lesson.taskId){
            formData.append('lesson[task_id]', this.DV_lesson.taskId)
          }
          if(this.DV_lesson.riskId){
            formData.append('lesson[risk_id]', this.DV_lesson.riskId)  
          }
          if(this.DV_lesson.issueId){
            formData.append('lesson[issue_id]', this.DV_lesson.issueId)
          }
          
          if(this.currentProject.id){
            formData.append('lesson[project_id]', this.currentProject.id)
          }

          if (this.DV_lesson.userIds && this.DV_lesson.userIds.length) {
            for (let u_id of this.DV_lesson.userIds) {
              formData.append('lesson[user_ids][]', u_id)
            }
          }
          else {
            formData.append('lesson[user_ids][]', [])
          }
          if (this.DV_lesson.facilityProjectIds && this.DV_lesson.facilityProjectIds.length) {
            for (let u_id of this.DV_lesson.facilityProjectIds) {
              formData.append('lesson[facility_project_ids][]', u_id)
            }
          }
          else {
            formData.append('lesson[facility_project_ids][]', [])
          }
          
          for (let i in this.DV_lesson.notes) {
            let note = this.DV_lesson.notes[i]
            if (!note.body && !note._destroy) continue
            for (let key in note) {
              let value = key == 'user_id' ? note.user_id ? note.user_id : this.$currentUser.id : note[key]
              key = humps.decamelize(key)
              formData.append(`lesson[notes_attributes][${i}][${key}]`, value)
            }
          }
          for (let i in this.DV_lesson.lessonDetails) {
            let lessonDetail = this.DV_lesson.lessonDetails[i]
            if (!lessonDetail.finding && !lessonDetail.recommendation && !lessonDetail._destroy) continue
            for (let key in lessonDetail) {              
              let value = key == 'user_id' ? lessonDetail.user_id ? lessonDetail.user_id : this.$currentUser.id : lessonDetail[key]
              key = humps.decamelize(key)
              formData.append(`lesson[lesson_details][${i}][${key}]`, value)
            }
          }
          for (let file of this.DV_lesson.lessonFiles) {
            if(file.id) continue
            if (!file.link) {
              formData.append('lesson[lesson_files][]', file)
            }else if(file.link){
              formData.append('file_links[]', file.name)
            }
          }

          let url = `/projects/${this.currentProject.id}/lessons.json`
          let method = "POST"
          let callback = "task-created"

          if (this.lesson && this.lesson.id) {
            url = `/projects/${this.currentProject.id}/lessons/${this.lesson.id}.json`
            method = "PUT"
            callback = "task-updated"
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

            if (response.status === 200) {
              this.setLessonForManager({key: 'lesson', value: {}})
              // Route to new task form page
              this.$router.push(
                `/programs/${this.$route.params.programId}/lessons`
              );
              this.$message({
                 message: `Lesson was saved successfully.`,
                type: "success",
                showClose: true,
              });
            }
            
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            this.loading = false
          })
        })
      },
      addFilesInput(){
        this.DV_lesson.lessonFiles.push({name: "", uri: '', link: true,guid: this.guid()})
      },
      addNote() {
        this.DV_lesson.notes.unshift({body: '', user_id: '', guid: this.guid()})
      },
      addSuccess(){
        this.DV_lesson.lessonDetails.unshift({finding: '', recommendation:'',detailType: 'success',  user_id: '', guid: this.guid()})
      },
      addFailure(){
        this.DV_lesson.lessonDetails.unshift({finding: '',recommendation:'',detailType: 'failure',  user_id: '', guid: this.guid()})
      },
      destroyNote(note) {
        let confirm = window.confirm(`Are you sure you want to delete this update note?`)
        if (!confirm) return;
        if(note.id){
          let i = this.DV_lesson.notes.findIndex(n => n.id === note.id)
          Vue.set(this.DV_lesson.notes, i, {...note, _destroy: true})
        }else{
          this.DV_lesson.notes = _.filter(this.DV_lesson.notes, (n) => n.guid != note.guid) 
        }
      },
      destroyLessonDetail(lessonDetail) {
        let confirm = window.confirm(`Are you sure you want to delete?`)
        if (!confirm) return;
        if(lessonDetail.id){
          let i = this.DV_lesson.lessonDetails.findIndex(n => n.id === lessonDetail.id)
          Vue.set(this.DV_lesson.lessonDetails, i, {...lessonDetail, _destroy: true})
        }else{
          this.DV_lesson.lessonDetails = _.filter(this.DV_lesson.lessonDetails, (n) => n.guid != lessonDetail.guid) 
        }
      },
      noteBy(note) {
        return note.user ? `${note.user.fullName} at ${new Date(note.createdAt).toLocaleString()}` : `${this.$currentUser.full_name} at (Now)`
      },
      downloadFile(file) {
        let url = window.location.origin + file.uri
        window.open(url, '_blank');
      },
      updateFileLinkItem(event, name, input) {
        //var v = event.target.value
        //var valid = /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/i/.test(v);
        if(event.target.value){
          input.name = event.target.value
        }
      },
      allowEditNote(note) {
        return this._isallowed('write') && note.guid || (note.userId == this.$currentUser.id)
      },
      disabledDateRange(date) {
        var dueDate = new Date(this.DV_lesson.dueDate)
        dueDate.setDate(dueDate.getDate() + 1)
        return date < new Date(this.DV_lesson.startDate) || date > dueDate;
      },
    },
    computed: {
      ...mapGetters([
        'contentLoaded',
        'fetchCurrentProject',
        'getFacilityProjectOptions',
        'currentProject',        
        'taskTypes',
        'taskStages',
        'activeProjectUsers',
        'projectUsers',
        'myActionsFilter',
        'currentTasks',
        'currentIssues',
        'currentRisks',
        'managerView'
   
      ]),
      readyToSave() {
        return (
          this.DV_lesson &&
          this.exists(this.DV_lesson.title) &&
          this.exists(this.DV_lesson.description)
        )
      },
      isMapView() {
        return this.$route.name === 'ProjectMapView'
      },
      isKanbanView() {
        return this.$route.name === 'ProjectKanbanView'
      },
      isSheetsView() {
        return this.$route.name === 'ProjectSheets'
      },
      filteredFiles() {
        return _.filter(this.DV_lesson.lessonFiles, f => !f._destroy)
      },
      C_myTasks() {
        return _.map(this.myActionsFilter, 'value').includes('tasks')
      },
      filteredTasks() {
        return _.filter(this.currentTasks, t => t.id !== this.DV_lesson.id)
      },
      filteredRisks() {
        return _.filter(this.currentRisks, t => t.id !== this.DV_lesson.id)
      },
      filteredIssues() {
        return this.currentIssues
      },
      filteredNotes() {
        return _.orderBy(_.filter(this.DV_lesson.notes, n => !n._destroy), 'createdAt', 'desc')
      },
      filterLessonDetailSuccess(){
        var details = _.filter(this.DV_lesson.lessonDetails, n => (n.detailType == 'success' && !n._destroy))
        return _.orderBy(details, 'createdAt', 'desc')
      
      },
      filterLessonDetailFailure(){
        var details = _.filter(this.DV_lesson.lessonDetails, n => ( n.detailType == 'failure' && !n._destroy) )
        return _.orderBy(details, 'createdAt', 'desc')
      },
      filterLessonDetailBestPractice(){
        var details = _.filter(this.DV_lesson.lessonDetails, n => ( n.detailType == 'best_practices') && !n._destroy )
        return _.orderBy(details, 'createdAt', 'desc')
      },
      filterLessonDetail(detailType){
        var details = _.filter(this.DV_lesson.lessonDetails, n => n.detailType == detailType)
        return _.orderBy(details, 'createdAt', 'desc')
      },
      _isallowed() {
        console.log(this.$currentUser.role)
        return salut => this.$currentUser.role == "superadmin" || this.$permissions.lessons[salut]
      },
      C_title() {
        return this._isallowed('write') ? this.task.id ? "Edit Task" : "Add Task" : "Task"
      },

      tab() {
        if (this.$route.path.includes("map")) {
          return "map";
        } else if (this.$route.path.includes("sheet")) {
          return "sheet";
        } else if (this.$route.path.includes("lessons")) {
          return "lessons";
        } else {
          return "kanban";
        }
      },
      projectNameLink() {
        if (this.$route.path.includes("lessons")) {
          return `/programs/${this.$route.params.programId}/${this.tab}`
        }
      }
    },
    watch: {
      contentLoaded: {
        handler() {
          if (this.contentLoaded && this.$route.params.lessonId && this.$route.params.lessonId !== "new") {
            // This will call when edit lesson url will hit reload
            this.fetchLesson()
          }
          if (!_.isEmpty(this.lesson)) {
            this.loadLesson(this.lesson)
          }else{
            this.loadLesson(this.DV_lesson)
          }

          this.loading = false
          this._ismounted = true
          
        },
      },
      lesson: {
        handler: function(value) {
          this.loadLesson(this.lesson)
        }
      },
      "DV_lesson.startDate"(value) {
        if (this._ismounted && !value) this.DV_lesson.dueDate = ''
      },
      users: {
        handler: function(value) {
          if (value){
              this.DV_lesson.userIds = _.uniq(_.map( _.flatten([value]) , 'id'))
          }else{
            this.DV_lesson.userIds = null
          }
        }, deep: true
      },
      selectedIssue: {
        handler: function(value) {
          if (value) this.DV_lesson.issueId = value.id
        }, deep: true
      },
      selectedTask: {
        handler: function(value) {
          if (value) this.DV_lesson.taskId = value.id
        }, deep: true
      },
      selectedRisk:{
        handler: function(value) {
          if (value) this.DV_lesson.riskId = value.id
        }, deep: true
      },
      selectedTaskType: {
        handler: function(value) {
          // console.log("SelectedTaskType: " + value)
          this.DV_lesson.taskTypeId = value ? value.id : null
        }, deep: true
      },
      selectedTaskStage: {
        handler: function(value) {
          this.DV_lesson.taskStageId = value ? value.id : null
        }, deep: true
      },
      selectedFacilityProjects: {
        handler: function(value) {
          if (value){
              this.DV_lesson.facilityProjectIds = _.uniq(_.map( _.flatten([value]) , 'id'))
          }else{
            this.DV_lesson.facilityProjectIds = null
          }
        }, deep: true
      },
      "filteredNotes.length"(value, previous) {
        this.$nextTick(() => {
          if (this.$refs.paginator && (value === 1 || previous === 0)) {
            this.$refs.paginator.goToPage(1)
          }
        })
      },
       "filterLessonDetailSuccess.length"(value, previous) {
        this.$nextTick(() => {
          if (this.$refs.paginator && (value === 1 || previous === 0)) {
            this.$refs.paginator.goToPage(1)
          }
        })
      },
       "filterLessonDetailFailure.length"(value, previous) {
        this.$nextTick(() => {
          if (this.$refs.paginator && (value === 1 || previous === 0)) {
            this.$refs.paginator.goToPage(1)
          }
        })
      }
    }
  };
</script>

<style scoped lang="scss">
  .tasks-form {
    
  }
  .kanban-form {
    left: 16.4%;
    width: 83.33%;
    z-index: 100;
  }
  .fixed-form-mapView {
    width: 100%;
    top:0;
    position: absolute;
    transform: scale(1.03);
  }
  td, th {
    border: solid 1px #ededed;
    padding: 1px 3px;
  }
  tbody {
    background-color: #fff;
  }

  th {
    background:  #ededed;
    color: #383838;
    padding: 1px 3px;
  }
  .form-control.error {
    border-color: #E84444;
  }
  .checklist-text {
    margin-left: 5px;
    min-height: 33px;
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
    position: absolute;
    display: flex;
    font-weight: 500;
    right: 2rem;
    background: transparent;
    height: fit-content;
    color: #dc3545;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  .paperLook {
    padding-bottom: 20px;
    margin-bottom: 10px;
    position: relative;
  }    
  .red-border {
    border: solid .5px red;
  }
  .sticky-btn {
    margin-top: 5px;
    margin-bottom: 5px;
    box-shadow: 0 5px 10px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }

  .scrollToChecklist, .addCheckProgBtn, .check-items {
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 1px 1px rgba(56,56,56,0.23);
  }
  .addCheckProgBtn:hover {
    background-color: lightgray !important;
  }
  .check-due-date {
    text-align: end;
  }
  .disabled {
    opacity: 0.6;
  }
   .simple-select /deep/ .multiselect {
    .multiselect__placeholder {

      text-overflow: ellipsis;
    }
  }
  .custom-tab {
    background-color: #fff;
    box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
  }
  .fixed-form {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100vh - 275px);
  }
  .fixed-form-mapView {
   width: 100%;
   position: absolute;
  }
  .display-length {
   border-radius: 0.15rem;
   margin-right: 12px;
  }
  .fa-building {
    font-size: large !important;
    color: #383838 !important;
  }
  .error-list {
  list-style-type: circle;
  li {
    width: max-content;
  }
}
.text-danger {
  font-size: 13px;
}
.error-border {
  border: 1px solid red;
  border-radius: 4px;
}
.overflow-ellipsis {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow-x: hidden;
}
 /deep/.el-collapse-item__header {
  background-color: #fafafa;
 }
 /deep/ .el-collapse {
  border-top: none !important;
  border-bottom: none !important;
}
/deep/.el-collapse-item__content {
  padding-bottom: 0 !important;
}
/deep/.el-collapse-item__header {
  background-color: #fafafa;
}
 #roll_up {
  /deep/.el-collapse-item__header {
    float: right;
    padding: 1em;
    margin-top: -36px;
    color: #d9534f !important;
    border-bottom: none !important;
    background-color: #fafafa !important;
  }
}
.informed.el-input__inner {
  height: 32px;
}
.no-text-decoration:link {
  text-decoration: none;
  color: #495057;
  text-decoration-color: none;
}
.no-text-decoration:active{
  text-decoration: none;
  color: #495057;
  text-decoration-color: none;
}
.no-text-decoration:visited {
  text-decoration: none;
  color: #495057;
  text-decoration-color: none;
}
.hover {
  background: transparent;
  border-radius: 0 !important;
}
.hover:hover {
  cursor: pointer;
  background-color: rgba(91, 192, 222, 0.3);
}
input.file-link {
  outline:0 none;
}
.clearStageBtn {
  box-shadow: 0 2.5px 5px rgba(56,56, 56,0.19), 0 3px 3px rgba(56,56,56,0.23);
}

.exampleTwo.el-steps, .exampleTwo.el-steps--simple {
  border: 1px solid #DCDFE6;
  background: #fff; 
}

.overSixSteps {
/deep/.el-step__title {
  font-size: 11px !important;
  line-height: 23px !important;
  margin: 5px !important;
 }
}
a {
  color: #007bff
}
a:hover {
  text-decoration: unset;
}
</style>

