class Api::TaskStagesController < AuthenticatedController
  def index
    task_stages = []
    if params[:project_id]
      task_stages = Project.find(params[:project_id]).task_stages
    else
      task_stages = TaskStage.all
    end
    render json: {task_stages: task_stages.as_json}
  end
end
