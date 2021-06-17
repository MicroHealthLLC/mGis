ActiveAdmin.register LessonDetail do
  menu parent: "Lessons", priority: 3
  actions :all, except: [:show]
  
  breadcrumb do
    links = [link_to('Admin', admin_root_path), link_to('Lesson Details', admin_lesson_details_path)]
    if %(show edit).include?(params['action'])
      links << link_to(lesson_detail.id, edit_admin_lesson_detail_path)
    end
    links
  end

  permit_params do
    permitted = [
      :finding, 
      :recommendation, 
      :user_id, 
      :lesson_id,  
      :detail_type
    ]
    permitted
  end
  
  index do
    div id: '__privileges', 'data-privilege': "#{current_user.admin_privilege}"
    column :id
    column :finding
    column :recommendation
    column :user, sortable: 'users.first_name' 
    column :lesson, sortable: 'lessons.title' 
    column :detail_type do |lesson_detail|
      "<span>#{lesson_detail.detail_type.humanize}</span>".html_safe
    end
    actions defaults: false do |lesson_detail|
      item "Edit", edit_admin_lesson_detail_path(lesson_detail), title: 'Edit', class: "member_link edit_link" if current_user.admin_write?
      item "Delete", admin_lesson_detail_path(lesson_detail), title: 'Delete', class: "member_link delete_link", 'data-confirm': 'Are you sure you want to delete this?', method: 'delete' if current_user.admin_delete?
    end
  end
  form do |f|
    f.semantic_errors *f.object.errors.keys
    f.inputs 'Basic Details' do
      f.input :id, input_html: { value: f.object.id }, as: :hidden
      f.input :finding
      f.input :recommendation
      f.input :user, include_blank: false
      f.input :lesson, include_blank: false
      f.input :detail_type, as: :select, collection: [["Success","success"], ["Failure", "failure"], ["Best Practices", "best_practices"]], include_blank: false
    end
    f.actions
  end

  controller do
    before_action :check_readability, only: [:index, :show]
    # before_action :check_order, only: [:index]
    before_action :check_writeability, only: [:new, :edit, :update, :create]

    def check_readability
      redirect_to '/not_found' and return unless current_user.admin_read?
    end

    def check_writeability
      redirect_to '/not_found' and return unless current_user.admin_write?
    end
    
    def scoped_collection
      super.includes(:lesson, :user)
    end
  end

end