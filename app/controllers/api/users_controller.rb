class Api::UsersController < AuthenticatedController
  before_action :require_admin

  def index
    if params[:project_id].present?
      @users = Project.where(id: params[:project_id]).first.users.as_json
    else
      @users = User.active.map(&:as_json)
    end
    render json: @users
  end
end
