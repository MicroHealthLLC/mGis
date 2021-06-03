<!--  NOTE: This File is used in Map view right side bard -->
<template>
  <div class="container-fluid m-2" data-cy="facility_rollup">
    <div class="row">
      <div class="col-9 pl-0">
        <span v-if="contentLoaded">
          <h4 v-if="isMapView" class="d-inline mr-2">{{ currentProject.name }}</h4>          
          <h3 v-else class="d-inline mr-2">{{ currentProject.name }}</h3>        
        </span>      
      </div>
      <div class="col-3 pl-0">        
        <h3 v-if="contentLoaded" class="d-inline float-right">
           <el-popover
            placement="top-start"
            title="Projects #"
            width="200"
            trigger="hover"
            content="This is the total number of projects in this program.">
          <b class="badge badge-secondary badge-pill" slot="reference"> {{ C_facilityCount }}</b>
          </el-popover>
        </h3>
      </div>
    </div>

    <div class="row row-1 mt-1">
      <div class="col-md-6 col-lg-6 px-0 col-sm-6">
        <el-card class="box-card">
          <div class="row">
            <div class="col">
              <span> <h5>Projects Status</h5></span>
              <hr />
            </div>
          </div>
          <div v-if="contentLoaded && C_facilityCount > 0">
            <div v-for="(status, index) in projectStatuses" :key="index">
              <div class="row">
                <div class="col-6 mb-2">
                  <span
                    class="badge badge-pill badge-color"
                    :class="{ 'font-sm': isMapView }"
                    :style="`background: ${status.color}`"
                    >&nbsp;</span
                  >
                  <span :class="{ 'font-sm': isMapView }">
                    {{ status.name }}</span
                  >                
                </div>
                <div class="col-1 pl-0 mb-2">                
                  <span class="badge badge-secondary badge-pill font-sm">{{
                    status.length
                  }}</span>
                </div>
                <div class="col-5">
                  <span
                    class="w-100 mt-1 ml-2 progress pg-content"
                    :class="{
                      'font-sm': isMapView,
                      'progress-0': status.progress <= 0,
                    }"
                  >
                    <div
                      class="progress-bar bg-info"
                      :style="`width: ${status.progress}%`"
                    >
                      {{ status.progress }} %
                    </div>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!contentLoaded" class="my-4">
            <loader type="code"></loader>
          </div>
        </el-card>
        <el-card
          class="box-card my-2"
          style="background-color:#41b883;color:#fff"
        >
          <div class="row">
            <div class="col">
              <h5 class="d-inline">Filters</h5>
              <hr />
            </div>
          </div>

          <div v-for="(filterArray, index) in getAllFilterNames" :key="index">
            <div class="row">
              <div class="col" v-if="getFilterValue(filterArray[0])">
                <b class="mr-1">{{ filterArray[1] }}:</b>
                {{ getFilterValue(filterArray[0]) }}
              </div>
            </div>
          </div>
          <span v-show="facilities.length !== getUnfilteredFacilities.length"
            >Map Boundary Filter: Active</span
          >
        </el-card>
        <el-card class="box-card" data-cy="projet_group_summary">
          <div class="row">
            <div class="col">
              <span> <h5>Project Groups</h5></span>
              <hr />
            </div>
          </div>
          <div
            v-for="(facilityGroup, index) in filteredFacilityGroups"
            :key="index"
          >
            <div class="row">
              <div class="col-6 mb-2">
                <span :class="{ 'font-sm': isMapView }">{{
                  facilityGroup.name
                }}</span>
               
              </div>
              <div class="col-1 pl-0">              
                <span class="badge badge-secondary badge-pill">{{
                  facilityGroupFacilities(facilityGroup).length
                }}</span>
              </div>
              <div class="col-5">
                <span
                  class="w-100 mt-1 ml-2 progress pg-content"
                  :class="{
                    'font-sm': isMapView,
                    'progress-0': facilityGroupProgress(facilityGroup) <= 0,
                  }"
                >
                  <div
                    class="progress-bar bg-info"
                    :style="`width: ${facilityGroupProgress(facilityGroup)}%`"
                  >
                    {{ facilityGroupProgress(facilityGroup) }} %
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div v-if="!contentLoaded" class="my-4">
            <loader type="code"></loader>
          </div>
        </el-card>
      </div>
      <div
        class="col-md-6 col-lg-6 col-sm-6 pl-2"
        v-if="from !== 'manager_view'"
        data-cy="facility_group_summary"
      >
        <el-card
          class="box-card mb-2"
          style="background-color:#fff"
          data-cy="task_summary"
        >
          <div class="row">
            <div class="col">
              <h5 class="d-inline"><b>TASKS</b></h5>
              <h5 v-if="contentLoaded" class="d-inline">
                <b class="float-right badge badge-secondary badge-pill">{{
                  filteredTasks.length
                }}</b>
              </h5>
              <hr />
            </div>
          </div>

          <div v-if="contentLoaded">
            <div class="row">
              <div class="col-6 mb-0">
                <span :class="{ 'font-sm': isMapView }">Complete</span>               
              </div>
               <div class="col-1 pl-0">              
                <span class="badge badge-secondary badge-pill">{{
                  taskVariation.completed.count
                }}</span>
              </div>
              <div class="col-5">
                <span
                  class="w-100 ml-2 progress pg-content"
                  :class="{
                    'progress-0': taskVariation.completed.percentage <= 0,
                  }"
                >
                  <div
                    class="progress-bar bg-info"
                    :style="`width: ${taskVariation.completed.percentage}%`"
                  >
                    {{ taskVariation.completed.percentage }} %
                  </div>
                </span>
              </div>
            </div>
            
            <div class="row mt-2">
              <div class="col-6 pt-0">
                <span :class="{ 'font-sm': isMapView }">Overdue</span>              
              </div>
              <div class="col-1 pt-0 pl-0">              
                <span
                  class="badge badge-secondary badge-pill"
                  :class="{ 'font-sm': isMapView }"
                  >{{ taskVariation.overdue.count }}</span
                >
              </div>
              <div class="col-5 pt-1">
                <span
                  class="w-100 ml-2 progress pg-content"
                  :class="{
                    'font-sm': isMapView,
                    'progress-0': taskVariation.overdue.percentage <= 0,
                  }"
                >
                  <div
                    class="progress-bar bg-info"
                    :style="`width: ${taskVariation.overdue.percentage}%`"
                  >
                    {{ taskVariation.overdue.percentage }} %
                  </div>
                </span>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6 pt-0">
                <span :class="{ 'font-sm': isMapView }">Ongoing</span>               
              </div>
               <div class="col-1 pl-0 pt-0">              
                <span class="badge badge-secondary badge-pill">{{
                  taskVariation.ongoing.length
                }}</span>
              </div>
              <div class="col-5 pt-1 text-center">
                <span
                  class="w-100 mt-1 ml-2 progress progress-0 pg-content"
                  :class="{
                    'font-sm': isMapView}"
                >
                  <div class="text-center pl-1">
                  <span v-tooltip="`Ongoing`" class="font-md" style="color:gray"> <i class="fas fa-retweet"></i></span>
                  </div>
                </span>
              </div>
            </div>

            <div v-if="filteredTasks.length">
              <el-collapse id="roll_up">
                <el-collapse-item title="Details" name="1">
                  <div class="row my-1">
                    <div class="col">
                      <span class="underline" :class="{ 'font-sm': isMapView }">CATEGORIES</span>
                    </div>
                  </div>
                  <div v-for="(task, index) in currentTaskTypes" :key="index">
                    <div class="row font-sm" v-if="task._display">
                      <div class="col-6">
                        <span class="font-sm"> {{ task.name }}</span>                       
                      </div>
                       <div class="col-1 pl-0">                      
                        <span
                          class="badge badge-secondary  font-sm badge-pill"
                    
                          >{{ task.length }}</span
                        >
                      </div>

                      <div class="col-5">
                        <span
                          class="w-100 my-1 progress ml-2 pg-content"
                          :class="{ 'progress-0': task.progress <= 0 }"
                        >
                          <div
                            class="progress-bar bg-info"
                            :style="`width: ${task.progress}%`"
                          >
                            {{ task.progress }} %
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
          <div v-if="!contentLoaded" class="my-4">
            <loader type="code"></loader>
          </div>
        </el-card>

        <!-- Issues -->
        <el-card
          class="box-card mb-2"
          style="background-color:#fff"
          data-cy="issue_summary"
        >
          <div class="row">
            <div class="col">
              <h5 class="d-inline"><b>ISSUES</b></h5>
              <h5 v-if="contentLoaded" class="d-inline">
                <b class="float-right badge badge-secondary badge-pill">{{
                  filteredIssues.length
                }}</b>
              </h5>
              <hr />
            </div>
          </div>

          <div v-if="contentLoaded">
            <div class="row">
              <div class="col-6 mb-0">
                <span :class="{ 'font-sm': isMapView }">Complete</span>
               
              </div>
               <div class="col-1 pl-0">
            
                <span
                  class="badge badge-secondary badge-pill"
                  :class="{ 'font-sm': !isMapView }"
                  >{{ issueVariation.completed.count }}</span
                >
              </div>
              <div class="col-5" :class="{ 'font-sm': !isMapView }">
                <span
                  class="w-100 progress ml-2 pg-content"
                  :class="{
                    'progress-0': issueVariation.completed.percentage <= 0,
                  }"
                >
                  <div
                    class="progress-bar bg-info"
                    :style="`width: ${issueVariation.completed.percentage}%`"
                  >
                    {{ issueVariation.completed.percentage }} %
                  </div>
                </span>
              </div>
            </div>
            <div class="row mt-2">
              <div class="col-6 pt-0">
                <span :class="{ 'font-sm': isMapView }">Overdue</span>
             
              </div>
              <div class="col-1 pt-0 pl-0">              
                <span class="badge badge-secondary font-sm badge-pill">{{
                  issueVariation.overdue.count
                }}</span>
              </div>
              <div class="col-5 pt-1">
                <span
                  class="w-100 progress ml-2 pg-content"
                  :class="{
                    'font-sm': !isMapView,
                    'progress-0': issueVariation.overdue.percentage <= 0,
                  }"
                >
                  <div
                    class="progress-bar bg-info"
                    :style="`width: ${issueVariation.overdue.percentage}%`"
                  >
                    {{ issueVariation.overdue.percentage }} %
                  </div>
                </span>
              </div>
            </div>

            <!-- If Issues? Place in collapsible container -->
            <div v-if="filteredIssues.length">
              <el-collapse>
                <el-collapse-item title="Details" name="1">
                  <div v-if="contentLoaded">
                    <div class="row">
                      <div class="col mt-1 underline">
                        CATEGORIES
                      </div>
                    </div>
                    <div
                      class="row"
                      v-for="(issue, index) in issueTaskCATEGORIES"
                      :key="index"
                    >
                      <div class="col-6">
                        <span> {{ issue.name }}</span>                      
                      </div>
                       <div class="col-1 pl-0">    
                                            
                        <span                       
                        class="badge badge-secondary font-sm badge-pill">{{
                          issue.count
                        }}</span>
                      </div>
                      <div class="col-5">
                        <span
                          class="w-100 my-1 progress ml-2 pg-content"
                          :class="{ 'progress-0': issue.progress <= 0 }"
                        >
                          <div
                            class="progress-bar bg-info"
                            :style="`width: ${issue.progress}%`"
                          >
                            {{ issue.progress }} %
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="col mt-2 mb-1 pl-0 underline">
                    ISSUE TYPES
                  </div>
                  <div v-for="issue in currentIssueTypes" :key="issue.id">
                    <div class="row font-sm" v-if="issue._display">
                      <div class="col-6">
                        <span> {{ issue.name }}</span>                        
                      </div>
                      <div class="col-1 pl-0">                        
                        <span                          
                          class="badge badge-secondary  font-sm badge-pill">{{
                          issue.length
                        }}</span>
                      </div>
                      <div class="col-5">
                        <span
                          class="w-100 my-1 progress ml-2 pg-content"
                          :class="{ 'progress-0': issue.progress <= 0 }"
                        >
                          <div
                            class="progress-bar bg-info"
                            :style="`width: ${issue.progress}%`"
                          >
                            {{ issue.progress }} %
                          </div>
                        </span>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>

          <div v-if="!contentLoaded" class="my-4">
            <loader type="code"></loader>
          </div>
        </el-card>
        <el-card
          class="box-card"
          style="background-color:#fff"
          data-cy="risk_summary"
        >
          <div class="row">
            <div class="col">
              <h5 class="d-inline"><b>RISKS</b></h5>
              <h5 v-if="contentLoaded" class="d-inline">
                <b class="float-right badge badge-secondary badge-pill">{{
                  filteredRisks.length
                }}</b>
              </h5>
              <hr />
            </div>
          </div>

          <div class="row">
            <div class="col-6 mb-0">
              <span :class="{ 'font-sm': isMapView }">Complete</span>            
            </div>
            <div class="col-1 pl-0">             
              <span class="badge badge-secondary badge-pill">{{
                riskVariation.completed.count
              }}</span>
            </div>
            <div class="col-5">
              <span
                class="w-100 progress ml-2 pg-content"
                :class="{
                  'progress-0': riskVariation.completed.percentage <= 0,
                }"
              >
                <div
                  class="progress-bar bg-info"
                  :style="`width: ${riskVariation.completed.percentage}%`"
                >
                  {{ riskVariation.completed.percentage }} %
                </div>
              </span>
            </div>
          </div>
          <div class="row mt-2">
            <div class="col-6 pt-0">
              <span :class="{ 'font-sm': isMapView }">Overdue</span>            
            </div>
             <div class="col-1 pt-0 pl-0">             
              <span class="badge badge-secondary badge-pill">{{
                riskVariation.overdue.count
              }}</span>
            </div>
            <div class="col-5 pt-1">
              <span
                class="w-100 progress ml-2 pg-content"
                :class="{ 'progress-0': riskVariation.overdue.percentage <= 0 }"
              >
                <div
                  class="progress-bar bg-info"
                  :style="`width: ${riskVariation.overdue.percentage}%`"
                >
                  {{ riskVariation.overdue.percentage }} %
                </div>
              </span>
            </div>
          </div>
          <div class="row mt-2">
              <div class="col-6 pt-0">
                <span :class="{ 'font-sm': isMapView }">Ongoing</span>               
              </div>
               <div class="col-1 pl-0 pt-0">              
                <span class="badge badge-secondary badge-pill">{{
                  riskVariation.ongoing.length
                }}</span>
              </div>
              <div class="col-5 pt-1 text-center">
                <span
                   class="w-100 mt-1 ml-2 progress progress-0 pg-content"
                  :class="{'font-sm': isMapView}"
                >
                  <div class="text-center pl-1">
                     <span v-tooltip="`Ongoing`" class="font-md" style="color:gray"> <i class="fas fa-retweet"></i></span>
                  </div>
                </span>
              </div>
            </div>

          <div v-if="filteredRisks.length > 0">
            <el-collapse>
              <el-collapse-item title="Details" name="1">
                <div class="row">
                  <div class="col my-1 underline">
                    CATEGORIES
                  </div>
                </div>

                <div v-for="risk in currentRiskTypes" :key="risk.id">
                  <div class="row" v-if="risk._display">
                    <div class="col-6">
                      <span> {{ risk.name }}</span>                    
                    </div>
                     <div class="col-1 pl-0">                 
                      <span                       
                       class="badge badge-secondary  font-sm badge-pill">{{
                        risk.length
                      }}</span>
                    </div>
                    <div class="col-5">
                      <span
                        class="w-100 my-1 ml-2 progress pg-content"
                        :class="{ 'progress-0': risk.progress <= 0 }"
                      >
                        <div
                          class="progress-bar bg-info"
                          :style="`width: ${risk.progress}%`"
                        >
                          {{ risk.progress }} %
                        </div>
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="contentLoaded">
                  <div class="row mt-3 mb-2">
                    <div class="col underline">
                      <span :class="{ 'font-sm': isMapView }">
                        RISK PRIORITY LEVELS</span
                      >
                    </div>
                  </div>
                  <div class="row">
                    <div
                      class="col text-center"
                      v-if="isMapView"
                    >
                      <p class="mb-2 grey2" v-tooltip="`Very Low`">VL</p>
                      <p class="mb-2 green" v-tooltip="`Low`">L</p>
                      <p class="mb-2 yellow" v-tooltip="`Moderate`">M</p>
                    </div>
                     <div
                     v-else
                      class="col text-center"                     
                    >
                      <p class="mb-2 grey2">Very Low</p>
                      <p class="mb-2 green">Low</p>
                      <p class="mb-2 yellow">Moderate</p>
                    </div>
                    <div class="col" :class="{ 'font-sm': isMapView }">
                      <span
                        class="mt-1 p-1 badge w-50 badge-secondary badge-pill d-block"
                        >{{ riskPriorityLevels.grey }}</span
                      >
                      <span
                        class="my-2 p-1 badge w-50 badge-secondary badge-pill d-block"
                        >{{ riskPriorityLevels.green }}</span
                      >
                      <span
                        class="my-2 p-1 badge w-50 badge-secondary badge-pill d-block"
                        >{{ riskPriorityLevels.yellow }}</span
                      >
                    </div>
                    <div
                      class="col text-center"               
                      v-if="isMapView"
                    >
                      <p class="mb-2 orange" v-tooltip="`High`">H</p>
                      <p class="mb-2 red" v-tooltip="`Extreme`">E</p>
                    </div>
                     <div
                      class="col text-center"               
                      v-else
                    >
                      <p class="mb-2 orange">High</p>
                      <p class="mb-2 red">Extreme</p>
                    </div>
                    <div class="col">
                      <span
                        class="mt-1 p-1 badge w-50 badge-secondary badge-pill d-block"
                        >{{ riskPriorityLevels.orange }}</span
                      >
                      <span
                        class="my-2 p-1 badge w-50 badge-secondary badge-pill d-block"
                        >{{ riskPriorityLevels.red }}</span
                      >
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div v-if="!contentLoaded" class="my-4">
            <loader type="code"></loader>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from "./loader";
import { mapGetters } from "vuex";
export default {
  name: "ProjectRollup",
  props: ["from"],
  components: {
    Loader,
  },
  data() {
    return {
      showLess: "Show More",
      showMore: true,
    };
  },
  computed: {
    ...mapGetters([
      "contentLoaded",
      "currentProject",
      'projects',
      "facilities",
      "facilityCount",
      "facilityGroupFacilities",
      "facilityProgress",
      "filterDataForAdvancedFilter",
      "filteredAllIssues",
      "filteredAllRisks",
      "filteredAllTasks",
      "filteredFacilities",
      "filteredFacilityGroups",
      "getAllFilterNames",
      "getAllFilterNames",
      "getFilterValue",
      "getTaskIssueUserFilter",
      "getUnfilteredFacilities",
      "issueSeverityFilter",
      "issueStageFilter",
      "issueTypeFilter",
      "issueTypes",
      "issueUserFilter",
      "myActionsFilter",
      "onWatchFilter",
      "riskStageFilter",
      "statuses",
      "taskStageFilter",
      "taskTypeFilter",
      "taskTypes",
      "taskTypes",
      "taskUserFilter",
    ]),
    C_taskTypeFilter: {
      get() {
        return this.taskTypeFilter;
      },
      set(value) {
        this.setTaskTypeFilter(value);
      },
    },
    C_myTasks: {
      get() {
        return _.map(this.myActionsFilter, "value").includes("tasks");
      },
    },
    C_myIssues: {
      get() {
        return _.map(this.myActionsFilter, "value").includes("issues");
      },
    },
    C_onWatchTasks: {
      get() {
        return _.map(this.onWatchFilter, "value").includes("tasks");
      },
    },
    C_onWatchIssues: {
      get() {
        return _.map(this.onWatchFilter, "value").includes("issues");
      },
    },
    C_facilityCount() {         
      return this.facilityGroup
      
        ? this.facilityGroupFacilities(this.facilityGroup).length
        : this.facilityCount; 
      
    },
    C_facilityProgress() {
      return this.facilityGroup
        ? Number(
            _.meanBy(
              this.facilityGroupFacilities(this.facilityGroup),
              "progress"
            ) || 0
          ).toFixed(0)
        : this.facilityProgress;
    },
    isMapView() {
      return this.$route.name.includes("Map");
    },
    filteredTasks() {
      let typeIds = _.map(this.taskTypeFilter, "id");
      let stageIds = _.map(this.taskStageFilter, "id");
      let tasks = this.facilityGroup
        ? _.flatten(
            _.map(this.facilityGroupFacilities(this.facilityGroup), "tasks")
          )
        : this.filteredAllTasks;
      let taskIssueUsers = this.getTaskIssueUserFilter;
      return _.filter(tasks, (resource) => {
        let valid = true;
        let userIds = [
          ..._.map(resource.checklists, "userId"),
          resource.userIds,
        ];
        if (taskIssueUsers.length > 0) {
          valid =
            valid &&
            userIds.some((u) => _.map(taskIssueUsers, "id").indexOf(u) !== -1);
        }
        //TODO: For performance, send the whole tasks array instead of one by one
        valid =
          valid &&
          this.filterDataForAdvancedFilter([resource], "facilitRollupTasks");
        if (stageIds.length > 0)
          valid = valid && stageIds.includes(resource.taskStageId);
        if (typeIds.length > 0)
          valid = valid && typeIds.includes(resource.taskTypeId);
        return valid;
      });
    },
    filteredIssues() {
      let typeIds = _.map(this.issueTypeFilter, "id");
      let stageIds = _.map(this.issueStageFilter, "id");
      let severityIds = _.map(this.issueSeverityFilter, "id");
      let issues = this.facilityGroup
        ? _.flatten(
            _.map(this.facilityGroupFacilities(this.facilityGroup), "issues")
          )
        : this.filteredAllIssues;

      let taskIssueUsers = this.getTaskIssueUserFilter;
      return _.filter(issues, (resource) => {
        let valid = true;
        let userIds = [
          ..._.map(resource.checklists, "userId"),
          resource.userIds,
        ];
        if (taskIssueUsers.length > 0) {
          valid =
            valid &&
            userIds.some((u) => _.map(taskIssueUsers, "id").indexOf(u) !== -1);
        }
        //TODO: For performance, send the whole tasks array instead of one by one
        valid =
          valid &&
          this.filterDataForAdvancedFilter([resource], "facilitRollupIssues");
        if (typeIds.length > 0)
          valid = valid && typeIds.includes(resource.issueTypeId);
        if (severityIds.length > 0)
          valid = valid && severityIds.includes(resource.issueSeverityId);
        if (stageIds.length > 0)
          valid = valid && stageIds.includes(resource.issueStageId);
        return valid;
      });
    },
    issueTaskCATEGORIES() {
      let issues = new Array();
      let group = _.groupBy(this.filteredIssues, "taskTypeName");
      for (let type in group) {
        if (!type || type == "null") continue;
        issues.push({
          name: type,
          count: group[type].length,
          progress: Number((_.meanBy(group[type], "progress") || 0).toFixed(0)),
        });
      }
      return issues;
    },
    filteredRisks() {
      let typeIds = _.map(this.taskTypeFilter, "id");
      let stageIds = _.map(this.riskStageFilter, "id");
      let risks = this.facilityGroup
        ? _.flatten(
            _.map(this.facilityGroupFacilities(this.facilityGroup), "risks")
          )
        : this.filteredAllRisks;
      let taskIssueUsers = this.getTaskIssueUserFilter;
      return _.filter(risks, (resource) => {
        let valid = true;
        let userIds = [
          ..._.map(resource.checklists, "userId"),
          resource.userIds,
        ];
        if (taskIssueUsers.length > 0) {
          valid =
            valid &&
            userIds.some((u) => _.map(taskIssueUsers, "id").indexOf(u) !== -1);
        }
        //TODO: For performance, send the whole tasks array instead of one by one
        valid =
          valid &&
          this.filterDataForAdvancedFilter([resource], "facilityRollupTasks");
        if (stageIds.length > 0)
          valid = valid && stageIds.includes(resource.riskStageId);
        if (typeIds.length > 0)
          valid = valid && typeIds.includes(resource.taskTypeId);
        return valid;
      });
    },
    riskPriorityLevels() {
      let grey = _.filter(
        this.filteredRisks,
        (t) => t && t.priorityLevelName && t.priorityLevelName == "Very Low"
      );
      let green = _.filter(
        this.filteredRisks,
        (t) => t && t.priorityLevelName && t.priorityLevelName == "Low"
      );
      let yellow = _.filter(
        this.filteredRisks,
        (t) => t && t.priorityLevelName && t.priorityLevelName == "Moderate"
      );
      let orange = _.filter(
        this.filteredRisks,
        (t) => t && t.priorityLevelName && t.priorityLevelName == "High"
      );
      let red = _.filter(
        this.filteredRisks,
        (t) => t && t.priorityLevelName && t.priorityLevelName == "Extreme"
      );
      return {
        grey: grey.length,
        green: green.length,
        yellow: yellow.length,
        orange: orange.length,
        red: red.length,
      };
    },
    activeFacilitiesByStatus() {
      return this.facilityGroup
        ? this.facilityGroupFacilities(this.facilityGroup).length
        : this.filteredFacilities("active").length;
    },
    inactiveFacilitiesByStatus() {
      return this.facilityGroup
        ? this.facilityGroupFacilities(this.facilityGroup, "inactive").length
        : this.filteredFacilities("inactive").length;
    },
    projectStatuses() {
      let statuses = [];

      if (this.contentLoaded && this.facilities.length > 0) {
        this.statuses.forEach((status) => {
          // Find number of facilities with current status
          let count = this.facilities
            .filter((facility) => facility.projectStatus === status.name)
            .reduce((total) => total + 1, 0);
          // Insert status into projectStatuses for use Project Status card
          statuses.push({
            name: status.name,
            color: status.color,
            length: count,
            progress: Math.floor((count / this.facilities.length) * 100),
          });
        });
      }

      return statuses;
    },
    currentTaskTypes() {
      let names =
        this.taskTypeFilter &&
        this.taskTypeFilter.length &&
        _.map(this.taskTypeFilter, "name");
      let taskTypes = new Array();
      for (let type of this.taskTypes) {
        let tasks = _.filter(
          this.filteredTasks,
          (t) => t.taskTypeId == type.id
        );
        taskTypes.push({
          name: type.name,
          _display:
            tasks.length > 0 && (names ? names.includes(type.name) : true),
          length: tasks.length,
          progress: Number(_.meanBy(tasks, "progress").toFixed(0)),
        });
      }
      return taskTypes;
    },
    currentIssueTypes() {
      let names =
        this.issueTypeFilter &&
        this.issueTypeFilter.length &&
        _.map(this.issueTypeFilter, "name");
      let issueTypes = new Array();
      for (let type of this.issueTypes) {
        let issues = _.filter(
          this.filteredIssues,
          (t) => t.issueTypeId == type.id
        );
        issueTypes.push({
          name: type.name,
          _display:
            (names ? names.includes(type.name) : true) && issues.length > 0,
          length: issues.length,
          progress: Number(_.meanBy(issues, "progress").toFixed(0)),
        });
      }
      return issueTypes;
    },
    currentRiskTypes() {
      let names =
        this.taskTypeFilter &&
        this.taskTypeFilter.length &&
        _.map(this.taskTypeFilter, "name");
      let taskTypes = new Array();
      for (let type of this.taskTypes) {
        let risks = _.filter(
          this.filteredRisks,
          (t) => t.taskTypeId == type.id
        );
        taskTypes.push({
          name: type.name,
          _display:
            risks.length > 0 && (names ? names.includes(type.name) : true),
          length: risks.length,
          progress: Number(_.meanBy(risks, "progress").toFixed(0)),
        });
      }
      return taskTypes;
    },
    taskVariation() {
      let completed = _.filter(
        this.filteredTasks,
        (t) => t && t.progress && t.progress == 100
      );
      let completed_percent = this.getAverage(
        completed.length,
        this.filteredTasks.length
      );
      let overdue = _.filter(this.filteredTasks, (t) => t && t.isOverdue);
      let overdue_percent = this.getAverage(
        overdue.length,
        this.filteredTasks.length
      );
      let ongoing = _.filter(this.filteredTasks, (t) => t && t.ongoing);
      return {
        completed: {
          count: completed.length,
          percentage: Math.round(completed_percent),
        },
        overdue: {
          count: overdue.length,
          percentage: Math.round(overdue_percent),
        },
        ongoing,       
    
      };
    },
    issueVariation() {
      let completed = _.filter(
        this.filteredIssues,
        (t) => t && t.progress && t.progress == 100
      );
      let completed_percent = this.getAverage(
        completed.length,
        this.filteredIssues.length
      );
      let overdue = _.filter(this.filteredIssues, (t) => t && t.isOverdue);
      let overdue_percent = this.getAverage(
        overdue.length,
        this.filteredIssues.length
      );
      return {
        completed: {
          count: completed.length,
          percentage: Math.round(completed_percent),
        },
        overdue: {
          count: overdue.length,
          percentage: Math.round(overdue_percent),
        },
      };
    },
    riskVariation() {
      let completed = _.filter(
        this.filteredRisks,
        (t) => t && t.progress && t.progress == 100
      );
      let completed_percent = this.getAverage(
        completed.length,
        this.filteredRisks.length
      );
      let overdue = _.filter(this.filteredRisks, (t) => t && t.isOverdue);
      let overdue_percent = this.getAverage(
        overdue.length,
        this.filteredRisks.length
      );
      let ongoing = _.filter(this.filteredRisks, (t) => t && t.ongoing);
      return {
        completed: {
          count: completed.length,
          percentage: Math.round(completed_percent),
        },
        overdue: {
          count: overdue.length,
          percentage: Math.round(overdue_percent),
        },
        ongoing
      };
    },
  },
  methods: {
    showLessToggle() {
      this.showLess = "Show Less";
    },
     facilityGroupProgress(f_group) {
      let ids = _.map(this.filteredFacilities("active"), "id");
      let mean =
        _.meanBy(
          _.filter(
            f_group.facilities,
            (f) =>
              ids.includes(f.facilityId) &&
              f.projectId == this.currentProject.id
          ),
          "progress"
        ) || 0;
      return Number(mean.toFixed(0));
    },
  },
};
</script>

<style scoped lang="scss">
.badge-color {
  height: 12px;
  padding-top: 2px;
}
.box-card {
  min-height: 150px;
}
.proj-type {
  display: inline;
  border-radius: 2px;
  padding: 4px;
  color: #fff;
  font-size: small;
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.fac-proj-status,
.tasks,
.issues,
.fac-groups {
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);
}
ul > li {
  display: inline-block !important;
  /* You can also add some margins here to make it look prettier */
  zoom: 1;
  *display: inline;
  /* this fix is needed for IE7- */
}
.grey {
  background-color: lightgray;
}
.grey2 {
  background-color: #ededed;
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
.red {
  background-color: #d9534f;
}
.red,
.orange,
.green,
.grey {
  color: white;
  border-radius: 3px;
}
.red,
.orange,
.green,
.grey,
.grey2,
.yellow {
  box-shadow: 0 2.5px 5px rgba(56, 56, 56, 0.19),
    0 3px 3px rgba(56, 56, 56, 0.23);
}
.grey2 {
  border-radius: 3px;
}

.underline {
  text-decoration: underline;
}
.ongoing-bg {
  background-color: #e9ecef;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  height: 20px;
}
// .fac-proj-status:hover, .tasks:hover, .issues:hover, .fac-groups:hover {
//  background-color: #fff;
// }
</style>
