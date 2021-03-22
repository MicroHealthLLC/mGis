<template>
  <div>
    <form
      @submit.prevent="validateThenSave"
      class="risks-form mx-auto pb-4"
      :class="{
        'fixed-form-mapView': isMapView,
        _disabled: loading,
        'kanban-form': isKanbanView,
      }"
      accept-charset="UTF-8"
    >
      <div class="form-group mb-1">
        <div class="mt-2 mx-4 d-flex align-items-center">
          <div>
            <h5 class="mb-0">
              <span style="font-size: 16px; margin-right: 10px"
                ><i class="fas fa-building"></i
              ></span>
              {{ facility.facilityName }}
              <el-icon
                class="el-icon-arrow-right"
                style="font-size: 12px"
              ></el-icon>
              Risks
              <el-icon
                class="el-icon-arrow-right"
                style="font-size: 12px"
              ></el-icon>
              <span v-if="DV_risk.text.length > 0">{{ DV_risk.text }}</span>
              <span v-else style="color: gray">(Risk Name)</span>
            </h5>
          </div>
          <div class="ml-auto d-flex" v-if="_isallowed('read')">
            <button
              v-if="_isallowed('write')"
              class="btn btn-sm sticky-btn btn-primary text-nowrap mr-2"
              data-cy="risk_save_btn"
            >
              Save Risk
            </button>
            <button
              v-else
              disabled
              class="btn btn-sm sticky-btn btn-primary mr-2"
              data-cy="risk_read_only_btn"
            >
              Read Only
            </button>
            <button
              class="btn btn-sm sticky-btn btn-outline-secondary"
              @click.prevent="cancelRiskSave"
              data-cy="risk_close_btn"
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
        <div class="fixed-form">
          <div class="mx-0">
            <div v-if="errors.items.length > 0" class="text-danger mx-4">
              Please fill the required fields before submitting
              <ul class="error-list mx-4">
                <li
                  v-for="(error, index) in errors.all()"
                  :key="index"
                  v-tooltip="{
                    content: `${errorLocation(error)}`,
                    placement: 'left',
                  }"
                >
                  {{ error }}
                </li>
              </ul>
            </div>

            <div v-show="currentTab == 'risk'" class="paperLookTab">
              <!-- RISK OVERVIEW TAB -->
              <div class="form-group mx-4">
                <span
                  v-if="_isallowed('write')"
                  class="watch_action mt-3 clickable float-right"
                  @click.prevent.stop="toggleWatched"
                  data-cy="risk_on_watch"
                >
                  <span v-show="DV_risk.watched" class="check_box mx-1"
                    ><i class="far fa-check-square font-md"></i
                  ></span>
                  <span v-show="!DV_risk.watched" class="empty_box mr-1"
                    ><i class="far fa-square"></i
                  ></span>
                  <span><i class="fas fa-eye mr-1"></i></span>
                  <small style="vertical-align: text-top">On Watch</small>
                </span>
                <label class="font-sm mt-3"
                  >Risk Name <span style="color: #dc3545">*</span></label
                >
                <textarea
                  v-validate="'required'"
                  class="form-control"
                  placeholder="Risk title"
                  v-model="DV_risk.text"
                  rows="1"
                  :readonly="!_isallowed('write')"
                  data-cy="risk_name"
                  name="Risk Name"
                  :class="{
                    'form-control': true,
                    error: errors.has('Risk Name'),
                  }"
                />
                <div
                  v-show="errors.has('Risk Name')"
                  class="text-danger"
                  data-cy="risk_name_error"
                >
                  {{ errors.first("Risk Name") }}
                </div>
              </div>

              <div class="form-group mx-4">
                <label class="font-sm"
                  >Risk Description <span style="color: #dc3545">*</span></label
                >
                <textarea
                  v-validate="'required'"
                  class="form-control"
                  placeholder="Risk brief description"
                  v-model="DV_risk.riskDescription"
                  rows="3"
                  :readonly="!_isallowed('write')"
                  data-cy="risk_description"
                  name="Risk Description"
                  :class="{
                    'form-control': true,
                    error: errors.has('Risk Description'),
                  }"
                />
                <div
                  v-show="errors.has('Risk Description')"
                  class="text-danger"
                  data-cy="risk_description_error"
                >
                  {{ errors.first("Risk Description") }}
                </div>
              </div>

              <div class="d-flex mb-0 form-group mx-4">
                <div class="simple-select form-group w-100">
                  <label class="font-sm"
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
                  <!-- <multiselect
                    v-model="selectedTaskType"
                    v-validate="'required'"
                    track-by="id"
                    label="name"
                    placeholder="Select Category"
                    :options="taskTypes"
                    :searchable="false"
                    select-label="Select"
                    deselect-label="Remove"
                    :disabled="!_isallowed('write')"
                    :class="{ 'error-border': errors.has('Category') }"
                    data-cy="risk_milestone"
                    name="Category"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
                      <div class="d-flex">
                        <span class="select__tag-name">{{ option.name }}</span>
                      </div>
                    </template>
                  </multiselect> -->
                  <div
                    v-show="errors.has('Category')"
                    class="text-danger"
                    data-cy="risk_milestone_error"
                  >
                    {{ errors.first("Category") }}
                  </div>
                </div>

                <div class="simple-select form-group w-100 mx-1">
                  <label class="font-sm">Stage</label>
                <el-select 
                  v-model="selectedRiskStage"                    
                  class="w-100" 
                  clearable
                  track-by="id" 
                  value-key="id"    
                  :disabled="!_isallowed('write') || !!fixedStage"
                  data-cy="risk_stage"                                                                                                                                              
                  placeholder="Select Stage"

                  >
                    <el-option
                      v-for="item in riskStages"
                      :value="item"
                      :key="item.id"
                      :label="item.name"
                    >
                    </el-option>
                  </el-select>
                </div>

                <!-- <div class="simple-select w-100 form-group">
              <label class="font-sm">*Project:</label>
              <multiselect
                v-model="selectedFacilityProject"
                v-validate="'required'"
                track-by="id"
                label="name"
                placeholder="Select Project"
                :options="getFacilityProjectOptions"
                :searchable="true"
                select-label="Select"
                deselect-label="Remove"
                :disabled="!_isallowed('write')"
                data-cy="facility_project_id"
                >
                <template slot="singleLabel" slot-scope="{option}">
                  <div class="d-flex">
                    <span class='select__tag-name'>{{option.name}}</span>
                  </div>
                </template>
              </multiselect>
            </div> -->
              </div>

              <div class="form-row mx-4">
                <div class="form-group col-md-6 pl-0">
                  <label class="font-sm"
                    >Identified Date
                    <span style="color: #dc3545">*</span></label
                  >
                  <v2-date-picker
                    v-validate="'required'"
                    v-model="DV_risk.startDate"
                    value-type="YYYY-MM-DD"
                    format="DD MMM YYYY"
                    placeholder="DD MM YYYY"
                    name="Identified Date"
                    class="w-100 vue2-datepicker"
                    :class="{ 'error-border': errors.has('Identified Date') }"
                    :disabled="!_isallowed('write')"
                    data-cy="risk_start_date"
                  />
                  <div
                    v-show="errors.has('Identified Date')"
                    class="text-danger"
                    data-cy="risk_start_date_error"
                  >
                    {{ errors.first("Identified Date") }}
                  </div>
                </div>

                <div class="form-group col-md-6 pr-0">
                  <label class="font-sm"
                    >Risk Approach Due Date
                    <span style="color: #dc3545">*</span></label
                  >
                  <v2-date-picker
                    v-validate="'required'"
                    v-model="DV_risk.dueDate"
                    value-type="YYYY-MM-DD"
                    format="DD MMM YYYY"
                    placeholder="DD MM YYYY"
                    name="Risk Approach Due Date"
                    class="w-100 vue2-datepicker"
                    :class="{
                      'error-border': errors.has('Risk Approach Due Date'),
                    }"
                    :disabled="
                      !_isallowed('write') ||
                        DV_risk.startDate === '' ||
                        DV_risk.startDate === null
                    "
                    :disabled-date="disabledDueDate"
                    data-cy="risk_due_date"
                  />
                  <div
                    v-show="errors.has('Risk Approach Due Date')"
                    class="text-danger"
                    data-cy="risk_due_date_error"
                  >
                    {{ errors.first("Risk Approach Due Date") }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- END RISK IDENTIFY TAB SECTION -->

          <!-- BEGIN ASSIGN Tab 2 -->
          <div v-show="currentTab == 'tab2'" class="paperLookTab tab2">
            <div class="form-group mb-0 pt-3 d-flex w-100">
              <div class="form-group user-select ml-4 mr-1 w-100">
                <!-- 'Responsible' field was formally known as 'Assign Users' field -->
                <label class="font-sm mb-0">Responsible</label>

                 <el-select 
                  v-model="responsibleUsers" 
                  class="w-100"                
                  track-by="id"   
                  clearable   
                  filterable  
                  value-key="id"                                                                                                                                                          
                  placeholder="Select Responsible User"
                  :disabled="!_isallowed('write')"
                  data-cy="risk_owner"
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
                <label class="font-sm mb-0">Accountable</label>

                <el-select 
                  v-model="accountableRiskUsers" 
                  class="w-100"           
                  track-by="id"
                  clearable        
                  value-key="id"                                                                                                                                                          
                  placeholder="Select Accountable User"
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

            <div class="form-group mt-0 d-flex w-100">
              <div class="form-group user-select ml-4 mr-1 w-100">
                <label class="font-sm mb-0">Consulted</label>
                <el-select
                  v-model="consultedRiskUsers"
                  class="w-100"
                  track-by="id"
                  value-key="id"
                  :multiple="true"
                  placeholder="Select Consulted Users"
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
                <label class="font-sm mb-0">Informed</label>
                <el-select
                  v-model="informedRiskUsers"
                  class="w-100"
                  track-by="id"
                  value-key="id"
                  multiple
                  filterable
                  placeholder="Select Informed Users"
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

          <!-- END ASSIGN Tab 2-->

          <!-- BEGIN RISK PRIORITIZE TAB -->

          <div v-show="currentTab == 'tab3'" class="paperLookTab">
            <div class="container-fluid pt-2 px-4">
              <div class="row mb-0">
                <div class="col-md-3 simple-select form-group">
                  <label class="font-sm">Priority Level:</label>
                  <div class="risk-priorityLevel text-center">
                    <span class="risk-pL px-2 pt-2 mb-0 pb-0 mx-0">
                      {{ calculatePriorityLevel }}</span
                    >
                    <br />
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          1
                      "
                      class="gray2"
                      >Very Low</span
                    >
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          2
                      "
                      class="green1"
                      >Low</span
                    >
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          3
                      "
                      class="green1"
                      >Low</span
                    >
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          4
                      "
                      class="yellow1"
                      >Moderate
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          5
                      "
                      class="yellow1"
                      >Moderate
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          6
                      "
                      class="yellow1"
                      >Moderate
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          8
                      "
                      class="orange1"
                      >High
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          9
                      "
                      class="orange1"
                      >High
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          10
                      "
                      class="orange1"
                      >High
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id ==
                          12
                      "
                      class="orange1"
                      >High
                    </span>
                    <span
                      v-if="
                        this.selectedRiskPossibility.id *
                          this.selectedRiskImpactLevel.id >=
                          15
                      "
                      class="red1"
                      >Extreme
                    </span>
                  </div>
                  <p class="font-sm mt-2">
                    <b>HINT:</b> Update Probability and/or Impact Level to
                    change Priority Level.
                  </p>
                </div>

                <div class="col-md-3 p-0">
                  <div class="simple-select form-group mb-4">
                    <label class="font-sm"
                      >Probability <span style="color: #dc3545">*</span></label
                    >
                    <el-select
                      v-model="selectedRiskPossibility"
                      class="w-100"
                      v-validate="'required'"
                      track-by="value"
                      value-key="id"
                      placeholder="Risk Probablity"
                      :disabled="!_isallowed('write')"
                      :class="{ error: errors.has('Risk Probability') }"
                      data-cy="risk_probability"
                    >
                      <el-option
                        v-for="item in getRiskProbabilityNames"
                        :value="item"
                        :key="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>
                    <!-- <multiselect
                      v-model="selectedRiskPossibility"
                      v-validate="'required'"
                      track-by="value"
                      label="name"
                      placeholder="Risk Probablity"
                      :options="getRiskProbabilityNames"
                      :searchable="false"
                      deselect-label=""
                      :allow-empty="false"
                      :disabled="!_isallowed('write')"
                      :class="{ error: errors.has('Risk Probability') }"
                      data-cy="risk_probability"
                    >
                      <template slot="singleLabel" slot-scope="{ option }">
                        <div class="d-flex">
                          <span class="select__tag-name">{{
                            option.name
                          }}</span>
                        </div>
                      </template>
                    </multiselect> -->
                    <div
                      v-show="errors.has('Risk Probability')"
                      class="text-danger"
                      data-cy="risk_probability_error"
                    >
                      {{ errors.first("Risk Probability") }}
                    </div>
                  </div>

                  <!-- COLUMN ROW 2 -->
                  <div class="simple-select form-group">
                    <label class="font-sm mb-0"
                      >Impact Level <span style="color: #dc3545">*</span></label
                    >
                    <el-select
                      v-model="selectedRiskImpactLevel"
                      class="w-100"
                      v-validate="'required'"
                      track-by="value"
                      value-key="id"
                      placeholder="Impact Level"
                      :disabled="!_isallowed('write')"
                      :class="{ error: errors.has('Impact Level') }"
                      data-cy="impact_level"
                    >
                      <el-option
                        v-for="item in getRiskImpactLevelNames"
                        :value="item"
                        :key="item.id"
                        :label="item.name"
                      >
                      </el-option>
                    </el-select>
                    <!-- <multiselect
                      v-model="selectedRiskImpactLevel"
                      v-validate="'required'"
                      placeholder="Impact Level"
                      :options="getRiskImpactLevelNames"
                      track-by="value"
                      label="name"
                      :searchable="false"
                      deselect-label=""
                      :disabled="!_isallowed('write')"
                      :allow-empty="false"
                      :class="{ error: errors.has('Impact Level') }"
                      data-cy="impact_level"
                    >
                      <template slot="singleLabel" slot-scope="{ option }">
                        <div class="d-flex">
                          <span class="select__tag-name">{{
                            option.name
                          }}</span>
                        </div>
                      </template>
                    </multiselect> -->
                    <div
                      v-show="errors.has('Impact Level')"
                      class="text-danger"
                      data-cy="impact_level_error"
                    >
                      {{ errors.first("Impact Level") }}
                    </div>
                  </div>

                  <!-- COLUMN FOR TEXT FIELD            -->
                </div>

                <div class="col-md-6 pl-1 pr-3">
                  <div class="form-group mx-1 mb-0">
                    <label class="font-sm"
                      >Probability Description
                      <span style="color: #dc3545">*</span></label
                    >
                    <textarea
                      v-validate="'required'"
                      class="form-control"
                      placeholder="Risk Probability description"
                      v-model="DV_risk.probabilityDescription"
                      rows="2"
                      :readonly="!_isallowed('write')"
                      data-cy="probability_description"
                      name="Probability Description"
                      :class="{
                        'form-control': true,
                        error: errors.has('Probability Description'),
                      }"
                    />
                    <div
                      v-show="errors.has('Probability Description')"
                      class="text-danger"
                      data-cy="probability_description_error"
                    >
                      {{ errors.first("Probability Description") }}
                    </div>
                  </div>
                  <div class="form-group mx-1">
                    <label class="font-sm mb-0"
                      >Impact Description
                      <span style="color: #dc3545">*</span></label
                    >
                    <textarea
                      v-validate="'required'"
                      class="form-control"
                      placeholder="Risk impact description"
                      v-model="DV_risk.impactDescription"
                      rows="2"
                      :readonly="!_isallowed('write')"
                      data-cy="impact_description"
                      name="Impact Description"
                      :class="{
                        'form-control': true,
                        error: errors.has('Impact Description'),
                      }"
                    />
                    <div
                      v-show="errors.has('Impact Description')"
                      class="text-danger"
                      data-cy="impact_description_error"
                    >
                      {{ errors.first("Impact Description") }}
                    </div>
                  </div>
                </div>
                <!-- ROW ENDS -->
              </div>

              <!-- CONTAINER ENDS -->
            </div>

            <div class="container mx-2 my-0 justify-content-center text-center">
              <el-collapse accordion class="risk_matrix">
                <el-collapse-item
                  title="Click to see Priority Level Risk Matrix"
                  name="1"
                >
                  <div>
                    <!-- Risk Matrix begins here -->
                    <div class="container my-2 px-2">
                      <!-- This first row is not a true row...Just a transformed vertical div header -->
                      <div class="row">
                        <div style="position: relative">
                          <div class="vertical-head risk-matrix-header">
                            <h6>PROBABILITY</h6>
                          </div>
                        </div>
                        <div class="col">
                          <div class="row">
                            <div class="col">
                              <h4 class="mb-3">
                                Risk Matrix for:
                                <span id="riskName">{{ DV_risk.text }}</span>
                              </h4>
                            </div>
                            <!-- <div class="col text-right"><h4 class="mb-3">Risk Priority Level: <span id="riskName">{{DV_risk.priorityLevel}}</span></h4>
                    </div> -->
                          </div>

                          <div class="row">
                            <div class="col text-center">
                              <h6 class="mb-1">IMPACT</h6>
                            </div>
                          </div>
                          <!-- Risk Matrix first row, Category headers -->

                          <div class="container mb-2 mt-0 risk-matrix">
                            <div class="row">
                              <div class="col-md-2 p-2 gray text-center"></div>
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Negligible <br />1
                              </div>
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Minor <br />2
                              </div>
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Moderate<br />
                                3
                              </div>
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Major<br />
                                4
                              </div>
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Catastrophic<br />
                                5
                              </div>
                            </div>

                            <!-- Risk Matrix 2nd row (first color row) -->
                            <div class="row">
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Almost<br />Certain<br />
                                5
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix15 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                5
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix25 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                10
                              </div>
                              <div
                                class="col-md-2 red p-2 text-center"
                                :class="[matrix35 == true ? 'reg-opacity' : '']"
                              >
                                Extreme <br />15
                              </div>
                              <div
                                class="col-md-2 red p-2 text-center"
                                :class="[matrix45 == true ? 'reg-opacity' : '']"
                              >
                                Extreme<br />
                                20
                              </div>
                              <div
                                class="col-md-2 red p-2 text-center"
                                :class="[matrix55 == true ? 'reg-opacity' : '']"
                              >
                                Extreme<br />
                                25
                              </div>
                            </div>

                            <!-- Risk Matrix 3rd row -->
                            <div class="row">
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Likely<br />
                                4
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix14 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                4
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix24 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                8
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix34 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                12
                              </div>
                              <div
                                class="col-md-2 red p-2 text-center"
                                :class="[matrix44 == true ? 'reg-opacity' : '']"
                              >
                                Extreme<br />
                                16
                              </div>
                              <div
                                class="col-md-2 red p-2 text-center"
                                :class="[matrix54 == true ? 'reg-opacity' : '']"
                              >
                                Extreme<br />
                                20
                              </div>
                            </div>

                            <!-- Risk Matrix 4th row -->
                            <div class="row">
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Possible<br />
                                3
                              </div>
                              <div
                                class="col-md-2 green p-2 text-center"
                                :class="[matrix13 == true ? 'reg-opacity' : '']"
                              >
                                Low<br />
                                3
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix23 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                6
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix33 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                9
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix43 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                12
                              </div>
                              <div
                                class="col-md-2 red p-2 text-center"
                                :class="[matrix53 == true ? 'reg-opacity' : '']"
                              >
                                Extreme<br />
                                15
                              </div>
                            </div>

                            <!-- Risk Matrix 5th row -->
                            <div class="row">
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Unlikely<br />
                                2
                              </div>
                              <div
                                class="col-md-2 green p-2 text-center"
                                :class="[matrix12 == true ? 'reg-opacity' : '']"
                              >
                                Low<br />
                                2
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix22 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                4
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix32 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                6
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix42 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                8
                              </div>
                              <div
                                class="col-md-2 orange p-2 text-center"
                                :class="[matrix52 == true ? 'reg-opacity' : '']"
                              >
                                High<br />
                                10
                              </div>
                            </div>

                            <!-- Risk Matrix 6th row (last row) -->
                            <div class="row">
                              <div
                                class="col-md-2 gray p-2 text-center text-truncate"
                              >
                                Rare<br />
                                1
                              </div>
                              <div
                                class="col-md-2 gray3 p-2 text-center"
                                :class="[matrix11 == true ? 'reg-opacity' : '']"
                              >
                                Very Low<br />
                                1
                              </div>
                              <div
                                class="col-md-2 green p-2 text-center"
                                :class="[matrix21 == true ? 'reg-opacity' : '']"
                              >
                                Low<br />
                                2
                              </div>
                              <div
                                class="col-md-2 green p-2 text-center"
                                :class="[matrix31 == true ? 'reg-opacity' : '']"
                              >
                                Low<br />
                                3
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix41 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                4
                              </div>
                              <div
                                class="col-md-2 yellow p-2 text-center"
                                :class="[matrix51 == true ? 'reg-opacity' : '']"
                              >
                                Moderate<br />
                                5
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Risk Matrix Container ends at this top div  -->
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>

            <div class="row form-group mx-4 mb-0">
              <div class="col-md-12 px-0 simple-select form-group">
                <label class="font-sm"
                  >Risk Approach <span style="color: #dc3545">*</span></label
                >
                <el-select
                  v-model="DV_risk.riskApproach"
                  class="w-100 upperCase"
                  track-by="name"
                  v-validate="'required'"
                  placeholder="Risk Approach"
                  :disabled="!_isallowed('write') || this.DV_risk.approved"
                  :class="{ error: errors.has('Risk Approach') }"
                  data-cy="risk_approach"
                >
                  <el-option
                    v-for="item in riskApproaches"
                    :value="item"
                    :key="item.id"
                    class="upperCase"
                    :label="item"
                  >
                  </el-option>
                </el-select>
                <!-- <multiselect
                  v-model="DV_risk.riskApproach"
                  v-validate="'required'"
                  :allow-empty="false"
                  placeholder="Risk Approach"
                  :options="riskApproaches"
                  :searchable="false"
                  select-label="Select"
                  :disabled="!_isallowed('write') || this.DV_risk.approved"
                  :class="{ error: errors.has('Risk Approach') }"
                  data-cy="risk_approach"
                >
                  <template slot="singleLabel" slot-scope="{ option }">
                    <div class="d-flex">
                      <span class="select__tag-name upperCase">{{
                        option
                      }}</span>
                    </div>
                  </template>
                </multiselect> -->
                <div
                  v-show="errors.has('Risk Approach')"
                  class="text-danger"
                  data-cy="risk_approach_error"
                >
                  {{ errors.first("Risk Approach") }}
                </div>
              </div>
            </div>

            <div class="row form-group mx-4 mb-0">
              <div class="col-md-12 px-0 simple-select form-group">
                <label class="font-sm"
                  >Risk Approach Description
                  <span style="color: #dc3545">*</span></label
                >
                <textarea
                  v-validate="'required'"
                  class="form-control"
                  placeholder="Describe how the Risk will be controlled"
                  v-model="DV_risk.riskApproachDescription"
                  rows="2"
                  :readonly="!_isallowed('write')"
                  data-cy="approach_description"
                  name="Risk Approach Description"
                  :class="{
                    'form-control': true,
                    error: errors.has('Risk Approach Description'),
                  }"
                />
                <div
                  v-show="errors.has('Risk Approach Description')"
                  class="text-danger"
                  data-cy="approach_description_error"
                >
                  {{ errors.first("Risk Approach Description") }}
                </div>
              </div>
            </div>

            <div class="row mx-4 mb-0">
              <div class="col-md-12 font-sm pt-3 pl-0">
                <span style="font-weight: 600">Note:</span> Risk Approach and
                Risk Approach Description must be populated before the Risk
                Approach can be approved.
              </div>
            </div>

            <div
              class="row form-group pl-2 mx-4 mb-0"
              style="background-color: #fafafa; border: solid 1px #ededed"
            >
              <div class="form-group col-md-3 py-2 mb-0 px-0 user-select w-100">
                <label class="font-sm mb-0">Risk Approach Approver</label>
                <el-select
                  v-model="riskApprover"
                  class="w-100"
                  track-by="id"
                  value-key="id"
                  filterable
                  placeholder="Select Risk Approver"
                  :disabled="this.DV_risk.approved"
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

              <!-- <div v-if="this.DV_risk.text"> -->
              <div
                v-if="riskApprover && riskApprover !== null"
                class="col-md-4 pl-0 py-2 mb-0 text-center"
              >
                <div
                  v-if="
                    this.DV_risk.riskApprover ||
                      this.DV_risk.riskApprover !== null
                  "
                >
                  <label class="font-sm mb-0">Risk Approach Approved</label>
                  <span
                    v-if="
                      this.$currentUser.full_name ==
                        this.DV_risk.riskApprover[0].name
                    "
                    class="d-block approver-pointer"
                    @click.prevent="toggleApproved"
                  >
                    <span
                      v-show="DV_risk.approved"
                      class="check_box mx-1 approver-pointer"
                      ><i class="far fa-check-square"></i
                    ></span>
                    <span
                      v-show="!DV_risk.approved"
                      class="empty_box mr-1 approver-pointer"
                      ><i class="far fa-square"></i
                    ></span>
                    <small style="vertical-align: text-top">Approved</small>
                  </span>
                </div>
              </div>
              <div v-else class="col-md-4 pl-0 py-2 mb-0 text-center">
                <label class="font-sm mb-0">Risk Approach Approved</label>
                <span class="d-block approver-pointer">
                  <span class="empty_box mr-1 approver-pointer"
                    ><i class="far fa-square"></i
                  ></span>
                  <small style="vertical-align: text-top">Approved</small>
                </span>
              </div>

              <!-- <div v-if="this.DV_risk.text" class="col-md-4 pl-0 py-2 mb-0 text-center">
            <label class="font-sm mb-0">Risk Approach Approved:</label>
              <span class="d-block approver-pointer" >
                  <span class="empty_box mr-1 approver-pointer"><i class="far fa-square"></i></span>
                  <small style="vertical-align:text-top">Approved</small>
              </span>
          </div>    -->

              <!-- Users listed here for debugging Risk Approval Section.  Delete if no longer needed
           Current User:  {{this.$currentUser.full_name  }} <br>

              Risk Aprrover Array (before saving to db)  {{ riskApprover.fullName }}
              Risk Aprrover Name (after saving to db)  {{this.DV_risk.riskApprover[0].name }}
             -->

              <div
                class="col-md-5 pr-2 py-2 mb-0 simple-select form-group ml-0"
              >
                <label class="font-sm mb-0"
                  >Date/Time Risk Approach Approved:</label
                >
                <!-- <span v-if="riskApprover.length > 0"> -->
                <textarea
                  class="form-control"
                  v-model="DV_risk.approvalTime"
                  rows="1"
                  :readonly="!_isallowed('write')"
                  data-cy="approach_description"
                  name="Approval Time"
                  disabled
                />
                <!-- </span>    -->
                <span v-if="this.DV_risk.text">
                  <button
                    v-if="isMapView"
                    class="btn clearBtn mr-2 font-sm btn-sm btn-warning"
                    v-tooltip="`Clear Risk Approval`"
                    @click.prevent="resetApprovalSection"
                  >
                    <i class="fas fa-redo"></i>
                  </button>
                  <button
                    v-else
                    class="btn clearBtn py-0 mr-1 font-sm btn-sm btn-warning"
                    v-tooltip="`Clear Risk Approval`"
                    v-on:click.prevent="resetApprovalSection"
                  >
                    <i class="fas fa-redo pr-1"></i>RISK APPROVAL SECTION
                  </button>
                </span>
              </div>
            </div>

            <small v-if="!this.DV_risk.text" class="pl-4 text-danger">
              Risk form and Risk Approach Approver must first be saved in order
              to submit for approval
            </small>
          </div>
          <!-- END RISK PRIORITIZE TAB SECTION -->

          <!-- BEGIN RISK CONTROL TAB SECTION -->
          <div v-show="currentTab == 'tab4'" class="paperLookTab">
            <div class="form-group pt-2 mb-3 ml-4 mr-5">
              <label class="font-sm mb-0 mr-3">Progress (in %)</label>
              <span class="ml-3">
                <label class="font-sm mb-0 d-inline-flex align-items-center">
                  <input
                    type="checkbox"
                    v-model="DV_risk.autoCalculate"
                    :disabled="!_isallowed('write')"
                    :readonly="!_isallowed('write')"
                  />
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

            <div class="form-group mt-2 mx-4">
              <label class="font-sm">Checklists</label>
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
                  @change="(e) => handleEnd(e, DV_risk.checklists)"
                  :list="DV_risk.checklists"
                  :animation="100"
                  ghost-class="ghost-card"
                  class="drag"
                >
                  <div
                    v-for="(check, index) in DV_risk.checklists"
                    class="d-flex w-100 mb-3 drag-item"
                    v-if="!check._destroy && isMyCheck(check)"
                    :key="index"
                  >
                    <div
                      class="form-control h-100 check-items pb-0"
                      style="background-color: #fafafa; position: relative"
                    >
                      <div class="row" style="width: 97%">
                        <div class="col-8 justify-content-start">
                          <input
                            type="checkbox"
                            name="check"
                            :checked="check.checked"
                            @change="updateCheckItem($event, 'check', index)"
                            :key="`check_${index}`"
                            :disabled="
                              !_isallowed('write') || !check.text.trim()
                            "
                          />
                          <input
                            :value="check.text"
                            name="text"
                            @input="updateCheckItem($event, 'text', index)"
                            :key="`text_${index}`"
                            placeholder="Checkpoint name here"
                            type="text"
                            class="checklist-text pl-1"
                            :readonly="!_isallowed('write')"
                          />
                        </div>
                        <div
                          v-if="isSheetsView || isKanbanView"
                          class="col-1 pl-0 pr-0"
                        >
                          <span class="font-sm dueDate">Due Date:</span>
                        </div>
                        <div
                          v-if="isSheetsView || isKanbanView"
                          class="col-3 pl-0"
                          style="margin-left: -25px"
                        >
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

                      <!-- Collpase section begins here -->
                      <el-collapse
                        id="roll_up"
                        style="background-color: #fafafa"
                      >
                        <el-collapse-item
                          title="Details"
                          name="1"
                          style="background-color: #fafafa"
                        >
                          <div
                            v-if="isMapView"
                            class="row justify-content-end pt-2 pb-5"
                            style="
                              background-color: #fafafa;
                              position: relative;
                            "
                          >
                            <div
                              class="d-flex col mb-0"
                              style="position: absolute"
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
                            style="background-color: #fafafa; position: inherit"
                          >
                            <div
                              class="simple-select d-flex form-group col mb-0"
                              style="position: absolute"
                            >
                              <div
                                class="d-flex w-100"
                                style="padding-left: 6.1rem"
                              >
                                <span class="font-sm pt-2 pr-2 m"
                                  >Assigned To:</span
                                >
                                 <el-select 
                                  v-model="check.user" 
                                  class="w-75"   
                                  clearable        
                                  track-by="id"    
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
                            <!-- <div class="simple-select form-group col mb-0">

              </div> -->
                          </div>

                          <!-- Start Checkbox Progress List -->
                          <!-- Create component to manage progress list -->
                          <div
                            class="pt-5 pb-3"
                            style="background-color: #fafafa"
                          >
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
                              style="width: 100%"
                              class="mt-1"
                            >
                              <thead>
                                <tr>
                                  <th style="width: 60%">Progress</th>
                                  <th>Last Updated</th>
                                  <th>By</th>
                                  <th>Action</th>
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
                                        :class="{
                                          'red-border': !progress.user,
                                        }"
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
                                  <td>
                                    <span
                                      class="pl-2"
                                      v-tooltip="`Save`"
                                      v-if="!progress.user"
                                      @click.prevent="validateThenSave"
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

            <div class="mx-4">
              <div class="input-group mb-2">
                <div
                  v-for="file in filteredFiles"
                  class="d-flex mb-2 w-100"
                  v-if="file.id"
                >
                  <div class="input-group-prepend">
                    <div
                      class="input-group-text clickable"
                      :class="{ 'btn-disabled': !file.uri }"
                      @click.prevent="downloadFile(file)"
                    >
                      <i class="fas fa-file-image"></i>
                    </div>
                  </div>
                  <input
                    readonly
                    type="text"
                    class="form-control form-control-sm mw-95"
                    :value="file.name || file.uri"
                    v-if="!file.link"
                  />
                  <a :href="file.uri" target="_blank" v-if="file.link">
                    {{ file.uri }}
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
            <div ref="addCheckItem" class="pt-0 mt-0"></div>
            

            <div v-if="_isallowed('write')" class="form-group mx-4">
               <hr class="my-4" />
              <label class="font-sm">Files</label>
              <span
                class="ml-2 clickable"
                v-if="_isallowed('write')"
                @click.prevent="addFilesInput"
              >
                <i class="fas fa-plus-circle"></i>
              </span>

              <div class="mx-4">
                <div class="input-group pt-3 mb-2">
                  <div
                    v-for="(file, index) in DV_risk.riskFiles"
                    :key="index"
                    class="d-flex mb-2 w-100"
                    v-if="!file.id && file.link"
                  >
                    <div class="input-group-prepend">
                      <div
                        class="input-group-text clickable"
                        :class="{ 'btn-disabled': !file.uri }"
                        @click.prevent="downloadFile(file)"
                      >
                        <i class="fas fa-file-image"></i>
                      </div>
                    </div>
                    <input
                      type="text"
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
                </div>
              </div>

              <attachment-input
                @input="addFile"
                :show-label="true"
              ></attachment-input>
            </div>

            <div class="w-100 d-flex mb-0 form-group">
              <div class="form-group user-select w-100 mb-0 ml-4">
                <label class="font-sm mb-0">Related Issues</label>

                <el-select
                  v-model="relatedIssues"
                  class="w-100"
                  track-by="id"
                  value-key="id"
                  filterable
                  multiple
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

              <div class="form-group user-select w-100 mb-0 mx-2">
                <label class="font-sm mb-0">Related Tasks</label>
                <el-select
                  v-model="relatedTasks"
                  class="w-100"
                  track-by="id"
                  value-key="id"
                  filterable
                  multiple
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

              <div class="form-group user-select w-100 mb-0 mr-4">
                <label class="font-sm mb-0">Related Risks</label>
                <el-select
                  v-model="relatedRisks"
                  class="w-100"
                  track-by="id"
                  value-key="id"
                  filterable
                  multiple
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
            </div>

            <div class="form-group mx-4 paginated-updates">
              <hr class="my-4" />
              <label class="font-sm mb-2">Updates</label>
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

          <!-- END RISK CONTROL SECTION TAB -->

          <!-- BEGIN RISK DISPOSITION SECTION TAB -->
          <div
            v-show="currentTab == 'tab5'"
            style="min-height: 300px"
            class="paperLookTab"
          >
            <div class="form-group mx-4">
              <label class="font-sm mb-0"><h5>Disposition</h5></label><br />
              <textarea
                class="form-control"
                placeholder="Coming Soon:  The ability to capture and perform Disposition activities will be included in the February 12th release."
                rows="4"
              >
              </textarea>
            </div>
          </div>
          <!-- END RISK DISPOSITION SECTION TAB -->
        </div>
      </div>
      <!-- TABBED OUT SECTION END HERE -->
      <div ref="addUpdates" class="pt-0 mt-0 mb-4"></div>
      <div></div>
    </form>
    <div
      v-if="loading"
      class="load-spinner spinner-border text-dark"
      role="status"
    ></div>
  </div>
</template>

<script>
import axios from "axios";
import humps from "humps";
import Draggable from "vuedraggable";
import FormTabs from "./../../shared/FormTabs";
import * as Moment from "moment";
import { mapGetters, mapMutations, mapActions } from "vuex";
import AttachmentInput from "./../../shared/attachment_input";
export default {
  name: "RiskForm",
  props: ["facility", "risk", "fixedStage"],
  components: {
    AttachmentInput,
    FormTabs,
    Draggable,
  },

  data() {
    return {
      DV_risk: this.INITIAL_RISK_STATE(),
      DV_facility: Object.assign({}, this.facility),
      paginate: ["filteredNotes"],
      now: new Date().toLocaleString(),
      destroyedFiles: [],
      responsibleUsers: null,
      riskApprover: null,
      accountableRiskUsers: null,
      consultedRiskUsers: [],
      informedRiskUsers: [],
      probability: [],
      selectedRiskPossibility: { id: 1, value: 1, name: "1 - Rare" },
      selectedRiskImpactLevel: { id: 1, value: 1, name: "1 - Negligible" },
      selectedTaskType: null,
      selectedRiskStage: null,
      relatedIssues: [],
      editToggle: false,
      relatedTasks: [],
      relatedRisks: [],
      showErrors: false,
      loading: true,
      movingSlot: "",
      currentTab: "risk",
      tabs: [
        {
          label: "Identify",
          key: "risk",
          closable: false,
          form_fields: [
            "Risk Name",
            "Risk Description",
            "Category",
            "Identified Date",
            "Risk Approach Due Date",
          ],
        },
        {
          label: "Assign",
          key: "tab2",
          closable: false,
        },
        {
          label: "Prioritize",
          key: "tab3",
          closable: false,
          form_fields: [
            "Probability",
            "Probability Description",
            "Impact Level",
            "Impact Description",
            "Risk Approach",
            "Risk Approach Description",
          ],
        },
        {
          label: "Control",
          key: "tab4",
          closable: false,
        },

        {
          label: "Disposition",
          key: "tab5",
          closable: false,
          disabled: true,
        },
      ],
    };
  },
  mounted() {
    if (!_.isEmpty(this.risk)) {
      this.loadRisk(this.risk);
    } else {
      this.loading = false;
      this.loadRisk(this.DV_risk);
    }
    if (this.fixedStage) {
      this.selectedRiskStage = this.riskStages.find(
        (t) => t.id === this.fixedStage
      );
    }
  },
  beforeDestroy() {
    this.SET_RISK_FORM_OPEN(false)
    this.SET_SELECTED_RISK({})
  },
  methods: {
    ...mapMutations([
      "setRiskForManager",
      "setRiskProbabilityOptions",
      "setRiskImpactLevelOptions",
      "updateRisksHash",
      "SET_RISK_FORM_OPEN",
      "SET_SELECTED_RISK"
    ]),
    ...mapActions([
      "riskDeleted",
      "riskUpdated",
      "updateWatchedRisks",
      "updateApprovedRisks",
    ]),
    INITIAL_RISK_STATE() {
      return {
        text: "",
        facilityProjectId: this.facility.id,
        text: "",
        riskDescription: "",
        impactDescription: "",
        probabilityDescription: "",
        riskApproach: "avoid",
        approvalTime: "",
        riskApproachDescription: "",
        riskTypeId: "",
        me: "",
        riskStageId: "",
        probability: 1,
        impactLevel: 1,
        probabilityName: "1 - Rare",
        impactLevelName: "1 - Negligible",
        progress: 0,
        startDate: "",
        getRiskImpactLevelNames: "1 - Negligible",
        dueDate: "",
        autoCalculate: true,
        riskApproverUserIds: [],
        responsibleUserIds: [],
        accountableUserIds: [],
        consultedUserIds: [],
        informedUserIds: [],
        riskFiles: [],
        subTaskIds: [],
        subIssueIds: [],
        subRiskIds: [],
        checklists: [],
        notes: [],
      };
    },
    scrollToChecklist() {
      this.$refs.addCheckItem.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
      this.DV_risk.checklists.push({ text: "", checked: false });
    },
    scrollToUpdates() {
      this.$refs.addUpdates.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      this.DV_risk.notes.unshift({ body: "", user_id: "", guid: this.guid() });
    },
    scrollToRiskMatrix() {
      this.$refs.riskMatrix.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    },
    handleMove(item) {
      this.movingSlot = item.relatedContext.component.$vnode.key;
      return true;
    },
    handleEnd(e, checklists) {
      let cc = this.DV_risk.checklists;
      let count = 0;
      for (let checklist of cc) {
        checklist.position = count;
        count++;
      }
    },
    onChangeTab(tab) {
      this.currentTab = tab ? tab.key : "risk";
    },
    loadRisk(risk) {
      this.DV_risk = { ...this.DV_risk, ..._.cloneDeep(risk) };
      this.responsibleUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_risk.responsibleUserIds.includes(u.id)
      )[0];
      this.accountableRiskUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_risk.accountableUserIds.includes(u.id)
      )[0];
      this.consultedRiskUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_risk.consultedUserIds.includes(u.id)
      );
      this.informedRiskUsers = _.filter(this.activeProjectUsers, (u) =>
        this.DV_risk.informedUserIds.includes(u.id)
      );
      this.riskApprover = _.filter(this.activeProjectUsers, (u) =>
        this.DV_risk.riskApproverUserIds.includes(u.id)
      )[0];
      this.relatedIssues = _.filter(this.currentIssues, (u) =>
        this.DV_risk.subIssueIds.includes(u.id)
      );
      this.relatedTasks = _.filter(this.currentTasks, (u) =>
        this.DV_risk.subTaskIds.includes(u.id)
      );
      this.relatedRisks = _.filter(this.currentRisks, (u) =>
        this.DV_risk.subRiskIds.includes(u.id)
      );
      this.selectedTaskType = this.taskTypes.find(
        (t) => t.id === this.DV_risk.taskTypeId
      );
      this.selectedRiskStage = this.riskStages.find(
        (t) => t.id === this.DV_risk.riskStageId
      );
      this.selectedRiskPossibility = this.getRiskProbabilityNames.find(
        (t) => t.id === this.DV_risk.probability
      );
      this.selectedRiskImpactLevel = this.getRiskImpactLevelNames.find(
        (t) => t.id === this.DV_risk.impactLevel
      );
      if (this.DV_risk.attachFiles) this.addFile(this.DV_risk.attachFiles, false);
      this.$nextTick(() => {
        this.errors.clear();
        this.$validator.reset();
        this.loading = false;
      });
    },
    addFile(files = [], append = true) {
      let _files = append ? [...this.DV_risk.riskFiles] : [];
      for (let file of files) {
        file.guid = this.guid();
        _files.push(file);
      }
      this.DV_risk.riskFiles = _files;
    },
    deleteRisk() {
      let confirm = window.confirm(
        `Are you sure you want to delete this risk?`
      );
      if (!confirm) {
        return;
      }
      this.riskDeleted(this.DV_risk);
      this.cancelRiskSave();
    },
    deleteFile(file) {
      if (!file) return;
      let confirm = window.confirm(
        `Are you sure you want to delete attachment?`
      );
      if (!confirm) return;
      if (file.uri || file.link) {
        let index = this.DV_risk.riskFiles.findIndex(
          (f) => f.guid === file.guid
        );
        if(file.id){
          Vue.set(this.DV_risk.riskFiles, index, {...file, _destroy: true})
          this.destroyedFiles.push(file)            
        }
        this.DV_risk.riskFiles.splice(this.DV_risk.riskFiles.findIndex(f => f.guid === file.guid), 1)

      } else if (file.name) {
        this.DV_risk.riskFiles.splice(
          this.DV_risk.riskFiles.findIndex((f) => f.guid === file.guid),
          1
        );
      }
    },
    toggleWatched() {
      if (this.DV_risk.watched) {
        let confirm = window.confirm(
          `Are you sure, you want to remove this risk from on-watch?`
        );
        if (!confirm) {
          return;
        }
      }
      this.DV_risk = { ...this.DV_risk, watched: !this.DV_risk.watched };
      this.updateWatchedRisks(this.DV_risk);
    },
    toggleApproved() {
      this.DV_risk = { ...this.DV_risk, approved: !this.DV_risk.approved };
      this.updateApprovedRisks(this.DV_risk);
      this.DV_risk.approvalTime = new Date().toLocaleString();
      if (!this.DV_risk.approved) {
        this.DV_risk.approvalTime = "";
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
    resetApprovalSection() {
      if (this.DV_risk.approved) {
        this.DV_risk.approved = !this.DV_risk.approved;
      }
      // this.DV_risk = {...this.DV_risk, approved: this.DV_risk.approved}
      if (!this.DV_risk.approved) {
        !this.DV_risk.approved;
      }
      this.updateApprovedRisks(this.DV_risk);
      this.DV_risk.approvalTime = " ";
      if (this.riskApprover.length > 0) {
        this.riskApprover = [];
        this.validateThenSave();
      }
      if (this.DV_risk.riskApprover.length > 0) {
        this.DV_risk.riskApprover = [];
        this.validateThenSave();
      }
      // this.validateThenSave
    },
    notApprover() {
      alert(
        "Sorry.  Only Risk Approach Approver is authorized to check this box."
      );
    },
    cancelRiskSave() {
      this.$emit("on-close-form");
      this.setRiskForManager({ key: "risk", value: null });
      this.SET_RISK_FORM_OPEN(false);
    },
    validateThenSave(e) {
      e.preventDefault();
      this.$validator.validate().then((success) => {
        if (!success || this.loading) {
          this.showErrors = !success;
          return;
        }
        this.editToggle = !this.editToggle;
        this.loading = true;
        let formData = new FormData();
        formData.append("risk[text]", this.DV_risk.text);
        formData.append("risk[risk_description]", this.DV_risk.riskDescription);
        formData.append(
          "risk[impact_description]",
          this.DV_risk.impactDescription
        );
        formData.append(
          "risk[probability_description]",
          this.DV_risk.probabilityDescription
        );
        formData.append(
          "risk[probability_name]",
          this.selectedRiskPossibility.name
        );
        formData.append("risk[probability]", this.selectedRiskPossibility.id);
        formData.append(
          "risk[impact_level_name]",
          this.selectedRiskImpactLevel.name
        );
        formData.append("risk[impact_level]", this.selectedRiskImpactLevel.id);
        formData.append("risk[risk_approach]", this.DV_risk.riskApproach);
        formData.append(
          "risk[risk_approach_description]",
          this.DV_risk.riskApproachDescription
        );
        formData.append("risk[approval_time]", this.DV_risk.approvalTime);
        formData.append("risk[task_type_id]", this.DV_risk.taskTypeId);
        formData.append("risk[risk_stage_id]", this.DV_risk.riskStageId);
        formData.append("risk[progress]", this.DV_risk.progress);
        formData.append("risk[start_date]", this.DV_risk.startDate);
        formData.append("risk[due_date]", this.DV_risk.dueDate);
        formData.append("risk[auto_calculate]", this.DV_risk.autoCalculate);
        formData.append(
          "risk[destroy_file_ids]",
          _.map(this.destroyedFiles, "id")
        );
        // Responsible User id
        if (this.DV_risk.responsibleUserIds && this.DV_risk.responsibleUserIds.length) {
          for (let u_id of this.DV_risk.responsibleUserIds) {
            formData.append("responsible_user_ids[]", u_id);
          }
        } else {
          formData.append("responsible_user_ids[]", []);
        }
        // Accountable UserId
        if (this.DV_risk.accountableUserIds && this.DV_risk.accountableUserIds.length) {
          for (let u_id of this.DV_risk.accountableUserIds) {
            formData.append("accountable_user_ids[]", u_id);
          }
        } else {
          formData.append("accountable_user_ids[]", []);
        }
        // Consulted UserId

        if (this.DV_risk.consultedUserIds.length) {
          for (let u_id of this.DV_risk.consultedUserIds) {
            formData.append("consulted_user_ids[]", u_id);
          }
        } else {
          formData.append("consulted_user_ids[]", []);
        }
        // Informed UserId

        if (this.DV_risk.informedUserIds.length) {
          for (let u_id of this.DV_risk.informedUserIds) {
            formData.append("informed_user_ids[]", u_id);
          }
        } else {
          formData.append("informed_user_ids[]", []);
        }
        // Risk Approver User id
        if (this.DV_risk.riskApproverUserIds.length) {
          for (let u_id of this.DV_risk.riskApproverUserIds) {
            formData.append("risk_approver_user_ids[]", u_id);
          }
        } else {
          formData.append("risk_approver_user_ids[]", []);
        }

        if (this.DV_risk.subTaskIds.length) {
          for (let u_id of this.DV_risk.subTaskIds) {
            formData.append("risk[sub_task_ids][]", u_id);
          }
        } else {
          formData.append("risk[sub_task_ids][]", []);
        }
        if (this.DV_risk.subIssueIds.length) {
          for (let u_id of this.DV_risk.subIssueIds) {
            formData.append("risk[sub_issue_ids][]", u_id);
          }
        } else {
          formData.append("risk[sub_issue_ids][]", []);
        }
        if (this.DV_risk.subRiskIds.length) {
          for (let u_id of this.DV_risk.subRiskIds) {
            formData.append("risk[sub_risk_ids][]", u_id);
          }
        } else {
          formData.append("risk[sub_risk_ids][]", []);
        }
        for (let i in this.DV_risk.checklists) {
          let check = this.DV_risk.checklists[i];
          if (!check.text && !check._destroy) continue;
          for (let key in check) {
            if (key === "user") key = "user_id";
            let value =
              key == "user_id"
                ? check.user
                  ? check.user.id
                  : null
                : check[key];
            // if (key === "dueDate") key = "due_date"

            key = humps.decamelize(key);
            if (["created_at", "updated_at", "progress_lists"].includes(key))
              continue;
            formData.append(`risk[checklists_attributes][${i}][${key}]`, value);

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
                  `risk[checklists_attributes][${i}][progress_lists_attributes][${pi}][${pkey}]`,
                  pvalue
                );
              }
            }
          }
        }

        for (let i in this.DV_risk.notes) {
          let note = this.DV_risk.notes[i];
          if (!note.body && !note._destroy) continue;
          for (let key in note) {
            let value =
              key == "user_id"
                ? note.user_id
                  ? note.user_id
                  : this.$currentUser.id
                : note[key];
            formData.append(`risk[notes_attributes][${i}][${key}]`, value);
          }
        }
        for (let file of this.DV_risk.riskFiles) {
          if (file.id) continue;
          if (!file.link) {
            formData.append("risk[risk_files][]", file);
          } else if (file.link) {
            formData.append("file_links[]", file.name);
          }
        }

        let url = `/projects/${this.currentProject.id}/facilities/${this.facility.id}/risks.json`;
        let method = "POST";
        let callback = "risk-created";
        if (this.risk && this.risk.id) {
          url = `/projects/${this.currentProject.id}/facilities/${this.risk.facilityId}/risks/${this.risk.id}.json`;
          method = "PUT";
          callback = "risk-updated";
        }
        // var beforeRisk = this.risk
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
            var responseRisk = humps.camelizeKeys(response.data.risk);
            this.loadRisk(responseRisk);
            //this.$emit(callback, responseRisk);
            this.updateRisksHash({ risk: responseRisk });
            if (response.status === 200) {
              this.$message({
                message: `${response.data.risk.text} was saved successfully.`,
                type: "success",
                showClose: true,
              });
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
    addFilesInput() {
      this.DV_risk.riskFiles.push({ name: "", uri: "", link: true, guid: this.guid() });
    },
    addProgressList(check) {
      var postion = check.progressLists.length;
      check.progressLists.push({ body: "", position: postion });
      this.editToggle = true;
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
      this.validateThenSave();
    },
    downloadFile(file) {
      let url = window.location.origin + file.uri;
      window.open(url, "_blank");
    },
    disabledDueDate(date) {
      date.setHours(0, 0, 0, 0);
      const startDate = new Date(this.DV_risk.startDate);
      startDate.setHours(0, 0, 0, 0);
      return date < startDate;
    },
    destroyNote(note) {
      let confirm = window.confirm(
        `Are you sure you want to delete this update note?`
      );
      if (!confirm) return;
      let i = note.id
        ? this.DV_risk.notes.findIndex((n) => n.id === note.id)
        : this.DV_risk.notes.findIndex((n) => n.guid === note.guid);
      Vue.set(this.DV_risk.notes, i, { ...note, _destroy: true });
    },
    addChecks() {
      var postion = this.DV_risk.checklists.length;
      this.DV_risk.checklists.push({
        text: "",
        checked: false,
        position: postion,
        progressLists: [],
      });
    },
    noteBy(note) {
      return note.user
        ? `${note.user.fullName} at ${new Date(
            note.createdAt
          ).toLocaleString()}`
        : `${this.$currentUser.full_name} at (Now)`;
    },
    addNote() {
      this.DV_risk.notes.unshift({ body: "", user_id: "", guid: this.guid() });
    },
    destroyCheck(check, index) {
      let confirm = window.confirm(
        `Are you sure, you want to delete this checklist item?`
      );
      if (!confirm) return;
      let i = check.id
        ? this.DV_risk.checklists.findIndex((c) => c.id === check.id)
        : index;
      Vue.set(this.DV_risk.checklists, i, { ...check, _destroy: true });
      this.validateThenSave();
    },
    calculateProgress(checks = null) {
      try {
        if (!checks) checks = this.DV_risk.checklists;
        let checked = _.filter(
          checks,
          (v) => !v._destroy && v.checked && v.text.trim()
        ).length;
        let total = _.filter(checks, (v) => !v._destroy && v.text.trim())
          .length;
        this.DV_risk.progress = Number(
          ((checked / total) * 100 || 0).toFixed(2)
        );
      } catch (err) {
        this.DV_risk.progress = 0;
      }
    },
    updateCheckItem(event, name, index) {
      if (name === "text") {
        this.DV_risk.checklists[index].text = event.target.value;
        if (!event.target.value) this.DV_risk.checklists[index].checked = false;
      } else if (name === "check" && this.DV_risk.checklists[index].text) {
        this.DV_risk.checklists[index].checked = event.target.checked;
      } else if (name === "dueDate" && this.DV_risk.checklists[index].text) {
        this.DV_risk.checklists[index].dueDate = event.target.value;
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
      return this.C_myRisks && check.id
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
      var dueDate = new Date(this.DV_risk.dueDate);
      dueDate.setDate(dueDate.getDate() + 1);
      return date < new Date(this.DV_risk.startDate) || date > dueDate;
    },
    errorLocation(error) {
      var identifyTabFields = [
        "Risk Name",
        "Risk Description",
        "Category",
        "Identified Date",
        "Risk Approach Due Date",
      ];

      var tooltipMessage = "Field is located on Prioritize";

      // var priortizeTabFields = ["Probability", "Probability Description", "Impact Level", "Impact Description", "Risk Approach", "Risk Approach Description"]

      identifyTabFields.forEach((field) => {
        var regex = new RegExp(field);

        if (regex.test(error)) {
          tooltipMessage = "Field is located on Identify";
        }
      });
      return tooltipMessage;
    },
  },
  computed: {
    ...mapGetters([
      "getFacilityProjectOptions",
      "currentProject",
      "projectUsers",
      "activeProjectUsers",
      "myActionsFilter",
      "taskTypes",
      "riskStages",
      "impactLevelNames",
      "getRiskProbabilityOptions",
      "getRiskProbabilityNames",
      "getRiskImpactLevelOptions",
      "getRiskImpactLevelNames",
      "probabilityNames",
      "riskApproaches",
      "currentTasks",
      "currentIssues",
      "currentRisks",
      "managerView",
    ]),
    readyToSave() {
      return (
        this.DV_risk &&
        this.exists(this.DV_risk.text) &&
        this.exists(this.DV_risk.riskDescription) &&
        this.exists(this.DV_risk.impactDescription) &&
        this.exists(this.DV_risk.probabilityDescription) &&
        this.exists(this.selectedRiskPossibility.id) &&
        this.exists(this.selectedRiskImpactLevel.id) &&
        this.exists(this.selectedRiskPossibility.id) &&
        this.exists(this.selectedRiskImpactLevel.id) &&
        this.exists(this.DV_risk.riskApproach) &&
        this.exists(this.DV_risk.riskApproachDescription) &&
        this.exists(this.DV_risk.taskTypeId) &&
        this.exists(this.DV_risk.startDate) &&
        this.exists(this.DV_risk.dueDate)
      );
    },
    isMapView() {
      return this.$route.name === "ProjectMapView";
    },
    isSheetsView() {
      return this.$route.name === "ProjectSheets";
    },
    isKanbanView() {
      return this.$route.name === "ProjectKanbanView";
    },
    filteredChecks() {
      return _.filter(this.DV_risk.checklists, (c) => !c._destroy);
    },
    filteredFiles() {
      return _.filter(this.DV_risk.riskFiles, (f) => !f._destroy);
    },
    C_myRisks() {
      return _.map(this.myActionsFilter, "value").includes("risks");
    },
    C_riskProbabilityOptions: {
      get() {
        return this.getRiskProbabilityOptions;
      },
      set(value) {
        this.setRiskProbabilityOptions(value);
      },
    },
    C_riskImpactLevelOptions: {
      get() {
        return this.getRiskImpactLevelOptions;
      },
      set(value) {
        this.setRiskImpactLevelOptions(value);
      },
    },
    title() {
      return this._isallowed("write")
        ? this.DV_risk.id
          ? "Edit Risk"
          : "Create Risk"
        : "Risk";
    },
    calculatePriorityLevel() {
      return this.selectedRiskImpactLevel.id * this.selectedRiskPossibility.id;
    },
    filteredTasks() {
      return this.currentTasks;
    },
    filteredIssues() {
      return this.currentIssues;
    },
    filteredRisks() {
      return _.filter(this.currentRisks, (t) => t.id !== this.DV_risk.id);
    },
    filteredNotes() {
      return _.orderBy(
        _.filter(this.DV_risk.notes, (n) => !n._destroy),
        "createdAt",
        "desc"
      );
    },
    _isallowed() {
      return (salut) =>
        this.$currentUser.role == "superadmin" ||
        this.$permissions.risks[salut];
    },
    matrix11() {
      if (
        this.selectedRiskImpactLevel.id == 1 &&
        this.selectedRiskPossibility.id == 1
      )
        return true;
    },
    matrix12() {
      if (
        this.selectedRiskImpactLevel.id == 1 &&
        this.selectedRiskPossibility.id == 2
      )
        return true;
    },
    matrix13() {
      if (
        this.selectedRiskImpactLevel.id == 1 &&
        this.selectedRiskPossibility.id == 3
      )
        return true;
    },
    matrix14() {
      if (
        this.selectedRiskImpactLevel.id == 1 &&
        this.selectedRiskPossibility.id == 4
      )
        return true;
    },
    matrix15() {
      if (
        this.selectedRiskImpactLevel.id == 1 &&
        this.selectedRiskPossibility.id == 5
      )
        return true;
    },
    matrix21() {
      if (
        this.selectedRiskImpactLevel.id == 2 &&
        this.selectedRiskPossibility.id == 1
      )
        return true;
    },
    matrix22() {
      if (
        this.selectedRiskImpactLevel.id == 2 &&
        this.selectedRiskPossibility.id == 2
      )
        return true;
    },
    matrix23() {
      if (
        this.selectedRiskImpactLevel.id == 2 &&
        this.selectedRiskPossibility.id == 3
      )
        return true;
    },
    matrix24() {
      if (
        this.selectedRiskImpactLevel.id == 2 &&
        this.selectedRiskPossibility.id == 4
      )
        return true;
    },
    matrix25() {
      if (
        this.selectedRiskImpactLevel.id == 2 &&
        this.selectedRiskPossibility.id == 5
      )
        return true;
    },
    matrix31() {
      if (
        this.selectedRiskImpactLevel.id == 3 &&
        this.selectedRiskPossibility.id == 1
      )
        return true;
    },
    matrix32() {
      if (
        this.selectedRiskImpactLevel.id == 3 &&
        this.selectedRiskPossibility.id == 2
      )
        return true;
    },
    matrix33() {
      if (
        this.selectedRiskImpactLevel.id == 3 &&
        this.selectedRiskPossibility.id == 3
      )
        return true;
    },
    matrix34() {
      if (
        this.selectedRiskImpactLevel.id == 3 &&
        this.selectedRiskPossibility.id == 4
      )
        return true;
    },
    matrix35() {
      if (
        this.selectedRiskImpactLevel.id == 3 &&
        this.selectedRiskPossibility.id == 5
      )
        return true;
    },
    matrix41() {
      if (
        this.selectedRiskImpactLevel.id == 4 &&
        this.selectedRiskPossibility.id == 1
      )
        return true;
    },
    matrix42() {
      if (
        this.selectedRiskImpactLevel.id == 4 &&
        this.selectedRiskPossibility.id == 2
      )
        return true;
    },
    matrix43() {
      if (
        this.selectedRiskImpactLevel.id == 4 &&
        this.selectedRiskPossibility.id == 3
      )
        return true;
    },
    matrix44() {
      if (
        this.selectedRiskImpactLevel.id == 4 &&
        this.selectedRiskPossibility.id == 4
      )
        return true;
    },
    matrix45() {
      if (
        this.selectedRiskImpactLevel.id == 4 &&
        this.selectedRiskPossibility.id == 5
      )
        return true;
    },
    matrix51() {
      if (
        this.selectedRiskImpactLevel.id == 5 &&
        this.selectedRiskPossibility.id == 1
      )
        return true;
    },
    matrix52() {
      if (
        this.selectedRiskImpactLevel.id == 5 &&
        this.selectedRiskPossibility.id == 2
      )
        return true;
    },
    matrix53() {
      if (
        this.selectedRiskImpactLevel.id == 5 &&
        this.selectedRiskPossibility.id == 3
      )
        return true;
    },
    matrix54() {
      if (
        this.selectedRiskImpactLevel.id == 5 &&
        this.selectedRiskPossibility.id == 4
      )
        return true;
    },
    matrix55() {
      if (
        this.selectedRiskImpactLevel.id == 5 &&
        this.selectedRiskPossibility.id == 5
      )
        return true;
    },
  },
  watch: {
    risk: {
      handler: function(value) {
        if (!("id" in value)) this.DV_risk = this.INITIAL_RISK_STATE();
        this.DV_risk.riskFiles = [];
        this.destroyedFiles = [];
        this.loadRisk(value);
      },
      deep: true,
    },
    "DV_risk.startDate"(value) {
      if (!value) this.DV_risk.dueDate = "";
    },
    "DV_risk.checklists": {
      handler: function(value) {
        if (this.DV_risk.autoCalculate) this.calculateProgress(value);
      },
      deep: true,
    },
    "DV_risk.autoCalculate"(value) {
      if (value) this.calculateProgress();
    },
    riskApprover: {
      handler: function(value) {
        if (value) {
          this.DV_risk.riskApproverUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_risk.riskApproverUserIds = null;
        }
      },
      deep: true,
    },
    responsibleUsers: {
      handler: function(value) {
        if (value) {
          this.DV_risk.responsibleUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_risk.responsibleUserIds = null;
        }
      },
      deep: true,
    },
    accountableRiskUsers: {
      handler: function(value) {
        if (value) {
          this.DV_risk.accountableUserIds = _.uniq(
            _.map(_.flatten([value]), "id")
          );
        } else {
          this.DV_risk.accountableUserIds = null;
        }
      },
      deep: true,
    },
    consultedRiskUsers: {
      handler: function(value) {
        if (value) {
          this.DV_risk.consultedUserIds = _.uniq(_.map(value, "id"));
        } else {
          this.DV_risk.consultedUserIds = [];
        }
      },
      deep: true,
    },
    informedRiskUsers: {
      handler: function(value) {
        if (value) {
          this.DV_risk.informedUserIds = _.uniq(_.map(value, "id"));
        } else {
          this.DV_risk.informedUserIds = [];
        }
      },
      deep: true,
    },
    relatedIssues: {
      handler: function(value) {
        if (value) this.DV_risk.subIssueIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedTasks: {
      handler: function(value) {
        if (value) this.DV_risk.subTaskIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    relatedRisks: {
      handler: function(value) {
        if (value) this.DV_risk.subRiskIds = _.uniq(_.map(value, "id"));
      },
      deep: true,
    },
    selectedTaskType: {
      handler: function(value) {
        this.DV_risk.taskTypeId = value ? value.id : null;
      },
      deep: true,
    },
    selectedRiskStage: {
      handler: function(value) {
        this.DV_risk.riskStageId = value ? value.id : null;
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
    facility: {
      handler(value) {
        this.SET_RISK_FORM_OPEN(false);
        this.SET_SELECTED_RISK({});
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.risks-form {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 100px);
  background-color: #fff;
  position: absolute;
  width: 100%;
  top: 0;
  z-index: 100;
}
.kanban-form {
  width: 97%;
}
.fixed-form-mapView {
  transform: scale(1.03);
  height: calc(100vh - 130px);
}
.form-control.error {
  border-color: #e84444;
}
.title {
  font-size: 15px;
  margin-left: 65px;
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
.paperLookTab {
  padding-bottom: 20px;
  margin-bottom: 10px;
  position: relative;
  background-color: #fff;
}
.sticky-btn {
  margin-top: 5px;
  margin-bottom: 5px;
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}
.rmBtn,
.clearBtn {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
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
    box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
      0 3px 3px rgba(56, 56, 56, 0.23);
    color: #383838;
    padding: 5px 12px;
    cursor: pointer;
    text-decoration-line: none !important;
  }
  .approver-pointer {
    cursor: pointer;
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
.btn-group {
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.scrollToChecklist {
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}
.risk-priorityLevel {
  border-radius: 5px;
  min-height: 33px;
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
  background-color: rgba(255, 255, 255, 1);
  font-weight: bold;
}
.risk-pL {
  // margin-right: 50px;
  font-size: large;
}
// Risk Matrix styling (Hexcodes are Bootstrap colors)
.risk-matrix {
  font-size: 0.85rem;
  border-radius: 4px;
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}
.risk-matrix-header {
  color: #5e6469;
  font-weight: bold;
  background-color: #efefef;
  background-image: linear-gradient(180deg, #efefef, #dfe1e2);
}
.vertical-head {
  transform: rotate(-90deg);
  position: absolute;
  top: 64%;
  left: 34%;
  width: 30%;
  font-weight: 500;
}
.gray {
  background-color: #f7f7f7;
}
.red {
  background-color: #d9534f;
}
.yellow {
  background-color: yellow;
}
.orange {
  background-color: #f0ad4e;
}
.green {
  background-color: rgb(92, 184, 92);
}
.red1 {
  background-color: #d9534f;
}
.gray2 {
  background-color: #ededed;
}
.yellow1 {
  background-color: yellow;
  color: #383838;
  display: block;
}
.orange1 {
  background-color: #f0ad4e;
}
.green1 {
  background-color: rgb(92, 184, 92);
}
.green1,
.orange1,
.red1 {
  display: block;
  color: #fff;
}
.red,
.yellow,
.orange,
.green,
.gray3 {
  opacity: 0.44;
  min-height: 76px;
}
.gray2 {
  display: block;
  color: #383838;
}
.red:hover,
.yellow:hover,
.orange:hover,
.green:hover,
.gray2:hover,
.gray3:hover {
  opacity: 1;
  cursor: pointer;
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.reg-opacity {
  opacity: 1 !important;
  box-shadow: 0 5px 10px rgba(56, 56, 56, 0.19),
    0 1px 1px rgba(56, 56, 56, 0.23);
}
#riskName {
  padding: 4px;
  border-radius: 4px;
  background-color: #f8f9fa;
  border-color: #f8f9fa;
  border: 1px solid transparent;
}
.disabled {
  opacity: 0.6;
}
.error {
  font-size: 0.8rem;
}
.risk-approved-date {
  min-height: 32px;
  max-width: 225px;
  padding: 5px 40px 0 8px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  font-size: 13px;
  text-align: left;
  color: #35495e;
  background-color: #fff;
}
.clearBtn {
  position: absolute;
  top: 5%;
  right: 1%;
}
.custom-tab {
  background-color: #fff;
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.display-length {
  border-radius: 0.15rem;
  margin-right: 12px;
}

.red-border {
  border: solid 0.5px red;
}
#roll_up {
  /deep/.el-collapse-item__header {
    float: right;
    padding: 1em;
    margin-top: -32px;
    color: #d9534f !important;
    border-bottom: none !important;
    background-color: #fafafa !important;
  }
}
.risk_matrix {
  /deep/.el-collapse-item__header {
    border-bottom: none !important;
    background-color: #fff !important;
  }
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
</style>
