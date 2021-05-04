<template>
  <LessonForm :lesson="lesson" @on-close-form="redirectBack" />
</template>

<script>
import { mapGetters } from "vuex";
import LessonForm from "../../dashboard/lessons/lessons_form"

export default {
  props: ["facility"],
  components: {
    LessonForm,
  },
  data() {
    return {
      lesson: {},
    };
  },
  methods: {
    redirectBack() {
      this.$router.push(
        `/programs/${this.$route.params.programId}/lessons/projects/${this.$route.params.projectId}/lessons`
      );
    },
  },
  computed: {
    ...mapGetters(["contentLoaded", "currentProject"]),
  },
  mounted() {
    if (this.contentLoaded && this.$route.params.lessonId !== "new") {
      this.lesson = this.currentProject.lessons.find(
        (lesson) => lesson.id == this.$route.params.lessonId
      );
    }
  },
  watch: {
    contentLoaded: {
      handler() {
        if (this.$route.params.lessonId !== "new") {
          this.lesson = this.currentProject.lesson.find(
            (lesson) => lesson.id == this.$route.params.lessonId
          );
        }
      },
    },
  },
};
</script>

<style></style>
