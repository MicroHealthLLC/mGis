ActiveAdmin.register Role do
  menu parent: "Users"
  actions :all, except: [:show]

  permit_params do
    permitted = [
      :name,
      :description,
      project_ids: [],
      privilege_attributes: [
        :id,
        :overview,
        :tasks,
        :issues,
        :notes,
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
    permitted
  end

  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Roles', admin_roles_path)]
    if %(show edit).include?(params['action'])
      links << link_to(role.name, edit_admin_role_path)
    end
    links
  end

  form do |f|
    f.semantic_errors *f.object.errors.keys
    f.inputs 'Basic' do
      f.input :name
      f.input :description, input_html: {rows: 4}
      f.input :projects, label: 'Projects', as: :select, collection: options_for_select(Project.active.map{|p| [p.name, p.id]}, f.object.project_ids) , multiple: true, input_html: {class: "select2", "data-close-on-select" => false }
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
      end
    end
    div id: 'user-role_privilege-tab'
    f.actions
  end

  index do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    selectable_column if current_user.admin_delete?
    column :id
    column :name
    column :description
    column :projects do |role|
      if current_user.admin_write?
        role.projects.active
      else
        "<span>#{role.projects.active.reorder(:id).pluck(:name).join(', ')}</span>".html_safe
      end
    end
    actions defaults: false do |role|
      item "Edit", edit_admin_role_path(role), title: 'Edit', class: "member_link edit_link" if current_user.admin_write?
      item "Delete", admin_role_path(role), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete?
    end
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
  end

  batch_action :destroy, if: proc {current_user.admin_delete?}, confirm: "Are you sure you want to delete these roles?" do |ids|
    deleted = Role.where(id: ids).destroy_all
    redirect_to collection_path, notice: "Successfully deleted #{deleted.count} Roles"
  end

  filter :name
  filter :id, as: :select, collection: -> {[current_user.admin_privilege]}, input_html: {id: '__privileges_id'}, include_blank: false
end
