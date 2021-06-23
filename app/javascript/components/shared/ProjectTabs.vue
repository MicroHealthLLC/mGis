<template>
  <div v-if="noTabsVisible" id="customtabs" class="d-flex align-items-center p-2">
    <div v-for="tab in tabs" :key="tab.key">
      <div
        v-if="!tab.hidden"
        class="badge mx-0"
        :class="{ active: currentTab == tab.key, disabled: tab.disabled }"
        @click="changeTab(tab)"
      >
        <div>{{ tab.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
export default {
  name: "ProjectTabs",
  data() {
    return {
      canSeeTab: true,
      tabs: [
        {
          label: "Overview",
          key: "overview",
          closable: false,
          hidden: false
        },
        {
          label: "Tasks",
          key: "tasks",
          closable: false,
          hidden: false
        },
        {
          label: "Issues",
          key: "issues",
          closable: false,
          hidden: false
        },
        {
          label: "Risks",
          key: "risks",
          closable: false,
          hidden: false
        },
        {
          label: "Lessons",
          key: "lessons",
          closable: false,
          hidden: false
        },
        {
          label: "Notes",
          key: "notes",
          closable: false,
          hidden: false
        },
      ],
    };
  },
  mounted() {
    // var programId = this.$route.params.programId;
    // var projectId = this.$route.params.projectId
    // var fPrivilege = _.filter(this.$projectPrivileges, (f) => f.program_id == programId && f.project_id == projectId)[0]
    
    // if(fPrivilege){
    //   for(var i = 0; i < this.tabs.length; i++){
    //     this.tabs[i].hidden = fPrivilege[this.tabs[i].key].hide
    //   }      
    // }
    for(var i = 0; i < this.tabs.length; i++){
      var hide = !this.$permissions[this.tabs[i].key]["read"] && !this.$permissions[this.tabs[i].key]["write"] && !this.$permissions[this.tabs[i].key]["delete"]
      this.tabs[i].hidden = hide
    }

  },
  methods: {
    changeTab(tab) {
      if (tab.key === "overview") {
        this.$router.push(this.path);
      } else {
        this.$router.push(this.path + `/${tab.key}`);
      }
    }
  },
  computed: {
    ...mapGetters([
      'contentLoaded',
      'currentProject',   
    ]),
    currentTab() {
      return this.tabs
        .map((tab) => tab.key)
        .filter((key) =>
          this.$route.name.toUpperCase().includes(key.toUpperCase())
        );
    },
    tab() {
      let url = this.$route.path;

      if (url.includes("sheet")) {
        return "sheet";
      } 
      if (url.includes("calendar")) {
        return "calendar";
      } 
      else {
        return "map";
      }
    },
    path() {
      return `/programs/${this.$route.params.programId}/${this.tab}/projects/${this.$route.params.projectId}`;
    },
    noTabsVisible() {
      return this.tabs.every((tab) => tab.hidden === false);
    },
  },
};
</script>

<style scoped lang="scss">
#customtabs {
  background-color: #ededed;
  border-top: solid 0.3px #ededed;
  width: min-content;
  box-shadow: 0 2.5px 2.5px rgba(0, 0, 0, 0.19), 0 3px 3px rgba(0, 0, 0, 0.23);
  .badge {
    cursor: pointer;
    padding: 7px 10px;
    border-radius: 0.1rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    margin: 4px 7px;
    transition: auto;
    &.active {
      color: #fff !important;
      background-color: #383838 !important;
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
      cursor: not-allowed;
      border: 0 !important;
      padding: 7px 10px !important;
    }
    &:hover {
      background-color: rgba(91, 192, 222, 0.3);
      border: none !important;
      color: #383838;
    }
  }
}
</style>
