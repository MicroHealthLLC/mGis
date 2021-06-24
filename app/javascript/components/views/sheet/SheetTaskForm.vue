<template>
  <TaskForm :facility="facility" :task="task" />
</template>

<script>
import { mapGetters } from "vuex";
import TaskForm from "../../dashboard/tasks/task_form";

export default {
  name: "SheetTaskForm",
  props: ["facility"],
  components: {
    TaskForm,
  },
  data() {
    return {
      //task: {},
    };
  },
  methods: {
   
  },
  computed: {
    ...mapGetters(["currentProject"]),
  },
  mixins: [
    TaskForm
  ],
  async beforeRouteLeave(to, from, next) {
    if (this.DV_Task != this.task) {
      await this.$confirm(
        `Are you sure you want to close without saving?`, "Leave Site Without Saving?",
        {
          confirmButtonText: "Save",
          cancelButtonText: "Don't Save",
          type: "warning",
        }
      )
        .then(async () => {
          await this.saveTask();
          this.$message({
            message: `${this.task.text} was saved successfully.`,
            type: "success",
            showClose: true,
          });
          next();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Changes not saved.",
            showClose: true,
          });
          next();
        });
    }
    else next();
  },
};
</script>

<style></style>
