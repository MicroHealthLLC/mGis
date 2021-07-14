class Api::V1::PortfolioController < AuthenticatedController 

  def lessons
    if params[:pagination] && params[:pagination] == "true"
      all_resources = Lesson.unscoped.joins(:facility_project).includes(Lesson.lesson_preload_array).where("facility_projects.project_id" => current_user.project_ids).paginate(per_page: 15, page: params[:page])
      json_response = []
      all_resources.each do |resource|
        json_response << resource.porfolio_json
      end
      render json: json_response
    else
      all_resources = Lesson.unscoped.joins(:facility_project).includes(Lesson.lesson_preload_array).where("facility_projects.project_id" => current_user.project_ids)
      json_response = []
      all_resources.in_batches(of: 1000) do |resources|
        resources.find_each do |resource|
          json_response << resource.porfolio_json  
        end        
      end
      render json: json_response
    end

  end

  def programs

    if params[:pagination] && params[:pagination] == "true"
      all_resources = current_user.projects.active.paginate(per_page: 15, page: params[:page])
      json_response = []
      all_resources.each do |resources|
        json_response << resource.porfolio_json
      end
      render json: json_response
    else
      all_resources = current_user.projects.active
      json_response = []
      all_resources.in_batches(of: 1000) do |resources|
        resources.find_each do |resource|
          json_response << resource.porfolio_json  
        end
      end
      render json: json_response
    end

  end

  def tasks

    if params[:pagination] && params[:pagination] == "true"
      all_resources = Task.unscoped.joins(:facility_project).includes([{task_files_attachments: :blob}, :task_type, :task_users, {users: :organization}, :task_stage, {checklists: [:user, {progress_lists: :user} ] }, { notes: :user }, :related_tasks, :related_issues, :related_risks, :sub_tasks, :sub_issues, :sub_risks, :project, :facility, {facility_project: :facility} ]).where("facility_projects.project_id" => current_user.project_ids).paginate(per_page: 15, page: params[:page])
      json_response = []
      all_resources.each do |resource|
        json_response << resource.porfolio_json  
      end
      render json: json_response

    else
      all_resources = Task.unscoped.joins(:facility_project).includes([{task_files_attachments: :blob}, :task_type, :task_users, {users: :organization}, :task_stage, {checklists: [:user, {progress_lists: :user} ] }, { notes: :user }, :related_tasks, :related_issues, :related_risks, :sub_tasks, :sub_issues, :sub_risks, :project, :facility, {facility_project: :facility} ]).where("facility_projects.project_id" => current_user.project_ids)
      json_response = []
      all_resources.in_batches(of: 1000) do |resources|
        resources.find_each do |resource|
          json_response << resource.porfolio_json  
        end
      end
      render json: json_response
    end

  end

  def issues

    if params[:pagination] && params[:pagination] == "true"

      all_resources = Issue.unscoped.joins(:facility_project).includes([{issue_files_attachments: :blob}, :issue_type, :task_type, :issue_users, {users: :organization}, :issue_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, :project, :facility, {facility_project: :facility}, :issue_severity ]).where("facility_projects.project_id" => current_user.project_ids).paginate(per_page: 15, page: params[:page])
      json_response = []
      all_resources.each do |resource|
        json_response << resource.porfolio_json  
      end
      render json: json_response

    else
      all_resources = Issue.unscoped.joins(:facility_project).includes([{issue_files_attachments: :blob}, :issue_type, :task_type, :issue_users, {users: :organization}, :issue_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, :project, :facility, {facility_project: :facility}, :issue_severity ]).where("facility_projects.project_id" => current_user.project_ids)
      json_response = []
      all_resources.in_batches(of: 1000) do |resources|
        resources.find_each do |resource|
          json_response << resource.porfolio_json  
        end
      end
      render json: json_response
    end

  end

  def risks
    
    if params[:pagination] && params[:pagination] == "true"
      all_resources = Risk.unscoped.joins(:facility_project).includes([{risk_files_attachments: :blob}, :task_type, :risk_users, {users: :organization},:risk_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, :project, :facility, {facility_project: :facility} ]).where("facility_projects.project_id" => current_user.project_ids).paginate(per_page: 15, page: params[:page])
      json_response = []
      all_resources.each do |resource|
        json_response << resource.porfolio_json  
      end
      render json: json_response
    else
      all_resources = Risk.unscoped.joins(:facility_project).includes([{risk_files_attachments: :blob}, :task_type, :risk_users, {users: :organization},:risk_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, :project, :facility, {facility_project: :facility} ]).where("facility_projects.project_id" => current_user.project_ids)
      json_response = []
      all_resources.in_batches(of: 1000) do |resources|
        resources.find_each do |resource|
          json_response << resource.porfolio_json  
        end
      end
      render json: json_response
    end

  end

end
