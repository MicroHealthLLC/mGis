<template>
  <div id="tabbar" data-cy="main_tab">
    <router-link v-if="permitted('map_view')" :to="routeMapSwap" tag="div">
      <div class="badge" :class="{ active: isMapView }" data-cy="map_tab">
        Map
      </div>
    </router-link>
    <router-link v-if="permitted('sheets_view')" :to="routeSheetSwap" tag="div">
      <div class="badge" :class="{ active: isSheetsView }" data-cy="sheets_tab">
        Sheet
      </div>
    </router-link>
    <router-link
      v-if="permitted('kanban_view')"
      :to="routeKanbanSwap"
      tag="div"
    >
      <div class="badge" :class="{ active: isKanbanView }" data-cy="kanban_tab">
        Kanban
      </div>
    </router-link>
    <router-link
      v-if="permitted('gantt_view')"
      :to="`/programs/${this.$route.params.programId}/gantt_chart`"
      tag="div"
    >
      <div class="badge" :class="{ active: isGanttView }" data-cy="gantt_tab">
        Gantt
      </div>
    </router-link>
    <!-- <router-link
      v-if="permitted('calendar_view')"
      :to="`/programs/${this.$route.params.programId}/calendar`"
      tag="div"
    >
      <div class="badge" :class="{ active: isCalendarView }" data-cy="calendar_tab">
        Calendar
      </div>
    </router-link> -->
    <div v-show="false" v-if="permitted('issues')" class="badge disabled">
      Mindmap (Coming Soon)
    </div>
    <div v-show="false" v-if="permitted('documents')" class="badge disabled">
      Documents (Coming Soon)
    </div>
    <router-link
      v-if="permitted('members')"
      :to="`/programs/${this.$route.params.programId}/member_list`"
      tag="div"
    >
      <div class="badge" :class="{ active: isMembersView }" data-cy="team_tab">
        Team
      </div>
    </router-link>
    <router-link v-if="permitted('lessons')" :to="routeLessonSwap" tag="div">
      <div class="badge"  :class="{ active: isLessonsView }" data-cy="lesson_tab">
        Lessons
        
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "Tabsbar",
  computed: {
    isSheetsView() {
      return this.$route.name.includes("Sheet");
    },
    isMapView() {
      return this.$route.name.includes("Map");
    },
    isGanttView() {
      return this.$route.name === "GanttChartView";
    },
    // isCalendarView() {
    //   return this.$route.name.includes("Calendar");
    // },
    isKanbanView() {
      return this.$route.name.includes("Kanban");
    },
    isMembersView() {
      return this.$route.name === "TeamMembersView";
    },
    isLessonsView() {
      return this.$route.name.includes("LessonsIndex");
    },
    routeSheetSwap() {
      let route = this.$route.path;
      if (this.isMapView) {
        return route.replace("map", "sheet");
      } else if (this.isKanbanView) {
        return route.replace("kanban", "sheet");
      } else if (this.isGanttView) {
        return route.replace("gantt_chart", "sheet");
      } else if (this.isLessonsView){
        return route.replace("lessons", "sheet");
      } else {
        return route.replace("member_list", "sheet");
      }
    },
    routeLessonSwap() {
      let route = this.$route.path;
      if (this.isMapView) {
        return route.replace("map", "lessons");
      } else if (this.isKanbanView) {
        return route.replace("kanban", "lessons");
      } else if (this.isGanttView) {
        return route.replace("gantt_chart", "lessons");
      } else if (this.isSheetsView){
        return route.replace("sheet", "lessons");
      } else {
        return route.replace("member_list", "lessons");
      }
    },
    routeMapSwap() {
      let route = this.$route.path;
      if (this.isSheetsView) {
        return route.replace("sheet", "map");
      } else if (this.isKanbanView) {
        return route.replace("kanban", "map");
      } else if (this.isGanttView) {
        return route.replace("gantt_chart", "map");
      } else if (this.isLessonsView){
        return route.replace("lessons", "map");
      }else {
        return route.replace("member_list", "map");
      }
    },
    routeKanbanSwap() {
      let route = this.$route.path;

      if (
        this.isSheetsView &&
        (route.includes("tasks") ||
          route.includes("issues") ||
          route.includes("risks"))
      ) {
        return route.replace("sheet", "kanban");
      } else if (this.isSheetsView && this.$route.params.projectId) {
        return `/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/tasks`;
      } else if (this.isSheetsView && !route.includes("notes")) {
        return `/programs/${this.$route.params.programId}/kanban`;
      }
      if (
        this.isMapView &&
        (route.includes("tasks") ||
          route.includes("issues") ||
          route.includes("risks"))
      ) {
        return route.replace("map", "kanban");
      } else if (this.isMapView && this.$route.params.projectId) {
        return `/programs/${this.$route.params.programId}/kanban/projects/${this.$route.params.projectId}/tasks`;
      } else if (this.isMapView && !route.includes("notes")) {
        return `/programs/${this.$route.params.programId}/kanban`;
      } else if (this.isGanttView) {
        return route.replace("gantt_chart", "kanban");
      } else if (this.isLessonsView) {
        return route.replace("lessons", "kanban");
      } else {
        return route.replace("member_list", "kanban");
      }
    },
    permitted() {
      return (salut) =>
        this.$currentUser.role == "superadmin" ||
        this.$permissions[salut]["read"];
    },
  },
  watch: {
    $route(to, from) {
      this.$store && this.$store.commit("nullifyTasksForManager");
    },
  },
};
</script>

<style scoped lang="scss">
#tabbar {
  padding: 4px 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.02), 0 2px 5px 0 rgba(0, 0, 0, 0.03);
  .badge {
    border-radius: 0.15rem;
    cursor: pointer;
    padding: 5px;
    margin: 2px 10px;
    transition: auto;
    &.active {
      color: #fff;
      font-weight: 200;
      padding: 5px;
      background-color: #17a2b8;
    }
    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
      border: 0 !important;
      padding: 5px !important;
    }
    &:hover {
      padding: 4px;
      border: 1px solid #17a2b8;
    }
  }
}
</style>
