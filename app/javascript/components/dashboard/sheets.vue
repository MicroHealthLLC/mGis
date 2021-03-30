<template>
  <div class="row">
    <div class="col-md-2 facility-groups-tab pl-0">
      <FacilitySidebar
        :current-facility-group="currentFacilityGroup"
        :expanded="expanded"
        :current-facility="currentFacility"
        @on-expand-facility-group="expandFacilityGroup"
        @on-expand-facility="showFacility"
      ></FacilitySidebar>
    </div>
    <div
      class="col-md-10 facility-show-tab px-0"
      data-cy="sheets_view"
      style="background-color: solid #ededed 15px"
      v-loading="!contentLoaded"
      element-loading-text="Fetching your data. Please wait..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <FacilitySheets
        v-show="projectSelected && !getRiskFormOpen && !isFormOpen"
        from="manager_view"
        :facility="currentFacility"
        :facility-group="currentFacilityGroup"
      />

      <TaskForm
        v-show="managerView.task"
        :facility="currentFacility"
        :task="managerView.task"
        @on-close-form="onCloseForm"
        @task-created="handleNewTask"
        @task-updated="handleNewTask"
      />

      <IssueForm
        v-show="managerView.issue"
        :facility="currentFacility"
        :issue="managerView.issue"
        @on-close-form="onCloseForm"
        @issue-updated="handleNewIssue"
        @issue-created="handleNewIssue"
      />

      <RiskForm
        v-show="projectSelected && getRiskFormOpen"
        :facility="currentFacility"
        :risk="getSelectedRisk"
        @on-close-form="onCloseForm"
        @risk-created="handleNewRisk"
        @risk-updated="handleNewRisk"
      />

      
      <NotesForm
        v-show="managerView.note"
        from="manager_view"
        :facility="currentFacility"
        :note="managerView.note"
        @close-note-input="newNote = false"
        @note-created="createdFacilityNote"
        @note-updated="updatedFacilityNote"
      />

      <FacilityRollup v-if="!projectSelected" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import FacilityRollup from "../dashboard/facilities/facility_rollup";
import FacilitySidebar from "../dashboard/facilities/facility_sidebar";
import FacilitySheets from "../dashboard/facilities/facility_sheets";
import TaskForm from "../dashboard/tasks/task_form";
import IssueForm from "../dashboard/issues/issue_form";
import RiskForm from "../dashboard/risks/risk_form";
import NotesForm from "../dashboard/notes/notes_form"
export default {
  name: "ProjectSheets",
  components: {
    FacilityRollup,
    FacilitySidebar,
    FacilitySheets,
    TaskForm,
    IssueForm,
    RiskForm,
    NotesForm
  },
  data() {
    return {
      currentFacility: {},
      currentFacilityGroup: {},
      expanded: {
        id: "",
      },
    };
  },
  computed: {
    ...mapGetters([
      "contentLoaded",
      "facilityGroupFacilities",
      "getRiskFormOpen",
      "getSelectedRisk",
      "managerView",
    ]),
    projectSelected() {
      return Object.keys(this.currentFacility).length !== 0;
    },
    isFormOpen() {
      return this.managerView.task || this.managerView.issue || this.managerView.note
    }
  },
  methods: {
    expandFacilityGroup(group) {
      if (group.id == this.expanded.id) {
        this.expanded.id = "";
      } else {
        this.expanded.id = group.id;
        this.currentFacilityGroup = group;
        this.currentFacility = this.facilityGroupFacilities(group)[0] || {};
      }
    },
    showFacility(facility) {
      this.currentFacility = facility;
    },
    onCloseForm() {
      this.fixedStageId = null;
      this.$refs.newFormModal && this.$refs.newFormModal.close();
    },
    handleNewTask(task) {
      let cb = () => this.updateTasksHash({ task: task });
      this.taskUpdated({
        facilityId: task.facilityId,
        projectId: task.projectId,
        cb,
      }).then((facility) => (this.currentFacility = facility));
      // this.onCloseForm()
    },
    handleNewIssue(issue) {
      let cb = () => this.updateIssuesHash({ issue: issue });
      this.taskUpdated({
        facilityId: issue.facilityId,
        projectId: issue.projectId,
        cb,
      }).then((facility) => (this.currentFacility = facility));
      // this.onCloseForm()
    },
    handleNewRisk(risk) {
      let cb = () => this.updateRisksHash({ risk: risk });
      this.taskUpdated({
        facilityId: risk.facilityId,
        projectId: risk.projectId,
        cb,
      }).then((facility) => (this.currentFacility = facility));
    },
    createdFacilityNote(note) {
      this.currentFacility.notes.unshift(note);
      this.setTaskForManager({ key: "note", value: null });
    },
    updatedFacilityNote(note) {
      let index = this.currentFacility.notes.findIndex((n) => n.id == note.id);
      if (index > -1) Vue.set(this.currentFacility.notes, index, note);
      this.setTaskForManager({ key: "note", value: null });
    },
  },
  mounted() {},
};
</script>

<style lang="scss"></style>
