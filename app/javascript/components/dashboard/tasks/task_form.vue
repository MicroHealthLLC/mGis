<template>
  <div>
   <form
      id="tasks-form"
      @submit.prevent="saveTask"
      class="mx-auto tasks-form"
      accept-charset="UTF-8"
      :class="{ _disabled: loading }"
    >
      <div class="mt-2 mx-4 d-flex align-items-center">
        <div>
          <h5 class="mb-0">
            <span style="font-size: 16px; margin-right: 2.5px"
              > <font-awesome-icon style="margin-bottom:1px" icon="suitcase" />
            </span>
            <router-link :to="projectNameLink">{{
              facility.facilityName
            }}</router-link>
            <el-icon
              class="el-icon-arrow-right"
              style="font-size: 12px"
            ></el-icon>
            <router-link
              :to="
                `/programs/${this.$route.params.programId}/${tab}/projects/${this.$route.params.projectId}/tasks`
              "
              >Tasks</router-link
            >
            <el-icon
              class="el-icon-arrow-right"
              style="font-size: 12px"
            ></el-icon>
            <span v-if="DV_task.text.length > 0">{{ DV_task.text }}</span>
            <span v-else style="color: gray">(Task Name)</span>
          </h5>
        </div>
       
        <div class="ml-auto d-flex" v-if="_isallowed('read')">
          <button
            v-if="_isallowed('write')"
            class="btn btn-sm sticky-btn btn-primary text-nowrap mr-2"
            data-cy="task_save_btn"
          >
            Save Task
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
        </div>
      
      </div>

      <hr class="mx-4 mb-6 mt-2" />

      <div
        v-if="_isallowed('read')"
        class="d-flex form-group pt-1 mb-1 justify-content-start"
      >
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
                content: 'Field is located on Task Info',
                placement: 'left',
              }"
            >
              {{ error }}
            </li>
          </ul>
        </div>
      

        <!-- TASK INFO TAB #1 -->
        <div v-show="currentTab == 'tab1'" class="paperLookTab tab1">
          <div class="form-group pt-3 mx-4">
            <label class="font-md"
              >Task Name <span style="color: #dc3545">*</span></label
            >
            <span
              v-if="_isallowed('write')"
              class="watch_action clickable float-right"
              @click.prevent.stop="toggleWatched"
              data-cy="task_on_watch"
            >
              <span v-show="DV_task.watched" class="check_box mr-1"
                ><i class="far fa-check-square"></i
              ></span>
              <span v-show="!DV_task.watched" class="empty_box mr-1"
                ><i class="far fa-square"></i
              ></span>
              <span><i class="fas fa-eye"></i></span
              ><small style="vertical-align:text-top"> On Watch</small>
            </span>

            <span
              v-if="_isallowed('write')"
              class="watch_action clickable float-right"
              @click.prevent.stop="toggleImportant"
              data-cy="task_important"
            >
              <span v-show="DV_task.important" class="check_box mr-1">
                <i class="far fa-check-square"></i>
              </span>
              <span v-show="!DV_task.important" class="empty_box mr-1">
                <i class="far fa-square"></i>
              </span>
              <span>
                <i class="fas fa-eye"></i>
              </span>
              <small style="vertical-align:text-top"> Important</small>
            </span>

            <el-input
              name="Task Name"
              v-validate="'required'"
              type="text"
              v-model="DV_task.text"
              placeholder="Task Name"
              :readonly="!_isallowed('write')"
              :class="{ error: errors.has('Task Name'), }"
              data-cy="task_name"
            />
            <div
              v-show="errors.has('Task Name')"
              class="text-danger"
              data-cy="task_name_error"
            >
              {{ errors.first("Task Name") }}
            </div>
          </div>
          <div class="form-group mx-4">
            <label class="font-md">Description</label>
            <el-input
              type="textarea"
              placeholder="Task brief description"
              v-model="DV_task.description"
              rows="4"
              :readonly="!_isallowed('write')"
              data-cy="task_description"
            />
          </div>

          <!-- Row begins -->
          <div class="d-flex mb-1 form-group">
            <div class="simple-select form-group w-33 ml-4">
              <label class="font-md"
                >Category <span style="color: #dc3545">*</span></label
              >
              <el-select
                v-model="selectedTaskType"
                v-validate="'required'"
                class="w-100"
                track-by="id"
                value-key="id"
                :disabled="!_isallowed('write')"
                data-cy="task_type"
                name="Category"
                :class="{ 'error': errors.has('Category') }"
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
          </div>

         <div class="mx-4 mt-2 mb-4" v-if="selectedTaskStage !== null">
          <div v-if="selectedTaskStage !== undefined">       
          <div style="position:relative"><label class="font-md mb-0">Stage</label>               
            <button v-if="_isallowed('write')" @click.prevent="clearStages" :disabled="fixedStage" class="btn btn-sm btn-danger font-sm float-right d-inline-block clearStageBtn">Clear Stages</button>  
            </div>    
          <el-steps 
            class="exampleOne mt-3" 
            finish-status="success"  
            :class="{'overSixSteps': taskStages.length >= 6 }" 
            :active="taskStages.findIndex(stage => stage.id == selectedTaskStage.id)"
            :disabled="!_isallowed('write') || fixedStage  && isKanbanView"
            v-model="selectedTaskStage"
            track-by="id" 
            value-key="id"
            >    
          <el-step
            v-for="item in taskStages"
            :key="item.id"                       
            :value="item"        
            style="cursor:pointer"
            @click.native="selectedStage(item)"        
            :title="item.name"   
            description=""                    
          ></el-step>          
            </el-steps>          
          </div>
         </div>

          <div
            class="mx-4 mt-2 mb-4"
            v-if="selectedTaskStage == null || selectedTaskStage == undefined"
          >
            <label class="font-md">Select Stage</label>
            <el-steps
              class="exampleOne"
              finish-status="success"
              :class="{ overSixSteps: taskStages.length >= 6 }"
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
                @click.native="selectedStage(item)"
                :title="item.name"
                description=""
              ></el-step>
            </el-steps>
          </div>

          <!-- Stages Row ends -->

          <div class="form-row mx-4">
            <div class="form-group col-md-6 pl-0">
              <label class="font-md"
                >Start Date <span style="color: #dc3545">*</span></label
              >
              <div :class="{ 'error': errors.has('Start Date') }">
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
              </div>
              <div
                v-show="errors.has('Start Date')"
                class="text-danger"
                data-cy="task_start_date_error"
              >
                {{ errors.first("Start Date") }}
              </div>
            </div>
            <div class="form-group col-md-6 pr-0">
              <label class="font-md"
                >Due Date <span style="color: #dc3545">*</span></label
              >
              <div :class="{ 'error': errors.has('Due Date') }">
                <v2-date-picker
                  v-validate="'required'"
                  v-model="DV_task.dueDate"
                  value-type="YYYY-MM-DD"
                  format="DD MMM YYYY"
                  placeholder="DD MM YYYY"
                  name="Due Date"
                  class="w-100 vue2-datepicker"
                  :disabled="
                    !_isallowed('write') ||
                      DV_task.startDate === '' ||
                      DV_task.startDate === null
                  "
                  :disabled-date="disabledDueDate"
                  data-cy="task_due_date"
                />
              </div>
              <div
                v-show="errors.has('Due Date')"
                class="text-danger"
                data-cy="task_due_date_error"
              >
                {{ errors.first("Due Date") }}
              </div>
            </div>
          </div>

          <!-- closing div for tab1 -->
        </div>

        <div v-show="currentTab == 'tab2'" class="paperLookTab tab2">
          <div class="form-group mb-0 pt-3 d-flex w-100">
            <div class="form-group user-select ml-4 mr-1 w-100">
              <!-- 'Responsible' field was formally known as 'Assign Users' field -->
              <label class="font-md mb-0">Responsible</label>
              <el-select
                v-model="responsibleUsers"
                class="w-100"
                filterable
                clearable
                track-by="id"
                value-key="id"
                placeholder="Search and select Responsible User"
                :disabled="!_isallowed('write')"
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
            </div>
            <div class="form-group user-select ml-1 mr-4 w-100">
              <label class="font-md mb-0">Accountable</label>
              <el-select
                v-model="accountableTaskUsers"
                class="w-100"
                clearable
                track-by="id"
                value-key="id"
                placeholder="Search and select Accountable User"
                :disabled="!_isallowed('write')"
                filterable
              >
                <el-option
                  v-for="item in activeProjectUsers"
                  :value="item"
                  :key="item.id"
                  :label="item.fullName"
                >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="mt-0 d-flex w-100">
            <div class="ml-4 form-group w-100 mr-1">
              <label class="font-md mb-0">Consulted</label>
              <el-select
                v-model="consultedTaskUsers"
                class="w-100"
                track-by="id"
                value-key="id"
                :multiple="true"
                placeholder="Search and select Consulted Users"
                :disabled="!_isallowed('write')"
                filterable
              >
                <el-option
                  v-for="item in activeProjectUsers"
                  :value="item"
                  :key="item.id"
                  :label="item.fullName"
                >
                </el-option>
              </el-select>
            </div>
            <div class="ml-1 form-group mr-4 w-100">
              <label class="font-md mb-0">Informed</label>
              <el-select
                v-model="informedTaskUsers"
                class="informed w-100"
                track-by="id"
                value-key="id"
                multiple
                filterable
                placeholder="Search and select Informed Users"
                :disabled="!_isallowed('write')"
              >
                <el-option
                  v-for="item in activeProjectUsers"
                  :value="item"
                  :key="item.id"
                  :label="item.fullName"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>

        <!-- CHECKLIST TAB #3-->

        <div v-show="currentTab == 'tab3'" class="paperLookTab tab3">
          <div class="form-group pt-3 ml-4 mr-5">
            <label class="font-md mb-0">Progress (in %)</label>
            <span class="ml-3">
              <label class="font-sm mb-0 d-inline-flex align-items-center">
                <input
                  type="checkbox"
                  v-model="DV_task.autoCalculate"
                  :disabled="!_isallowed('write')"
                  :readonly="!_isallowed('write')"
                />
                <span>&nbsp;&nbsp;Auto Calculate Progress</span></label
              >
            </span>
            <el-slider
              v-model="DV_task.progress"
              :input="removeFromWatch()"    
              :disabled="!_isallowed('write') || DV_task.autoCalculate"
              :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
              :format-tooltip="(value) => value + '%'"
              class="mx-2"
            ></el-slider>
          </div>

          <div class="form-group pt-3 mx-4">
            <label class="font-md">Checklists</label>
            <span
              class="ml-2 clickable"
              v-if="_isallowed('write')"
              @click.prevent="addChecks"
            >
              <i class="fas fa-plus-circle"></i>
            </span>
            <span
              class="float-right bg-dark font-sm text-light display-length px-1"
              v-if="filteredChecks.length > 1"
            >
              Displaying:
              <span class="mx-1">{{ filteredChecks.length }}</span> items
            </span>
            <span
              class="float-right bg-dark font-sm text-light display-length px-1"
              v-if="filteredChecks.length == 1"
            >
              Displaying:
              <span class="mx-1">{{ filteredChecks.length }}</span> item
            </span>
            <div v-if="filteredChecks.length > 0">
              <draggable
                :move="handleMove"
                @change="(e) => handleEnd(e, DV_task.checklists)"
                :list="DV_task.checklists"
                :animation="100"
                ghost-class="ghost-card"
              >
                <div
                  v-for="(check, index) in DV_task.checklists"
                  :key="index"
                  class="d-flex w-100 mb-3 drag"
                  v-if="!check._destroy && isMyCheck(check)"
                >
                  <div
                    class="form-control h-100 check-items pb-0"
                    style="background-color:#fafafa;position:relative"
                  >
                    <div class="row" style="width:97%">
                      <div class="col-8 justify-content-start">
                        <input
                          type="checkbox"
                          name="check"
                          :checked="check.checked"
                          @change="updateCheckItem($event, 'check', index)"
                          :key="`check_${index}`"
                          :disabled="!_isallowed('write') || !check.text.trim()"
                        />
                        <input
                          :value="check.text"
                          name="text"
                          @input="updateCheckItem($event, 'text', index)"
                          :key="`text_${index}`"
                          placeholder="Checkpoint name here"
                          type="text"
                          class="checklist-text pl-1"
                          maxlength="80"
                          :readonly="!_isallowed('write')"
                        />
                      </div>
                      <div
                        v-if="isSheetsView || isKanbanView || isCalendarView"
                        class="col-1 pl-0 pr-0"
                      >
                        <span class="font-sm dueDate">Due Date:</span>
                      </div>
                      <div
                        v-if="isSheetsView || isKanbanView || isCalendarView"
                        class="col-3 pl-0"
                        style="margin-left:-25px"
                      >
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
                          :class="{ disabled: disabledDateRange }"
                        />
                      </div>
                    </div>

                    <!-- Collpase section begins here -->
                    <el-collapse id="roll_up" style="background-color:#fafafa">
                      <el-collapse-item
                        title="Details"
                        name="1"
                        style="background-color:#fafafa"
                      >
                        <div
                          v-if="isMapView"
                          class="row justify-content-end pt-2 pb-5"
                          style="background-color:#fafafa;position:relative"
                        >
                          <div
                            class="d-flex col mb-0"
                            style="position:absolute"
                          >
                            Due Date:
                            <v2-date-picker
                              v-model="check.dueDate"
                              :value="check.dueDate"
                              :disabled="!_isallowed('write') || !check.text"
                              @selected="
                                updateCheckItem($event, 'dueDate', index)
                              "
                              :key="`dueDate_${index}`"
                              value-type="YYYY-MM-DD"
                              format="DD MMM YYYY"
                              placeholder="DD MM YYYY"
                              name="dueDate"
                              class="w-100 vue2-datepicker d-flex ml-auto"
                              :disabled-date="disabledDateRange"
                              :class="{ disabled: disabledDateRange }"
                            />
                          </div>
                        </div>
                        <div
                          class="row justify-content-end pt-2"
                          style="background-color:#fafafa;position:inherit"
                        >
                          <div
                            class="simple-select d-flex form-group col mb-0"
                            style="position:absolute"
                          >
                            <div
                              class="d-flex w-100"
                              style="padding-left:6.1rem"
                            >
                              <span class="font-sm pt-2 pr-2"
                                >Assigned To:</span
                              >
                              <el-select
                                v-model="check.user"
                                class="w-75"
                                track-by="id"
                                clearable
                                value-key="id"
                                filterable
                                :disabled="!_isallowed('write') || !check.text"
                                placeholder="Search and select user"
                              >
                                <el-option
                                  v-for="item in activeProjectUsers"
                                  :value="item"
                                  :key="item.id"
                                  :label="item.fullName"
                                >
                                </el-option>
                              </el-select>
                            </div>
                          </div>
                         
                        </div>

                        <!-- Start Checkbox Progress List -->
                        <!-- Create component to manage progress list -->
                        <div class="pt-5 vuetify-checkitem pb-3" style="background-color:#fafafa">
                        <div class="font-md pt-3">
                          Progress Update
                          <span v-if="editToggle">
                            <span class="ml-2 clickable">
                              <font-awesome-icon
                                icon="plus-circle"
                                class="mr-1 text-danger"
                              />
                            </span>
                          </span>
                          <span v-else>
                            <span
                              class="ml-2 clickable"
                              v-if="_isallowed('write')"
                              @click.prevent="addProgressList(check)"
                            >
                              <font-awesome-icon
                                icon="plus-circle"
                                class="mr-1"
                              />
                            </span>
                          </span>

                          <table
                            v-if="check.progressLists.length > 0"
                            style="width:100%"
                            class="mt-1"
                          >
                            <thead>
                              <tr>
                                <th style="width:50%">Progress</th>
                                <th>Last Updated</th>
                                <th>By</th>
                                <th
                                  v-if="
                                    _isallowed('write') || _isallowed('delete')
                                  "
                                >
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr
                                v-for="(progress,
                                pindex) in check.progressLists
                                  .slice()
                                  .reverse()"
                                :key="pindex"
                                v-if="!progress._destroy"
                              >
                                <td>
                                  <span v-if="editToggle">
                                    <input
                                      :value="progress.body"
                                      name="text"
                                      :class="{ 'red-border': !progress.user }"
                                      @input="
                                        updateProgressListItem(
                                          $event,
                                          'text',
                                          progress
                                        )
                                      "
                                      :key="`ptext_${pindex}`"
                                      placeholder="Type Progress update here"
                                      type="text"
                                      class="checklist-text pl-1"
                                      maxlength="80"
                                    />
                                  </span>
                                  <span v-else>
                                    {{ progress.body }}
                                  </span>
                                </td>
                                <td>
                                  <span v-if="!progress.user"></span>
                                  <span v-else>
                                    {{
                                      moment(progress.updatedAt).format(
                                        "DD MMM YYYY, h:mm a"
                                      )
                                    }}
                                  </span>
                                </td>
                                <td>
                                  <span v-if="progress.user">
                                    <span> {{ progress.user.fullName }}</span>
                                  </span>
                                  <span v-else>
                                    {{ $currentUser.full_name }}
                                  </span>
                                </td>
                                <td
                                  v-if="
                                    _isallowed('write') || _isallowed('delete')
                                  "
                                >
                                  <span
                                    class="pl-2"
                                    v-tooltip="`Save`"
                                    v-if="!progress.user"
                                    @click.prevent="saveTask"
                                  >
                                    <font-awesome-icon
                                      icon="save"
                                      class="text-primary clickable"
                                    />
                                  </span>
                                  <span
                                    v-tooltip="`Edit`"
                                    v-if="progress.user"
                                    class="px-2"
                                  >
                                    <font-awesome-icon
                                      icon="pencil-alt"
                                      class="text-info clickable"
                                      @click.prevent="editProgress"
                                      :readonly="!_isallowed('write')"
                                    />
                                  </span>
                                  <span
                                    v-tooltip="`Delete`"
                                    class="pl-1"
                                    v-if="progress.user"
                                  >
                                    <font-awesome-icon
                                      icon="trash"
                                      class="text-danger clickable"
                                      v-if="_isallowed('write')"
                                      @click.prevent="
                                        destroyProgressList(
                                          check,
                                          progress,
                                          pindex
                                        )
                                      "
                                    />
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div v-else class="text-danger">
                            No Checklist Progress Updates to Display
                          </div>
                          <!-- End Checkbox Progress List -->
                        </div>
                      </div>
                      </el-collapse-item>
                    </el-collapse>
                  </div>
                  <span
                    class="del-check clickable"
                    v-if="_isallowed('write')"
                    @click.prevent="destroyCheck(check, index)"
                  >
                    <i class="fas fa-times"></i>
                  </span>
                </div>
              </draggable>
            </div>
            <p v-else class="text-danger font-sm">No checks..</p>
          </div>
          <!-- closing div for tab2 -->
        </div>
        

        <!-- FILES TAB # 4-->
        <div v-show="currentTab == 'tab4'" class="paperLookTab tab4">
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
                    <span class="ml-2 clickable" @click.prevent="addFilesInput">
                      <i class="fas fa-plus-circle"></i>
                    </span>
                  </div>

                  <div
                    v-for="(file, index) in DV_task.taskFiles.slice().reverse()"
                    :key="index"
                    class="d-flex mb-2 w-75"
                    v-if="!file.id && file.link"
                  >
                    <div class="input-group-append">
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
                    <a
                      :href="file.uri"
                      target="_blank"
                      v-if="file.link"
                      class="no-text-decoration"
                    >
                      <span v-if="file.link">
                        <i class="fas fa-link mr-1"></i></span
                      >{{ urlShortener(file.uri, 68) }}
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
        <div v-show="currentTab == 'tab5'" class="paperLookTab tab5">
          <div class="row mx-3 mt-2">
            <!-- RELATED TASKS -->
            <div :class="[isMapView ? 'col-12' : 'col']">
              Related Tasks
              <span
                class="ml-2 clickable"
                v-if="_isallowed('write')"
                @click="openContextMenu($event, 'task')"
                @contextmenu.prevent=""
              >
                <i class="fas fa-plus-circle"></i>
              </span>

              <hr class="mt-0" />

              <ul class="text-smaller">
                <li
                  class="d-flex justify-content-between align-items-center my-2"
                  v-for="(task, index) in relatedTasks"
                  :key="index"
                >
                  <el-popover placement="right" width="200" trigger="hover">
                    <div>
                      <p class="m-0 text-left">
                        <el-tag size="mini">Project Name</el-tag>
                        {{ task.facilityName }}
                      </p>
                    </div>
                    <router-link
                      :to="
                        `/programs/${$route.params.programId}/${tab}/projects/${task.facilityId}/tasks/${task.id}`
                      "
                      slot="reference"
                      >{{ task.text }}</router-link
                    ></el-popover
                  >
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    title="Remove Related Task"
                    @click.prevent="removeRelatedTask(task)"
                    :disabled="!_isallowed('delete')"
                  ></el-button>
                </li>
              </ul>
            </div>
            <!-- RELATED ISSUES -->
            <div :class="[isMapView ? 'col-12' : 'col']">
              Related Issues
              <span
                class="ml-2 clickable"
                v-if="_isallowed('write')"
                @click="openContextMenu($event, 'issue')"
                @contextmenu.prevent=""
              >
                <i id="issue-add-btn" class="fas fa-plus-circle"></i>
              </span>

              <hr class="mt-0" />

              <ul class="text-smaller">
                <li
                  class="d-flex justify-content-between align-items-center my-2"
                  v-for="(issue, index) in relatedIssues"
                  :key="index"
                >
                  <el-popover placement="right" width="200" trigger="hover">
                    <div>
                      <p class="m-0 text-left">
                        <el-tag size="mini">Project Name</el-tag>
                        {{ issue.facilityName }}
                      </p>
                    </div>
                    <router-link
                      :to="
                        `/programs/${$route.params.programId}/${tab}/projects/${issue.facilityId}/issues/${issue.id}`
                      "
                      slot="reference"
                      >{{ issue.title }}</router-link
                    ></el-popover
                  >
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    title="Remove Related Issue"
                    @click.prevent="removeRelatedIssue(issue)"
                    :disabled="!_isallowed('delete')"
                  ></el-button>
                </li>
              </ul>
            </div>
            <!-- RELATED RISKS -->
            <div :class="[isMapView ? 'col-12' : 'col']">
              Related Risks
              <span
                class="ml-2 clickable"
                v-if="_isallowed('write')"
                @click="openContextMenu($event, 'risk')"
                @contextmenu.prevent=""
              >
                <i id="risk-add-btn" class="fas fa-plus-circle"></i>
              </span>

              <hr class="mt-0" />

              <ul class="text-smaller">
                <li
                  class="d-flex justify-content-between align-items-center my-2"
                  v-for="(risk, index) in relatedRisks"
                  :key="index"
                >
                  <el-popover placement="right" width="200" trigger="hover">
                    <div>
                      <p class="m-0 text-left">
                        <el-tag size="mini">Project Name</el-tag>
                        {{ risk.facilityName }}
                      </p>
                    </div>
                    <router-link
                      :to="
                        `/programs/${$route.params.programId}/${tab}/projects/${risk.facilityId}/risks/${risk.id}`
                      "
                      slot="reference"
                      >{{ risk.text }}</router-link
                    ></el-popover
                  >
                  <el-button
                    size="mini"
                    icon="el-icon-delete"
                    title="Remove Related Risk"
                    @click.prevent="removeRelatedRisk(risk)"
                    :disabled="!_isallowed('delete')"
                  ></el-button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        

        <!-- UPDATE TAB 6 -->
        <div v-show="currentTab == 'tab6'" class="paperLookTab tab5">
          <div class="form-group mx-4 paginated-updates">
            <label class="font-sm">Updates:</label>
            <span
              class="ml-2 clickable"
              v-if="_isallowed('write')"
              @click.prevent="addNote"
            >
              <i class="fas fa-plus-circle"></i>
            </span>
            <paginate-links
              v-if="filteredNotes.length"
              for="filteredNotes"
              :show-step-links="true"
              :limit="2"
            ></paginate-links>
            <paginate
              ref="paginator"
              name="filteredNotes"
              :list="filteredNotes"
              :per="5"
              class="paginate-list"
              :key="filteredNotes ? filteredNotes.length : 1"
            >
              <div
                v-for="note in paginated('filteredNotes')"
                class="form-group"
                :key="note.id"
              >
                <span class="d-inline-block w-100"
                  ><label class="badge badge-secondary">Update by</label>
                  <span class="font-sm text-muted">{{ noteBy(note) }}</span>
                  <span
                    v-if="allowDeleteNote(note)"
                    class="clickable font-sm delete-action float-right"
                    @click.prevent.stop="destroyNote(note)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </span>
                </span>
                <textarea
                  class="form-control"
                  v-model="note.body"
                  rows="3"
                  placeholder="Enter your update here..."
                  :readonly="!allowEditNote(note)"
                ></textarea>
              </div>
            </paginate>
          </div>
        </div>
        <!-- closing div for tab5 -->
      
    
      </div>

      <!-- TABBED OUT SECTION END HERE -->
  </form>  
    <div
      v-if="loading"
      class="load-spinner spinner-border text-dark"
      role="status"
    ></div>
 

    <RelatedTaskMenu
      :facilities="facilities"
      :facilityGroups="facilityGroups"
      :task="task"
      :relatedTasks="relatedTasks"
      :relatedIssues="relatedIssues"
      :relatedRisks="relatedRisks"
      @add-related-tasks="addRelatedTasks"
      @add-related-issues="addRelatedIssues"
      @add-related-risks="addRelatedRisks"
      ref="menu"
    >
    </RelatedTaskMenu>
  </div>

   
</template>

<script>
import axios from "axios";
import Draggable from "vuedraggable";
import FormTabs from "./../../shared/FormTabs";
import RelatedTaskMenu from "./../../shared/RelatedTaskMenu";
import humps from "humps";
import { mapGetters, mapMutations, mapActions } from "vuex";
import AttachmentInput from "./../../shared/attachment_input";
import * as Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);
export default {
  name: "TaskForm",
  props: ["facility", "task", "title", "fixedStage"],
  components: {
    AttachmentInput,
    Draggable,
    FormTabs,
    RelatedTaskMenu,
  },
  data() {
    return {
      DV_task: this.INITIAL_TASK_STATE(),
      DV_facility: Object.assign({}, this.facility),
      paginate: ["filteredNotes"],
      destroyedFiles: [],
      editTimeLive: "",
      selectedTaskType: null,
      selectedTaskStage: null,
      responsibleUsers: null,
      accountableTaskUsers: null,
      consultedTaskUsers: [],
      informedTaskUsers: [],
      relatedIssues: [],
      relatedTasks: [],
      relatedRisks: [],
      editToggle: false,
      _ismounted: false,
      showErrors: false,
      loading: true,
      movingSlot: "",
      currentTab: "tab1",
      tabs: [
        {
          label: "Task Info",
          key: "tab1",
          closable: false,
          form_fields: [
            "Task Name",
            "Description",
            "Start Date",
            "Category",
            "Stage",
            "Start Date",
            "Due Date",
          ],
        },
        {
          label: "Assignments",
          key: "tab2",
          closable: false,
          form_fields: ["Responsible", "Accountable", "Consulted", "Informed"],
        },
        {
          label: "Checklist",
          key: "tab3",
          closable: false,
          form_fields: ["Checklists"],
        },
        {
          label: "Files & Links",
          key: "tab4",
          closable: false,
          form_fields: ["Files"],
        },
        {
          label: "Related",
          key: "tab5",
          closable: false,
          form_fields: ["Related Tasks", "Related Issues", "Related Risks"],
        },
        {
          label: "Updates",
          key: "tab6",
          closable: false,
          form_fields: ["Progress", "Updates"],
        },
      ],
    };
  },
  updated() {
    if (this.fixedStage) {
      this.selectedTaskStage = this.fixedStage;
    }
  },
  mounted() {
    if (!_.isEmpty(this.task)) {
      this.loadTask(this.task);
    } else {
      this.loadTask(this.DV_task);
    }

    this.loading = false;
    this._ismounted = true;
  },
  methods: {
    ...mapMutations(["setTaskForManager", "updateTasksHash"]),
    ...mapActions(["taskDeleted", "taskUpdated", "updateWatchedTasks"]),
    INITIAL_TASK_STATE() {
      return {
        text: "",
        startDate: "",
        dueDate: "",
        facilityProjectId: this.facility.id,
        checklistDueDate: "",
        taskTypeId: "",
        taskStageId: "",
        important: false,
        responsibleUserIds: [],
        accountableUserIds: [],
        consultedUserIds: [],
        informedUserIds: [],
        subTaskIds: [],
        subIssueIds: [],
        subRiskIds: [],
        description: "",
        progress: 0,
        autoCalculate: true,
        taskFiles: [],
        checklists: [],
        notes: [],
      };
    },
    selectedStage(item) {
      if (this._isallowed("write")) {
        this.selectedTaskStage = item;
      }
    },
    clearStages() {
      this.selectedTaskStage = null;
      this.taskStageId = "";
    },
    urlShortener(str, length, ending) {
      if (length == null) {
        length = 70;
      }
      if (ending == null) {
        ending = "...";
      }
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
      } else {
        return str;
      }
    },
    scrollToChecklist() {
      this.$refs.addCheckItem.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      this.DV_task.checklists.push({ text: "", checked: false });
    },
    scrollToUpdates() {
      this.$refs.addUpdates.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      this.DV_task.notes.unshift({ body: "", user_id: "", guid: this.guid() });
    },
    handleMove(item) {
      this.movingSlot = item.relatedContext.component.$vnode.key;
      return true;
    },
    onChangeTab(tab) {
      this.currentTab = tab ? tab.key : "tab1";
    },
    handleEnd(e, checklists) {
      var cc = this.DV_task.checklists;
      var count = 0;
      for (var checklist of cc) {
        checklist.position = count;
        count++;
      }
    },
    editProgress() {
      this.editToggle = !this.editToggle;
      //this.editTimeLive = moment.format('DD MMM YYYY, h:mm a')
    },
    deleteTask() {
      this.$confirm(`Are you sure you want to delete ${this.DV_task.text}?`, 'Confirm Delete', {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.taskDeleted(this.DV_task).then((value) => {
            if (value === 'Success') {
              this.$message({
                message: `${this.DV_task.text} was deleted successfully.`,
                type: "success",
                showClose: true,
              });
            }
          });
          this.cancelSave();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
            showClose: true
          });          
        });
    },
    progressListTitleText(progressList) {
      if (!progressList.id) return;
      var date = moment(progressList.createdAt).format("MM/DD/YYYY");
      var time = moment(progressList.createdAt).format("hh:mm:ss a");
      return `${progressList.user.fullName} at ${date} ${time} `;
    },
    // RACI USERS commented out out here.....Awaiting backend work
    loadTask(task) {
      this.DV_task = { ...this.DV_task, ..._.cloneDeep(task) };
      this.responsibleUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_task.responsibleUserIds.includes(u.id)
      )[0];
      this.accountableTaskUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_task.accountableUserIds.includes(u.id)
      )[0];
      this.consultedTaskUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_task.consultedUserIds.includes(u.id)
      );
      this.informedTaskUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_task.informedUserIds.includes(u.id)
      );
      this.relatedIssues = _.filter(this.filteredIssues, (u) =>
        this.DV_task.subIssueIds.includes(u.id)
      );
      this.relatedTasks = _.filter(this.filteredTasks, (u) =>
        this.DV_task.subTaskIds.includes(u.id)
      );
      this.relatedRisks = _.filter(this.filteredRisks, (u) =>
        this.DV_task.subRiskIds.includes(u.id)
      );
      this.selectedTaskType = this.taskTypes.find(
        (t) => t.id === this.DV_task.taskTypeId
      );
      this.selectedTaskStage = this.taskStages.find(
        (t) => t.id === this.DV_task.taskStageId
      );
      this.selectedFacilityProject = this.getFacilityProjectOptions.find(
        (t) => t.id === this.DV_task.facilityProjectId
      );
      if (this.DV_task.attachFiles)
        this.addFile(this.DV_task.attachFiles, false);
      this.$nextTick(() => {
        this.errors.clear();
        this.$validator.reset();
      });
    },
    addFile(files, append = true) {
      let _files = append ? [...this.DV_task.taskFiles] : [];
      for (let file of files) {
        file.guid = this.guid();
        _files.push(file);
      }
      this.DV_task.taskFiles = _files;
    },
    deleteFile(file) {
      if (!file) return;
      let confirm = window.confirm(
        `Are you sure you want to delete attachment?`
      );
      if (!confirm) return;

      if (file.uri || file.link) {
        let index = this.DV_task.taskFiles.findIndex(
          (f) => f.guid === file.guid
        );
        if (file.id) {
          Vue.set(this.DV_task.taskFiles, index, { ...file, _destroy: true });
          this.destroyedFiles.push(file);
        }
        this.DV_task.taskFiles.splice(
          this.DV_task.taskFiles.findIndex((f) => f.guid === file.guid),
          1
        );
      } else if (file.name) {
        this.DV_task.taskFiles.splice(
          this.DV_task.taskFiles.findIndex((f) => f.guid === file.guid),
          1
        );
      }
    },
    toggleWatched() {
       if (this.DV_task.progress == 100 && !this.DV_task.watched ) {
         this.$message({
            message: `Tasks at 100% progress cannot be placed On Watch status.`,
            type: "warning",
            showClose: true,
          });      
        return
      } 
      if (this.DV_task.watched) {
         thiss.$message({
            message: `${this.DV_task.text} has been removed from On Watch status.`,
            type: "warning",
            showClose: true,
          });
      } else {
         this.$message({
            message: `${this.DV_task.text} successfully placed On Watch status.`,
            type: "success",
            showClose: true,
          });
      }
      this.DV_task = { ...this.DV_task, watched: !this.DV_task.watched };
      this.updateWatchedTasks(this.DV_task);
    },
    removeFromWatch() {
      if ( (this.DV_task.progress == 100) && (this.DV_task.watched == true) ) {         
        this.toggleWatched()     
      }
    },
    toggleImportant() {
      this.DV_task = { ...this.DV_task, important: !this.DV_task.important };
    },
    cancelSave() {
      this.$emit("on-close-form");
      this.setTaskForManager({ key: "task", value: null });
    },
    saveTask() {
      if (!this._isallowed("write")) return;
      this.$validator.validate().then((success) => {
        if (!success || this.loading) {
          this.showErrors = !success;
          return;
        }
        this.editToggle = !this.editToggle;
        this.loading = true;
        let formData = new FormData();
        formData.append("task[text]", this.DV_task.text);
        formData.append("task[due_date]", this.DV_task.dueDate);
        formData.append("task[start_date]", this.DV_task.startDate);
        formData.append("task[task_type_id]", this.DV_task.taskTypeId);
        formData.append("task[task_stage_id]", this.DV_task.taskStageId);
        formData.append("task[progress]", this.DV_task.progress);
        formData.append("task[auto_calculate]", this.DV_task.autoCalculate);
        formData.append("task[description]", this.DV_task.description);
        formData.append("task[important]", this.DV_task.important);
        formData.append(
          "task[destroy_file_ids]",
          _.map(this.destroyedFiles, "id")
        );
        // RACI USERS START HERE Awaiting backend work

        //Responsible USer Id
        //  formData.append('responsible_user_ids', this.DV_task.responsibleUserIds)
        if (
          this.DV_task.responsibleUserIds &&
          this.DV_task.responsibleUserIds.length
        ) {
          for (let u_id of this.DV_task.responsibleUserIds) {
            formData.append("responsible_user_ids[]", u_id);
          }
        } else {
          formData.append("responsible_user_ids[]", []);
        }
        // Accountable UserId
        if (
          this.DV_task.accountableUserIds &&
          this.DV_task.accountableUserIds.length
        ) {
          for (let u_id of this.DV_task.accountableUserIds) {
            formData.append("accountable_user_ids[]", u_id);
          }
        } else {
          formData.append("accountable_user_ids[]", []);
        }
        // Consulted UserId

        if (this.DV_task.consultedUserIds.length) {
          for (let u_id of this.DV_task.consultedUserIds) {
            formData.append("consulted_user_ids[]", u_id);
          }
        } else {
          formData.append("consulted_user_ids[]", []);
        }
        // Informed UserId

        if (this.DV_task.informedUserIds.length) {
          for (let u_id of this.DV_task.informedUserIds) {
            formData.append("informed_user_ids[]", u_id);
          }
        } else {
          formData.append("informed_user_ids[]", []);
        }
        // RACI USERS ABOVE THIS LINE  Awaiting backend work
        // More RACI Users in Computed section below
        if (this.DV_task.subTaskIds.length) {
          for (let u_id of this.DV_task.subTaskIds) {
            formData.append("task[sub_task_ids][]", u_id);
          }
        } else {
          formData.append("task[sub_task_ids][]", []);
        }
        if (this.DV_task.subIssueIds.length) {
          for (let u_id of this.DV_task.subIssueIds) {
            formData.append("task[sub_issue_ids][]", u_id);
          }
        } else {
          formData.append("task[sub_issue_ids][]", []);
        }
        if (this.DV_task.subRiskIds.length) {
          for (let u_id of this.DV_task.subRiskIds) {
            formData.append("task[sub_risk_ids][]", u_id);
          }
        } else {
          formData.append("task[sub_risk_ids][]", []);
        }
        for (let i in this.DV_task.checklists) {
          let check = this.DV_task.checklists[i];
          if (!check.text && !check._destroy) continue;
          for (let key in check) {
            if (key === "user") key = "user_id";
            let value =
              key == "user_id"
                ? check.user
                  ? check.user.id
                  : null
                : check[key];
            // if (key === "dueDate"){
            //   key = "due_date"
            // }
            key = humps.decamelize(key);
            if (["created_at", "updated_at", "progress_lists"].includes(key))
              continue;
            formData.append(`task[checklists_attributes][${i}][${key}]`, value);
            for (let pi in check.progressLists) {
              let progressList = check.progressLists[pi];
              if (!progressList.body && !progressList._destroy) continue;
              for (let pkey in progressList) {
                if (pkey === "user") pkey = "user_id";
                let pvalue =
                  pkey == "user_id"
                    ? progressList.user
                      ? progressList.user.id
                      : null
                    : progressList[pkey];
                pkey = humps.decamelize(pkey);
                if (["created_at", "updated_at"].includes(pkey)) continue;
                formData.append(
                  `task[checklists_attributes][${i}][progress_lists_attributes][${pi}][${pkey}]`,
                  pvalue
                );
              }
            }
          }
        }
        for (let i in this.DV_task.notes) {
          let note = this.DV_task.notes[i];
          if (!note.body && !note._destroy) continue;
          for (let key in note) {
            let value =
              key == "user_id"
                ? note.user_id
                  ? note.user_id
                  : this.$currentUser.id
                : note[key];
                if ( key == 'body') {
                  value = value.replace(/[^ -~]/g,'')
                }           
            formData.append(`task[notes_attributes][${i}][${key}]`, value);
          }
        }
        for (let file of this.DV_task.taskFiles) {
          if (file.id) continue;
          if (!file.link) {
            formData.append("task[task_files][]", file);
          } else if (file.link) {
            formData.append("file_links[]", file.name);
          }
        }
        let url = `/projects/${this.currentProject.id}/facilities/${this.$route.params.projectId}/tasks.json`;
        let method = "POST";
        let callback = "task-created";
        if (this.task && this.task.id) {
          url = `/projects/${this.currentProject.id}/facilities/${this.task.facilityId}/tasks/${this.task.id}.json`;
          method = "PUT";
          callback = "task-updated";
        }
        // var beforeSaveTask = this.task
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
            // if(beforeSaveTask.facilityId && beforeSaveTask.projectId )
            //   this.$emit(callback, humps.camelizeKeys(beforeSaveTask))
            var responseTask = humps.camelizeKeys(response.data.task);
            this.loadTask(responseTask);
            //this.$emit(callback, responseTask)
            this.updateTasksHash({ task: responseTask });
            if (response.status === 200) {
              this.$message({
                message: `${response.data.task.text} was saved successfully.`,
                type: "success",
                showClose: true,
              });
            }
            //Route to newly created task form page
            if (this.$route.path.includes("sheet")) {
              this.$router.push(
                `/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/tasks/${response.data.task.id}`
              );
            } else if (this.$route.path.includes("map")) {
              this.$router.push(
                `/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/tasks/${response.data.task.id}`
              );
            } else if (this.$route.path.includes("calendar")) {
              this.$router.push(
                `/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/tasks/${response.data.task.id}`
              );
            } else {
              this.$router.push(
                `/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/tasks/${response.data.task.id}`
              );
            }
          })
          .catch((err) => {
            // var errors = err.response.data.errors
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    addProgressList(check) {
      var postion = check.progressLists.length;
      check.progressLists.push({ body: "", position: postion });
      this.editToggle = true;
    },
    addChecks() {
      var postion = this.DV_task.checklists.length;
      this.DV_task.checklists.push({
        text: "",
        checked: false,
        position: postion,
        progressLists: [],
      });
    },
    addFilesInput() {
      this.DV_task.taskFiles.push({
        name: "",
        uri: "",
        link: true,
        guid: this.guid(),
      });
    },
    addNote() {
      this.DV_task.notes.unshift({ body: "", user_id: "", guid: this.guid() });
    },

    destroyNote(note) {
      let confirm = window.confirm(
        `Are you sure you want to delete this update note?`
      );
      if (!confirm) return;
      let i = note.id
        ? this.DV_task.notes.findIndex((n) => n.id === note.id)
        : this.DV_task.notes.findIndex((n) => n.guid === note.guid);
      Vue.set(this.DV_task.notes, i, { ...note, _destroy: true });
    },
    noteBy(note) {
      return note.user
        ? `${note.user.fullName} at ${new Date(
            note.createdAt
          ).toLocaleString()}`
        : `${this.$currentUser.full_name} at (Now)`;
    },
    downloadFile(file) {
      let url = window.location.origin + file.uri;
      window.open(url, "_blank");
    },
    destroyProgressList(check, progressList, index) {
      let confirm = window.confirm(
        `Are you sure you want to delete this Progress List item?`
      );
      if (!confirm) return;
      let i = progressList.id
        ? check.progressLists.findIndex((c) => c.id === progressList.id)
        : index;
      Vue.set(check.progressLists, i, { ...progressList, _destroy: true });
      this.saveTask();
    },
    destroyCheck(check, index) {
      let confirm = window.confirm(
        `Are you sure you want to delete this checklist item?`
      );
      if (!confirm) return;
      let i = check.id
        ? this.DV_task.checklists.findIndex((c) => c.id === check.id)
        : index;
      Vue.set(this.DV_task.checklists, i, { ...check, _destroy: true });
      this.saveTask();
    },
    disabledDueDate(date) {
      date.setHours(0, 0, 0, 0);
      const startDate = new Date(this.DV_task.startDate);
      startDate.setHours(48, 0, 0, 0);
      return date < startDate;
    },
    calculateProgress(checks = null) {
      try {
        if (!checks) checks = this.DV_task.checklists;
        let checked = _.filter(
          checks,
          (v) => !v._destroy && v.checked && v.text.trim()
        ).length;
        let total = _.filter(checks, (v) => !v._destroy && v.text.trim())
          .length;
        this.DV_task.progress = Number(
          ((checked / total) * 100 || 0).toFixed(2)
        );
      } catch (err) {
        this.DV_task.progress = 0;
      }
    },
    updateCheckItem(event, name, index) {
      if (name === "text") {
        this.DV_task.checklists[index].text = event.target.value;
        if (!event.target.value) this.DV_task.checklists[index].checked = false;
      } else if (name === "check" && this.DV_task.checklists[index].text) {
        this.DV_task.checklists[index].checked = event.target.checked;
      } else if (name === "dueDate" && this.DV_task.checklists[index].text) {
        this.DV_task.checklists[index].dueDate = event.target.value;
      }
    },
    updateFileLinkItem(event, name, input) {
      //var v = event.target.value
      //var valid = /^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6}(:[0-9]{1,5})?(\/.*)?$/i/.test(v);
      if (event.target.value) {
        input.name = event.target.value;
      }
    },
    updateProgressListItem(event, name, progressList) {
      progressList.body = event.target.value;
    },
    isMyCheck(check) {
      return this.C_myTasks && check.id
        ? check.user && check.user.id == this.$currentUser.id
        : true;
    },
    allowDeleteNote(note) {
      return (
        (this._isallowed("delete") && note.guid) ||
        note.userId == this.$currentUser.id
      );
    },
    allowEditNote(note) {
      return (
        (this._isallowed("write") && note.guid) ||
        note.userId == this.$currentUser.id
      );
    },
    disabledDateRange(date) {
      var dueDate = new Date(this.DV_task.dueDate);
      dueDate.setDate(dueDate.getDate() + 1);
      return date < new Date(this.DV_task.startDate) || date > dueDate;
    },
    openContextMenu(e, item) {
      e.preventDefault();
      this.$refs.menu.open(e, item);
    },
    addRelatedTasks(tasks) {
      tasks.forEach((task) => this.relatedTasks.push(task));
    },
    removeRelatedTask({ id }) {
      this.relatedTasks.splice(
        this.relatedTasks.findIndex((task) => task.id == id),
        1
      );
    },
    addRelatedIssues(issues) {
      issues.forEach((issue) => this.relatedIssues.push(issue));
    },
    removeRelatedIssue({ id }) {
      this.relatedIssues.splice(
        this.relatedIssues.findIndex((issue) => issue.id == id),
        1
      );
    },
    addRelatedRisks(risks) {
      risks.forEach((risk) => this.relatedRisks.push(risk));
    },
    removeRelatedRisk({ id }) {
      this.relatedRisks.splice(
        this.relatedRisks.findIndex((risk) => risk.id == id),
        1
      );
    },
  },
  computed: {
    ...mapGetters([
      "activeProjectUsers",
      "currentIssues",
      "currentProject",
      "currentRisks",
      "currentTasks",
      "facilities",
      "facilityGroups",
      "getFacilityProjectOptions",
      "managerView",
      "myActionsFilter",
      "projectUsers",
      "taskStages",
      "taskTypes",
    ]),
    readyToSave() {
      return (
        this.DV_task &&
        this.exists(this.DV_task.text) &&
        this.exists(this.DV_task.taskTypeId) &&
        this.exists(this.DV_task.dueDate) &&
        this.exists(this.DV_task.startDate)
      );
    },
    isMapView() {
      return this.$route.name === "MapTaskForm";
    },
    isKanbanView() {
      return this.$route.name === "KanbanTaskForm";
    },
    isSheetsView() {
      return this.$route.name === "SheetTaskForm";
    },
    isCalendarView() {
      return this.$route.name === "CalendarTaskForm";
    },
    filteredChecks() {
      return _.filter(this.DV_task.checklists, (c) => !c._destroy);
    },
    filteredFiles() {
      return _.filter(this.DV_task.taskFiles, (f) => !f._destroy);
    },
    C_myTasks() {
      return _.map(this.myActionsFilter, "value").includes("tasks");
    },
    filteredTasks() {
      return _.filter(this.currentTasks, (t) => t.id !== this.DV_task.id);
    },
    filteredRisks() {
      return _.filter(this.currentRisks, (t) => t.id !== this.DV_task.id);
    },
    filteredIssues() {
      return this.currentIssues;
    },
    filteredNotes() {
      return _.orderBy(
        _.filter(this.DV_task.notes, (n) => !n._destroy),
        "createdAt",
        "desc"
      );
    },
    _isallowed() {
      return (salut) =>
        this.$currentUser.role == "superadmin" ||
        this.$permissions.tasks[salut];
    },
    C_title() {
      return this._isallowed("write")
        ? this.task.id
          ? "Edit Task"
          : "Add Task"
        : "Task";
    },
    tab() {
      if (this.$route.path.includes("map")) {
        return "map";
      } else if (this.$route.path.includes("sheet")) {
        return "sheet";
      } else if (this.$route.path.includes("calendar")) {
        return "calendar";
      } else {
        return "kanban";
      }
    },
    projectNameLink() {
      if (this.$route.path.includes("kanban") || this.$route.path.includes("calendar") ) {
        return `/programs/${this.$route.params.programId}/${this.tab}/projects/${this.$route.params.projectId}/tasks`;
      } else {
        return `/programs/${this.$route.params.programId}/${this.tab}/projects/${this.$route.params.projectId}`;
      }
    },
  },
  watch: {
    task: {
      handler: function(value) {
        this.loadTask(this.task);
      },
    },
    "DV_task.startDate"(value) {
      if (this._ismounted && !value) this.DV_task.dueDate = "";
    },
    "DV_task.dueDate"(value) {
      if (this._ismounted && this.facility.dueDate) {
        if (moment(value).isAfter(this.facility.dueDate, "day")) {
          this.$alert(`${this.DV_task.text} Due Date is past Project Due Date!`, `${this.DV_task.text} Due Date Warning`, {
          confirmButtonText: 'Ok',
          type: 'info'
        });
        }
      }
    },
    "DV_task.checklists": {
      handler: function(value) {
        if (this.DV_task.autoCalculate) this.calculateProgress(value);
      },
      deep: true,
    },
    "DV_task.autoCalculate"(value) {
      if (value) this.calculateProgress();
    },
    // RACI USERS HERE awaiting backend work
    responsibleUsers: {
      handler: function(value) {
        if (value) {
          this.DV_task.responsibleUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_task.responsibleUserIds = null;
        }
      },
      deep: true,
    },
    accountableTaskUsers: {
      handler: function(value) {
        if (value) {
          this.DV_task.accountableUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_task.accountableUserIds = null;
        }
      },
      deep: true,
    },
    consultedTaskUsers: {
      handler: function(value) {
        if (value) {
          this.DV_task.consultedUserIds = _.uniq(_.map(value, "id"));
        } else {
          this.DV_task.consultedUserIds = [];
        }
      },
      deep: true,
    },
    informedTaskUsers: {
      handler: function(value) {
        if (value) {
          this.DV_task.informedUserIds = _.uniq(_.map(value, "id"));
        } else {
          this.DV_task.informedUserIds = [];
        }
      },
      deep: true,
    },
    relatedIssues: {
      handler: function(value) {
        if (value) this.DV_task.subIssueIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedTasks: {
      handler: function(value) {
        if (value) this.DV_task.subTaskIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedRisks: {
      handler: function(value) {
        if (value) this.DV_task.subRiskIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    selectedTaskType: {
      handler: function(value) {
        this.DV_task.taskTypeId = value ? value.id : null;
      },
      deep: true,
    },
    selectedTaskStage: {
      handler: function(value) {
        this.DV_task.taskStageId = value ? value.id : null;
      },
      deep: true,
    },
    filteredTasks: {
      handler(value) {
        let ids = _.map(value, "id");
        this.relatedTasks = _.filter(this.relatedTasks, (t) =>
          ids.includes(t.id)
        );
      },
      deep: true,
    },
    filteredIssues: {
      handler(value) {
        let ids = _.map(value, "id");
        this.relatedIssues = _.filter(this.relatedIssues, (t) =>
          ids.includes(t.id)
        );
      },
      deep: true,
    },
    filteredRisks: {
      handler(value) {
        let ids = _.map(value, "id");
        this.relatedRisks = _.filter(this.relatedRisks, (t) =>
          ids.includes(t.id)
        );
      },
      deep: true,
    },
    "filteredNotes.length"(value, previous) {
      this.$nextTick(() => {
        if (this.$refs.paginator && (value === 1 || previous === 0)) {
          this.$refs.paginator.goToPage(1);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
// .tasks-form {
// }
td,
th {
  border: solid 1px #ededed;
  padding: 1px 3px;
}
tbody {
  background-color: #fff;
}

th {
  background: #ededed;
  color: #383838;
  padding: 1px 3px;
}
.error {
  border-color: #e84444;
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
    box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
      0 3px 3px rgba(56, 56, 56, 0.23);
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
  a.active {
    background-color: rgba(211, 211, 211, 10%);
  }
  li.next:before {
    content: " | ";
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
.red-border {
  border: solid 0.5px red;
}
.sticky-btn {
  margin-top: 5px;
  margin-bottom: 5px;
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}

.scrollToChecklist,
.addCheckProgBtn,
.check-items {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
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
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.fixed-form {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 275px);
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
.no-text-decoration:active {
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
  outline: 0 none;
}
.clearStageBtn {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}

.exampleTwo.el-steps,
.exampleTwo.el-steps--simple {
  border: 1px solid #dcdfe6;
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
  color: #007bff;
}
a:hover {
  text-decoration: unset;
}
.text-smaller {
  font-size: smaller;
}
</style>
