class TasksController < AuthenticatedController
  before_action :set_resources
  before_action :set_task, only: [:show, :update, :destroy, :create_duplicate]

  def index
    render json: {tasks: @facility_project.tasks.map(&:to_json)}
  end

  def create
    @task = Task.new.create_or_update_task(params, current_user)
    render json: {task: @task.to_json}
  end

  def update
    destroy_files_first if destroy_file_ids.present?
    @task.update(task_params)
    # @task.create_or_update_task(params, current_user)
    render json: {task: @task.reload.to_json}
  end

  def create_duplicate
    duplicate_task = @task.amoeba_dup
    duplicate_task.save
    # @task.create_or_update_task(params, current_user)
    render json: {task: duplicate_task.reload.to_json}
  end

  def show
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
    params.require(:task).permit(
      :text,
      :task_type_id,
      :task_stage_id,
      :facility_project_id,
      :due_date,
      :start_date,
      :description,
      :progress,
      :auto_calculate,
      :watched,    
      :kanban_order,
      task_files: [],
      user_ids: [],
      sub_task_ids: [],
      sub_issue_ids: [],
      checklists_attributes: [
        :id,
        :_destroy,
        :text,
        :user_id,
        :checked,
        :position,
        :due_date,
        :listable_type,
        :listable_id,
        :position
      ],
      notes_attributes: [
        :id,
        :_destroy,
        :user_id,
        :body
      ]
    )
  end

  def destroy_file_ids
    params[:task][:destroy_file_ids]&.split(',')&.map(&:to_i)
  end

  def destroy_files_first
    @task.task_files.where(id: destroy_file_ids)&.map(&:purge)
  end
end
