ActiveAdmin.register RiskMilestone do
  menu parent: "Risks"
  actions :all, except: [:show]

  permit_params do
    permitted = [:name]
    permitted
  end

  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Risk Milestones', admin_risk_milestones_path)]
    if %(show edit).include?(params['action'])
      links << link_to(risk_milestone.name, edit_admin_risk_milestone_path)
    end
    links
  end

  index do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    selectable_column if current_user.admin_delete?
    column :id
    column :name
    actions defaults: false do |risk_milestone|
      item "Edit", edit_admin_risk_milestone_path(risk_milestone), title: 'Edit', class: "member_link edit_link" if current_user.admin_write?
      item "Delete", admin_risk_milestone_path(risk_milestone), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete?
    end
  end

  controller do
    before_action :check_readability, only: [:index, :show]
    before_action :check_order, only: [:index]
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

    def check_order
      order = RiskMilestone.sort_order?
      redirect_to admin_risk_milestones_path(order: order) and return unless params[:order] == order
    end

    def index
      super do |format|
        format.json {send_data collection.to_json, type: :json, disposition: "attachment"}
      end
    end
  end

  batch_action :destroy, if: proc {current_user.admin_delete?}, confirm: "Are you sure you want to delete these Risk Milestones?" do |ids|
    deleted = RiskMilestone.where(id: ids).destroy_all
    redirect_to collection_path, notice: "Successfully deleted #{deleted.count} Risk Milestones"
  end

  filter :name
  filter :created_at
  filter :updated_at
  filter :id, as: :select, collection: -> {[current_user.admin_privilege]}, input_html: {id: '__privileges_id'}, include_blank: false
  remove_filter :risks

end