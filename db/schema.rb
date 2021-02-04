# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_02_03_212756) do

  create_table "active_admin_comments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "namespace"
    t.text "body"
    t.string "resource_type"
    t.bigint "resource_id"
    t.string "author_type"
    t.bigint "author_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_type", "author_id"], name: "index_active_admin_comments_on_author_type_and_author_id"
    t.index ["namespace"], name: "index_active_admin_comments_on_namespace"
    t.index ["resource_type", "resource_id"], name: "index_active_admin_comments_on_resource_type_and_resource_id"
  end

  create_table "active_storage_attachments", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "admin_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_admin_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_admin_users_on_reset_password_token", unique: true
  end

  create_table "checklists", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "listable_type"
    t.integer "listable_id"
    t.boolean "checked"
    t.string "text"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.integer "position", default: 0
    t.date "due_date"
    t.index ["user_id"], name: "index_checklists_on_user_id"
  end

  create_table "facilities", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "facility_name", default: "", null: false
    t.string "address"
    t.string "point_of_contact"
    t.string "phone_number"
    t.string "email", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "facility_group_id"
    t.bigint "creator_id"
    t.string "lat"
    t.string "lng"
    t.integer "status", default: 1
    t.string "country_code", default: ""
    t.index ["creator_id"], name: "index_facilities_on_creator_id"
    t.index ["facility_group_id"], name: "index_facilities_on_facility_group_id"
  end

  create_table "facility_groups", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "code"
    t.integer "status", default: 0
    t.integer "region_type", default: 0
    t.string "center", default: "[]"
    t.bigint "project_id"
    t.index ["project_id"], name: "index_facility_groups_on_project_id"
  end

  create_table "facility_projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "facility_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "due_date"
    t.bigint "status_id"
    t.index ["facility_id"], name: "index_facility_projects_on_facility_id"
    t.index ["project_id"], name: "index_facility_projects_on_project_id"
    t.index ["status_id"], name: "index_facility_projects_on_status_id"
  end

  create_table "issue_severities", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "issue_stages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "percentage", default: 0
  end

  create_table "issue_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "issue_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "issue_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_type", default: "responsible"
    t.index ["issue_id"], name: "index_issue_users_on_issue_id"
    t.index ["user_id"], name: "index_issue_users_on_user_id"
  end

  create_table "issues", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "title"
    t.text "description", limit: 4294967295
    t.bigint "issue_type_id"
    t.bigint "issue_severity_id"
    t.bigint "facility_project_id"
    t.date "start_date"
    t.date "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "progress", default: 0
    t.boolean "auto_calculate", default: true
    t.boolean "watched", default: false
    t.datetime "watched_at"
    t.bigint "issue_stage_id"
    t.integer "kanban_order", default: 0
    t.integer "task_type_id"
    t.index ["facility_project_id"], name: "index_issues_on_facility_project_id"
    t.index ["issue_severity_id"], name: "index_issues_on_issue_severity_id"
    t.index ["issue_stage_id"], name: "index_issues_on_issue_stage_id"
    t.index ["issue_type_id"], name: "index_issues_on_issue_type_id"
  end

  create_table "notes", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "noteable_type"
    t.integer "noteable_id"
    t.bigint "user_id"
    t.text "body", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_notes_on_user_id"
  end

  create_table "organizations", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "title", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "privileges", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "overview", default: "R"
    t.string "tasks", default: "R"
    t.string "notes", default: "R"
    t.string "issues", default: "R"
    t.string "admin", default: ""
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "map_view", default: "R"
    t.string "gantt_view", default: "R"
    t.string "watch_view", default: "R"
    t.string "documents", default: "R"
    t.string "members", default: "R"
    t.string "facility_manager_view", default: "R"
    t.string "sheets_view", default: "R"
    t.string "kanban_view", default: "R"
    t.string "risks", default: "R"
    t.index ["user_id"], name: "index_privileges_on_user_id"
  end

  create_table "project_issue_severities", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "issue_severity_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["issue_severity_id"], name: "index_project_issue_severities_on_issue_severity_id"
    t.index ["project_id"], name: "index_project_issue_severities_on_project_id"
  end

  create_table "project_issue_stages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "project_id"
    t.integer "issue_stage_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_issue_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "issue_type_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["issue_type_id"], name: "index_project_issue_types_on_issue_type_id"
    t.index ["project_id"], name: "index_project_issue_types_on_project_id"
  end

  create_table "project_risk_stages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "project_id"
    t.integer "risk_stage_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "role_id"
    t.integer "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_statuses", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "status_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_statuses_on_project_id"
    t.index ["status_id"], name: "index_project_statuses_on_status_id"
  end

  create_table "project_task_stages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.integer "project_id"
    t.integer "task_stage_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_task_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "task_type_id"
    t.bigint "project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_task_types_on_project_id"
    t.index ["task_type_id"], name: "index_project_task_types_on_task_type_id"
  end

  create_table "project_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "project_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "project_id"
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_project_users_on_project_id"
    t.index ["user_id"], name: "index_project_users_on_user_id"
  end

  create_table "projects", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.text "description", limit: 4294967295
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "uuid"
    t.bigint "project_type_id"
    t.integer "status", default: 1
    t.index ["project_type_id"], name: "index_projects_on_project_type_id"
    t.index ["uuid"], name: "index_projects_on_uuid", unique: true
  end

  create_table "region_states", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "facility_group_id"
    t.bigint "state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["facility_group_id"], name: "index_region_states_on_facility_group_id"
    t.index ["state_id"], name: "index_region_states_on_state_id"
  end

  create_table "related_issues", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "relatable_type"
    t.integer "relatable_id"
    t.bigint "issue_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["issue_id"], name: "index_related_issues_on_issue_id"
  end

  create_table "related_risks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "relatable_type"
    t.integer "relatable_id"
    t.bigint "risk_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["risk_id"], name: "index_related_risks_on_risk_id"
  end

  create_table "related_tasks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "relatable_type"
    t.integer "relatable_id"
    t.bigint "task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["task_id"], name: "index_related_tasks_on_task_id"
  end

  create_table "risk_stages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.integer "percentage", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "risk_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "risk_id"
    t.string "timestamps"
    t.string "user_type", default: "responsible"
    t.index ["risk_id"], name: "index_risk_users_on_risk_id"
    t.index ["user_id"], name: "index_risk_users_on_user_id"
  end

  create_table "risks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "risk_description"
    t.text "impact_description"
    t.date "start_date"
    t.date "due_date"
    t.boolean "auto_calculate", default: true
    t.integer "progress", default: 0
    t.integer "probability", default: 1
    t.integer "impact_level", default: 1
    t.integer "priority_level", default: 1
    t.integer "risk_approach", default: 0
    t.text "risk_approach_description"
    t.boolean "watched", default: false
    t.datetime "watched_at"
    t.bigint "user_id"
    t.bigint "facility_project_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "task_type_id"
    t.string "text"
    t.bigint "risk_id"
    t.integer "kanban_order", default: 0
    t.bigint "risk_stage_id"
    t.string "probability_name"
    t.string "impact_level_name"
    t.index ["facility_project_id"], name: "index_risks_on_facility_project_id"
    t.index ["risk_stage_id"], name: "index_risks_on_risk_stage_id"
    t.index ["task_type_id"], name: "index_risks_on_task_type_id"
    t.index ["user_id"], name: "index_risks_on_user_id"
  end

  create_table "roles", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "system", default: false
  end

  create_table "settings", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.text "office365_key"
    t.text "office365_secret"
    t.text "google_map_key"
    t.text "google_oauth_key"
    t.text "google_oauth_secret"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "passwords_key"
  end

  create_table "sorts", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "relation"
    t.string "column", default: "id"
    t.string "order", default: "asc"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "states", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name"
    t.string "code"
    t.string "center", default: "[]"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "statuses", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "color"
  end

  create_table "task_stages", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "percentage", default: 0
  end

  create_table "task_types", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "task_users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_type", default: "responsible"
    t.index ["task_id"], name: "index_task_users_on_task_id"
    t.index ["user_id"], name: "index_task_users_on_user_id"
  end

  create_table "tasks", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "text"
    t.text "description", limit: 4294967295
    t.date "due_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "progress", default: 0
    t.bigint "task_type_id"
    t.date "start_date"
    t.bigint "facility_project_id"
    t.boolean "auto_calculate", default: true
    t.boolean "watched", default: false
    t.datetime "watched_at"
    t.bigint "task_stage_id"
    t.integer "kanban_order", default: 0
    t.index ["facility_project_id"], name: "index_tasks_on_facility_project_id"
    t.index ["task_stage_id"], name: "index_tasks_on_task_stage_id"
    t.index ["task_type_id"], name: "index_tasks_on_task_type_id"
  end

  create_table "users", options: "ENGINE=InnoDB DEFAULT CHARSET=utf8", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "first_name"
    t.string "last_name"
    t.string "title"
    t.string "phone_number"
    t.string "address"
    t.integer "role", default: 0
    t.string "provider"
    t.string "uid"
    t.string "login"
    t.integer "status", default: 1
    t.string "lat"
    t.string "lng"
    t.string "privileges", default: ""
    t.string "country_code", default: ""
    t.string "color"
    t.bigint "organization_id"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "checklists", "users"
  add_foreign_key "facilities", "users", column: "creator_id"
  add_foreign_key "facility_groups", "projects"
  add_foreign_key "facility_projects", "facilities"
  add_foreign_key "facility_projects", "projects"
  add_foreign_key "facility_projects", "statuses"
  add_foreign_key "issue_users", "issues"
  add_foreign_key "issue_users", "users"
  add_foreign_key "issues", "facility_projects"
  add_foreign_key "issues", "issue_severities"
  add_foreign_key "issues", "issue_stages"
  add_foreign_key "issues", "issue_types"
  add_foreign_key "privileges", "users"
  add_foreign_key "project_issue_severities", "issue_severities"
  add_foreign_key "project_issue_severities", "projects"
  add_foreign_key "project_issue_types", "issue_types"
  add_foreign_key "project_issue_types", "projects"
  add_foreign_key "project_statuses", "projects"
  add_foreign_key "project_statuses", "statuses"
  add_foreign_key "project_task_types", "projects"
  add_foreign_key "project_task_types", "task_types"
  add_foreign_key "project_users", "projects"
  add_foreign_key "project_users", "users"
  add_foreign_key "projects", "project_types"
  add_foreign_key "region_states", "facility_groups"
  add_foreign_key "region_states", "states"
  add_foreign_key "related_issues", "issues"
  add_foreign_key "related_risks", "risks"
  add_foreign_key "related_tasks", "tasks"
  add_foreign_key "risk_users", "risks"
  add_foreign_key "risk_users", "users"
  add_foreign_key "risks", "facility_projects"
  add_foreign_key "risks", "risk_stages"
  add_foreign_key "risks", "task_types"
  add_foreign_key "risks", "users"
  add_foreign_key "task_users", "tasks"
  add_foreign_key "task_users", "users"
  add_foreign_key "tasks", "facility_projects"
  add_foreign_key "tasks", "task_stages"
  add_foreign_key "tasks", "task_types"
  add_foreign_key "users", "organizations"
end
