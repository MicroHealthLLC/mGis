//= require active_admin/base
//= require activeadmin_addons/all
//= require jquery_ujs
//= require activestorage
//= require 'node_modules/vue2-google-maps/dist/vue-google-maps.js'
//= require 'node_modules/vue-slide-bar/lib/vue-slide-bar.min.js'
//= require 'node_modules/vue-phone-number-input/dist/vue-phone-number-input.umd.js'
//= require 'node_modules/vue-multiselect/dist/vue-multiselect.min.js'

function checkRiskProbabilityImpactNumber(element) {
  if ($(element).val() > 5) {
    $(element).val(5);
  } else if($(element).val() < 0) {
    $(element).val(0);
  }
}

jQuery(function($) {

  // Add placeholder to for organization select
  $("#user_organization_input .select2").select2({
    placeholder: "Search and select an organization",
    allowClear: true
  });

  $("#task_task_stage_input .select2").select2({
    placeholder: "Search and select a Stage",
    allowClear: true
  });
  $("#issue_issue_stage_input .select2").select2({
    placeholder: "Search and select a Stage",
    allowClear: true
  });

  // project index page
  $("#index_table_projects td.col-status").each(function() {
    this.parentElement.classList.value = "";
    this.parentElement.classList.add(`status_${$(this).text()}`);
  });

  // facility_group index page
  $("#index_table_facility_groups td.col-status").each(function() {
    this.parentElement.classList.value = "";
    this.parentElement.classList.add(`status_${$(this).text()}`);
  });

  //risk probability level labels 
  $('#risk_probability_text').append(
    '<div class="risk_prob_level"><span id="riskText">Probability Levels:</span> <div class="risk_probability">1 - Rare</div><div class="risk_probability bg-danger">2 - Unlikely</div><div class="risk_probability">3 - Possible</div> <div class="risk_probability">4 - Likely</div><div class="risk_probability">5 - Almost Certain</div></div');    

  $('#risk_impact_text').append(
      '<div class="risk_prob_level"><span id="riskText">Impact Levels:</span> <div class="risk_probability">1 - Negligible</div><div class="risk_probability">2 - Minor</div><div class="risk_probability">3 - Moderate</div> <div class="risk_probability">4 - Major</div><div class="risk_probability">5 - Catastrophic</div></div')
 
      // direct file-upload for tasks/issues
  $.directFileUpload = (file) => {
    const url = $("#direct-upload-url").data('directUploadUrl');
    const upload = new ActiveStorage.DirectUpload(file, url);
    return new Promise((resolve, reject) => {
      upload.create((error, blob) => {
        if (error) reject(error);
        else resolve(blob);
      });
    });
  }

  // facility form google-map
  if ($("#gmaps-tab").is(":visible"))
  {
    let google_map_key = $("#gmap-key") ? $("#gmap-key").data().key : ""
    Vue.use(VueGoogleMaps, {
      load: {
        key: google_map_key,
        libraries: 'places',
      },
      installComponents: true
    });

    let GmapAutocomplete = VueGoogleMaps.Autocomplete;
    let gmap = new Vue({
      el: "#gmaps-tab",
      components: {GmapAutocomplete},
      data() {
        return {
          center: {lat: 40.64, lng: -74.66},
          address: '',
          lat: '',
          lng: '',
          apiError: '',
          gmap_address: {}
        }
      },
      mounted() {
        this.setApiError();
        this.address = $("#facility_address").val();
        this.gmap_address.formatted_address = this.address;
        this.lat = $("#facility_lat").val();
        this.lng = $("#facility_lng").val();
        if (this.isAddressDrawn) {
          this.center = {lat: this.lat, lng: this.lng};
        }
      },
      methods: {
        setApiError() {
          this.apiError = $("#facility_address_input p").text() || '';
        },
        updateAddress(address) {
          this.gmap_address = address;
        }
      },
      computed: {
        isAddressDrawn() {
          return this.lat !== '' && this.lng !== '';
        },
        getLatLng() {
          this.center = {lat: Number(this.lat), lng: Number(this.lng)};
          return this.center;
        }
      },
      watch: {
        gmap_address: {
          handler: function(value) {
            this.address = value.formatted_address;
            $("#facility_address").val(this.address);
            if (value.geometry) {
              this.lat = value.geometry.location.lat();
              this.lng = value.geometry.location.lng();
              $("#facility_lat").val(this.lat);
              $("#facility_lng").val(this.lng);
            }
          }, deep: true
        }
      },
      template: `<li class='string input required stringish' id='facility_address_input_gmap'><label for='facility_address_input_gmap' class='label'>Address<abbr title="required">*</abbr></label><GmapAutocomplete class='gmap-input' :class="{'error' : apiError}" @place_changed="updateAddress" :value="address" @input.stop="address=$event.target.value" @keypress.enter="$event.preventDefault"></GmapAutocomplete><div v-if="isAddressDrawn" class='gmap-wraper'><GmapMap map-type-id="terrain" ref="googlemap" :zoom="15" :options="{rotateControl: false, minZoom: 2, zoomControl: true, mapTypeControl: false, scaleControl: false, streetViewControl: false, fullscreenControl: false}" style="width: 100%; height: 99%" :center="center"><GmapMarker :animation="4" :position="getLatLng" /></GmapMap></div><p v-if="apiError" class="inline-errors">{{apiError}}</p></li>`
    });
  }

  // User form google-map
  if ($("#user-gmaps-tab").is(":visible"))
  {
    let google_map_key = $("#gmap-key") ? $("#gmap-key").data().key : "";
    Vue.use(VueGoogleMaps, {
      load: {
        key: google_map_key,
        libraries: 'places',
      },
      installComponents: true
    });

    let GmapAutocomplete = VueGoogleMaps.Autocomplete;
    let gmap = new Vue({
      el: "#user-gmaps-tab",
      components: {GmapAutocomplete},
      data() {
        return {
          center: {lat: 40.64, lng: -74.66},
          address: '',
          lat: '',
          lng: '',
          apiError: '',
          gmap_address: {}
        }
      },
      mounted() {
        this.setApiError();
        this.address = $("#user_address").val();
        this.gmap_address.formatted_address = this.address;
        this.lat = $("#user_lat").val();
        this.lng = $("#user_lng").val();
        if (this.isAddressDrawn) {
          this.center = {lat: this.lat, lng: this.lng};
        }
      },
      methods: {
        setApiError() {
          this.apiError = $("#user_address_input p").text() || '';
        },
        updateAddress(address) {
          this.gmap_address = address;
        }
      },
      computed: {
        isAddressDrawn() {
          return this.lat !== '' && this.lng !== '';
        },
        getLatLng() {
          this.center = {lat: Number(this.lat), lng: Number(this.lng)};
          return this.center;
        }
      },
      watch: {
        gmap_address: {
          handler: function(value) {
            this.address = value.formatted_address;
            $("#user_address").val(this.address);
            if (value.geometry) {
              this.lat = value.geometry.location.lat();
              this.lng = value.geometry.location.lng();
              $("#user_lat").val(this.lat);
              $("#user_lng").val(this.lng);
            }
          }, deep: true
        }
      },
      template: `<li class='string input required stringish' id='user_address_input_gmap'><label for='user_address_input_gmap' class='label'>Address</label><GmapAutocomplete class='gmap-input' :class="{'error' : apiError}" @place_changed="updateAddress" :value="address" @input.stop="address=$event.target.value" @keypress.enter="$event.preventDefault"></GmapAutocomplete><div v-if="isAddressDrawn" class='gmap-wraper'><GmapMap map-type-id="terrain" ref="googlemap" :zoom="15" :options="{rotateControl: false, minZoom: 2, zoomControl: true, mapTypeControl: false, scaleControl: false, streetViewControl: false, fullscreenControl: false}" style="width: 100%; height: 99%" :center="center"><GmapMarker :animation="4" :position="getLatLng" /></GmapMap></div><p v-if="apiError" class="inline-errors">{{apiError}}</p></li>`
    });
  }

  // user form phone_number_tab
  if ($("#user_phone_number-tab").is(":visible"))
  {
    Vue.component('vue-phone-number-input', window['vue-phone-number-input']);
    let phone_number = new Vue({
      el: "#user_phone_number-tab",
      data() {
        return {
          phoneData: {},
          phoneNumber: '',
          countryCode: '',
          loading: true,
          error: false,
          apiError: ''
        }
      },
      mounted() {
        this.setApiError();
        this.phoneNumber = $("#user_phone_number").val();
        this.countryCode = $("#user_country_code").val();
        this.loading = false;
      },
      methods: {
        setApiError() {
          this.apiError = $("#user_phone_number_input p").text() || '';
        },
        onUpdate(data) {
          this.phoneData = data;
          this.error = !data.isValid;
          if (data.formattedNumber)
          {
            this.phoneNumber = data.formattedNumber;
            this.countryCode = data.countryCode;
          }
        }
      },
      watch: {
        phoneNumber(value) {
          let ph_number = this.error ? '' : this.phoneNumber;
          $("#user_phone_number").val(ph_number);
        },
        countryCode(value) {
          $("#user_country_code").val(this.countryCode);
        }
      },
      computed: {
        phone() {
          return this.phoneData.phoneNumber ? this.phoneData.formatNational : this.phoneNumber;
        },
        code() {
          return this.phoneData.phoneNumber ? this.phoneData.countryCode : this.countryCode;
        }
      },
      template: `<li class='string input required stringish' id='user_phone_number_input_tel'><label for='user_phone_number_input_tel' class='label'>Phone number</label><div v-if="!loading"><vue-phone-number-input :value="phone" @update="onUpdate" id="phone-number__input" :default-country-code="code" ></vue-phone-number-input></div><p v-if="apiError" class="inline-errors">{{apiError}}</p></li>`
    });
  }

  // facility form phone_number_tab
  if ($("#f_phone_number-tab").is(":visible"))
  {
    Vue.component('vue-phone-number-input', window['vue-phone-number-input']);
    let phone_number = new Vue({
      el: "#f_phone_number-tab",
      data() {
        return {
          phoneData: {},
          phoneNumber: '',
          countryCode: '',
          loading: true,
          error: false,
          apiError: ''
        }
      },
      mounted() {
        this.setApiError();
        this.phoneNumber = $("#facility_phone_number").val();
        this.countryCode = $("#facility_country_code").val();
        this.loading = false;
      },
      methods: {
        setApiError() {
          this.apiError = $("#facility_phone_number_input p").text() || '';
        },
        onUpdate(data) {
          this.phoneData = data;
          this.error = !data.isValid;
          if (data.formattedNumber)
          {
            this.phoneNumber = data.formattedNumber;
            this.countryCode = data.countryCode;
          }
        }
      },
      watch: {
        phoneNumber(value) {
          let ph_number = this.error ? '' : this.phoneNumber;
          $("#facility_phone_number").val(ph_number);
        },
        countryCode(value) {
          $("#facility_country_code").val(this.countryCode);
        }
      },
      computed: {
        phone() {
          return this.phoneData.phoneNumber ? this.phoneData.formatNational : this.phoneNumber;
        },
        code() {
          return this.phoneData.phoneNumber ? this.phoneData.countryCode : this.countryCode;
        }
      },
      template: `<li class='string input required stringish' id='facility_phone_number_input_tel'><label for='facility_phone_number_input_tel' class='label'>Phone number<abbr title="required">*</abbr></label><div v-if="!loading"><vue-phone-number-input :value="phone" @update="onUpdate" id="phone-number__input" :default-country-code="code" ></vue-phone-number-input></div><p v-if="apiError" class="inline-errors">{{apiError}}</p></li>`
    });
  }

  // task/issue form slider tab
  if ($("#progress_slider-tab").is(":visible"))
  {
    Vue.component('vue-slide-bar', vueSlideBar);
    $.Vue_task_slider = new Vue({
      el: "#progress_slider-tab",
      data() {
        return {
          progress: 0,
          autoCalculate: false,
          tab_type: ''
        }
      },
      mounted() {
        this.tab_type = $('form').attr('id').split('_').pop();
        this.setAutoCalculate();
        this.progress = $(`#${this.tab_type}_progress`).val();
      },
      methods: {
        setAutoCalculate() {
          this.autoCalculate = $(`#${this.tab_type}_auto_calculate`).is(':checked');
        },
        calculateProgress() {
          let isCheked = total = 0;
          $(".has_many_container.checklists fieldset").each(function() {
            if (!$(this).is(':visible')) return;
            if (this.querySelector("input[type=text]").value.trim()) {
              if (this.querySelector("input[type=checkbox]").checked) isCheked+=1;
              total+=1;
            }
          });
          this.progress = Number(((isCheked / total) * 100).toFixed(2)) || 0;
        }
      },
      watch: {
        progress(value) {
          $(`#${this.tab_type}_progress`).val(value);
        },
        autoCalculate(value) {
          if (!value) return;
          this.calculateProgress();
        }
      },
      template: `<li class='string input required stringish' id='task_progress_input_slider'><label  class='label'>Progress<abbr title="required">*</abbr></label><div class="task-progress-slide"><vue-slide-bar v-model="progress" :line-height="8" :is-disabled="autoCalculate" :draggable="!autoCalculate" /></div></li>`
    });
  }

  // facilities projects list
  if ($("#facility_projects-tab").css('display') === 'block')
  {
    let facility_id = $("#facility_projects-tab") ? $("#facility_projects-tab").data().key : ''
    let facility_projects_tab = new Vue({
      el: "#facility_projects-tab",
      data() {
        return {
          loading: true,
          editable: false,
          projects: [],
          project: {}
        }
      },
      mounted() {
        let cb = () => this.loading = false;
        if (facility_id) this.fetchFacilityProjects(cb);
      },
      methods: {
        fetchFacilityProjects(cb) {
          $.get(`/facilities/${facility_id}/facility_projects.json`, (data) => {
            this.projects = data;
            this.fetchStatuses(cb);
          });
        },
        fetchStatuses(cb) {
          $.get("/api/statuses.json", (data) => {
            this.statuses = data.statuses;
            return cb();
          });
        },
        openEditModal(project) {
          $("body").append('<div id="dimmer" class="ui-widget-overlay ui-front" style="z-index: 1001;"></div>');
          this.editable = true;
          this.project = Object.assign({}, project);
        },
        handleClose() {
          this.editable = false;
          $("#dimmer").remove();
          this.project = {};
        },
        handleSubmit() {
          let data = {facility_project: {due_date: this.project.due_date, status_id: this.project.status_id}};
          let _this = this;
          $.ajax({
            url: `/facilities/${facility_id}/facility_projects/${this.project.id}.json`,
            type: 'PUT',
            data: data,
            success: function(res) {
              let index = _this.projects.findIndex(p => p.id === res.id);
              _this.projects[index] = res;
              _this.handleClose();
            }
          });
        }
      },
      template: `<div v-if="!loading">
        <div id='project_vue_tab' class="index_as_table">
          <table border="0" cellspacing="0" cellpadding="0" class="index_table index" paginator="true">
            <thead>
              <tr>
                <th class="col col-project">Project</th>
                <th class="col col-due_date">Due Date</th>
                <th class="col col-status">Status</th>
                <th class="col col-actions"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project in projects" :key="project.id">
                <td class="col col-project">{{project.project.name}}</td>
                <td class="col col-due_date">{{project.due_date || '-'}}</td>
                <td class="col col-status">{{project.status_name || '-'}}</td>
                <td class="col col-actions">
                  <div class="table_actions">
                    <a class="edit_link member_link" title="Edit" href="#" @click.prevent="openEditModal(project)">Edit</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="editable">
          <div tabindex="-1" role="dialog" style="position: fixed; height: auto; width: 300px; top: 155.625px; left: 489.578px;" class="ui-dialog ui-corner-all ui-widget ui-widget-content ui-front active_admin_dialog ui-dialog-buttons ui-draggable ui-resizable" aria-describedby="dialog_confirm" aria-labelledby="ui-id-1">
            <div class="ui-dialog-titlebar ui-corner-all ui-widget-header ui-helper-clearfix ui-draggable-handle">
              <span id="ui-id-1" class="ui-dialog-title">Are you sure you want to do this?</span>
              <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="Close">
                <span class="ui-button-icon ui-icon ui-icon-closethick"></span>
                <span class="ui-button-icon-space"> </span>Close</button>
            </div>
            <form id="dialog_confirm" class="ui-dialog-content ui-widget-content" style="width: auto; min-height: 49.25px; max-height: none; height: auto;">
              <ul>
                <li>
                  <label>Project</label>
                  <input name="project" class="text" type="text" readOnly :value="project.project.name">
                </li>
                <li>
                  <label>Status</label>
                  <select name="Status" class="" v-model="project.status_id">
                    <option v-for="status in statuses" :value="status.id">{{status.name}}</option>
                  </select>
                </li>
                <li>
                  <label>Due Date</label>
                  <input name="Due Date" class="datepicker" type="date" v-model="project.due_date">
                </li>
              </ul>
            </form>
            <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
              <div class="ui-dialog-buttonset">
                <button type="button" class="ui-button ui-corner-all ui-widget" @click.prevent="handleSubmit">OK</button>
                <button type="button" class="ui-button ui-corner-all ui-widget" @click="handleClose">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>`
    });
  }

  // user role previliges
  if ($("#user-role_privilege-tab").is(":visible"))
  {
    let role_privilege = new Vue({
      el: "#user-role_privilege-tab",
      data() {
        return {
          loading: true,
          facility_manager_view: {
            read: false,
            write: false,
            delete: false
          },
          sheets_view: {
            read: false,
            write: false,
            delete: false
          },
          map_view: {
            read: false,
            write: false,
            delete: false
          },
          gantt_view: {
            read: false,
            write: false,
            delete: false
          },
          watch_view: {
            read: false,
            write: false,
            delete: false
          },
          kanban_view: {
            read: false,
            write: false,
            delete: false
          },
          documents: {
            read: false,
            write: false,
            delete: false
          },
          members: {
            read: false,
            write: false,
            delete: false
          },
          overview: {
            read: false,
            write: false,
            delete: false
          },
          tasks: {
            read: false,
            write: false,
            delete: false
          },
          issues: {
            read: false,
            write: false,
            delete: false
          },
          risks: {
            read: false,
            write: false,
            delete: false
          },
          notes: {
            read: false,
            write: false,
            delete: false
          },
          admin: {
            read: false,
            write: false,
            delete: false
          }
        }
      },
      mounted() {
        this.writePrivileges();
        this.$nextTick(() => {
          this.loading = false;
        })
      },
      methods: {
        writePrivileges() {
          let overview = $("#role_privilege_attributes_overview").val() || "";
          let tasks = $("#role_privilege_attributes_tasks").val() || "";
          let issues = $("#role_privilege_attributes_issues").val() || "";
          let risks = $("#role_privilege_attributes_risks").val() || "";
          let notes = $("#role_privilege_attributes_notes").val() || "";
          let admin = $("#role_privilege_attributes_admin").val() || "";
          let map_view = $("#role_privilege_attributes_map_view").val() || "";
          let facility_manager_view = $("#role_privilege_attributes_facility_manager_view").val() || "";
          let sheets_view = $("#role_privilege_attributes_sheets_view").val() || "";
          let gantt_view = $("#role_privilege_attributes_gantt_view").val() || "";
          let watch_view = $("#role_privilege_attributes_watch_view").val() || "";
          let kanban_view = $("#role_privilege_attributes_kanban_view").val() || "";
          let documents = $("#role_privilege_attributes_documents").val() || "";
          let members = $("#role_privilege_attributes_members").val() || "";
          this.overview = {
            read: overview.includes("R"),
            write: overview.includes("W"),
            delete: overview.includes("D")
          }
          this.tasks = {
            read: tasks.includes("R"),
            write: tasks.includes("W"),
            delete: tasks.includes("D")
          }
          this.issues = {
            read: issues.includes("R"),
            write: issues.includes("W"),
            delete: issues.includes("D")
          }
          this.risks = {
            read: risks.includes("R"),
            write: risks.includes("W"),
            delete: risks.includes("D")
          }
          this.notes = {
            read: notes.includes("R"),
            write: notes.includes("W"),
            delete: notes.includes("D")
          }
          this.admin = {
            read: admin.includes("R"),
            write: admin.includes("W"),
            delete: admin.includes("D")
          }
          this.map_view = {
            read: map_view.includes("R"),
            write: map_view.includes("W"),
            delete: map_view.includes("D")
          }
          this.facility_manager_view = {
            read: facility_manager_view.includes("R"),
            write: facility_manager_view.includes("W"),
            delete: facility_manager_view.includes("D")
          }
          this.sheets_view = {
            read: sheets_view.includes("R"),
            write: sheets_view.includes("W"),
            delete: sheets_view.includes("D")
          }
          this.gantt_view = {
            read: gantt_view.includes("R"),
            write: gantt_view.includes("W"),
            delete: gantt_view.includes("D")
          }
          this.watch_view = {
            read: watch_view.includes("R"),
            write: watch_view.includes("W"),
            delete: watch_view.includes("D")
          }
          this.kanban_view = {
            read: kanban_view.includes("R"),
            write: kanban_view.includes("W"),
            delete: kanban_view.includes("D")
          }
          this.documents = {
            read: documents.includes("R"),
            write: documents.includes("W"),
            delete: documents.includes("D")
          }
          this.members = {
            read: members.includes("R"),
            write: members.includes("W"),
            delete: members.includes("D")
          }
        }
      },
      watch: {
        "overview.read"(value) {
          if (this.loading) return;
          if (!value) this.overview.read = true;
          let v = $("#role_privilege_attributes_overview").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.overview.write = false;
            this.overview.delete = false;
          }
          $("#role_privilege_attributes_overview").val(v);
        },
        "overview.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_overview").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.overview.read = value;
          $("#role_privilege_attributes_overview").val(v);
        },
        "overview.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_overview").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.overview.read = value;
          $("#role_privilege_attributes_overview").val(v);
        },
        "tasks.read"(value) {
          if (this.loading) return;
          if (!value) this.tasks.read = true;
          let v = $("#role_privilege_attributes_tasks").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.tasks.write = false;
            this.tasks.delete = false;
          }
          $("#role_privilege_attributes_tasks").val(v);
        },
        "tasks.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_tasks").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.tasks.read = value;
          $("#role_privilege_attributes_tasks").val(v);
        },
        "tasks.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_tasks").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.tasks.read = value;
          $("#role_privilege_attributes_tasks").val(v);
        },
        "issues.read"(value) {
          if (this.loading) return;
          if (!value) this.issues.read = true;
          let v = $("#role_privilege_attributes_issues").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.issues.write = false;
            this.issues.delete = false;
          }
          $("#role_privilege_attributes_issues").val(v);
        },
        "issues.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_issues").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.issues.read = value;
          $("#role_privilege_attributes_issues").val(v);
        },
        "issues.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_issues").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.issues.read = value;
          $("#role_privilege_attributes_issues").val(v);
        },
        "risks.read"(value) {
          if (this.loading) return;
          if (!value) this.risks.read = true;
          let v = $("#role_privilege_attributes_risks").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.risks.write = false;
            this.risks.delete = false;
          }
          $("#role_privilege_attributes_risks").val(v);
        },
        "risks.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_risks").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.risks.read = value;
          $("#role_privilege_attributes_risks").val(v);
        },
        "risks.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_risks").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.risks.read = value;
          $("#role_privilege_attributes_risks").val(v);
        },
        "notes.read"(value) {
          if (this.loading) return;
          if (!value) this.notes.read = true;
          let v = $("#role_privilege_attributes_notes").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.notes.write = false;
            this.notes.delete = false;
          }
          $("#role_privilege_attributes_notes").val(v);
        },
        "notes.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_notes").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.notes.read = value;
          $("#role_privilege_attributes_notes").val(v);
        },
        "notes.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_notes").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.notes.read = value;
          $("#role_privilege_attributes_notes").val(v);
        },
        "admin.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_admin").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.admin.write = false;
            this.admin.delete = false;
          }
          $("#role_privilege_attributes_admin").val(v);
        },
        "admin.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_admin").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.admin.read = value;
          $("#role_privilege_attributes_admin").val(v);
        },
        "admin.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_admin").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.admin.read = value;
          $("#role_privilege_attributes_admin").val(v);
        },
        "map_view.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_map_view").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.map_view.write = false;
            this.map_view.delete = false;
          }
          $("#role_privilege_attributes_map_view").val(v);
        },
        "map_view.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_map_view").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.map_view.read = value;
          $("#role_privilege_attributes_map_view").val(v);
        },
        "map_view.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_map_view").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.map_view.read = value;
          $("#role_privilege_attributes_map_view").val(v);
        },
        "gantt_view.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_gantt_view").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.gantt_view.write = false;
            this.gantt_view.delete = false;
          }
          $("#role_privilege_attributes_gantt_view").val(v);
        },
        "gantt_view.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_gantt_view").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.gantt_view.read = value;
          $("#role_privilege_attributes_gantt_view").val(v);
        },
        "gantt_view.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_gantt_view").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.gantt_view.read = value;
          $("#role_privilege_attributes_gantt_view").val(v);
        },
        "facility_manager_view.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_facility_manager_view").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.facility_manager_view.write = false;
            this.facility_manager_view.delete = false;
          }
          $("#role_privilege_attributes_facility_manager_view").val(v);
        },
        "facility_manager_view.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_facility_manager_view").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.facility_manager_view.read = value;
          $("#role_privilege_attributes_facility_manager_view").val(v);
        },
        "facility_manager_view.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_facility_manager_view").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.facility_manager_view.read = value;
          $("#role_privilege_attributes_facility_manager_view").val(v);
        },
        "sheets_view.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_sheets_view").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.sheets_view.write = false;
            this.sheets_view.delete = false;
          }
          $("#role_privilege_attributes_sheets_view").val(v);
        },
        "sheets_view.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_sheets_view").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.sheets_view.read = value;
          $("#role_privilege_attributes_sheets_view").val(v);
        },
        "sheets_view.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_sheets_view").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.sheets_view.read = value;
          $("#role_privilege_attributes_sheets_view").val(v);
        },
        "watch_view.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_watch_view").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.watch_view.write = false;
            this.watch_view.delete = false;
          }
          $("#role_privilege_attributes_watch_view").val(v);
        },
        "watch_view.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_watch_view").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.watch_view.read = value;
          $("#role_privilege_attributes_watch_view").val(v);
        },
        "watch_view.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_watch_view").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.watch_view.read = value;
          $("#role_privilege_attributes_watch_view").val(v);
        },
        "kanban_view.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_kanban_view").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.kanban_view.write = false;
            this.kanban_view.delete = false;
          }
          $("#role_privilege_attributes_kanban_view").val(v);
        },
        "kanban_view.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_kanban_view").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.kanban_view.read = value;
          $("#role_privilege_attributes_kanban_view").val(v);
        },
        "kanban_view.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_kanban_view").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.kanban_view.read = value;
          $("#role_privilege_attributes_kanban_view").val(v);
        },
        "documents.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_documents").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.documents.write = false;
            this.documents.delete = false;
          }
          $("#role_privilege_attributes_documents").val(v);
        },
        "documents.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_documents").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.documents.read = value;
          $("#role_privilege_attributes_documents").val(v);
        },
        "documents.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_documents").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.documents.read = value;
          $("#role_privilege_attributes_documents").val(v);
        },
        "members.read"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_members").val();
          v = value ? v + "R" : v.replace("R", "")
          if (!value) {
            this.members.write = false;
            this.members.delete = false;
          }
          $("#role_privilege_attributes_members").val(v);
        },
        "members.write"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_members").val();
          v = value ? v + "W" : v.replace("W", "")
          if (value) this.members.read = value;
          $("#role_privilege_attributes_members").val(v);
        },
        "members.delete"(value) {
          if (this.loading) return;
          let v = $("#role_privilege_attributes_members").val();
          v = value ? v + "D" : v.replace("D", "")
          if (value) this.members.read = value;
          $("#role_privilege_attributes_members").val(v);
        }
      },
      template: `<div class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false">
        <fieldset v-if="!loading" class="inputs">
          <legend><span>Privileges</span></legend>
          <ol class="choices-group">
            <li class="choice d-flex">
              <label>Facility Manager</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="facility_manager_view.read">Read</label>
            </li>
            <li class="choice d-flex">
            <label>Sheets</label>
            <label class="d-flex align-center"><input type="checkbox" disabled v-model="sheets_view.read">Read</label>
           </li>
            <li class="choice d-flex">
              <label>Map</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="map_view.read">Read</label>
            </li>
            <li class="choice d-flex">
              <label>Gantt</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="gantt_view.read">Read</label>
            </li>
            <li class="choice d-flex">
              <label>On Watch</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="watch_view.read">Read</label>
            </li>
            <li class="choice d-flex">
              <label>Kanban</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="kanban_view.read">Read</label>
            </li>
            <li class="choice d-flex">
            <label>Documents</label>
            <label class="d-flex align-center"><input type="checkbox" v-model="documents.read">Read</label>
           </li>
           <li class="choice d-flex">
            <label>Members</label>
            <label class="d-flex align-center"><input type="checkbox" v-model="members.read">Read</label>
           </li>
            <li class="choice d-flex">
              <label>Overview</label>
              <label class="d-flex align-center" :readOnly="overview.read"><input type="checkbox" v-model="overview.read" :readOnly="overview.read">Read</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="overview.write">Write</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="overview.delete">Delete</label>
            </li>
            <li class="choice d-flex">
              <label>Tasks</label>
              <label class="d-flex align-center" :readOnly="tasks.read"><input type="checkbox" v-model="tasks.read" :readOnly="tasks.read">Read</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="tasks.write">Write</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="tasks.delete">Delete</label>
            </li>
            <li class="choice d-flex">
              <label>Issues</label>
              <label class="d-flex align-center" :readOnly="issues.read"><input type="checkbox" v-model="issues.read" :readOnly="issues.read">Read</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="issues.write">Write</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="issues.delete">Delete</label>
            </li>
            <li class="choice d-flex">
              <label>Risks</label>
              <label class="d-flex align-center" :readOnly="risks.read"><input type="checkbox" v-model="risks.read" :readOnly="risks.read">Read</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="risks.write">Write</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="risks.delete">Delete</label>
            </li>
            <li class="choice d-flex">
              <label>Notes</label>
              <label class="d-flex align-center" :readOnly="notes.read"><input type="checkbox" v-model="notes.read" :readOnly="notes.read">Read</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="notes.write">Write</label>
              <label class="d-flex align-center"><input type="checkbox" v-model="notes.delete">Delete</label>
            </li>
          </ol>
        </fieldset>
      </div>`
    });
  }

  $(document).on('ready page:load turbolinks:load', function()
  {
    // destroy user session and storage
    $('#logout').click(function () {
      localStorage.removeItem('vuex');
    });

    if ($("#__privileges").is(":visible") || $("#__privileges_id").length) {
      $.__privileges_element = $("#__privileges").is(":visible") ? $("#__privileges").data('privilege') : $("#__privileges_id").val();
      $("#q_id_input").length && $("#q_id_input").remove();
      let p_write = $.__privileges_element.includes("W");
      let p_delete = $.__privileges_element.includes("D");
      if (p_write) {
        $("#titlebar_right .action_items").show();
      } else {
        $("#titlebar_right .action_items").remove();
      }
      if (!p_delete && !p_write) {
        $(".batch_actions_selector").remove();
      } else {
        $(".batch_actions_selector").show();
      }
    }

    // settings page
    if ($("#settings_container").is(":visible"))
    {
      let settings = new Vue({
        el: "#settings_container",
        data() {
          return {
            currentTab: 1,
            isEditing: false,
            loading: true,
            settings: {
              office365_key: '',
              office365_secret: '',
              google_map_key: '',
              google_oauth_key: '',
              google_oauth_secret: '',
              passwords_key: ''
            },
            passwords: {
              range: 8,
              uppercase: false,
              lowercase: false,
              numbers: false,
              special_chars: false
            }
          }
        },
        mounted() {
          this.fetchSettings();
        },
        computed: {
          textType() {
            return this.isEditing ? 'text' : 'password';
          },
          permitted() {
            return $.__privileges_element.includes('W');
          }
        },
        methods: {
          submitSettings() {
            if (!this.permitted) return;
            $.post("/api/settings.json", {settings: this.settings}, (data) => {
              window.location.href = "/admin/settings";
            });
          },
          fetchSettings() {
            $.get("/api/settings.json", (data) => {
              for (let key in this.settings) {
                this.settings[key] = data[key] || '';
              }
              if (this.settings.passwords_key) {
                for (let [key, value] of Object.entries(JSON.parse(this.settings.passwords_key))) {
                  this.passwords[key] = value || '';
                }
              }
              this.loading = false;
            });
          }
        },
        watch: {
          passwords: {
            handler(value) {
              this.settings.passwords_key = JSON.stringify(value);
            }, deep: true
          }
        },
        template: `<div>
          <button v-if="permitted" class="edit-creds" :class="{'vue__disabled': isEditing}" @click.stop="isEditing=true">Edit</button>
          <form v-if="!loading" class="formtastic settings" @submit.prevent="submitSettings">
            <div class="tabs ui-tabs ui-corner-all ui-widget ui-widget-content">
              <ul class="nav nav-tabs ui-tabs-nav ui-corner-all ui-helper-reset ui-helper-clearfix ui-widget-header" role="tablist">
                <li role="tab" tabindex="0" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="office365" aria-labelledby="ui-id-1" :class="{'ui-tabs-active ui-state-active': currentTab == 1}"><a @click.stop.prevent="currentTab = 1" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-1">Office 365</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="google_oauth" aria-labelledby="ui-id-2" :class="{'ui-tabs-active ui-state-active': currentTab == 2}"><a @click.stop.prevent="currentTab = 2" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-2">Google OAuth</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="google_map" aria-labelledby="ui-id-3" :class="{'ui-tabs-active ui-state-active': currentTab == 3}"><a @click.stop.prevent="currentTab = 3" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-3">Google Maps</a></li>
                <li role="tab" tabindex="-1" class="ui-tabs-tab ui-corner-top ui-state-default ui-tab" aria-controls="password_generator" aria-labelledby="ui-id-3" :class="{'ui-tabs-active ui-state-active': currentTab == 4}"><a @click.stop.prevent="currentTab = 4" role="presentation" tabindex="-1" class="ui-tabs-anchor" id="ui-id-3">Password Generator</a></li>
              </ul>
              <div class="tab-content">
                <div id="office365" aria-labelledby="ui-id-1" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false" v-show="currentTab === 1">
                  <fieldset class="inputs"><legend><span>Office 365</span></legend>
                    <ol>
                      <li class="string input required stringish" id="office365_key_input"><label class="label">Office 365 key<abbr title="required">*</abbr></label><input :readOnly="!isEditing" id="office365_key" v-model="settings.office365_key" type="text"></li>
                      <li class="string input required stringish" id="office365_secret_input"><label class="label">Office 365 secret<abbr title="required">*</abbr></label><input :readOnly="!isEditing" id="office365_secret" v-model="settings.office365_secret" :type="textType"></li>
                    </ol>
                  </fieldset>
                </div>
                <div id="google_oauth" aria-labelledby="ui-id-2" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true" v-show="currentTab === 2">
                  <fieldset class="inputs"><legend><span>Google OAuth</span></legend>
                    <ol>
                      <li class="string input required stringish" id="google_oauth_key_input"><label class="label">Google oauth key<abbr title="required">*</abbr></label><input :readOnly="!isEditing" id="google_oauth_key" v-model="settings.google_oauth_key" type="text"></li>
                      <li class="string input required stringish" id="google_oauth_secret_input"><label class="label">Google oauth secret<abbr title="required">*</abbr></label><input :readOnly="!isEditing" id="google_oauth_secret" v-model="settings.google_oauth_secret" :type="textType"></li>
                    </ol>
                  </fieldset>
                </div>
                <div id="google_map" aria-labelledby="ui-id-3" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="true" v-show="currentTab === 3">
                  <fieldset class="inputs"><legend><span>Google Maps</span></legend>
                    <ol>
                      <li class="string input required stringish" id="google_maps_key_input"><label class="label">Google maps key<abbr title="required">*</abbr></label><input :readOnly="!isEditing" id="google_maps_key" v-model="settings.google_map_key" type="text"></li>
                    </ol>
                  </fieldset>
                </div>
                <div id="password_generator" aria-labelledby="ui-id-1" role="tabpanel" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false" v-show="currentTab === 4">
                  <fieldset class="inputs"><legend><span>Password Generator</span></legend>
                    <div class='p-generator'>
                      <ul class="choices-group">
                        <li class="choice range">
                          <label>Length ({{passwords.range}})</label>
                          <input :readOnly="!isEditing" :disabled="!isEditing" type="range" v-model="passwords.range" min="8" max="25">
                        </li>
                        <li class="choice">
                          <label><input :readOnly="!isEditing" :disabled="!isEditing" type="checkbox" v-model="passwords.uppercase">A-Z</label>
                        </li>
                        <li class="choice">
                          <label><input :readOnly="!isEditing" :disabled="!isEditing" type="checkbox" v-model="passwords.lowercase">a-z</label>
                        </li>
                        <li class="choice">
                          <label><input :readOnly="!isEditing" :disabled="!isEditing" type="checkbox" v-model="passwords.numbers">0-9</label>
                        </li>
                        <li class="choice">
                          <label><input :readOnly="!isEditing" :disabled="!isEditing" type="checkbox" v-model="passwords.special_chars">!@#$%^&*</label>
                        </li>
                      </ul>
                    </div>
                  </fieldset>
                </div>
              </div>
            </div>
            <fieldset class="actions" v-if="permitted && isEditing">
              <ol>
                <li class="action input_action " id="submit_settings"><input :readOnly="!isEditing" type="submit"></li>
              </ol>
            </fieldset>
          </form>
        </div>`
      });
    }

    // hide batch_action after click
    $('a.batch_action').click(function(e) {
      $('.dropdown_menu_list_wrapper').css({display: 'none'});
    });

    // add assign/unassign inputs in dialog_form
    $("a[data-action='Assign/Unassign Facility Group'], a[data-action='Assign/Unassign Project']").click(function(e) {
      e.stopPropagation();
      e.preventDefault();

      let input = $("form#dialog_confirm input[name=assign]");
      let li = input.parent();
      let ul = li.parent();
      li.remove();
      ul.prepend("<li class='radio__group'><input name='assign' type='radio' value='assign' checked><label>Assign</label><input name='assign' type='radio' value='unassign'><label>Unassign</label></li>");
    });

    // batch_action task form
    $('a[data-action=add_task]').click(function(e) {
      e.stopPropagation();
      e.preventDefault();

      // #add progress_bar auto_calculate plus checklists items
      let progress_input = $("form#dialog_confirm input[name=Progress]");
      progress_input.parent().parent().addClass("__batch_task_form");

      let assign_user_input = $("form#dialog_confirm input[name='Assign Users']");
      let auto_calculate_input = $("form#dialog_confirm input[name=AutoCalculate]");
      let checklists_input = $("form#dialog_confirm input[name=Checklists]");
      let progress_parent = progress_input.parent();
      $(progress_parent).children().hide();
      $(assign_user_input.parent()).children().hide();
      $(auto_calculate_input.parent()).children().hide();
      $(checklists_input.parent()).children().hide();

      progress_parent.append("<div id='add_task_popup'></div>");

      if ($("#add_task_popup").is(":visible"))
      {
        Vue.component('vue-slide-bar', vueSlideBar);
        Vue.component('multiselect', VueMultiselect.Multiselect);
        $.Vue_task_popup = new Vue({
          el: "#add_task_popup",
          data() {
            return {
              loading: true,
              project_id: '',
              progress: 0,
              auto_calculate: false,
              checklists: [],
              project_users: [],
              task_users: []
            }
          },
          mounted() {
            this.auto_calculate = true
            this.setProgressVal();
            this.setProjectConsts();
          },
          methods: {
            setProgressVal() {
              $("input[name=Progress]").val(this.progress);
            },
            setProjectConsts() {
              this.project_id = $("select[name=Project]").children("option:selected").val();
            },
            fetchProjectUsers() {
              $.get(`/api/users.json?project_id=${this.project_id}`, (data) => {
                this.project_users = data.filter(u => u.status == "active");
                this.loading = false;
              });
            },
            addCheck() {
              this.checklists.push({text: '', checked: false})
            },
            updateCheckItem(event, name, index) {
              if (name === 'text') {
                this.checklists[index].text = event.target.value;
                if (!event.target.value) this.checklists[index].checked = false;
              } else if (name === 'check' && this.checklists[index].text) {
                this.checklists[index].checked = event.target.checked;
              }
            },
            destroyCheck(check, index) {
              let i = check.id ? this.checklists.findIndex(c => c.id === check.id) : index;
              Vue.set(this.checklists, i, {...check, _destroy: true});
            },
            calculateProgress(checks=null) {
              try {
                if (!checks) checks = this.checklists;
                let checked = checks.filter(v => !v._destroy && v.checked && v.text.trim()).length;
                let total = checks.filter(v => !v._destroy && v.text.trim()).length;
                this.progress = Number((((checked / total) * 100) || 0).toFixed(2));
              } catch(err) {
                this.progress = 0;
              }
            },
            updateChecklistUsers() {
              let u_ids = this.project_users.map(p => p.id)
              for (let check of this.checklists) {
                check.user = check.user && u_ids.includes(check.user.id) ? check.user : null;
              }
            },
            updatechecklistUsersHash() {
              let checklists = [];
              for (let check of this.checklists) {
                if (check.text && !check._destroy) checklists.push({checked: check.checked, text: check.text, user_id: check.user ? check.user.id : null});
              }
              $("input[name=Checklists]").val(JSON.stringify(checklists));
            }
          },
          watch: {
            project_id(value) {
              this.fetchProjectUsers();
            },
            progress(value) {
              this.setProgressVal();
            },
            checklists: {
              handler: function(value) {
                if (this.auto_calculate) this.calculateProgress(value);
                this.updatechecklistUsersHash();
              }, deep: true
            },
            auto_calculate(value) {
              $("input[name=AutoCalculate]").prop('checked', value);
              if (value) this.calculateProgress();
            },
            task_users: {
              handler(value) {
                if (value) $("input[name='Assign Users']").val(value.map(u => u.id));
              }, deep: true
            },
            project_users: {
              handler(value) {
                let u_ids = value.map(u => u.id);
                this.task_users = this.task_users.filter(u => u_ids.includes(u.id));
                this.updateChecklistUsers();
              }, deep: true
            }
          },
          template: `<div v-if="!loading" class="task_progression">
            <div class="__users_tab">
              <label>Assign Users</label>
              <div class="user_multiselect">
                <multiselect
                  v-model="task_users"
                  track-by="id"
                  label="full_name"
                  placeholder="Search and select users"
                  :options="project_users"
                  :searchable="true"
                  :multiple="true"
                  select-label="Select"
                  deselect-label="Remove"
                  :close-on-select="false"
                  >
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name'>{{option.full_name}}</span>
                    </div>
                  </template>
                </multiselect>
              </div>
            </div>
            <label class="ml-20 mt-10" id="auto-calculate"><input type="checkbox" v-model="auto_calculate">Auto Calculate Progress</label>
            <div class="progress_tab">
              <label>Progress</label>
              <div class='w-80'>
                <vue-slide-bar v-model="progress" :line-height="8" :is-disabled="auto_calculate" :draggable="!auto_calculate" />
              </div>
            </div>
            <div class='checklist_tab'>
              <label>Checklist Items</label>
              <span @click="addCheck" class='plus-button mln-20'></span>
            </div>
            <div>
              <div v-for="(check, index) in checklists" class="check_item_tab mt-10" v-if="!check._destroy">
                <span class='close-icon' @click.prevent="destroyCheck(check, index)"></span>
                <div class="check_text w-100" :key="index">
                  <input type="checkbox" name="check" :checked="check.checked" @change="updateCheckItem($event, 'check', index)" :key="index" :disabled="!check.text.trim()" class="w-20">
                  <input :value="check.text" name="text" @input="updateCheckItem($event, 'text', index)" :key="index+999" placeholder="Check point" type="text" class="checklist-text">
                </div>
                <div class="user_multiselect checklist_select mt-10">
                  <multiselect
                    v-model="check.user"
                    track-by="id"
                    label="full_name"
                    placeholder="Search and Assign User"
                    :options="project_users"
                    :searchable="true"
                    :disabled="!check.text"
                    select-label="Select"
                    deselect-label="Remove"
                    >
                    <template slot="singleLabel" slot-scope="{option}">
                      <div class="d-flex">
                        <span class='select__tag-name'>{{option.full_name}}</span>
                      </div>
                    </template>
                  </multiselect>
                </div>
              </div>
            </div>
          </div>`
        });

        // on change project
        $("body").on('change', ".__batch_task_form select[name=Project]", function() {
          $.Vue_task_popup && $.Vue_task_popup.setProjectConsts();
        });

        // upload file
        let uploadfile_text = $("form#dialog_confirm input[name='Task Files']");
        uploadfile_text.css({display: 'none'});
        uploadfile_text.after("<input id='_task_files_upload' type='file' name='task_files' multiple='multiple'>");

        $("body").on('change', "#_task_files_upload", async function() {
          let file_blobs = [];
          for (let file of this.files) {
            try {
              let blob = await $.directFileUpload(file);
              if (!(blob instanceof Error)) file_blobs.push(blob);
            } catch (err) {
              console.log(err);
            }
          }
          $(uploadfile_text).val(JSON.stringify(file_blobs.map(f => f.id)));
        });
      }
    });

    // task form slider auto calculate and slider
    $("#task_auto_calculate").change(function(e) {
      $.Vue_task_slider && $.Vue_task_slider.setAutoCalculate();
    });
    $("#issue_auto_calculate").change(function(e) {
      $.Vue_task_slider && $.Vue_task_slider.setAutoCalculate();
    });

    $("body").on("click", ".checklists a.button.has_many_remove", function() {
      $(this.parentElement.parentElement.parentElement).hide();
      if ($.Vue_task_slider.autoCalculate) $.Vue_task_slider.calculateProgress();
    });

    $(".has_many_container.checklists .has_many_delete.boolean input[type=checkbox]").change(function(e) {
      let confirm = window.confirm(`Are you sure, you want to delete this checklist item?`)
      if (!confirm) {
        e.preventDefault();
        e.stopPropagation();
        return $(this).prop('checked', false);
      }
      $(this.parentElement.parentElement.parentElement.parentElement).hide();
      if ($.Vue_task_slider.autoCalculate) $.Vue_task_slider.calculateProgress();
    });

    $("body").on('change', "input.checklist_item_checked", function() {
      if ($.Vue_task_slider.autoCalculate) $.Vue_task_slider.calculateProgress();
    });

    // delete comments
    $("body").on("change", ".comments li.boolean input[type=checkbox]", function(e) {
      let confirm = window.confirm(`Are you sure, you want to delete this comment?`)
      if (!confirm) {
        e.preventDefault();
        e.stopPropagation();
        return $(this).prop('checked', false);
      }
      $(this.parentElement.parentElement.parentElement).hide();
    });

    $("body").on("click", ".comments a.button.has_many_remove", function(e) {
      let confirm = window.confirm(`Are you sure, you want to delete this comment?`)
      if (!confirm) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    $("body").on("input", "input.checklist_item_text", function() {
      this.parentElement.parentElement.querySelector(".checklist_item_checked").disabled = !this.value.trim();
      if (!this.value.trim()) this.parentElement.parentElement.querySelector(".checklist_item_checked").checked = false;
      if ($.Vue_task_slider.autoCalculate) $.Vue_task_slider.calculateProgress();
    });

    $.Vue_checklists_items = [];
    $.build_user_select_vue = (elem) => {
      let item = {};
      item.input_id = $(elem).prop('id');
      item.app_id = `${$(elem).parent().prop('id')}_Vue`;
      $(elem).parent().append(`<div id='${item.app_id}'></div>`);
      $(elem).hide();

      item.user_select = new Vue({
        el: `#${item.app_id}`,
        data() {
          return {
            app_id: item.app_id,
            loading: true,
            type: '',
            project_id: '',
            u_id: [],
            users: [],
            selected_user: null
          }
        },
        mounted() {
          this.setProjectConsts();
        },
        methods: {
          setProjectConsts() {
            this.type = $('form').attr('id').split('_').pop();
            this.project_id = $(`#${this.type}_facility_project_attributes_project_id`).val();
            this.u_id = $(`#${item.input_id}`).val();
          },
          fetchProjectUsers() {
            $.get(`/api/users.json?project_id=${this.project_id}`, (data) => {
              this.users = data.filter(u => u.status == "active");
              this.loading = false;
            });
          }
        },
        watch: {
          project_id(value) {
            this.fetchProjectUsers();
          },
          users: {
            handler(value) {
              this.selected_user = this.users.find(u => this.u_id == u.id);
            }, deep: true
          },
          selected_user: {
            handler(value) {
              this.u_id = value ? value.id : '';
              $(`#${item.input_id}`).val(this.u_id);
            }, deep: true
          }
        },
        template: `<div v-if="!loading" class="user_multiselect w-100" :id="app_id">
          <multiselect
            v-model="selected_user"
            track-by="id"
            label="full_name"
            placeholder="Search and assign user"
            :options="users"
            :searchable="true"
            select-label="Select"
            deselect-label="Remove"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.full_name}}</span>
              </div>
            </template>
          </multiselect>
        </div>`
      });

      $.Vue_checklists_items.push(item);
    };

    // projects_users tab in tasks view
    if ($("#projects_users-tab").is(":visible"))
    {
      Vue.component('multiselect', VueMultiselect.Multiselect);
      $.Vue_projects_users_select = new Vue({
        el: "#projects_users-tab",
        data() {
          return {
            loading: true,
            project_id: '',
            type: '',
            task_users: [],
            project_users: [],
            u_ids: []
          }
        },
        mounted() {
          this.setProjectConsts();
        },
        methods: {
          setProjectConsts() {
            this.type = $('form').attr('id').split('_').pop();
            this.project_id = $(`#${this.type}_facility_project_attributes_project_id`).val();
            this.u_ids = $(`#${this.type}_user_ids`).val().map(Number);
          },
          fetchProjectUsers() {
            $.get(`/api/users.json?project_id=${this.project_id}`, (data) => {
              this.project_users = data.filter(u => u.status == "active");
              this.task_users = this.project_users.filter(u => this.u_ids.includes(u.id));
              this.loading = false;
            });
          }
        },
        watch: {
          project_id(value) {
            if (value) this.fetchProjectUsers();
          },
          task_users: {
            handler(value) {
              this.u_ids = value.map(u => u.id);
              if (value) $(`#${this.type}_user_ids`).val(this.u_ids);
            }, deep: true
          }
        },
        template: `<li class='select input optional d-flex' id='task_users_input_multiple'>
          <label for='task_users_input_multiple' class='label'>Assigned Users</label>
          <div v-if="!loading" class="user_multiselect">
            <multiselect
              v-model="task_users"
              track-by="id"
              label="full_name"
              placeholder="Search and select users"
              :options="project_users"
              :searchable="true"
              :multiple="true"
              select-label="Select"
              deselect-label="Remove"
              :close-on-select="false"
              >
              <template slot="singleLabel" slot-scope="{option}">
                <div class="d-flex">
                  <span class='select__tag-name'>{{option.full_name}}</span>
                </div>
              </template>
            </multiselect>
          </div>
        </li>`
      });
    }

    // user projects tab
    if ($("#user-projects-with-roles").css('display') === 'block')
    {
      Vue.component('multiselect', VueMultiselect.Multiselect);
      $.Vue_user_projects_with_roles = new Vue({
        el: "#user-projects-with-roles",
        data() {
          return {
            loading: true,
            projectWithRoleSelector: [],
            selectors: [],
            projects: [],
            projectRoles: []
          }
        },
        mounted() {
          this.projectWithRoleSelector = $("#user_project_role_ids").val();
          this.fetchProjectWithRoles();
        },
        methods: {
          fetchProjectWithRoles() {
            $.get(`/api/project_roles.json`, (data) => {
              this.projects = data.filter(d => d.project_roles.length > 0);
              this.projectRoles = this.projects.map(p => p.project_roles).filter(Boolean).flat();
              for (let val of this.projectWithRoleSelector) {
                let p_role = this.projectRoles.find(p => p.id == Number(val));
                let project = this.projects.find(p => p.id == p_role.project_id);
                let role = project.project_roles.map(p => p.role).find(p => p.id == p_role.role_id);
                this.selectors.push({
                  project,
                  role
                });
              }
              this.loading = false;
            });
          },
          addMoreProject() {
            if (!this.allowMoreProjects) return;
            this.selectors.push({
              project: null,
              role: null
            });
          },
          removeProject(index) {
            this.selectors.splice(index, 1);
          }
        },
        computed: {
          filteredProjects() {
            return sault => {
              let projectIds = this.selectors.map(s => s.project).filter(Boolean).flat().map(p => p.id);
              return this.projects.filter(p => !projectIds.includes(p.id) || (sault.project && p.id == sault.project.id));
            }
          },
          filteredRoles() {
            return sault => {
              if (!sault.project) return [];
              return sault.project.project_roles.map(s => s.role);
            }
          },
          allowMoreProjects() {
            return this.selectors.length !== this.projects.length;
          }
        },
        watch: {
          selectors: {
            handler(value) {
              if (this.loading) return;
              let targetVal = [];
              for (let v of value) {
                if (v.project && v.project.id && v.role && v.role.id) {
                  let p_role = this.projectRoles.find(p => p.project_id == v.project.id && p.role_id == v.role.id);
                  targetVal.push(p_role.id.toString());
                }
              }
              $("#user_project_role_ids").val(targetVal);
            },
            deep: true
          }
        },
        template: `<li id='userProjectsWithRoleTab'>
          <ol>
            <li v-if="!loading" class='select input optional'>
              <div class='d-flex'>
                <label class='label'>Assign Projects with Roles</label>
                <span class='plus-button mln-8' @click="addMoreProject" :class="{'disabled': !allowMoreProjects}"></span>
              </div>
              <div v-if="selectors.length > 0" class="select--wrapper select-headings">
                <div>Project Selector</div>
                <div>Role Selector</div>
              </div>
              <div v-for="(select, i) in selectors">
                <div class="select--wrapper">
                  <div class="user_multiselect">
                    <multiselect
                      v-model="select.project"
                      track-by="id"
                      label="name"
                      placeholder="Search and select Project"
                      :options="filteredProjects(select)"
                      :searchable="true"
                      :multiple="false"
                      select-label="Select"
                      deselect-label="Remove"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                  <div class="user_multiselect">
                    <multiselect
                      v-model="select.role"
                      track-by="id"
                      label="name"
                      placeholder="Search and select Role"
                      :options="filteredRoles(select)"
                      :searchable="true"
                      :multiple="false"
                      select-label="Select"
                      deselect-label="Remove"
                      :disabled="!select.project"
                      >
                      <template slot="singleLabel" slot-scope="{option}">
                        <div class="d-flex">
                          <span class='select__tag-name'>{{option.name}}</span>
                        </div>
                      </template>
                    </multiselect>
                  </div>
                  <span class='close-icon select-close-icon' @click.prevent="removeProject(i)"></span>
                </div>
              </div>
            </li>
          </ol>
        </li>`
      });
    }

    // related tasks/issues multiselect
    if ($("#related_tasks-issues-tab").is(":visible"))
    {
      Vue.component('multiselect', VueMultiselect.Multiselect);
      $.Vue_related_tasks_issues = new Vue({
        el: "#related_tasks-issues-tab",
        data() {
          return {
            loading: true,
            type: '',
            _id: '',
            project_id: '',
            facility_id: '',
            sub_tasks: [],
            sub_issues: [],
            sub_risks: [],
            sub_task_ids: [],
            sub_issue_ids: [],
            sub_risk_ids: [],
            persist: {
              task_ids: [],
              issue_ids: [],
              risk_ids: [],
              project_id: '',
              facility_id: ''
            },
            tasks: [],
            issues: [],
            risks: []
          }
        },
        mounted() {
          this.setProjectConsts({persist: true});
        },
        methods: {
          setProjectConsts(opt={}) {
            this.type = $('form').attr('id').split('_').pop();
            this._id = Number($(`#${this.type}_id`).val()) || 0;
            this.project_id = $(`#${this.type}_facility_project_attributes_project_id`).val();
            this.facility_id = $(`#${this.type}_facility_project_attributes_facility_id`).val();
            this.sub_task_ids = $(`#${this.type}_sub_task_ids`).val().map(Number);
            this.sub_issue_ids = $(`#${this.type}_sub_issue_ids`).val().map(Number);
            this.sub_risk_ids = $(`#${this.type}_sub_risk_ids`).val().map(Number);
            if (opt.persist) {
              this.persist.task_ids = this.sub_task_ids;
              this.persist.issue_ids = this.sub_issue_ids;
              this.persist.risk_ids = this.sub_risk_ids;
              this.persist.project_id = this.project_id;
              this.persist.facility_id = this.facility_id;
            }
          },
          checkForPersistance() {
            if (this.project_id == this.persist.project_id) {
              this.sub_task_ids = this.persist.task_ids;
              this.sub_issue_ids = this.persist.issue_ids;
              this.sub_risk_ids = this.persist.risk_ids;
            }
            this.fetchProjectTaskIssues()
          },
          fetchProjectTaskIssues() {
            $.get(`/api/projects/${this.project_id}/task_issues.json`, (data) => {
              this.issues = data ? this.type == 'issue' ? data.issues.filter(t => t.id !== this._id) : data.issues : [];
              this.tasks = data ? this.type == 'task' ? data.tasks.filter(t => t.id !== this._id) : data.tasks : [];
              this.risks = data ? this.type == 'risk' ? data.risks.filter(t => t.id !== this._id) : data.risks : [];
              this.sub_tasks = this.tasks.filter(t => t.id && this.sub_task_ids.includes(t.id));
              this.sub_issues = this.issues.filter(t => this.sub_issue_ids.includes(t.id));
              this.sub_risks = this.risks.filter(t => this.sub_risk_ids.includes(t.id));
              this.loading = false;
            });
          }
        },
        watch: {
          project_id(value) {
            if (value) this.checkForPersistance();
          },
          sub_tasks: {
            handler(value) {
              this.sub_task_ids = value.map(u => u.id);
              if (value) $(`#${this.type}_sub_task_ids`).val(this.sub_task_ids);
            }, deep: true
          },
          sub_issues: {
            handler(value) {
              this.sub_issue_ids = value.map(u => u.id);
              if (value) $(`#${this.type}_sub_issue_ids`).val(this.sub_issue_ids);
            }, deep: true
          },
          sub_risks: {
            handler(value) {
              this.sub_risk_ids = value.map(u => u.id);
              if (value) $(`#${this.type}_sub_risk_ids`).val(this.sub_risk_ids);
            }, deep: true
          }
        },
        template: `<li>
          <ol>
            <li class='select input optional d-flex p-0' id='sub_task_multiple'>
              <label for='sub_task_multiple' class='label'>Related Tasks</label>
              <div v-if="!loading" class="user_multiselect">
                <multiselect
                  v-model="sub_tasks"
                  track-by="id"
                  label="text"
                  placeholder="Search and select Related-tasks"
                  :options="tasks"
                  :searchable="true"
                  :multiple="true"
                  select-label="Select"
                  deselect-label="Remove"
                  :close-on-select="false"
                  >
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name'>{{option.text}}</span>
                    </div>
                  </template>
                </multiselect>
              </div>
            </li>

            <li class='select input optional d-flex mt-10 p-0' id='sub_issue_multiple'>
              <label for='sub_issue_multiple' class='label'>Related Issues</label>
              <div v-if="!loading" class="user_multiselect">
                <multiselect
                  v-model="sub_issues"
                  track-by="id"
                  label="title"
                  placeholder="Search and select Related-issues"
                  :options="issues"
                  :searchable="true"
                  :multiple="true"
                  select-label="Select"
                  deselect-label="Remove"
                  :close-on-select="false"
                  >
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name'>{{option.title}}</span>
                    </div>
                  </template>
                </multiselect>
              </div>
            </li>

            <li class='select input optional d-flex mt-10 p-0' id='sub_risk_multiple'>
              <label for='sub_risk_multiple' class='label'>Related Risks</label>
              <div v-if="!loading" class="user_multiselect">
                <multiselect
                  v-model="sub_risks"
                  track-by="id"
                  label="risk_description"
                  placeholder="Search and select Related-risks"
                  :options="risks"
                  :searchable="true"
                  :multiple="true"
                  select-label="Select"
                  deselect-label="Remove"
                  :close-on-select="false"
                  >
                  <template slot="singleLabel" slot-scope="{option}">
                    <div class="d-flex">
                      <span class='select__tag-name'>{{option.risk_description}}</span>
                    </div>
                  </template>
                </multiselect>
              </div>
            </li>
          </ol>
        </li>`
      });
    }

    if ($(".checklist_user").is(":visible"))
    {
      $(".checklist_user").each(function(i) {
        $.build_user_select_vue(this);
      });
    }

    $.update_checklist_user_wrt_project = () => {
      for (let item of $.Vue_checklists_items) {
        if ($(`#${item.app_id}`).is(':visible')) {
          item.user_select.setProjectConsts();
        }
      }
    };

    $('body').on('DOMNodeInserted', '.has_many_container.checklists', function(e) {
      let elem = $(e.target).find('.checklist_user').length ? $(e.target).find('.checklist_user') : null;
      if (elem) $.build_user_select_vue(elem);
    });

    // task/issues files handling
    if ($('#uploaded-task-files').is(':visible'))
    {
      let upload_type = $('form').attr('id').split('_').pop();
      $(`#${upload_type}_${upload_type}_files`).after("<div id='vue-uploaded-task-files'></div>");
      $.Vue_uploadedTaskFiles = new Vue({
        el: "#vue-uploaded-task-files",
        data() {
          return {
            files: []
          }
        },
        mounted() {
          let files_data = $('#uploaded-task-files').data('files').length ? $('#uploaded-task-files').data('files').replace(/=>/gi, ':') : "[]";
          $(`#${upload_type}_${upload_type}_files`).val('');
          for (let file of JSON.parse(files_data)) this.addFile(file);
        },
        methods: {
          addFile(file) {
            this.files.push(file);
          },
          downloadFile(file) {
            if (file.uri) {
              let url = window.location.origin + file.uri
              window.open(url, '_blank');
            }
          },
          destroyFile(file, index) {
            Vue.set(this.files, index, {...file, _destroy: true})
          },
          uploadFile() {
            this.$refs.fileInput.click();
          }
        },
        watch: {
          files: {
            handler(value) {
              $(`#${upload_type}_${upload_type}_files`).val(JSON.stringify(this.files));
            }, deep: true
          }
        },
        template: `<div>
          <input ref="fileInput" id='vue_task_task_files' type='file' multiple='multiple' style="visibility: hidden; position: absolute;" />
          <div class='upload_file_holder ml-20' @click.stop="uploadFile">UPLOAD FILES</div>
          <ul class='ml-20 mt-10'>
            <li v-for="(file, i) in files" :key="file.id+'_'+i" class='p-5' v-if="!file._destroy">
              <div :is="file.uri ? 'a' : 'span'" @click.prevent="downloadFile(file)">{{file.name || file.filename}}</div>
              <span class='close-icon' @click.prevent="destroyFile(file, i)"></span>
            </li>
          </ul>
        </div>`
      });
    }

    $("body").on('change', "#vue_task_task_files", async function() {
      for (let file of this.files) {
        try {
          let blob = await $.directFileUpload(file);
          if (!(blob instanceof Error)) $.Vue_uploadedTaskFiles.addFile({...blob, _new: true});
        } catch (err) {
          console.log(err);
        }
      }
    });

    // on change project_id in tasks/issues
    $("body").on('change', "#task_facility_project_attributes_project_id, #issue_facility_project_attributes_project_id", function() {
      $.Vue_projects_users_select && $.Vue_projects_users_select.setProjectConsts();
      $.Vue_checklists_items.length && $.update_checklist_user_wrt_project();
    });

    // on change project_id or facility_id in tasks/issues
    $("body").on('change', "#task_facility_project_attributes_project_id, #issue_facility_project_attributes_project_id, #task_facility_project_attributes_facility_id, #issue_facility_project_attributes_facility_id", function() {
      $.Vue_related_tasks_issues && $.Vue_related_tasks_issues.setProjectConsts();
    });

    if ($(".admin_project_types.active_admin, .admin_facility_groups.active_admin, .admin_issue_severities.active_admin, .admin_statuses.active_admin, .admin_task_types.active_admin, .admin_issue_types.active_admin, .admin_projects.active_admin, .admin_issue_stages.active_admin, .admin_task_stages.active_admin, .admin_risk_stages.active_admin").is(":visible"))
    {
      $("body").on("click", ".sortable", function() {
        if ($(this.firstElementChild).is('a')) {
          let href = $(this.firstElementChild).attr('href').split('/').pop();
          let model = href.split('?')[0];
          let sort_col = href.split('?')[1].split('=').pop();
          let order = sort_col.split('_').pop();
          sort_col = sort_col.replace(`_${order}`, '');
          let data = {relation: model, order: order, column: sort_col}
          $.post("/api/sort-by.json", data, (res) => {/* Noops */});
        }
      });
    }

    // user filters
    if ($("#__users_filters").is(":visible"))
    {
      let select = $("#__users_filters");
      let parent = select.parent();
      select.css({display: 'none'});
      parent.append("<div id='__users_filters_multiselect'></div>");
      let email_select = $("#__users_filter_emails").siblings()[1];
      email_select.id = "__users_filter_emails_select";

      Vue.component('multiselect', VueMultiselect.Multiselect);
      $.Vue_users_filter_select = new Vue({
        el: "#__users_filters_multiselect",
        data() {
          return {
            loading: true,
            selected_users: [],
            users: [],
            filtered_users: []
          }
        },
        created() {
          this.fetchUsers();
        },
        methods: {
          fetchUsers() {
            $.get(`/api/users.json`, (data) => {
              this.users = data.filter(u => u.status == "active");
              let user_ids = $("#__users_filters").val().map(Number);
              this.selected_users = this.users.filter(u => user_ids.includes(u.id));
              this.setEmailCheck();
              this.loading = false;
            });
          },
          setEmailCheck() {
            let value = $("#__users_filter_emails").val();
            if (value) {
              let operator = $(email_select).val();
              operator = operator.replace("users_email_", '');
              if (operator == "contains") this.filtered_users = this.users.filter(u => u.email.includes(value));
              else if (operator == "equals") this.filtered_users = this.users.filter(u => u.email == value);
              else if (operator == "starts_with") this.filtered_users = this.users.filter(u => u.email.startsWith(value));
              else if (operator == "ends_with") this.filtered_users = this.users.filter(u => u.email.endsWith(value));
            } else {
              this.filtered_users = this.users;
            }
            let user_ids = this.filtered_users.map(u => u.id);
            this.selected_users = this.selected_users.filter(u => user_ids.includes(u.id));
          }
        },
        watch: {
          selected_users: {
            handler(value) {
              if (value) $("#__users_filters").val(value.map(u => u.id));
            }, deep: true
          }
        },
        template: `<div v-if="!loading" class="user_multiselect">
          <multiselect
            v-model="selected_users"
            track-by="id"
            label="full_name"
            placeholder="Search and select users"
            :options="filtered_users"
            :searchable="true"
            :multiple="true"
            select-label="Select"
            deselect-label="Remove"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.full_name}}</span>
              </div>
            </template>
          </multiselect>
        </div>`
      });

      $("body").on('change', "#__users_filter_emails, #__users_filter_emails_select", function() {
        $.Vue_users_filter_select && $.Vue_users_filter_select.setEmailCheck();
      });
    }

    // checklists_user filters
    if ($("#__checklist_users_filters").is(":visible"))
    {
      let select = $("#__checklist_users_filters");
      let parent = select.parent();
      select.css({display: 'none'});
      parent.append("<div id='__checklist_users_filters_multiselect'></div>");
      let email_select = $("#__users_filter_emails").siblings()[1];
      email_select.id = "__users_filter_emails_select";

      Vue.component('multiselect', VueMultiselect.Multiselect);
      $.Vue_users_filter_select = new Vue({
        el: "#__checklist_users_filters_multiselect",
        data() {
          return {
            loading: true,
            selected_users: [],
            users: [],
            filtered_users: []
          }
        },
        created() {
          this.fetchUsers();
        },
        methods: {
          fetchUsers() {
            $.get(`/api/users.json`, (data) => {
              this.users = data.filter(u => u.status == "active");
              let user_ids = $("#__checklist_users_filters").val().map(Number);
              this.selected_users = this.users.filter(u => user_ids.includes(u.id));
              this.setEmailCheck();
              this.loading = false;
            });
          },
          setEmailCheck() {
            let value = $("#__users_filter_emails").val();
            if (value) {
              let operator = $(email_select).val();
              operator = operator.replace("users_email_", '');
              if (operator == "contains") this.filtered_users = this.users.filter(u => u.email.includes(value));
              else if (operator == "equals") this.filtered_users = this.users.filter(u => u.email == value);
              else if (operator == "starts_with") this.filtered_users = this.users.filter(u => u.email.startsWith(value));
              else if (operator == "ends_with") this.filtered_users = this.users.filter(u => u.email.endsWith(value));
            } else {
              this.filtered_users = this.users
            }
            let user_ids = this.filtered_users.map(u => u.id);
            this.selected_users = this.selected_users.filter(u => user_ids.includes(u.id));
          }
        },
        watch: {
          selected_users: {
            handler(value) {
              if (value) $("#__checklist_users_filters").val(value.map(u => u.id));
            }, deep: true
          }
        },
        template: `<div v-if="!loading" class="user_multiselect">
          <multiselect
            v-model="selected_users"
            track-by="id"
            label="full_name"
            placeholder="Search and select users"
            :options="filtered_users"
            :searchable="true"
            :multiple="true"
            select-label="Select"
            deselect-label="Remove"
            >
            <template slot="singleLabel" slot-scope="{option}">
              <div class="d-flex">
                <span class='select__tag-name'>{{option.full_name}}</span>
              </div>
            </template>
          </multiselect>
        </div>`
      });

      $("body").on('change', "#__users_filter_emails, #__users_filter_emails_select", function() {
        $.Vue_users_filter_select && $.Vue_users_filter_select.setEmailCheck();
      });
    }

    // on_change percent stages
    let task_stage_percentage = $("label[for='task_stage_percentage']").text();
    $("label[for='task_stage_percentage']").text(task_stage_percentage + " (" + (parseFloat($("#task_stage_percentage").val()).toFixed(1)) + ")");
    $("#task_stage_percentage").on('input', function() {
      return $("label[for='task_stage_percentage']").text(task_stage_percentage + " (" + (parseFloat(this.value).toFixed(1)) + ")");
    });

    // on_change percent stages
    let issue_stage_percentage = $("label[for='issue_stage_percentage']").text();
    $("label[for='issue_stage_percentage']").text(issue_stage_percentage + " (" + (parseFloat($("#issue_stage_percentage").val()).toFixed(1)) + ")");
    $("#issue_stage_percentage").on('input', function() {
      return $("label[for='issue_stage_percentage']").text(issue_stage_percentage + " (" + (parseFloat(this.value).toFixed(1)) + ")");
    });

    // on_change percent stages
    let risk_stage_percentage = $("label[for='risk_stage_percentage']").text();
    $("label[for='risk_stage_percentage']").text(risk_stage_percentage + " (" + (parseFloat($("#risk_stage_percentage").val()).toFixed(1)) + ")");
    $("#risk_stage_percentage").on('input', function() {
      return $("label[for='risk_stage_percentage']").text(risk_stage_percentage + " (" + (parseFloat(this.value).toFixed(1)) + ")");
    });

  }());

  // password generator tab
  if ($("#user-password__tab").is(":visible"))
  {
    let settings = new Vue({
      el: "#user-password__tab",
      data() {
        return {
          password: '',
          confirm_password: '',
          copied: false,
          editPass: false,
          range: 8,
          uppercase: false,
          lowercase: false,
          numbers: false,
          special_chars: false,
          UPPERCASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
          NUMBERS: "1234567890",
          SPECIALCASE: "!@#$%^&*()",
          LOWERCASE: "abcdefghijklmnopqrstuvwxyz"
        }
      },
      mounted() {
        let user_id = $("#user_email").data().id;
        if ($("#passwords-key").data('key')) {
          for (let [key, value] of Object.entries($("#passwords-key").data('key'))) {
            this[key] = value;
          }
        }
        if (!user_id) this.generatePassword();
      },
      methods: {
        generatePassword() {
          this.editPass = true;
          let chars = [...Array(Number(this.range))].map(i=>(~~(Math.random()*36)).toString(36)).join('');
          let pass = "";
          let i = 0;
          if (this.uppercase || this.lowercase || this.numbers || this.special_chars) {
            chars = "";
            if (this.uppercase) {
              pass = pass + this.UPPERCASE.charAt(Math.floor(Math.random() * this.UPPERCASE.length));
              chars = chars + this.UPPERCASE;
              i++;
            }
            if (this.numbers) {
              pass = pass + this.NUMBERS.charAt(Math.floor(Math.random() * this.NUMBERS.length));
              chars = chars + this.NUMBERS;
              i++;
            }
            if (this.special_chars) {
              pass = pass + this.SPECIALCASE.charAt(Math.floor(Math.random() * this.SPECIALCASE.length));
              chars = chars + this.SPECIALCASE;
              i++;
            }
            if (this.lowercase) {
              pass = pass + this.LOWERCASE.charAt(Math.floor(Math.random() * this.LOWERCASE.length));
              chars = chars + this.LOWERCASE;
              i++;
            }
            while (i<Number(this.range)) {
              pass += chars.charAt(Math.floor(Math.random() * chars.length));
              i++;
            }
          }
          else {
            pass = chars;
          }
          this.password = pass;
        },
        copyPassword() {
          const copyText = document.getElementById("__password");
          const el = document.createElement('textarea');
          el.value = copyText.value;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          this.copied = el.value != "";
          document.body.removeChild(el);
        }
      },
      computed: {
        C_passValidationCheck() {
          let errors = {};
          if (this.editPass) {
            if (this.password.length < this.range) errors.length = true;
            if (this.uppercase && !(/([A-Z])/g).test(this.password)) errors.uppercase = true;
            if (this.lowercase && !(/([a-z])/g).test(this.password)) errors.smallcase = true;
            if (this.numbers && !(/([\d])/g).test(this.password)) errors.digits = true;
            if (this.special_chars && !(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g).test(this.password)) errors.specialcase = true;
          }
          return errors;
        }
      },
      watch: {
        password(value) {
          this.editPass = true;
          $("#user_password").prop("disabled", false);
          $("#user_password").val(value);
          $("#user_password_confirmation").prop("disabled", false);
          $("#user_password_confirmation").val(value);
        }
      },
      template: `<div id="pass-word-generator-tab" class="ui-tabs-panel ui-corner-bottom ui-widget-content" aria-hidden="false">
        <fieldset class="inputs">
          <legend><span>Password Generator</span></legend>
          <ol>
            <li class="string input optional stringish">
              <label class="label">Password</label>
              <input id="__password" :maxlength="range" type="text" v-model="password">
              <div v-if="editPass" class="text-danger ml-20 p-5">
                <div v-if="C_passValidationCheck.length" class="font-sm text-danger">Password must contains {{range}} characters.</div>
                <div v-if="C_passValidationCheck.uppercase" class="font-sm text-danger">Contain atleast 1 Uppercase letter.</div>
                <div v-if="C_passValidationCheck.smallcase" class="font-sm text-danger">Contain atleast 1 Lowercase letter.</div>
                <div v-if="C_passValidationCheck.digits" class="font-sm text-danger">Contain atleast 1 digit.</div>
                <div v-if="C_passValidationCheck.specialcase" class="font-sm text-danger">Contain atleast 1 special character.</div>
              </div>
              <input v-model="confirm_password" type="hidden">
            </li>
            <li>
              <div class="ml-20">
                <a href="javascript:;" @click.prevent="generatePassword">Regenerate Password</a>
                <a href="javascript:;" style="margin-left: 20px" @click.prevent="copyPassword">Copy Password</a>
                <span v-if="copied" class="pass-copied"><sup>copied!</sup></span>
              </div>
            </li>
          </ol>
        </fieldset>
      </div>`
    });
  }

});
