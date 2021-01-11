ActiveAdmin.register Organization do
  menu parent: "Users"
  actions :all, except: [:show]

  permit_params do
    permitted = [:title]
    permitted
  end

  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Organizations', admin_organizations_path)]
    if %(show edit).include?(params['action'])
      links << link_to(organization.title, edit_admin_organization_path)
    end
    links
  end

  index do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    selectable_column if current_user.admin_delete?
    column :id
    column :title
    actions defaults: false do |organization|
      item "Edit", edit_admin_organization_path(organization), title: 'Edit', class: "member_link edit_link" if current_user.admin_write?
      item "Delete", admin_organization_path(organization), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete?
    end
  end

  form do |f|
    f.semantic_errors *f.object.errors.keys
    f.inputs do
      f.input :title
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

    def destroy
      redirect_to '/not_found' and return unless current_user.admin_delete?
      super
    rescue ActiveRecord::StatementInvalid
      flash[:error] = "Not able to delete this! Violates foreign key constraint."
      redirect_back fallback_location: root_path
    end
  end

  batch_action :destroy, if: proc {current_user.admin_delete?}, confirm: "Are you sure you want to delete these organizations?" do |ids|
    deleted = Organization.where(id: ids).destroy_all
    redirect_to collection_path, notice: "Successfully deleted #{deleted.count} Organizations"
  end

  filter :title
  filter :id, as: :select, collection: -> {[current_user.admin_privilege]}, input_html: {id: '__privileges_id'}, include_blank: false
  remove_filter :tasks

end
