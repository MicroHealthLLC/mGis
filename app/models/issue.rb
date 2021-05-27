class Issue < ApplicationRecord
  include Normalizer
  include Tasker

  belongs_to :issue_type
  belongs_to :issue_stage, optional: true
  belongs_to :task_type, optional: true
  belongs_to :issue_severity
  has_many :issue_users, dependent: :destroy
  has_many :users, through: :issue_users
  has_many_attached :issue_files, dependent: :destroy
  has_many :notes, as: :noteable, dependent: :destroy

  validates :title, :start_date, :due_date, presence: true
  accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true

  before_update :update_progress_on_stage_change, if: :issue_stage_id_changed?
  before_save :init_kanban_order, if: Proc.new {|issue| issue.issue_stage_id_was.nil?}


  amoeba do
    include_association :issue_type
    include_association :issue_stage
    include_association :issue_severity

    include_association :task_type
    include_association :issue_users
    include_association :users

    include_association :facility_project
    include_association :checklists
    include_association :related_tasks
    include_association :related_issues
    include_association :related_risks
    include_association :sub_tasks
    include_association :sub_issues
    include_association :sub_risks

    append :title => " - Copy"
  end
  
  def self.params_to_permit
    [
      :title,
      :description,
      :issue_type_id,
      :issue_stage_id,
      :issue_severity_id,
      :facility_project_id,
      :task_type_id,
      :progress,
      :start_date,
      :due_date,
      :auto_calculate,
      :watched,
      :kanban_order,
      :important,
      issue_files: [],
      user_ids: [],
      sub_task_ids: [],
      sub_issue_ids: [],
      sub_risk_ids:[],
      checklists_attributes: [
        :id,
        :_destroy,
        :text,
        :user_id,
        :checked,
        :due_date,
        :position,
        progress_lists_attributes: [
          :id,
          :_destroy,
          :body,
          :checklist_id
        ]
      ],
      notes_attributes: [
        :id,
        :_destroy,
        :user_id,
        :body
       ]
    ]
  end

  def to_json(options = {})
    attach_files = []
    i_files = self.issue_files

    if i_files.attached?
      attach_files = i_files.map do |file|
        next if !file.blob.filename.instance_variable_get("@filename").present?
        begin
          if file.blob.content_type == "text/plain" && valid_url?(file.blob.filename.instance_variable_get("@filename"))
            {
              id: file.id,
              name: file.blob.filename.instance_variable_get("@filename"),
              uri: file.blob.filename.instance_variable_get("@filename"),
              link: true
            }
          else
            {
              id: file.id,
              name: file.blob.filename,
              uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true),
              link: false
            }
          end
        rescue Exception => e
          puts "There is an exception"
        end
      end.compact.uniq
    end

    fp = self.facility_project
    
    t_users = options[:all_issue_users] || []
    all_users = options[:all_users] || []
    if options[:for].present? && [:project_build_response, :issue_index].include?(options[:for])
      resource_users = t_users
    else
      resource_users = self.issue_users #.where(user_id: self.users.active.uniq.map(&:id) )
    end

    resource_user_ids = resource_users.map(&:user_id).compact.uniq

    accountable_user_ids = resource_users.map{|ru| ru.user_id if ru.accountable? }.compact.uniq
    responsible_user_ids = resource_users.map{|ru| ru.user_id if ru.responsible? }.compact.uniq
    consulted_user_ids = resource_users.map{|ru| ru.user_id if ru.consulted? }.compact.uniq
    informed_user_ids = resource_users.map{|ru| ru.user_id if ru.informed? }.compact.uniq

    p_users = [] 
    if all_users.any?
      p_users = all_users.select{|u| resource_user_ids.include?(u.id) }
    else
      p_users = users.select(&:active?) #User.where(id: resource_user_ids).active
    end

    users_hash = {} 
    p_users.map{|u| users_hash[u.id] = {id: u.id, name: u.full_name} }

    # Last name values added for improved sorting in datatables
    users_last_name_hash = {} 
    p_users.map{|u| users_last_name_hash[u.id] = u.last_name }

    # First name values added for improved sorting in datatables
    users_first_name_hash = {} 
    p_users.map{|u| users_first_name_hash[u.id] = u.first_name }


    sub_tasks = self.sub_tasks
    sub_issues = self.sub_issues
    progress_status = "active"
    if(progress >= 100)
      progress_status = "completed"
    end
    task_type_name = self.task_type&.name
    self.as_json.merge(
      class_name: self.class.name,
      progress_status: progress_status,
      attach_files: attach_files,
      is_overdue: progress < 100 && (due_date < Date.today),
      issue_type: issue_type.try(:name),
      issue_stage: issue_stage.try(:name),
      issue_severity: issue_severity.try(:name),
      task_type_name: task_type_name,
      due_date_duplicate: due_date.as_json,
      responsible_user_names: p_users.map(&:full_name).compact.join(", "),
      user_names: p_users.map(&:full_name).compact.join(", "),
      user_ids: p_users.map(&:id).compact.uniq,
      users: p_users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email]),
      

      # Add RACI user name
      # Last name values added for improved sorting in datatables
      responsible_users: responsible_user_ids.map{|id| users_hash[id] }.compact,
      responsible_users_last_name: responsible_user_ids.map{|id| users_last_name_hash[id] }.compact,
      responsible_users_first_name: responsible_user_ids.map{|id| users_first_name_hash[id] }.compact,
      accountable_users: accountable_user_ids.map{|id| users_hash[id] }.compact,
      accountable_users_last_name: accountable_user_ids.map{|id| users_last_name_hash[id] }.compact,
      accountable_users_first_name: accountable_user_ids.map{|id| users_first_name_hash[id] }.compact,
      consulted_users: consulted_user_ids.map{|id| users_hash[id] }.compact, 
      informed_users: informed_user_ids.map{|id| users_hash[id] }.compact, 


     # Add RACI user ids
      responsible_user_ids: responsible_user_ids,
      accountable_user_ids: accountable_user_ids,  
      consulted_user_ids: consulted_user_ids,
      informed_user_ids: informed_user_ids,

      checklists: checklists.as_json,
      notes: notes.as_json,
      notes_updated_at: notes.map(&:updated_at).compact.uniq,
      facility_id: fp.try(:facility_id),
      facility_name: fp.try(:facility).facility_name,
      project_id: fp.try(:project_id),
      sub_tasks: sub_tasks.as_json(only: [:text, :id]),
      sub_issues: sub_issues.as_json(only: [:title, :id]),
      sub_task_ids: sub_tasks.map(&:id),
      sub_issue_ids: sub_issues.map(&:id),
      sub_risk_ids: sub_risks.map(&:id)
    ).as_json
  end

  def files_as_json
    issue_files.map do |file|
      if file.blob.content_type == "text/plain"
        {
          id: file.id,
          name: file.blob.filename.instance_variable_get("@filename"),
          uri: file.blob.filename.instance_variable_get("@filename"),
          link: true
        }
      else
        {
          id: file.id,
          name: file.blob.filename,
          uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true),
          link: false
        }
      end
    end.as_json
  end

  # This method is currently just creating Issue and not updating it
  # In future we will use this method in background process
  def create_or_update_issue(params, user)

    issue_params = params.require(:issue).permit(Issue.params_to_permit)


    issue = self
    i_params = issue_params.dup
    user_ids = i_params.delete(:user_ids)
    sub_task_ids = i_params.delete(:sub_task_ids)
    sub_issue_ids = i_params.delete(:sub_issue_ids)
    checklists_attributes = i_params.delete(:checklists_attributes)
    notes_attributes = i_params.delete(:notes_attributes)

    issue.attributes = i_params
    if !issue.facility_project_id.present?
      project = user.projects.active.find_by(id: params[:project_id])
      facility_project = project.facility_projects.find_by(facility_id: params[:facility_id])

      issue.facility_project_id = facility_project.id
    end


    issue.transaction do

      issue.save

      issue.add_link_attachment(params)

      if user_ids && user_ids.present?
        issue_users_obj = []
        user_ids.each do |uid|
          next if !uid.present?
          issue_users_obj << IssueUser.new(issue_id: issue.id, user_id: uid)
        end
        IssueUser.import(issue_users_obj) if issue_users_obj.any?
      end

      if sub_task_ids && sub_task_ids.any?
        related_task_objs = []
        related_task_objs2 = []
        sub_task_ids.each do |sid|
          related_task_objs << RelatedTask.new(relatable_id: issue.id, relatable_type: issue.class.name, task_id: sid)
          related_task_objs2 << RelatedIssue.new(relatable_id: sid, relatable_type: "Task", issue_id: issue.id)
        end
        RelatedTask.import(related_task_objs) if related_task_objs.any?
        RelatedIssue.import(related_task_objs2) if related_task_objs2.any?
      end

      if sub_issue_ids && sub_issue_ids.any?
        related_issue_objs = []
        related_issue_objs2 = []
        sub_issue_ids.each do |sid|
          related_issue_objs << RelatedIssue.new(relatable_id: issue.id, relatable_type: issue.class.name, issue_id: sid)
          related_issue_objs2 << RelatedIssue.new(relatable_id: sid, relatable_type: "Issue", issue_id: issue.id)
        end
        RelatedIssue.import(related_issue_objs) if related_issue_objs.any?
        RelatedIssue.import(related_issue_objs2) if related_issue_objs2.any?
      end

      if checklists_attributes.present?
        checklist_objs = []
        checklists_attributes.each do |key, value|
          value.delete("_destroy")
          # checklist_objs << Checklist.new(value.merge({listable_id: issue.id, listable_type: issue.class.name}) )
          c = Checklist.new(value.merge({listable_id: issue.id, listable_type: "Issue"}) )
          c.progress_lists.each do |p|
            p.user_id = user.id
          end
          c.save       
        end
        Checklist.import(checklist_objs) if checklist_objs.any?
      end

      if notes_attributes.present?
        notes_objs = []
        notes_attributes.each do |key, value|
          value.delete("_destroy")
          notes_objs << Note.new(value.merge({noteable_id: issue.id, noteable_type: issue.class.name}) )
        end
        Note.import(notes_objs) if notes_objs.any?
      end

      issue.assign_users(params)

    end

    issue
  end

  def add_link_attachment(params = {})
    link_files = params[:file_links]
    if link_files && link_files.any?
      link_files.each do |f|
        next if !f.present? || f.nil? || !valid_url?(f)
        self.issue_files.attach(io: StringIO.new(f), filename: f, content_type: "text/plain")
      end
    end
  end

  def assign_users(params)
    accountable_resource_users = []
    responsible_resource_users = []
    consulted_resource_users = []
    informed_resource_users = []

    resource = self
    resource_users = resource.issue_users
    accountable_user_ids = resource_users.map{|ru| ru.user_id if ru.accountable? }.compact
    responsible_user_ids = resource_users.map{|ru| ru.user_id if ru.responsible? }.compact
    consulted_user_ids = resource_users.map{|ru| ru.user_id if ru.consulted? }.compact
    informed_user_ids = resource_users.map{|ru| ru.user_id if ru.informed? }.compact

    users_to_delete = []

    if params[:accountable_user_ids].present?
      params[:accountable_user_ids].each do |uid|
        next if uid == "undefined"
        if !accountable_user_ids.include?(uid.to_i)
          accountable_resource_users << IssueUser.new(user_id: uid, issue_id: resource.id, user_type: 'accountable')
        end
      end
      users_to_delete += accountable_user_ids - params[:accountable_user_ids].map(&:to_i)
    end

    if params[:responsible_user_ids].present?
      params[:responsible_user_ids].each do |uid|
        next if uid == "undefined"
        if !responsible_user_ids.include?(uid.to_i)
          responsible_resource_users << IssueUser.new(user_id: uid, issue_id: resource.id, user_type: 'responsible')
        end
      end
      users_to_delete += responsible_user_ids - params[:responsible_user_ids].map(&:to_i)
    end

    if params[:consulted_user_ids].present?
      params[:consulted_user_ids].each do |uid|
        next if uid == "undefined"
        if !consulted_user_ids.include?(uid.to_i)
          consulted_resource_users << IssueUser.new(user_id: uid, issue_id: resource.id, user_type: 'consulted')
        end
      end
      users_to_delete += consulted_user_ids - params[:consulted_user_ids].map(&:to_i)
    end

    if params[:informed_user_ids].present?
      params[:informed_user_ids].each do |uid|
        next if uid == "undefined"
        if !informed_user_ids.include?(uid.to_i)
          informed_resource_users << IssueUser.new(user_id: uid, issue_id: resource.id, user_type: 'informed')
        end
      end
      users_to_delete += informed_user_ids - params[:informed_user_ids].map(&:to_i)
    end
    
    records_to_import = accountable_resource_users + responsible_resource_users + consulted_resource_users + informed_resource_users
    
    if users_to_delete.any?
      resource_users.where(user_id: users_to_delete).destroy_all
    end

    if records_to_import.any?
      IssueUser.import(records_to_import)
    end
  end

  def manipulate_files(params)
    return unless params[:issue][:issue_files].present?
    file_blobs = JSON.parse(params[:issue][:issue_files])
    file_blobs.each do |file|
      if file['_destroy']
        issue_files.find_by_id(file['id'])&.purge
      elsif file['_new']
        issue_files.new(blob_id: file['id'])
      end
    end
  end

  def nuke_it!
    RelatedIssue.where(issue_id: self.id).or(RelatedIssue.where(relatable: self)).destroy_all
  end

  def destroy
    nuke_it!
    super
  end

  def update_progress_on_stage_change
    if issue_stage.present?
      self.progress = issue_stage.percentage
      self.auto_calculate = false
    end
  end

  def init_kanban_order
    self.kanban_order = facility_project.issues.where(issue_stage_id: issue_stage_id).maximum(:kanban_order) + 1 rescue 0 if self.issue_stage_id.present?
  end
end
