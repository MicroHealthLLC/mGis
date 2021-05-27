<template>
  <div>
   <form
      id="issues-form"
      @submit.prevent="saveIssue"
      class="mx-auto issues-form"
      accept-charset="UTF-8"
      data-cy="issue_form"
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
                `/programs/${this.$route.params.programId}/${tab}/projects/${this.$route.params.projectId}/issues`
              "
              >Issues</router-link
            >
            <el-icon
              class="el-icon-arrow-right"
              style="font-size: 12px"
            ></el-icon>
            <span v-if="DV_issue.title.length > 0">{{ DV_issue.title }}</span>
            <span v-else style="color: gray">(Issue Name)</span>
          </h5>
        </div>
       
        <div class="ml-auto d-flex" v-if="_isallowed('read')">
          <button
            v-if="_isallowed('write')"
            class="btn btn-sm sticky-btn btn-primary text-nowrap mr-2"
            data-cy="issue_save_btn"
          >
            Save Issue
          </button>
          <button
            v-else
            disabled
            class="btn btn-sm sticky-btn btn-primary mr-2"
            data-cy="issue_read_only_btn"
          >
            Read Only
          </button>
          <button
            class="btn btn-sm sticky-btn btn-outline-secondary"
            @click.prevent="cancelIssueSave"
            data-cy="issue_close_btn"
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
      <div class="formTitle fixed-form">
        <div v-if="errors.items.length > 0" class="text-danger mx-4">
          Please fill the required fields before submitting
          <ul class="error-list mx-4">
            <li
              v-for="(error, index) in errors.all()"
              :key="index"
              v-tooltip="{
                content: 'Field is located on Issue Info',
                placement: 'left',
              }"
            >
              {{ error }}
            </li>
          </ul>
        </div>
        <!-- ISSUE INFO TAB #1 -->
        <div v-show="currentTab == 'tab1'" class="paperLookTab tab1">
          <div class="form-group pt-3 mx-4">
            <label class="font-md"
              >Issue Name <span style="color: #dc3545">*</span></label
            >
            <span
              v-if="_isallowed('write')"
              class="watch_action clickable float-right"
              @click.prevent.stop="toggleWatched"
              data-cy="issue_on_watch"
            >
              <span v-show="DV_issue.watched" class="check_box mx-1"
                ><i class="far fa-check-square font-md"></i
              ></span>
              <span v-show="!DV_issue.watched" class="empty_box mr-1"
                ><i class="far fa-square"></i
              ></span>
              <span><i class="fas fa-eye mr-1"></i></span
              ><small style="vertical-align: text-top">On Watch</small>
            </span>

            <span
              v-if="_isallowed('write')"
              class="watch_action clickable float-right"
              @click.prevent.stop="toggleImportant"
              data-cy="issue_important"
            >
              <span v-show="DV_issue.important" class="check_box mr-1">
                <i class="far fa-check-square"></i>
              </span>
              <span v-show="!DV_issue.important" class="empty_box mr-1">
                <i class="far fa-square"></i>
              </span>
              <span>
                <i class="fas fa-eye"></i>
              </span>
              <small style="vertical-align:text-top"> Important</small>
            </span>

            <el-input
              name="Issue Name"
              v-validate="'required'"
              type="text"
              v-model="DV_issue.title"
              placeholder="Issue Name"
              :readonly="!_isallowed('write')"
              :class="{ error: errors.has('Issue Name') }"
              data-cy="issue_title"
            />
            <div
              v-show="errors.has('Issue Name')"
              class="text-danger"
              data-cy="issue_title_error"
            >
              {{ errors.first("Issue Name") }}
            </div>
          </div>

          <div class="form-group mx-4">
            <label class="font-md">Description</label>
            <el-input
              type="textarea"
              placeholder="Issue brief description"
              v-model="DV_issue.description"
              rows="4"
              :readonly="!_isallowed('write')"
              data-cy="issue_description"
            />
          </div>

          <!-- Row begins -->
          <div class="d-flex mb-0 mx-4 form-group">
            <div class="simple-select w-100 form-group">
              <label class="font-md">Category</label>
              <el-select
                v-model="selectedTaskType"
                class="w-100"
                clearable
                track-by="id"
                value-key="id"
                :disabled="!_isallowed('write')"
                data-cy="task_type"
                name="Category"
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
            </div>
            </div>

            <div class="simple-select form-group mx-4">
              <label class="font-md"
                >Issue Type <span style="color: #dc3545">*</span></label
              >
              <el-select
                v-model="selectedIssueType"
                v-validate="'required'"
                class="w-100"
                track-by="id"
                value-key="id"
                :class="{ 'error': errors.has('Issue Type') }"
                data-cy="issue_type_field"
                name="Issue Type"
                :disabled="!_isallowed('write')"
                placeholder="Issue Type"
              >
                <el-option
                  v-for="item in issueTypes"
                  :value="item"
                  :key="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
      
              <div
                v-show="errors.has('Issue Type')"
                class="text-danger"
                data-cy="issue_type_error"
              >
                {{ errors.first("Issue Type") }}
              </div>
            </div>
         
          <!-- Tab 1 Row ends here -->
          <!-- Tab 1 Row begins here -->
          <div class="d-flex mx-4">
            <div class="simple-select form-group w-100">
              <label class="font-md"
                >Issue Severity <span style="color: #dc3545">*</span></label
              >
              <el-select
                v-model="selectedIssueSeverity"
                v-validate="'required'"
                class="w-100"
                track-by="id"
                value-key="id"
                :disabled="!_isallowed('write')"
                :class="{ 'error': errors.has('Issue Severity') }"
                data-cy="issue_severity"
                name="Issue Severity"
                placeholder="Issue Severity"
              >
                <el-option
                  v-for="item in issueSeverities"
                  :value="item"
                  :key="item.id"
                  :label="item.name"
                >
                </el-option>
              </el-select>
     
          <div
            v-show="errors.has('Issue Severity')"
            class="text-danger"
            data-cy="issue_severity_error"
          >
            {{ errors.first("Issue Severity") }}
          </div>
         </div>       
        </div>  
          
            <div class="mx-4 mt-2 mb-4" v-if="selectedIssueStage !== null">
              <div v-if="selectedIssueStage !== undefined">       
              <div style="position:relative"><label class="font-md mb-0">Stage</label>               
                <button v-if="_isallowed('write')" @click.prevent="clearStages" :disabled="fixedStage" class="btn btn-sm btn-danger d-inline-block font-sm float-right clearStageBtn">Clear Stages</button>  
              </div>    
            <el-steps 
              class="exampleOne mt-3" 
              :class="{'overSixSteps': issueStages.length >= 6 }"   
              :active="issueStages.findIndex(stage => stage.id == selectedIssueStage.id)"                
              finish-status="success"  
              :disabled="!_isallowed('write') || !!fixedStage"
              v-model="selectedIssueStage"
              track-by="id" 
              value-key="id"
              >         
              <el-step
              v-for="item in issueStages"
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
            v-if="selectedIssueStage == null || selectedIssueStage == undefined"
          >
            <label class="font-md">Select Stage</label>
            <el-steps
              class="exampleOne"
              :class="{ overSixSteps: issueStages.length >= 6 }"
              finish-status="success"
              :disabled="!_isallowed('write') || !!fixedStage"
              v-model="selectedIssueStage"
              track-by="id"
              value-key="id"
            >
              <el-step
                v-for="item in issueStages"
                :key="item.id"
                :value="item"
                style="cursor:pointer"
                @click.native="selectedStage(item)"
                :title="item.name"
                description=""
              ></el-step>
            </el-steps>
          </div>

          <!--
Tab 1 Row Begins here -->
          <div class="d-flex mb-0 mx-4 form-group">
            <div class="form-group mx-1 w-75">
              <label class="font-md"
                >Start Date <span style="color: #dc3545">*</span></label
              >
              <v2-date-picker
                v-validate="'required'"
                v-model="DV_issue.startDate"
                value-type="YYYY-MM-DD"
                format="DD MMM YYYY"
                placeholder="DD MM YYYY"
                name="Start Date"
                class="w-100 vue2-datepicker"
                :class="{ 'error': errors.has('Start Date') }"
                :disabled="!_isallowed('write')"
                data-cy="issue_start_date"
              />
              <div
                v-show="errors.has('Start Date')"
                class="text-danger"
                data-cy="issue_start_date_error"
              >
                {{ errors.first("Start Date") }}
              </div>
            </div>
            <div class="form-group w-75 ml-1">
              <label class="font-md"
                >Estimated Completion Date
                <span style="color: #dc3545">*</span></label
              >
              <v2-date-picker
                v-validate="'required'"
                v-model="DV_issue.dueDate"
                value-type="YYYY-MM-DD"
                format="DD MMM YYYY"
                placeholder="DD MM YYYY"
                name="Estimated Completion Date"
                class="w-100 vue2-datepicker"
                :class="{
                  'error': errors.has('Estimated Completion Date'),
                }"
                :disabled="
                  !_isallowed('write') ||
                    DV_issue.startDate === '' ||
                    DV_issue.startDate === null
                "
                :disabled-date="disabledDueDate"
                data-cy="issue_due_date"
              />
              <div
                v-show="errors.has('Estimated Completion Date')"
                class="text-danger"
                data-cy="issue_due_date_error"
              >
                {{ errors.first("Estimated Completion Date") }}
              </div>
            </div>
          </div>

        </div>
        <!-- ASSIGN USERS TAB # 2-->
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
                v-model="accountableIssueUsers"
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
          <div class="form-group  mt-0 d-flex w-100">
            <div class="form-group user-select ml-4 mr-1 w-100">
              <label class="font-md mb-0">Consulted</label>
              <el-select
                v-model="consultedIssueUsers"
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
            <div class="form-group user-select ml-1 mr-4 w-100">
              <label class="font-md mb-0">Informed</label>

              <el-select
                v-model="informedIssueUsers"
                class="w-100"
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

        <!-- CHECKLIST TAB #3 -->
        <div v-show="currentTab == 'tab3'" class="paperLookTab tab2">
          <div class="form-group pt-3 ml-4 mr-5">
            <label class="font-md mb-0">Progress (in %)</label>
            <span class="ml-3">
              <label class="font-sm mb-0 d-inline-flex align-items-center"
                ><input
                  type="checkbox"
                  v-model="DV_issue.autoCalculate"
                  :disabled="!_isallowed('write')"
                  :readonly="!_isallowed('write')"
                /><span>&nbsp;&nbsp;Auto Calculate Progress</span></label
              >
            </span>
            <el-slider
              v-model="DV_issue.progress"
              :disabled="!_isallowed('write') || DV_issue.autoCalculate"
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
                @change="(e) => handleEnd(e, DV_issue.checklists)"
                :list="DV_issue.checklists"
                :animation="100"
                ghost-class="ghost-card"
              >
                <div
                  v-for="(check, index) in DV_issue.checklists"
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
                              style="padding-left:4.5rem"
                            >
                              <span class="font-md pt-2 pr-2 m"
                                >Assigned To:</span
                              >
                              <el-select
                                v-model="check.user"
                                class="w-75"
                                track-by="id"
                                value-key="id"
                                clearable
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
                         
                          <div class="font-md vuetify-mt pt-3">
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
                                    @click.prevent="saveIssue"
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
          <!-- closing div for tab3 -->
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
                    class="input-group-text d-inline clickable px-1 w-100 hover"
                    :class="{ 'btn-disabled': !file.uri }"
                    @click.prevent="downloadFile(file)"
                  >
                    <span class="scales"
                      ><font-awesome-icon icon="file" class="mr-1"
                    /></span>
                    <input
                      readonly
                      type="text"
                      class="w-100 mr-1 file-link"
                      style="border:none; cursor:pointer; background-color:transparent"
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
                    v-for="(file,
                    index) in DV_issue.issueFiles.slice().reverse()"
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
        </div>

        <!-- RELATED TAB #5 -->
        <div v-show="currentTab == 'tab5'" class="paperLookTab tab4">
          <div class="row mx-3 mt-2">
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
            <label class="font-md">Updates</label>
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
                    @click.stop="destroyNote(note)"
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

      <div ref="addUpdates" class="pt-0 mt-0"></div>
    </form>
    <div
      v-if="loading"
      class="load-spinner spinner-border text-dark"
      role="status"
    ></div>

    <RelatedIssueMenu
      :facilities="facilities"
      :facilityGroups="facilityGroups"
      :issue="issue"
      :relatedTasks="relatedTasks"
      :relatedIssues="relatedIssues"
      :relatedRisks="relatedRisks"
      @add-related-tasks="addRelatedTasks"
      @add-related-issues="addRelatedIssues"
      @add-related-risks="addRelatedRisks"
      ref="menu"
    >
    </RelatedIssueMenu>
  </div>
</template>

<script>
import axios from "axios";
import humps from "humps";
import Draggable from "vuedraggable";
import { mapGetters, mapMutations, mapActions } from "vuex";
import AttachmentInput from "./../../shared/attachment_input";
import FormTabs from "./../../shared/FormTabs";
import RelatedIssueMenu from "./../../shared/RelatedIssueMenu";

export default {
  name: "IssueForm",
  props: ["facility", "issue", "task", "fixedStage"],
  components: {
    AttachmentInput,
    Draggable,
    FormTabs,
    RelatedIssueMenu,
  },
  data() {
    return {
      DV_issue: this.INITIAL_ISSUE_STATE(),
      DV_facility: Object.assign({}, this.facility),
      paginate: ["filteredNotes"],
      destroyedFiles: [],
      selectedIssueType: null,
      selectedTaskType: null,
      selectedIssueSeverity: null,
      editToggle: false,
      selectedIssueStage: null,
      issueUsers: [],
      responsibleUsers: null,
      accountableIssueUsers: null,
      consultedIssueUsers: [],
      informedIssueUsers: [],
      relatedIssues: [],
      relatedTasks: [],
      relatedRisks: [],
      showErrors: false,
      loading: true,
      movingSlot: "",
      currentTab: "tab1",
      tabs: [
        {
          label: "Issue Info",
          key: "tab1",
          closable: false,
          form_fields: [
            "Issue Name",
            "Description",
            "Category",
            "Issue Type",
            "Issue Severity",
            "Stage",
            "Start Date",
            "Estimated Completion Date",
          ],
        },
        {
          label: "Assignments",
          key: "tab2",
          closable: false,
        },
        {
          label: "Checklist",
          key: "tab3",
          closable: false,
        },
        {
          label: "Files & Links",
          key: "tab4",
          closable: false,
        },
        {
          label: "Related",
          key: "tab5",
          closable: false,
        },
        {
          label: "Updates",
          key: "tab6",
          closable: false,
        },
      ],
    };
  },
  updated() {
    if (this.fixedStage) {
      this.selectedIssueStage = this.fixedStage;
    }
  },
  mounted() {
    if (!_.isEmpty(this.issue)) {
      this.loadIssue(this.issue);
    } else {
      this.loading = false;
      this.loadIssue(this.DV_issue);
    }
  },
  methods: {
    ...mapMutations(["setTaskForManager", "updateIssuesHash"]),
    ...mapActions(["issueDeleted", "taskUpdated", "updateWatchedIssues"]),
    INITIAL_ISSUE_STATE() {
      return {
        title: "",
        startDate: "",
        dueDate: "",
        facilityProjectId: this.facility.id,       
        issueTypeId: "",
        taskTypeId: "",
        progress: 0,
        issueSeverityId: "",
        issueStageId: "",
        description: "",
        autoCalculate: true,
        important: false,
        responsibleUserIds: [],
        accountableUserIds: [],
        consultedUserIds: [],
        informedUserIds: [],
        subTaskIds: [],
        subRiskIds: [],
        subIssueIds: [],
        issueFiles: [],
        checklists: [],
        notes: [],
      };
    },
    selectedStage(item) {
      if (this._isallowed("write")) {
        this.selectedIssueStage = item;
      }
    },
    clearStages() {
      this.selectedIssueStage = null;
      this.IssueStageId = "";
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
      this.DV_issue.checklists.push({ text: "", checked: false });
    },
    onChangeTab(tab) {
      this.currentTab = tab ? tab.key : "tab1";
    },
    scrollToUpdates() {
      this.$refs.addUpdates.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      this.DV_issue.notes.unshift({ body: "", user_id: "", guid: this.guid() });
    },
    handleMove(item) {
      this.movingSlot = item.relatedContext.component.$vnode.key;
      return true;
    },
    handleEnd(e, checklists) {
      var cc = this.DV_issue.checklists;
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
    progressListTitleText(progressList) {
      if (!progressList.id) return;
      var date = moment(progressList.createdAt).format("MM/DD/YYYY");
      var time = moment(progressList.createdAt).format("hh:mm:ss a");
      return `${progressList.user.fullName} at ${date} ${time} `;
    },
    loadIssue(issue) {
      this.DV_issue = { ...this.DV_issue, ..._.cloneDeep(issue) };

      this.responsibleUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_issue.responsibleUserIds.includes(u.id)
      )[0];
      this.accountableIssueUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_issue.accountableUserIds.includes(u.id)
      )[0];
      this.consultedIssueUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_issue.consultedUserIds.includes(u.id)
      );
      this.informedIssueUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_issue.informedUserIds.includes(u.id)
      );

      this.relatedIssues = _.filter(this.currentIssues, (u) =>
        this.DV_issue.subIssueIds.includes(u.id)
      );
      this.relatedTasks = _.filter(this.currentTasks, (u) =>
        this.DV_issue.subTaskIds.includes(u.id)
      );
      this.relatedRisks = _.filter(this.filteredRisks, (u) =>
        this.DV_issue.subRiskIds.includes(u.id)
      );
      this.selectedIssueType = this.issueTypes.find(
        (t) => t.id === this.DV_issue.issueTypeId
      );
      this.selectedTaskType = this.taskTypes.find(
        (t) => t.id === this.DV_issue.taskTypeId
      );
      this.selectedIssueSeverity = this.issueSeverities.find(
        (t) => t.id === this.DV_issue.issueSeverityId
      );
      this.selectedIssueStage = this.issueStages.find(
        (t) => t.id === this.DV_issue.issueStageId
      );
      if (this.DV_issue.attachFiles)
        this.addFile(this.DV_issue.attachFiles, false);
      this.$nextTick(() => {
        this.errors.clear();
        this.$validator.reset();
        this.loading = false;
      });
    },
    addFilesInput() {
      this.DV_issue.issueFiles.push({
        name: "",
        uri: "",
        link: true,
        guid: this.guid(),
      });
    },
    addFile(files = [], append = true) {
      let _files = append ? [...this.DV_issue.issueFiles] : [];
      for (let file of files) {
        file.guid = this.guid();
        _files.push(file);
      }
      this.DV_issue.issueFiles = _files;
    },
    deleteIssue() {
      this.$confirm(`Are you sure you want to delete ${this.DV_issue.title}?`, ` Confirm Delete`, {
          confirmButtonText: 'Delete',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.issueDeleted(this.DV_issue).then((value) => {
            if (value === 'Success') {
              this.$message({
                message: `${this.DV_issue.title} was deleted successfully.`,
                type: "success",
                showClose: true,
              });
            }
          });
          this.cancelIssueSave();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled',
            showClose: true
          });          
        });
             
    },
    deleteFile(file) {
      if (!file) return;
      let confirm = window.confirm(
        `Are you sure you want to delete attachment?`
      );
      if (!confirm) return;

      if (file.uri || file.link) {
        let index = this.DV_issue.issueFiles.findIndex(
          (f) => f.guid === file.guid
        );

        if (file.id) {
          Vue.set(this.DV_issue.issueFiles, index, { ...file, _destroy: true });
          this.destroyedFiles.push(file);
        }
        this.DV_issue.issueFiles.splice(
          this.DV_issue.issueFiles.findIndex((f) => f.guid === file.guid),
          1
        );
      } else if (file.name) {
        this.DV_issue.issueFiles.splice(
          this.DV_issue.issueFiles.findIndex((f) => f.guid === file.guid),
          1
        );
      }
    },
    toggleWatched() {
      if (this.DV_issue.progress == 100 && !this.DV_issue.watched) {
        this.$message({
          message: `Issues at 100% progress cannot be placed On Watch status.`,
          type: "warning",
          showClose: true,
        });
        return;
      }
      if (this.DV_issue.watched) {
        this.$message({
          message: `${this.DV_issue.title} has been removed from On Watch status.`,
          type: "warning",
          showClose: true,
        });
      } else {
        this.$message({
          message: `${this.DV_issue.title} successfully placed On Watch status.`,
          type: "success",
          showClose: true,
        });
      }
      this.DV_issue = { ...this.DV_issue, watched: !this.DV_issue.watched };
      this.updateWatchedIssues(this.DV_issue);
    },
    toggleImportant() {
      this.DV_issue = { ...this.DV_issue, important: !this.DV_issue.important };
    },
    removeFromWatch() {
      if (this.DV_issue.progress == 100 && this.DV_issue.watched == true) {
        this.toggleWatched();
      }
    },
    cancelIssueSave() {
      this.$emit("on-close-form");
      this.setTaskForManager({ key: "issue", value: null });
    },
    saveIssue() {
      this.$validator.validate().then((success) => {
        if (!success || this.loading) {
          this.showErrors = !success;
          return;
        }
        this.editToggle = !this.editToggle;
        this.loading = true;
        let formData = new FormData();
        formData.append("issue[title]", this.DV_issue.title);
        formData.append("issue[due_date]", this.DV_issue.dueDate);
        formData.append("issue[start_date]", this.DV_issue.startDate);
        formData.append("issue[issue_type_id]", this.DV_issue.issueTypeId);
        formData.append("issue[task_type_id]", this.DV_issue.taskTypeId);
        formData.append("issue[important]", this.DV_issue.important);
        formData.append(
          "issue[issue_severity_id]",
          this.DV_issue.issueSeverityId
        );
        formData.append("issue[issue_stage_id]", this.DV_issue.issueStageId);
        formData.append("issue[progress]", this.DV_issue.progress);
        formData.append("issue[description]", this.DV_issue.description);
        formData.append("issue[auto_calculate]", this.DV_issue.autoCalculate);
        formData.append("issue[destroy_file_ids]",_.map(this.destroyedFiles, "id") );

     //Responsible USer Id
        if (this.DV_issue.responsibleUserIds && this.DV_issue.responsibleUserIds.length) {
          // console.log("this.DV_issue.responsibleUserIds.length")
          // console.log(this.DV_issue.responsibleUserIds.length)
          // console.log(this.DV_issue.responsibleUserIds)
          for (let u_id of this.DV_issue.responsibleUserIds) {
            formData.append("responsible_user_ids[]", u_id);
          }
        } else {
          formData.append("responsible_user_ids[]", []);
        }

        // Accountable UserId

        if (
          this.DV_issue.accountableUserIds &&
          this.DV_issue.accountableUserIds.length
        ) {
          // console.log("this.DV_issue.responsibleUserIds.length")
          // console.log(this.DV_issue.accountableUserIds.length)
          // console.log(this.DV_issue.accountableUserIds)
          for (let u_id of this.DV_issue.accountableUserIds) {
            formData.append("accountable_user_ids[]", u_id);
          }
        } else {
          formData.append("accountable_user_ids[]", []);
        }

        // Consulted UserId

        if (this.DV_issue.consultedUserIds.length) {
          // console.log("this.DV_issue.responsibleUserIds.length")
          // console.log(this.DV_issue.consultedUserIds.length)
          // console.log(this.DV_issue.consultedUserIds)
          for (let u_id of this.DV_issue.consultedUserIds) {
            formData.append("consulted_user_ids[]", u_id);
          }
        } else {
          formData.append("consulted_user_ids[]", []);
        }

        // Informed UserId

        if (this.DV_issue.informedUserIds.length) {
          // console.log("this.DV_issue.responsibleUserIds.length")
          // console.log(this.DV_issue.informedUserIds.length)
          // console.log(this.DV_issue.informedUserIds)
          for (let u_id of this.DV_issue.informedUserIds) {
            formData.append("informed_user_ids[]", u_id);
          }
        } else {
          formData.append("informed_user_ids[]", []);
        }

        if (this.DV_issue.subTaskIds.length) {
          for (let u_id of this.DV_issue.subTaskIds) {
            formData.append("issue[sub_task_ids][]", u_id);
          }
        } else {
          formData.append("issue[sub_task_ids][]", []);
        }

        if (this.DV_issue.subRiskIds.length) {
          for (let u_id of this.DV_issue.subRiskIds) {
            formData.append("issue[sub_risk_ids][]", u_id);
          }
        } else {
          formData.append("issue[sub_risk_ids][]", []);
        }

        if (this.DV_issue.subIssueIds.length) {
          for (let u_id of this.DV_issue.subIssueIds) {
            formData.append("issue[sub_issue_ids][]", u_id);
          }
        } else {
          formData.append("issue[sub_issue_ids][]", []);
        }

        for (let i in this.DV_issue.checklists) {
          let check = this.DV_issue.checklists[i];
          if (!check.text && !check._destroy) continue;
          for (let key in check) {
            if (key === "user") key = "user_id";
            let value =
              key == "user_id"
                ? check.user
                  ? check.user.id
                  : null
                : check[key];
            // if (key === "dueDate") {
            //   key = "due_date";
            // }
            key = humps.decamelize(key);
            if (["created_at", "updated_at", "progress_lists"].includes(key))
              continue;
            formData.append(
              `issue[checklists_attributes][${i}][${key}]`,
              value
            );
          }
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
                `issue[checklists_attributes][${i}][progress_lists_attributes][${pi}][${pkey}]`,
                pvalue
              );
            }
          }
        }

        for (let i in this.DV_issue.notes) {
          let note = this.DV_issue.notes[i];
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
            formData.append(`issue[notes_attributes][${i}][${key}]`, value);
          }
        }

        for (let file of this.DV_issue.issueFiles) {
          if (file.id) continue;
          if (!file.link) {
            formData.append("issue[issue_files][]", file);
          } else if (file.link) {
            formData.append("file_links[]", file.name);
          }
        }

        let url = `/projects/${this.currentProject.id}/facilities/${this.$route.params.projectId}/issues.json`;
        let method = "POST";
        let callback = "issue-created";

        if (this.issue && this.issue.id) {
          url = `/projects/${this.currentProject.id}/facilities/${this.issue.facilityId}/issues/${this.issue.id}.json`;
          method = "PUT";
          callback = "issue-updated";
        }
        // var beforeIssue = this.issue

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
            // if(beforeIssue.facilityId && beforeIssue.projectId )
            //   this.$emit(callback, humps.camelizeKeys(beforeIssue));
            // this.$emit(callback, humps.camelizeKeys(response.data.issue));

            var responseIssue = humps.camelizeKeys(response.data.issue);
            this.loadIssue(responseIssue);
            //this.$emit(callback, responseIssue)
            this.updateIssuesHash({ issue: responseIssue });
            if (response.status === 200) {
              this.$message({
                message: `${response.data.issue.title} was saved successfully.`,
                type: "success",
                showClose: true,
              });
            }
            if (this.$route.path.includes("sheet")) {
              this.$router.push(
                `/programs/${this.$route.params.programId}/sheet/projects/${this.$route.params.projectId}/issues/${response.data.issue.id}`
              );
            } else if (this.$route.path.includes("map")) {
              this.$router.push(
                `/programs/${this.$route.params.programId}/map/projects/${this.$route.params.projectId}/issues/${response.data.issue.id}`
              );
            } else if (this.$route.path.includes("calendar")) {
              this.$router.push(
                `/programs/${this.$route.params.programId}/calendar/projects/${this.$route.params.projectId}/issues/${response.data.issue.id}`
              );
            } else {
              this.$router.push(
                `/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/issues/${response.data.issue.id}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      });
    },
    addNote() {
      this.DV_issue.notes.unshift({ body: "", user_id: "", guid: this.guid() });
    },
    destroyNote(note) {
      let confirm = window.confirm(
        `Are you sure, you want to delete this update note?`
      );
      if (!confirm) return;
      let i = note.id
        ? this.DV_issue.notes.findIndex((n) => n.id === note.id)
        : this.DV_issue.notes.findIndex((n) => n.guid === note.guid);
      Vue.set(this.DV_issue.notes, i, { ...note, _destroy: true });
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
      this.saveIssue();
    },
    disabledDueDate(date) {
      date.setHours(0, 0, 0, 0);
      const startDate = new Date(this.DV_issue.startDate);
      startDate.setHours(48, 0, 0, 0);
      return date < startDate;
    },
    addChecks() {
      var postion = this.DV_issue.checklists.length;
      this.DV_issue.checklists.push({
        text: "",
        checked: false,
        position: postion,
        progressLists: [],
      });
    },
    addProgressList(check) {
      var postion = check.progressLists.length;
      check.progressLists.push({ body: "", position: postion });
      this.editToggle = true;
    },
    destroyCheck(check, index) {
      let confirm = window.confirm(
        `Are you sure, you want to delete this checklist item?`
      );
      if (!confirm) return;

      let i = check.id
        ? this.DV_issue.checklists.findIndex((c) => c.id === check.id)
        : index;
      Vue.set(this.DV_issue.checklists, i, { ...check, _destroy: true });
      this.saveIssue();
    },
    calculateProgress(checks = null) {
      try {
        if (!checks) checks = this.DV_issue.checklists;
        let checked = _.filter(
          checks,
          (v) => !v._destroy && v.checked && v.text.trim()
        ).length;
        let total = _.filter(checks, (v) => !v._destroy && v.text.trim())
          .length;
        this.DV_issue.progress = Number(
          ((checked / total) * 100 || 0).toFixed(2)
        );
      } catch (err) {
        this.DV_issue.progress = 0;
      }
    },
    updateCheckItem(event, name, index) {
      if (name === "text") {
        this.DV_issue.checklists[index].text = event.target.value;
        if (!event.target.value)
          this.DV_issue.checklists[index].checked = false;
      } else if (name === "check" && this.DV_issue.checklists[index].text) {
        this.DV_issue.checklists[index].checked = event.target.checked;
      } else if (name === "dueDate" && this.DV_issue.checklists[index].text) {
        this.DV_issue.checklists[index].dueDate = event.target.value;
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
      return this.C_myIssues && check.id
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
      var dueDate = new Date(this.DV_issue.dueDate);
      dueDate.setDate(dueDate.getDate() + 1);

      return date < new Date(this.DV_issue.startDate) || date > dueDate;
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
      "issueSeverities",
      "issueStages",
      "issueTypes",
      "managerView",
      "myActionsFilter",
      "projectUsers",
      "taskTypes",
    ]),
    readyToSave() {
      return (
        this.DV_issue &&
        this.exists(this.DV_issue.title) &&
        this.exists(this.DV_issue.issueTypeId) &&
        this.exists(this.DV_issue.issueSeverityId) &&
        this.exists(this.DV_issue.dueDate) &&
        this.exists(this.DV_issue.startDate)
      );
    },
    isMapView() {
      return this.$route.name === "MapIssueForm";
    },
    isSheetsView() {
      return this.$route.name === "SheetIssueForm";
    },
    isKanbanView() {
      return this.$route.name === "KanbanIssueForm";
    },
    isCalendarView() {
      return this.$route.name === "CalendarIssueForm";
    },
    filteredChecks() {
      return _.filter(this.DV_issue.checklists, (c) => !c._destroy);
    },
    filteredFiles() {
      return _.filter(this.DV_issue.issueFiles, (f) => !f._destroy);
    },
    C_myIssues() {
      return _.map(this.myActionsFilter, "value").includes("issues");
    },
    title() {
      return this._isallowed("write")
        ? this.DV_issue.id
          ? "Edit Issue"
          : "Report an Issue"
        : "Issue";
    },
    filteredTasks() {
      return this.currentTasks;
    },
    filteredIssues() {
      return _.filter(this.currentIssues, (t) => t.id !== this.DV_issue.id);
    },
    filteredRisks() {
      return _.filter(this.currentRisks, (t) => t.id !== this.DV_issue.id);
    },
    filteredNotes() {
      return _.orderBy(
        _.filter(this.DV_issue.notes, (n) => !n._destroy),
        "createdAt",
        "desc"
      );
    },
    _isallowed() {
      return (salut) =>
        this.$currentUser.role == "superadmin" ||
        this.$permissions.issues[salut];
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
      if (this.$route.path.includes("kanban") || this.$route.path.includes("calendar")) {
        return `/programs/${this.$route.params.programId}/${this.tab}/projects/${this.$route.params.projectId}/issues`;
      } else {
        return `/programs/${this.$route.params.programId}/${this.tab}/projects/${this.$route.params.projectId}`;
      }
    },
  },
  watch: {
    issue: {
      handler() {
        if (this.issue) {
          this.loadIssue(this.issue);
        }
      },
    },
    "DV_issue.startDate"(value) {
      if (!value) this.DV_issue.dueDate = "";
    },
    "DV_issue.dueDate"(value) {
      if (this.facility.dueDate) {
        if (moment(value).isAfter(this.facility.dueDate, "day")) {
          this.$alert(`${this.DV_issue.title} Due Date is past Project Due Date!`, `${this.DV_issue.title} Due Date Warning`, {
          confirmButtonText: 'Ok',
          type: 'info'
        });
        }
      }
    },
    "DV_issue.checklists": {
      handler: function(value) {
        if (this.DV_issue.autoCalculate) this.calculateProgress(value);
      },
      deep: true,
    },
    "DV_issue.autoCalculate"(value) {
      if (value) this.calculateProgress();
    },
    responsibleUsers: {
      handler: function(value) {
        if (value) {
          this.DV_issue.responsibleUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_issue.responsibleUserIds = null;
        }
      },
      deep: true,
    },
    accountableIssueUsers: {
      handler: function(value) {
        if (value) {
          this.DV_issue.accountableUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_issue.accountableUserIds = null;
        }
      },
      deep: true,
    },
    consultedIssueUsers: {
      handler: function(value) {
        if (value) this.DV_issue.consultedUserIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    informedIssueUsers: {
      handler: function(value) {
        if (value) this.DV_issue.informedUserIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedIssues: {
      handler: function(value) {
        if (value) this.DV_issue.subIssueIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedTasks: {
      handler: function(value) {
        if (value) this.DV_issue.subTaskIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedRisks: {
      handler: function(value) {
        if (value) this.DV_issue.subRiskIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    selectedIssueType: {
      handler: function(value) {
        this.DV_issue.issueTypeId = value ? value.id : null;
      },
      deep: true,
    },
    selectedTaskType: {
      handler: function(value) {
        this.DV_issue.taskTypeId = value ? value.id : null;
      },
      deep: true,
    },
    selectedIssueSeverity: {
      handler: function(value) {
        this.DV_issue.issueSeverityId = value ? value.id : null;
      },
      deep: true,
    },
    selectedIssueStage: {
      handler: function(value) {
        this.DV_issue.issueStageId = value ? value.id : null;
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

<style lang="scss" scoped>
.issues-form {
}
.form-control.error {
  border-color: #e84444;
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
  position: absolute;
  display: flex;
  right: 2rem;
  font-weight: 500;
  background: transparent;
  height: fit-content;
  color: #dc3545;
}
ul {
  list-style-type: none;
  padding: 0;
}
.drag {
  cursor: all-scroll;
}
// Checklist feature UI
/deep/.el-collapse-item__header {
  background-color: #fafafa !important;
}
/deep/.el-collapse-item__header {
  float: right;
  margin-top: -38px;
  font: small;
  color: #d9534f !important;
  border-bottom: none !important;
}
/deep/ .el-collapse {
  border-top: none !important;
  border-bottom: none !important;
}
/deep/.el-collapse-item__content {
  padding-bottom: 0 !important;
}
.paperLook {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
  position: relative;
}
.sticky-btn {
  margin-top: 5px;
  margin-bottom: 5px;
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}
.sticky {
  justify-content: center;
  z-index: 1000;
  left: 15;
  top: 0;
  width: 100%;
  padding: 6px;
  background-color: rgba(237, 237, 237, 0.85);
  box-shadow: 0 10px 20px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.sticky-kanban {
  position: sticky;
  position: -webkit-sticky;
  margin-bottom: -2.5rem;
}
.scrollToChecklist {
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}
.btn-group {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.check-due-date {
  text-align: end;
}
.disabled {
  opacity: 0.6;
}
.custom-tab {
  width: min-content;
  background-color: #fff;
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.tab2,
.tab3,
.tab4,
.tab5 {
  min-height: 400px;
  background-color: #fff;
}

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
.fixed-form {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 275px);
}
.display-length {
  border-radius: 0.15rem;
  margin-right: 12px;
}
.red-border {
  border: solid 0.5px red;
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
  background-color: rgba(91, 192, 222, 0.3) !important;
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
