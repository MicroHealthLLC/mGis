class Api::ProjectRolesController < AuthenticatedController
  before_action :require_admin

  def index
    collection = Project.active.as_json(include: {project_roles: {include: {role: {only: [:name, :id]}}}})
    render json: collection
  end
end
