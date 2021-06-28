import axios from "axios";
import store from "../index";

const lessonModule = {
  state: () => ({
    lesson: {}, // Current lesson loaded in form
    project_lessons: [],
    program_lessons: [],
    lesson_stages: [],
    lessons_loaded: true,
    lesson_status: 0,
  }),
  actions: {
    fetchProgramLessons({ commit }, { programId }) {
      // Send GET request for all lessons contained within a program
      axios({
        method: "GET",
        url: `/api/v1/programs/${programId}/lessons.json`,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .attributes["content"].value,
        },
      })
        .then((res) => {
          console.log(res);
          // Mutate state with response from back end
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
    fetchProjectLessons({ commit }, { programId, projectId }) {
      commit("TOGGLE_LESSONS_LOADED", false);
      // Send GET request for all lessons contained within a project
      axios({
        method: "GET",
        url: `/api/v1/programs/${programId}/projects/${projectId}/lessons.json`,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .attributes["content"].value,
        },
      })
        .then((res) => {
          // Mutate state with response from back end
          commit("SET_PROJECT_LESSONS", res.data.lessons);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          commit("TOGGLE_LESSONS_LOADED", true);
        });
    },
    fetchLesson({ commit }, { id, programId, projectId }) {
      commit("TOGGLE_LESSONS_LOADED", false);
      // Retrieve lesson by id
      axios({
        method: "GET",
        url: `/api/v1/programs/${programId}/projects/${projectId}/lessons/${id}.json`,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .attributes["content"].value,
        },
      })
        .then((res) => {
          commit("SET_LESSON", res.data.lesson);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          commit("TOGGLE_LESSONS_LOADED", true);
        });
    },
    addLesson({ commit }, { lesson, programId, projectId }) {
      // Displays loader on front end
      commit("TOGGLE_LESSONS_LOADED", false);
      // Utilize utility function to prep Lesson form data
      let formData = lessonFormData(lesson);

      axios({
        method: "POST",
        url: `/api/v1/programs/${programId}/projects/${projectId}/lessons.json`,
        data: formData,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .attributes["content"].value,
        },
      })
        .then((res) => {
          commit("SET_LESSON", res.data.lesson);
          commit("SET_LESSON_STATUS", res.status);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          commit("TOGGLE_LESSONS_LOADED", true);
        });
    },
    updateLesson({ commit }, { lesson, programId, projectId, lessonId }) {
      // Displays loader on front end
      commit("TOGGLE_LESSONS_LOADED", false);
      // Utilize utility function to prep Lesson form data
      let formData = lessonFormData(lesson);

      axios({
        method: "PATCH",
        url: `/api/v1/programs/${programId}/projects/${projectId}/lessons/${lessonId}`,
        data: formData,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .attributes["content"].value,
        },
      })
        .then((res) => {
          commit("SET_LESSON", res.data.lesson);
          commit("SET_LESSON_STATUS", res.status);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          commit("TOGGLE_LESSONS_LOADED", true);
        });
    },
    deleteLesson({ commit }, { id, programId, projectId }) {
      // Delete a single lesson
      axios({
        method: "DELETE",
        url: `/api/v1/programs/${programId}/projects/${projectId}/lessons/${id}.json`,
        headers: {
          "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
            .attributes["content"].value,
        },
      })
        .then((res) => {
          commit("DELETE_LESSON", id);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {});
    },
  },
  mutations: {
    SET_PROGRAM_LESSONS: (state, lessons) => (state.project_lessons = lessons),
    SET_PROJECT_LESSONS: (state, lessons) => (state.project_lessons = lessons),
    SET_LESSON: (state, lesson) => (state.lesson = lesson),
    DELETE_LESSON: (state, id) => {
      // Find index of lesson to delete
      let index = state.project_lessons.findIndex((lesson) => lesson.id == id);
      // Remove lesson from array
      state.project_lessons.splice(index, 1);
    },
    SET_LESSON_STAGES: (state, lessonStages) =>
      (state.lesson_stages = lessonStages),
    TOGGLE_LESSONS_LOADED: (state, loaded) => (state.lessons_loaded = loaded),
    SET_LESSON_STATUS: (state, status) => (state.lesson_status = status),
  },
  getters: {
    lesson: (state) => state.lesson,
    projectLessons: (state) =>
      state.project_lessons
        .filter((lesson) => filterImportant(lesson))
        .filter((lesson) => filterNotImportant(lesson))
        .filter((lesson) => filterDrafts(lesson))
        .filter((lesson) => filterBriefings(lesson)),
    programLessons: (state) => state.program_lessons,
    lessonStages: (state) => state.lesson_stages,
    lessonsLoaded: (state) => state.lessons_loaded,
    lessonStatus: (state) => state.lesson_status,
  },
};
// Utility function to prepare form data from lesson object that is passed from LessonForm.vue
const lessonFormData = (lesson) => {
  let formData = new FormData();
  // Append all required form data
  formData.append("lesson[title]", lesson.title); // Required
  formData.append("lesson[description]", lesson.description); // Required
  formData.append("lesson[date]", lesson.date); // Required
  if (lesson.task_type_id) {
    formData.append("lesson[task_type_id]", lesson.task_type_id);
  }
  if (lesson.user_id) {
    formData.append("lesson[user_id]", lesson.user_id);
  }
  if (lesson.lesson_stage_id) {
    formData.append("lesson[lesson_stage_id]", lesson.lesson_stage_id);
  }
  formData.append("lesson[important]", lesson.important || false);
  formData.append("lesson[reportable]", lesson.reportable || false);
  formData.append("lesson[draft]", lesson.draft || false);
  // Prep Related Tasks
  lesson.sub_task_ids.forEach((id) => {
    formData.append("lesson[sub_task_ids][]", id);
  });
  // Prep Related Issues
  lesson.sub_issue_ids.forEach((id) => {
    formData.append("lesson[sub_issue_ids][]", id);
  });
  // Prep Related Risks
  lesson.sub_risk_ids.forEach((id) => {
    formData.append("lesson[sub_risk_ids][]", id);
  });
  // Prep Successes
  lesson.successes.forEach((success) => {
    Object.entries(success).forEach(([key, value]) => {
      formData.append(`lesson[successes][][${key}]`, value);
    });
  });
  // Prep Failures
  lesson.failures.forEach((failure) => {
    Object.entries(failure).forEach(([key, value]) => {
      formData.append(`lesson[failures][][${key}]`, value);
    });
  });
  // Prep Best Practices
  lesson.best_practices.forEach((bestPractice) => {
    Object.entries(bestPractice).forEach(([key, value]) => {
      formData.append(`lesson[best_practices][][${key}]`, value);
    });
  });
  // Prep Updates
  lesson.notes_attributes.forEach((update) => {
    Object.entries(update).forEach(([key, value]) => {
      formData.append(`lesson[notes_attributes][][${key}]`, value);
    });
  });
  // Prep Files
  lesson.attach_files.forEach((file) => {
    formData.append("lesson[lesson_files][]", file);
  });
  // Prep File Links
  lesson.file_links.forEach((link) => {
    formData.append("file_links[]", link.name);
  });
  // Prep File Ids to be destroyed
  lesson.destroy_file_ids.forEach((id) => {
    formData.append("lesson[destroy_file_ids][]", id);
  });

  return formData;
};

const filterImportant = (lesson) => {
  return store.getters.getAdvancedFilter
    .map((filter) => filter.id)
    .includes("important")
    ? lesson.important
    : true;
};

const filterNotImportant = (lesson) => {
  return store.getters.getAdvancedFilter
    .map((filter) => filter.id)
    .includes("notImportant")
    ? !lesson.important
    : true;
};

const filterDrafts = (lesson) => {
  return store.getters.getAdvancedFilter
    .map((filter) => filter.id)
    .includes("draft")
    ? !lesson.important
    : true;
};

const filterBriefings = (lesson) => {
  return store.getters.getAdvancedFilter
    .map((filter) => filter.id)
    .includes("reportable")
    ? lesson.reportable
    : true;
};

export default lessonModule;
