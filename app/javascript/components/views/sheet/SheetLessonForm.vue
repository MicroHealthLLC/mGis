<template>
  <div>
    <LessonForm class="mx-4" :facility="facility" />
  </div>
</template>

<script>
import LessonForm from "./../../dashboard/lessons/LessonForm";
import { VeeValidate, mapFields } from 'vee-validate'

export default {
  name: "SheetLessonForm",
  props: ["facility"],
  components: {
    LessonForm,
  },
  data() {
    return{
      Description: "",
      LessonName: "",
      Date: "",
    }
  },
  mixins: [
    LessonForm,
  ],
  methods: {
    changed(lesson){
      return !(this.relatedTasks == lesson.sub_tasks &&
      this.relatedIssues == lesson.sub_issues &&
      this.important == lesson.important &&
      this.draft == lesson.draft &&
      this.reportable == lesson.reportable &&
      this.relatedRisks == lesson.sub_risks &&
      this.successes == lesson.successes &&
      this.failures == lesson.failures &&
      this.bestPractices == lesson.best_practices &&
      this.updates == lesson.notes &&
      this.files == lesson.attach_files.filter((file) => !file.link) &&
      this.fileLinks == lesson.attach_files.filter((file) => file.link));
    },
    hasDirty() {
      /* const a = function(e) {
      return e === true;
      }
      console.log((this.$validator.fields).map(field => field.flags.dirty));
      return (this.$validator.fields).map(field => field.flags.dirty); */
      console.log(this.$validator.veeFields);
      if (this.fields){
      console.log(Object.keys(this.fields).some(key => this.fields[key].dirty));
      return Object.keys(this.fields).some(key => this.fields[key].dirty);
      }
    }
  },
  computed: {
    ...mapFields({
      DateFlags: 'Date',
      DescriptionFlags: 'Description',
      LessonNameFlags: 'LessonName',
    }),
  },
  async beforeRouteLeave(to, from, next) {
    if (this.changed(this.lesson)) {
      await this.$confirm(
        `Are you sure you want to close without saving?`, "Leave Site Without Saving?",
        {
          confirmButtonText: "Save",
          cancelButtonText: "Don't Save",
          type: "warning",
        }
      )
        .then(async () => {
          await this.saveLesson();
          this.$message({
            message: `${this.lesson.title} was saved successfully.`,
            type: "success",
            showClose: true,
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Changes not saved.",
            showClose: true,
          });
        });
    }
    next();
  },
};
</script>

<style scoped></style>
