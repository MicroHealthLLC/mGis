ActiveAdmin.register Facility do
  menu priority: 6
  actions :all, except: [:show]

  permit_params do
    permitted = [
      :facility_name,
      :address,
      :point_of_contact,
      :phone_number,
      :email,
      :notes,
      :facility_group_id,
      :status_id,
      :creator_id,
      :due_date,
      :status,
      :lat,
      :lng,
      project_ids: [],
      comments_attributes: [
        :namespace,
        :author_id,
        :author_type,
        :body
      ]
    ]
  end

  index do
    selectable_column
    column :facility_name
    column :address
    column :point_of_contact
    column :email
    column :phone_number
    column :facility_group
    column :status
    column(:projects) { |facility| facility.projects.active }
    actions
  end

  form do |f|
    f.semantic_errors *f.object.errors.keys

    tabs do
      tab 'Basic' do
        f.inputs 'Basic Details' do
          f.input :facility_name
          f.input :facility_group
          f.input :status
          f.input :due_date
          f.input :address
          f.input :lat
          f.input :lng
          div id: 'gmaps-tab'
          f.input :point_of_contact
          f.input :phone_number
          f.input :email
        end
      end

      tab 'Advanced' do
        f.inputs 'Assign Projects' do
          f.input :projects, label: 'Projects', as: :select, collection: Project.all.map{|p| [p.name, p.id]}
        end
      end

      tab 'Comments' do
        panel "Comments" do
          div class: 'comments custom_made' do
            resource.comments.each do |comment|
              div for: comment do
                div class: 'active_admin_comment_meta' do
                  h4 class: 'active_admin_comment_author' do
                    comment.author ? auto_link(comment.author) : I18n.t('active_admin.comments.author_missing')
                  end
                  span pretty_format comment.created_at
                  if authorized?(ActiveAdmin::Auth::DESTROY, comment)
                    text_node link_to I18n.t('active_admin.comments.delete'), admin_comment_url(comment.id), method: :delete, data: { confirm: I18n.t('active_admin.comments.delete_confirmation') }
                  end
                end
                div class: 'active_admin_comment_body' do
                  simple_format comment.body
                end
              end
            end

            f.semantic_fields_for :comments, ActiveAdmin::Comment.new do |c|
              c.inputs :class => "" do
                c.input :body, label: "Comment", input_html: { rows: 8 }
              end
            end
          end
        end
      end
    end

    f.actions

  end

  batch_action :assign_facility_group, form: {
    "Facility Group": FacilityGroup.pluck(:name, :id)
  } do |ids, inputs|
    Facility.where(id: ids).update_all(facility_group_id: inputs["Facility Group"])
    redirect_to collection_path, notice: "Facility group is updated"
  end

  batch_action :assign_status, form: {
    "status": Status.pluck(:name, :id)
  } do |ids, inputs|
    Facility.where(id: ids).update_all(status_id: inputs["status"])
    redirect_to collection_path, notice: "Status is updated"
  end

  batch_action :assign_projects, confirm: "Are you sure?", form: {
    project: Project.pluck(:name, :id)
  } do |ids, inputs|
    project = Project.find_by_id(inputs[:project])
    Facility.where(id: ids).each do |facility|
      facility.projects << project unless facility.projects.pluck(:id).include?(project.id)
    end
    redirect_to collection_path, notice: "Assigned projects updated"
  end

  batch_action :add_task, id:"asasas", form: {
    text: :text,
    "Task Type": TaskType.pluck(:name, :id),
    "Start Date": :datepicker,
    "Due Date": :datepicker,
    "progress": :number,
    "notes":  :textarea
  } do |ids, inputs|
    Facility.where(id: ids).each do |facility|
      facility.tasks.create!(text: inputs['text'], task_type_id: inputs['Task Type'], start_date: inputs['Start Date'], due_date: inputs['Due Date'], progress: inputs['progress'], notes: inputs['notes'])
    end
    redirect_to collection_path, notice: "Task added"
  rescue => e
    redirect_to collection_path, flash: {error: e.message}
  end

  controller do

    def create
      params[:facility][:creator_id] = current_user.id
      super
    end

    def update(options={}, &block)
      params[:facility][:comments_attributes]['0']['namespace'] = 'admin'
      params[:facility][:comments_attributes]['0']['author_id'] = current_user.id
      params[:facility][:comments_attributes]['0']['author_type'] = 'User'
      super do |success, failure|
        block.call(success, failure) if block
        failure.html { render :edit }
      end
    end
  end

  preserve_default_filters!
  filter :creator_id, as: :select, collection: User.all.map{|u| ["#{u.first_name} #{u.last_name}", u.id]}
  filter :tasks, as: :select, collection: Task.pluck(:text, :id)
  remove_filter :creator
  remove_filter :comments
  remove_filter :created_at
  remove_filter :updated_at
  remove_filter :lat
  remove_filter :lng
  remove_filter :facility_projects

end
