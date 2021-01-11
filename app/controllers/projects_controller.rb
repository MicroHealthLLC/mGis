class ProjectsController < AuthenticatedController
  before_action :set_project, only: [:show, :destroy, :update, :gantt_chart, :watch_view, :member_list, :facility_manager, :sheets]

  def index
    respond_to do |format|
      format.json {render json: {projects: current_user.projects.includes(:project_type).active.as_json}}
      format.html {}
    end
  end

  def show
    check_permit("map_view")
    unless @project.nil?
      respond_to do |format|
        format.json {render json: {project: @project.as_complete_json}, status: 200}
        format.html {render action: :index}
      end
     else
      respond_to do |format|
       format.json {render json: {}, status: :not_found}
       format.html {render 'layouts/_not_found', locals: {message: "Project with id #{params[:id]} doesn't exists"}}
      end
    end
  end

  def gantt_chart
    check_permit("gantt_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def watch_view
    check_permit("watch_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def member_list
    check_permit("members")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def facility_manager
    check_permit("facility_manager_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def sheets
    check_permit("sheets_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def kanban
    check_permit("kanban_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  private
  def set_project
      fg_hash = {
        facility_projects: [:facility, {
          tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ]
          }, {
          issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ]
          }, {
            notes: [{note_files_attachments: :blob}, :user]
          }
        ]
      }
      fp_hash = {
        facility: [:facility_group],
        tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ],
        issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ],
        notes: [{note_files_attachments: :blob}, :user]
      }
      projects_include_hash = {
        users: [],
        facility_projects: fp_hash,
        facility_groups: fg_hash,
        statuses: [],
        task_types: [],
        issue_types: [],
        issue_severities: []
      }
    @project = current_user.projects.includes(projects_include_hash).active.find_by(id: params[:id])
    current_user.current_project = @project
  end

  def check_permit(view)
    return unless current_user.allowed?(view)
  end
end
