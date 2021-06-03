class TasksController < AuthenticatedController
  before_action :set_resources, except: [:show]
  before_action :set_task, only: [:update, :destroy, :create_duplicate, :create_bulk_duplicate]

  def index
    all_users = []
    all_user_ids = []

    all_tasks = Task.unscoped.includes([{task_files_attachments: :blob}, :task_type, {task_users: :user}, {users: :organization}, :task_stage, {checklists: [:user, {progress_lists: :user} ] }, { notes: :user }, :related_tasks, :related_issues, :related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility} ]).where(facility_project_id: @facility_project.id).paginate(:page => params[:page], :per_page => 15)
    all_task_users = TaskUser.where(task_id: all_tasks.map(&:id) ).group_by(&:task_id)
    all_user_ids += all_task_users.values.flatten.map(&:user_id)
    all_user_ids = all_user_ids.compact.uniq

    all_users = User.includes(:organization).where(id: all_user_ids ).active
    all_organizations = Organization.where(id: all_users.map(&:organization_id).compact.uniq )

    h = []
    all_tasks.each do |t| 
      h << t.to_json({orgaizations: all_organizations, all_task_users: all_task_users[t.id], all_users: all_users, for: :task_index} )
    end

    render json: {tasks: h, total_pages: all_tasks.total_pages, current_page: all_tasks.current_page, next_page: all_tasks.next_page }
    # render json: {tasks: @facility_project.tasks.map(&:to_json)}
  end

  def create
    @task = Task.new.create_or_update_task(params, current_user)

    if @task.errors.any?
      render json: {task: @task.to_json, errors: @task.errors.full_messages.join(", ") }, status: :unprocessable_entity
    else
      render json: {task: @task.to_json}
    end
    
  end

  def update
    destroy_files_first if destroy_file_ids.present?
    t_params = task_params.dup
    if t_params[:checklists_attributes].present?
      t_params[:checklists_attributes].each do |key, hash|
        if hash["progress_lists_attributes"].present?
          hash["progress_lists_attributes"].each do |key2, hash2|
            hash2[:user_id] = current_user.id if hash2[:user_id].nil?
          end
        end
      end
    end
    @task.update(t_params)
    @task.assign_users(params)
    @task.add_link_attachment(params)
    @task.reload
    # @task.create_or_update_task(params, current_user)

    if @task.errors.any?
      render json: {task: @task.to_json, errors: @task.errors.full_messages.join(", ") }, status: :unprocessable_entity
    else
      render json: {task: @task.to_json}
    end
  end

  def create_duplicate
    duplicate_task = @task.amoeba_dup
    duplicate_task.save
    # @task.create_or_update_task(params, current_user)
    render json: {task: duplicate_task.reload.to_json}
  end

  def create_bulk_duplicate
    all_objs = []
    if params[:facility_project_ids].present?
      params[:facility_project_ids].each do |fp_id|
        duplicate_task = @task.amoeba_dup
        duplicate_task.facility_project_id = fp_id
        duplicate_task.save
        all_objs << duplicate_task
      end
    end
    # duplicate_task.save
    # @task.create_or_update_task(params, current_user)
    render json: {tasks: all_objs.map(&:to_json)}
  end

  def show
    @facility_project = FacilityProject.find(params[:facility_project_id])
    @task = @facility_project.tasks.includes([{task_files_attachments: :blob}, :task_type, :task_users, {users: :organization}, :task_stage, {checklists: [:user, {progress_lists: :user} ] }, { notes: :user }, :related_tasks, :related_issues, :related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility} ]).find(params[:id])
    render json: {task: @task.to_json}
  end

  def destroy
    @task.destroy!
    render json: {}, status: 200
  rescue
    render json: {}, status: 500
  end

  def batch_update
    Task.update(params[:tasks].keys, params[:tasks].values)
    render json: @facility_project.as_json
  end

  private
  def set_resources
    @project = current_user.projects.active.find_by(id: params[:project_id])
    @facility_project = @project.facility_projects.find_by(facility_id: params[:facility_id])
  end

  def set_task
    @task = @facility_project.tasks.find_by(id: params[:id])
  end

  def task_params
    params.require(:task).permit(Task.params_to_permit)
  end

  def destroy_file_ids
    params[:task][:destroy_file_ids]&.split(',')&.map(&:to_i)
  end

  def destroy_files_first
    @task.task_files.where(id: destroy_file_ids)&.map(&:purge)
  end
end
