<template>
  <div>
    <LessonForm class="mx-4" :facility="facility" />
  </div>
</template>

<script>
import LessonForm from "./../../dashboard/lessons/LessonForm";

export default {
  name: "SheetLessonForm",
  props: ["facility"],
  components: {
    LessonForm,
  },
  mixins: [
    LessonForm,
  ],
  beforeRouteLeave(to, from, next) {
    if (this.lesson !== this.DV_lesson) {
      this.$confirm(
        `Are you sure you want to close without saving?`, "Leave Site Without Saving?",
        {
          confirmButtonText: "Save",
          cancelButtonText: "Don't Save",
          type: "warning",
        }
      )
        .then(() => {
          this.saveLesson()
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
  },
};
</script>

<style scoped></style>
