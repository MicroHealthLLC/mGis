class FacilitiesController < AuthenticatedController
  before_action :set_project
  before_action :set_facility, only: [:show, :update]

  def index
    include_hash = {
      facility: [:facility_group],
      tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ],
      issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ],
      notes: [{note_files_attachments: :blob}, :user]
    }
    facility_projects = @project.facility_projects.includes(include_hash,:status ).order(created_at: :desc).as_json
    render json: {facilities: facility_projects, project: @project}
  end

  def create
    @facility = @project.facilities.create(facility_params.merge(creator: current_user))
    render json: {facility: @facility.as_json}
  end

  def show
    render json: {facility: @facility_project.as_json}
  end

  def update
    @facility_project.update(facility_project_params)
    render json: {facility: @facility_project.as_json}
  end

  def destroy
    @facility_project = @project.facility_projects.includes(include_hash,:status).find_by(facility_id: params[:id])
    @facility = @facility_project.facility
    @facility.destroy!
    render json: {}, status: 200
  rescue
    render json: {}, status: :not_found
  end

  private
  def set_facility
    include_hash = {
      facility: [:facility_group],
      tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ],
      issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ],
      notes: [{note_files_attachments: :blob}, :user]
    }
    @facility_project = @project.facility_projects.includes(include_hash,:status).find_by(facility_id: params[:id])
    # @facility = @facility_project.facility
  end

  def set_project
    @project = current_user.projects.active.find_by(id: params[:project_id])
  end

  def facility_params
    params.require(:facility).permit(
      :facility_name,
      :address,
      :facility_group_id,
      :point_of_contact,
      :phone_number,
      :email,
      :lat,
      :lng
    )
  end

  def facility_project_params
    params.require(:facility).permit(
      :status_id,
      :due_date
    )
  end
end
