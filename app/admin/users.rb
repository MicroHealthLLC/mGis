ActiveAdmin.register User do
  menu priority: 2
  actions :all, except: [:show]

  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Users', admin_users_path)]
    if %(show edit).include?(params['action'])
      links << link_to(user.email, edit_admin_user_path)
    end
    links
  end

  permit_params do
    permitted = [
      :email,
      :first_name,
      :last_name,
      :title,
      :phone_number,
      :address,
      :lat,
      :lng,
      :password,
      :password_confirmation,
      :status,
      :privileges,
      :country_code,
      :organization_id,
      project_ids: [],
      privilege_attributes: [
        :id,
        :overview,
        :tasks,
        :issues,
        :notes,
        :admin,
        :map_view,
        :gantt_view,
        :watch_view,
        :kanban_view,
        :documents,
        :facility_manager_view,
        :sheets_view,
        :members,
        :risks
      ]
    ]
  end

  form(html: {autocomplete: :off}) do |f|
    f.semantic_errors *f.object.errors.keys

    tabs do
      tab 'Basic' do
        f.inputs 'Basic Details' do
          f.input :title, label: "Position"
          f.input :first_name
          f.input :last_name
          f.input :email, input_html: {:'data-id' => user.id, autocomplete: :off}
          f.input :password, input_html: {disabled: user.id?, autocomplete: :off}
          f.input :password_confirmation, input_html: {disabled: user.id?, autocomplete: :off}
          f.input :phone_number
          f.input :country_code
          div id: 'user_phone_number-tab'
          f.input :address, input_html: {autocomplete: :off}
          f.input :lat
          f.input :lng
          div id: 'gmap-key', "data-key": Setting['GOOGLE_MAP_KEY']
          div id: 'passwords-key', "data-key": Setting['PASSWORDS_KEY']
          div id: 'user-gmaps-tab'
          f.input :status, include_blank: false, include_hidden: false, label: "State"
          f.input :organization, input_html: {class: "select2"}, include_blank: true
          f.inputs for: [:privilege, f.object.privilege || Privilege.new] do |p|
            p.input :facility_manager_view
            p.input :sheets_view
            p.input :map_view
            p.input :gantt_view
            p.input :watch_view
            p.input :kanban_view
            p.input :overview
            p.input :tasks
            p.input :issues
            p.input :risks
            p.input :notes
            p.input :documents
            p.input :members
            p.input :admin
          end
        end
        div id: 'user-role_privilege-tab'
        div id: 'user-password__tab'
      end

      tab 'Programs' do
        f.inputs 'Programs Details' do
          f.input :projects, label: 'Programs', as: :select, include_blank: false
        end
      end
    end

    actions
  end

  index do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    selectable_column if current_user.admin_write? || current_user.admin_delete?
    column "Position", :title
    column :first_name
    column :last_name
    column :email
    column :organization, nil, sortable: 'organizations.title' do |user|
      if current_user.admin_write?
        link_to "#{user.organization.title}", "#{edit_admin_organization_path(user.organization)}" if user.organization.present?
      else
        "<span>#{user.organization&.title}</span>".html_safe
      end
    end
    tag_column "State", :status
    column :phone_number
    column :address
    column "Programs", :projects do |user|
      if current_user.admin_write?
        user.projects.active
      else
        "<span>#{user.projects.active.reorder(:id).pluck(:name).join(', ')}</span>".html_safe
      end
    end
    actions defaults: false do |user|
      item "Edit", edit_admin_user_path(user), title: 'Edit', class: "member_link edit_link" if current_user.admin_write? && current_user.id != user.id
      item "Delete", admin_user_path(user), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete? && current_user.id != user.id
    end
  end

  batch_action :assign_state, if: proc {current_user.admin_write?}, form: {
    "State": User.statuses&.to_a
  } do |ids, inputs|
    User.where(id: ids).update_all(status: inputs['State'].to_i)
    redirect_to collection_path, notice: 'State is updated'
  end

  batch_action :"Assign/Unassign Program", if: proc {current_user.admin_write?}, form: -> {{
    assign: :checkbox,
    "Program": Project.pluck(:name, :id)
  }} do |ids, inputs|
    notice = "Program is assigned"
    project = Project.find_by_id(inputs["Program"])
    if inputs['assign'] === 'assign'
      User.where(id: ids).each do |user|
        user.projects << project unless user.projects.pluck(:id).include?(project.id)
      end
      notice = "Program is assigned"
    elsif inputs['assign'] === 'unassign'
      ProjectUser.where(project_id: project.id, user_id: ids).destroy_all
      notice = "Program is unassigned"
    end
    redirect_to collection_path, notice: "#{notice}"
  end

  batch_action :destroy, if: proc {current_user.admin_delete?}, confirm: "Are you sure you want to delete these Users?" do |ids|
    deleted = User.where(id: ids).where.not(id: current_user.id).destroy_all
    redirect_to collection_path, notice: "Successfully deleted #{deleted.count} Users"
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

    def edit
      redirect_to '/not_found' and return if params[:id].to_i == current_user.id
      super
    end

    def destroy
      redirect_to '/not_found' and return unless current_user.admin_delete?
      super
    rescue ActiveRecord::StatementInvalid
      flash[:error] = "Not able to delete this! Violates foreign key constraint."
      redirect_back fallback_location: root_path
    end

    def index
      super do |format|
        format.json {send_data collection.to_json, type: :json, disposition: "attachment"}
      end
    end

    def scoped_collection
      super.includes(:organization)
    end
  end

  filter :email
  filter :projects, as: :select, collection: -> {Project.active}, label: "Program"
  filter :title, label: "Position"
  filter :organization
  filter :first_name
  filter :last_name
  filter :phone_number
  filter :address
  filter :status, as: :select, collection: User.statuses, label: "State"
  filter :id, as: :select, collection: -> {[current_user.admin_privilege]}, input_html: {id: '__privileges_id'}, include_blank: false
  remove_filter :lat
  remove_filter :lng
end
