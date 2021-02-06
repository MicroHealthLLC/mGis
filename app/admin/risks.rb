ActiveAdmin.register Risk do
  menu priority: 6
  actions :all, except: [:show]

  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Risks', admin_risks_path)]
    if %(show edit).include?(params['action'])
      links << link_to(risk.id, edit_admin_risk_path)
    end
    links
  end

  permit_params do
    permitted = [
      :text,
      :risk_description,
      :impact_description,
      :probability,
      :impact_level,
      :risk_approach,
      :risk_approach_description,
      :task_type_id,
      :risk_stage_id,
      :progress,
      :start_date,
      :due_date,
      :auto_calculate,
      user_ids: [],
      risk_files: [],
      sub_task_ids: [],
      sub_issue_ids: [],
      sub_risk_ids: [],
      facility_project_attributes: [
        :id,
        :project_id,
        :facility_id
      ],
      checklists_attributes: [
        :id,
        :_destroy,
        :text,
        :user_id,
        :checked
      ]
    ]
  end

  index do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    selectable_column if current_user.admin_delete?
    column "Risk Name", :text, sortable: false
    column "Risk Description", :risk_description, sortable: false
    column "Impact Description", :impact_description, sortable: false
    column :start_date
    column :due_date
    column :progress
    tag_column :probability
    tag_column :impact_level
    tag_column :priority_level
    tag_column :risk_approach
    column :risk_approach_description, sortable: false
    column "Task Category", :task_type, nil, sortable: 'task_types.name' do |risk|
      if current_user.admin_write?
        link_to "#{risk.task_type.name}", "#{edit_admin_task_type_path(risk.task_type)}" if risk.task_type.present?
      else
        "<span>#{risk.task_type&.name}</span>".html_safe
      end
    end
    column :risk_stage, nil, sortable: 'risk_stages.name' do |risk|
      if current_user.admin_write?
        link_to "#{risk.risk_stage.name}", "#{edit_admin_risk_stage_path(risk.risk_stage)}" if risk.risk_stage.present?
      else
        "<span>#{risk.risk_stage&.name}</span>".html_safe
      end
    end
    column "Files" do |risk|
      risk.risk_files.map do |file|
        if current_user.admin_write?
          link_to "#{file.blob.filename}", "#{Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)}", target: '_blank'
        else
          "<span>#{file.blob.filename}</span>".html_safe
        end
      end
    end
    column :project, nil, sortable: 'projects.name' do |risk|
      if current_user.admin_write?
        link_to "#{risk.project.name}", "#{edit_admin_project_path(risk.project)}" if risk.project.present?
      else
        "<span>#{risk.project&.name}</span>".html_safe
      end
    end
    column :facility, nil, sortable: 'facilities.facility_name' do |risk|
      if current_user.admin_write?
        link_to "#{risk.facility.facility_name}", "#{edit_admin_facility_path(risk.facility)}" if risk.facility.present?
      else
        "<span>#{risk.facility&.facility_name}</span>".html_safe
      end
    end
    column "Owner", :user do |risk|
      if current_user.admin_write?
        risk.user&.full_name
      else
        "<span>#{risk.user&.full_name}</span>".html_safe
      end
    end
    actions defaults: false do |risk|
      item "Edit", edit_admin_risk_path(risk), title: 'Edit', class: "member_link edit_link" if current_user.admin_write?
      item "Delete", admin_risk_path(risk), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete?
    end
  end

  form do |f|
    f.semantic_errors *f.object.errors.keys
    div id: 'direct-upload-url', "data-direct-upload-url": "#{rails_direct_uploads_url}"
    f.inputs 'Basic Details' do
      f.input :id, input_html: { value: f.object.id }, as: :hidden
      f.input :text, label: 'Risk Name'
      f.input :risk_description, label: 'Risk Description', input_html: { rows: 8 }
      f.input :impact_description, label: 'Impact Description', input_html: { rows: 8 }
      div id: 'facility_projects' do
        f.inputs for: [:facility_project, f.object.facility_project || FacilityProject.new] do |fp|
            fp.input :project_id, label: 'Project', as: :select, collection: Project.all.map{|p| [p.name, p.id]}, include_blank: false
            fp.input :facility_id, label: 'Facility', as: :select, collection: Facility.all.map{|p| [p.facility_name, p.id]}, include_blank: false
        end
      end
      f.input :start_date, as: :datepicker
      f.input :due_date, as: :datepicker
      f.input :task_type, label: 'Task Category', include_blank: false, include_hidden: false
      f.input :risk_stage, label: 'Stage', input_html: {class: "select2"}, include_blank: true
      f.input :probability, include_blank: false, include_hidden: false, min: 1, max: 5, input_html: { onchange: 'checkRiskProbabilityImpactNumber(this)' }
      div id: 'risk_probability_text'
      f.input :impact_level, include_blank: false, include_hidden: false, min: 1, max: 5, input_html: { onchange: 'checkRiskProbabilityImpactNumber(this)' }
      div id: 'risk_impact_text'
      f.input :risk_approach, include_blank: false, include_hidden: false
      f.input :risk_approach_description, label: 'Risk Approach Description', input_html: { rows: 8 }
      f.input :progress
      div id: 'progress_slider-tab'
      f.input :auto_calculate
      f.has_many :checklists, heading: 'Checklist Items', allow_destroy: true do |c|
        c.input :checked, label: '', input_html: {class: 'checklist_item_checked', disabled: !c.object.text&.strip}
        c.input :text, input_html: {class: 'checklist_item_text'}
        c.input :user_id, as: :select, label: 'Assigned To', collection: User.active.map{|u| [u.full_name, u.id]}, input_html: {class: 'checklist_user'}
      end
      div id: 'uploaded-task-files', 'data-files': "#{f.object.files_as_json}"
      f.input :risk_files, label: 'Risk Files'
      f.input :sub_tasks, label: 'Related Tasks', as: :select, collection: Task.all.map{|u| [u.text, u.id]}, input_html: {multiple: true}
      f.input :sub_issues, label: 'Related Issues', as: :select, collection: Issue.all.map{|u| [u.title, u.id]}, input_html: {multiple: true}
      f.input :sub_risks, label: 'Related Risks', as: :select, collection: Risk.all.map{|u| [u.risk_description, u.id]}, input_html: {multiple: true}
      div id: 'related_tasks-issues-tab'
    end
    f.actions
  end

  controller do
    before_action :check_readability, only: [:index, :show]
    before_action :check_writeability, only: [:new, :edit, :update, :create]

    def check_readability
      redirect_to '/not_found' and return unless current_user.admin_read?
    end

    def check_writeability
      redirect_to '/not_found' and return unless current_user.admin_write?
    end

    def create
      build_resource
      handle_files
      resource.user = current_user
      # super
      resource.validate
      if resource.save
        redirect_to admin_risks_path , notice: "Risk created Successfully"
      else
        render :new
      end
    end

    def update
      handle_files
      super
    end

    def handle_files
      resource.manipulate_files(params) if resource.present?
      params[:risk].delete(:risk_files)
    end

    def destroy
      redirect_to '/not_found' and return unless current_user.admin_delete?
      super
    rescue ActiveRecord::StatementInvalid
      flash[:error] = "Not able to delete this! Violates foreign key constraint."
      redirect_back fallback_location: root_path
    end

    def scoped_collection
      super.includes(:task_type, :risk_stage, facility_project: [:project, :facility])
    end
  end

  filter :text, label: "Name"
  filter :risk_stage
  filter :risk_description
  filter :impact_description
  filter :probability
  filter :impact_level
  filter :risk_approach, as: :select, collection: Risk.risk_approaches
  filter :risk_approach_description
  filter :task_type
  filter :start_date
  filter :due_date
  filter :facility_project_project_id, as: :select, collection: -> {Project.pluck(:name, :id)}, label: 'Project'
  filter :facility_project_facility_facility_name, as: :string, label: 'Facility'
  filter :user, label: "Owned by"
  filter :progress
  filter :id, as: :select, collection: -> {[current_user.admin_privilege]}, input_html: {id: '__privileges_id'}, include_blank: false
end
