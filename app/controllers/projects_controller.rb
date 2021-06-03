class ProjectsController < AuthenticatedController
  before_action :set_project, only: [:destroy, :update, :gantt_chart, :watch_view, :member_list, :facility_manager, :sheet, :calendar]

  def vue_js_route
    view = "map_view"
    if params[:tab] == "map"
      view = "map_view"
    elsif params[:tab] == "sheet"
      view = "sheets_view"
    elsif params[:tab] == "calendar"
      view = "calendar_view"
    elsif params[:tab] == "kanban"
      view = "kanban_view"
    elsif ["gantt_chart", "gantt"].include?(params[:tab])
      view = "gantt_view"
    elsif params[:tab] == "member_list"
      view = "members"
    elsif params[:tab] == "lessons" || params[:lesson_id]
      view = "lessons"
  ##  elsif params[:tab] == "watch_view"
  ##    view = "watch_view"
  ##  elsif params[:tab] == "facility_manager"
  ##    view = "facility_manager_view" 
    else
      raise CanCan::AccessDenied
    end

    if !current_user.allowed?(view)
      raise CanCan::AccessDenied
    end
    
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def index
    respond_to do |format|
      format.json {render json: {projects: current_user.projects.includes(:project_type).active.as_json}}
      format.html {}
    end
  end

  def show
    @project = current_user.projects.active.find_by(id: params[:id])
    check_permit("map_view")
    unless @project.nil?
      respond_to do |format|
        
        format.json {render json: {project: @project.build_json_response}, status: 200}
        # format.json {render json: {project: @project.as_complete_json}, status: 200}
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

  def sheet
    check_permit("sheets_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def calendar
    check_permit("calendar_view")
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

  def map
    check_permit("map_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  def gantt
    check_permit("gantt_view")
    respond_to do |format|
      format.json {}
      format.html {render action: :index}
    end
  end

  private
  def set_project
      fg_hash = {
        facility_projects: [:facility, {
          tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, {checklists: :progress_lists}, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ]
          }, {
          issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, {checklists: :progress_lists}, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ]
          }, {
            notes: [{note_files_attachments: :blob}, :user]
          }
        ]
      }
      fp_hash = {
        facility: [:facility_group],
        tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, {checklists: :progress_lists}, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ],
        issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, {checklists: :progress_lists}, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ],
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
  end

  def check_permit(view)
    return unless current_user.allowed?(view)
  end
end
