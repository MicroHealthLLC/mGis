<template>
  <div
    class="context-menu"
    :v-show="getShowContextMenu"
    :style="style"
    ref="context"
    tabindex="0"
  >
    <slot></slot>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex"

export default {
  name: "ContextMenu",
  data() {
    return {
      left: 0, // left position
      top: 0, // top position
    };
  },
  computed: {
    ...mapGetters(['getShowContextMenu']),
    // get position of context menu
    style() {
      return {
        top: this.top + "px",
        left: this.left + "px",
      };
    },
  },
  methods: {
    ...mapMutations(['setShowContextMenu']),
    open(evt) {
      // updates position of context menu
      this.left = evt.pageX || evt.clientX;
      this.top = evt.pageY || evt.clientY;
      // make element focused
      // @ts-ignore
      Vue.nextTick(() => this.$el.focus());
      this.setShowContextMenu(true)
    },
    close() {
      this.setShowContextMenu(false);
      this.left = 0;
      this.top = 0;
    }
  },
};
</script>

<style>
.context-menu {
  position: fixed;
  background: white;
  z-index: 999;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
</style>