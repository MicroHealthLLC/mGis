ActiveAdmin.register Facility do
  menu priority: 4, label: "Projects"
  actions :all, except: [:show]

  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Projects', admin_facilities_path)]
    if %(show edit).include?(params['action'])
      links << link_to(facility.facility_name, edit_admin_facility_path)
    end
    links
  end

  permit_params do
    permitted = [
      :facility_name,
      :address,
      :point_of_contact,
      :phone_number,
      :country_code,
      :email,
      :facility_group_id,
      :creator_id,
      :status,
      :lat,
      :lng,
      :status,
      project_ids: [],
      comments_attributes: [
        :id,
        :namespace,
        :author_id,
        :author_type,
        :body,
        :_destroy
      ]
    ]
  end

  index title: 'Projects' do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    div id: 'direct-upload-url', "data-direct-upload-url": "#{rails_direct_uploads_url}"
    selectable_column if current_user.admin_write? || current_user.admin_delete?
    column "Project Name", :facility_name
    column :address
    column :point_of_contact
    column :email
    column :phone_number
    column "Project Group", :facility_group, nil, sortable: 'facility_groups.name' do |facility|
      if current_user.admin_write?
        link_to "#{facility.facility_group.name}", "#{edit_admin_facility_group_path(facility.facility_group)}" if facility.facility_group.present?
      else
        "<span>#{facility.facility_group&.name}</span>".html_safe
      end
    end
    tag_column "State", :status
    column "Programs" , :projects do |facility|
      if current_user.admin_write?
        facility.projects.active
      else
        "<span>#{facility.projects.active.reorder(:id).pluck(:name).join(', ')}</span>".html_safe
      end
    end
    actions defaults: false do |facility|
      item "Edit", edit_admin_facility_path(facility), title: 'Edit', class: "member_link edit_link" if current_user.admin_write?
      item "Delete", admin_facility_path(facility), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete?
    end
  end

  form do |f|
    f.semantic_errors *f.object.errors.keys

    tabs do
      tab 'Basic' do
        f.inputs 'Basic Details' do
          f.input :facility_name, label: "Project Name"
          f.input :facility_group, include_blank: false, include_hidden: false, label: "Project Group"
          f.input :address, as: :hidden
          f.input :lat, as: :hidden
          f.input :lng, as: :hidden
          div id: 'gmap-key', "data-key": Setting['GOOGLE_MAP_KEY']
          div id: 'gmaps-tab'
          f.input :point_of_contact
          f.input :phone_number, as: :hidden
          f.input :country_code, as: :hidden
          div id: 'f_phone_number-tab'
          f.input :email
          f.input :status, include_blank: false, include_hidden: false, label: "State"
        end
      end

      tab 'Advanced' do
        f.inputs 'Assign Programs' do
          # f.input :projects, label: 'Programs', as: :select, collection: Project.all.map{|p| [p.name, p.id]}
          input :projects, label: 'Programs', as: :select, collection: options_for_select(  Project.all.map{|p| [p.name, p.id]}, f.object.project_ids ), multiple: true, input_html: {class: "select2", "data-close-on-select" => false }

        end
        div id: 'facility_projects-tab', "data-key": "#{resource.id}"
      end

      tab 'Comments' do
        f.inputs 'Comments' do
          f.has_many :comments, heading: false do |c|
            c.input :author, as: :select, label: "Comments by", collection: User.where(id: c.object.author_id).map {|u| [u.full_name, u.id]} if c.object.id?
            c.input :created_at, as: :string, label: 'Created at', input_html: {value: pretty_format(c.object.created_at)} if c.object.id?
            c.input :updated_at, as: :string, label: 'Last Updated at', input_html: {value: pretty_format(c.object.updated_at)} if (c.object.id? and c.object.updated_at > c.object.created_at)
            c.input :body, label: "Comment body", input_html: {readonly: (c.object.id? and c.object.author_id != current_user.id), disabled: (c.object.id? and c.object.author_id != current_user.id), rows: 7}
            c.input :_destroy, as: :boolean, label: "Delete" if (c.object.id? and c.object.author_id == current_user.id)
          end
        end
      end
    end
    f.actions
  end

  batch_action :"Assign/Unassign Project Group", if: proc {current_user.admin_write?}, form: -> {{
    assign: :checkbox,
    "Project Group": FacilityGroup.pluck(:name, :id)
  }} do |ids, inputs|
    notice = "Project Group is updated"
    if inputs['assign'] === 'assign'
      Facility.where(id: ids).update_all(facility_group_id: inputs["Facility Group"])
      notice = "Project Group is assigned"
    elsif inputs['assign'] === 'unassign'
      Facility.where(id: ids, facility_group_id: inputs["Facility Group"]).update_all(facility_group_id: nil)
      notice = "Project Group is unassigned"
    end
    redirect_to collection_path, notice: "#{notice}"
  end

  batch_action :assign_state, if: proc {current_user.admin_write?}, form: {
    state: Facility.statuses&.to_a
  } do |ids, inputs|
    Facility.where(id: ids).update_all(status: inputs['state'].to_i)
    redirect_to collection_path, notice: 'State is updated'
  end

  batch_action :"Assign/Unassign Program", if: proc {current_user.admin_write?}, form: -> {{
    assign: :checkbox,
    "Program": Project.pluck(:name, :id)
  }} do |ids, inputs|
    notice = "Program is assigned"
    project = Project.find_by_id(inputs["Project"])
    if inputs['assign'] === 'assign'
      Facility.where(id: ids).each do |facility|
        facility.projects << project unless facility.projects.pluck(:id).include?(project.id)
      end
      notice = "Program is assigned"
    elsif inputs['assign'] === 'unassign'
      FacilityProject.where(project_id: project.id, facility_id: ids).destroy_all
      notice = "Program is unassigned"
    end
    redirect_to collection_path, notice: "#{notice}"
  end

  batch_action :add_task, if: proc {current_user.admin_write?}, id:"add-tasks", form: -> {{
    "Name": :text,
    "Description": :textarea,
    "Program": Project.pluck(:name, :id),
    "Category": TaskType.pluck(:name, :id),
    "Stage": TaskStage.pluck(:name, :id),
    "Start Date": :datepicker,
    "Due Date": :datepicker,
    "Assign Users": :text,
    "Progress": :number,
    "AutoCalculate": :checkbox,
    "Checklists": :text,
    "Task Files": :text
  }} do |ids, inputs|
    binding.pry
    user_ids = inputs["Assign Users"].split(',').map(&:to_i) rescue []
    file_blobs = JSON.parse(inputs["Task Files"]).map{|id| {:blob_id => id}} rescue []
    checklists = JSON.parse(inputs["Checklists"]) rescue []
    Facility.where(id: ids).each do |facility|
      facility.facility_projects.where(project_id: inputs['Program']).each do |facility_project|
        task = facility_project.tasks.create!(text: inputs['Name'], task_type_id: inputs['Category'], task_stage_id: inputs['Stage'], start_date: inputs['Start Date'], due_date: inputs['Due Date'], progress: inputs['Progress'], description: inputs['Description'], auto_calculate: inputs['AutoCalculate'], user_ids: user_ids, checklists_attributes: checklists)
        task.task_files.create(file_blobs) if file_blobs.present?
      end
    end
    redirect_to collection_path, notice: "Task added"
  rescue => e
    redirect_to collection_path, flash: {error: e.message}
  end

  batch_action :"Assign Program, Due Date and Status", if: proc {current_user.admin_write?}, id:"assign-duedate-status", form: -> {{
    "Program": Project.pluck(:name, :id),
    "Status": Status.pluck(:name, :id),
    "Due Date": :datepicker
  }} do |ids, inputs|
    Facility.where(id: ids).each do |facility|
      facility_project = facility.facility_projects.find_or_initialize_by(project_id: inputs['Project'])
      facility_project.status_id = inputs['Status']
      facility_project.due_date = inputs['Due Date']
      facility_project.save
    end
    redirect_to collection_path, notice: "Due Date, Status and Assign Program is updated"
  rescue => e
    redirect_to collection_path, flash: {error: e.message}
  end

  batch_action :destroy, if: proc {current_user.admin_delete?}, confirm: "Are you sure you want to delete these Projects" do |ids|
    deleted = Facility.where(id: ids).destroy_all
    redirect_to collection_path, notice: "Successfully deleted #{deleted.count} Projects"
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

    def destroy
      redirect_to '/not_found' and return unless current_user.admin_delete?
      super
    rescue ActiveRecord::StatementInvalid
      flash[:error] = "Not able to delete this! Violates foreign key constraint."
      redirect_back fallback_location: root_path
    end

    def create
      params[:facility][:creator_id] = current_user.id
      normalize_comment_params
      super
    end

    def update(options={}, &block)
      normalize_comment_params
      resource.delete_nested_projects(params[:facility][:project_ids]) if params[:facility][:project_ids].present?
      super do |success, failure|
        block.call(success, failure) if block
        failure.html {render :edit}
      end
    end

    def normalize_comment_params
      i = 0
      while params[:facility][:comments_attributes][i.to_s].present?
        params[:facility][:comments_attributes][i.to_s]['namespace'] = 'admin'
        params[:facility][:comments_attributes][i.to_s]['author_id'] = current_user.id
        params[:facility][:comments_attributes][i.to_s]['author_type'] = 'User'
        i = i+1
      end if params[:facility][:comments_attributes].present?
    end

    def index

      super do |format|
        format.json {send_data collection.to_json, type: :json, disposition: "attachment"}
      end
    end

    def scoped_collection
      super.includes(:facility_group)
    end
  end

  filter :creator_id, as: :select, collection: -> {User.admin.where.not(last_name: ['', nil]).or(User.admin.where.not(first_name: [nil, ''])).map{|u| ["#{u.first_name} #{u.last_name}", u.id]}}
  filter :facility_group, label: "Project Group"
  filter :facility_name, label: "Project Name"
  filter :address
  filter :point_of_contact
  filter :email
  filter :phone_number
  filter :status, label: 'State', as: :select, collection: Facility.statuses
  filter :tasks_text, as: :string, label: "Task Name"
  filter :tasks_task_type_id, as: :select, collection: -> {TaskType.pluck(:name, :id)}, label: 'Category'
  filter :facility_projects_status_id, as: :select, collection: -> {Status.pluck(:name, :id)}, label: 'Project Status'
  filter :projects, label: "Programs"
  filter :id, as: :select, collection: -> {[current_user.admin_privilege]}, input_html: {id: '__privileges_id'}, include_blank: false
  remove_filter :creator
  remove_filter :country_code
  remove_filter :tasks
  remove_filter :comments
  remove_filter :created_at
  remove_filter :updated_at
  remove_filter :lat
  remove_filter :lng
  remove_filter :facility_projects

end
