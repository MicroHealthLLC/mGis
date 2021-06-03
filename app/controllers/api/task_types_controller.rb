class Api::TaskTypesController < AuthenticatedController

  def index
    task_types = []
    if params[:project_id]
      task_types = Project.find(params[:project_id]).task_types
    else
      task_types = TaskType.all
    end
    render json: {task_types: task_types.as_json}
  end
end
