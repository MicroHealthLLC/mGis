<template>
  <div
    id="customtabs"
    class="d-flex align-items-center mx-4"
    :class="{ 'tab-shadow': !badgeMargin }"
  >
    <div v-for="tab in tabs" :key="tab.key">
      <div
        class="form-tabs"
        :class="{ active: currentTab == tab.key, disabled: tab.disabled }"
        @click.prevent="changeTab(tab)"
        :style="badgeStyle"
        data-cy="facility_tabs"
      >
        <div :class="{ label: tabHasErrors(tab) }">{{ tab.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomTabs",
  props: ["tabs", "currentTab", "badgeMargin", "allErrors"],
  methods: {
    changeTab(tab) {
      if (tab.disabled) return;
      this.$emit("on-change-tab", tab);
    },
    tabHasErrors(tab) {
      if (this.errors.items.length > 0 && tab.form_fields) {
        var errorFields = this.errors.items.map(item => item.field)

        console.log(tab.form_fields)
        console.log(errorFields)

        return tab.form_fields.some(item => errorFields.includes(item))
      } else {
        return false
      }
    },
  },
  computed: {
    badgeStyle() {
      return this.badgeMargin ? { margin: this.badgeMargin } : {};
    },
  }
};
</script>

<style scoped lang="scss">
#customtabs {
  .form-tabs {
    cursor: pointer;
    border-bottom: 5px solid rgba(0, 0, 0, 0.1);
    width: 100px;
    text-align: center;
    &.active {
      border-bottom: 5px solid #007bff;
      color: #007bff;
    }
    &.disabled {
      pointer-events: none;
      opacity: 0.5;
      cursor: not-allowed;
      border: 0 !important;
      padding: 7px 10px !important;
    }
    &:hover {
      color: #007bff;
    }
  }
}
.tab-shadow {
  // box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.02), 0 2px 5px 0 rgba(0, 0, 0, 0.03);
}
.label::after {
  content: "*";
  display: inline-block;
  // width: 5px;
  // height: 5px;
  // -moz-border-radius: 50%;
  // -webkit-border-radius: 50%;
  // border-radius: 50%;
  // background-color: #dc3545;
  // position: relative;
  // top: -5px;
  // right: -2px;
  // padding: 0;
  color: #dc3545;
  font-weight: 600;
}
</style>