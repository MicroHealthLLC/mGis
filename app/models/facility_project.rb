class FacilityProject < ApplicationRecord
  belongs_to :facility
  belongs_to :project
  belongs_to :status, optional: true
  has_many :tasks, dependent: :destroy
  has_many :task_types, through: :tasks
  has_many :issues, dependent: :destroy
  has_many :risks, dependent: :destroy
  has_many :notes, as: :noteable, dependent: :destroy

  scope :active, -> {joins(:facility).where("facilities.status = ?", 1).distinct}

  validates :facility, uniqueness: {scope: :project}

  before_save :assign_default_status

  def as_json(options=nil)
    json = super(options)
    fac = self.facility
    return json.merge(
      facility_project_id: self.id,
      facility_name: fac.facility_name,
      facility: fac.as_json,
      tasks: tasks.map(&:to_json),
      issues: issues.map(&:to_json),
      risks: risks.map(&:to_json),
      notes: notes.map(&:to_json),
      project_status: status_name,
      color: color,
      progress: progress
    ).as_json if options.nil?
    json
  end

  def build_json_response
    all_facility_projects = [self]
    all_facility_project_ids = all_facility_projects.map(&:id).compact.uniq
    all_facility_ids = all_facility_projects.map(&:facility_id).compact.uniq

    all_users = []
    all_user_ids = []

    all_tasks = Task.unscoped.includes([{task_files_attachments: :blob}, :task_type, :task_users, {users: :organization}, :task_stage, {checklists: [:user, {progress_lists: :user} ] }, { notes: :user }, :related_tasks, :related_issues, :related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility} ]).where(facility_project_id: all_facility_project_ids)
    all_task_users = TaskUser.where(task_id: all_tasks.map(&:id) ).group_by(&:task_id)
    all_user_ids += all_task_users.values.flatten.map(&:user_id)

    all_issues = Issue.unscoped.includes([{issue_files_attachments: :blob}, :issue_type, :task_type, :issue_users, {users: :organization}, :issue_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility}, :issue_severity ]).where(facility_project_id: all_facility_project_ids)
    all_issue_users = IssueUser.where(issue_id: all_issues.map(&:id) ).group_by(&:issue_id)
    all_user_ids += all_issue_users.values.flatten.map(&:user_id)

    all_risks = Risk.unscoped.includes([{risk_files_attachments: :blob}, :task_type, :risk_users, {user: :organization},:risk_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility} ]).where(facility_project_id: all_facility_project_ids)
    all_risk_users = RiskUser.where(risk_id: all_risks.map(&:id) ).group_by(&:risk_id)
    all_user_ids += all_risk_users.values.flatten.map(&:user_id)

    all_user_ids = all_user_ids.compact.uniq

    all_users = User.includes(:organization).where(id: all_user_ids ).active
    all_organizations = Organization.where(id: all_users.map(&:organization_id).compact.uniq )

    all_notes = Note.unscoped.where(noteable_id: all_facility_project_ids, noteable_type: "FacilityProject")
    all_facilities = Facility.where(id: all_facility_ids)
    all_facility_group_ids = all_facilities.map(&:facility_group_id).compact.uniq
    all_facility_groups = FacilityGroup.includes(:facilities, :facility_projects).where(id: all_facility_group_ids)

    facility_projects_hash = []
    facility_projects_hash2 = {}

    # project_type_name = self.project_type.try(:name)

    all_facility_projects.each do |fp|

      facility = all_facilities.detect{|f| f.id == fp.facility_id}

      h = fp.attributes.merge({
        class: fp.class.name,
        project_status: fp.status_name,
        color: fp.color,
        progress: fp.progress,
        facility_project_id: fp.id,
        facility_name: facility.facility_name
      })

      g = all_facility_groups.detect{|gg| gg.id == facility.facility_group_id}

      h[:facility] = facility.attributes.merge({
        facility_group_name: g&.name,
        facility_group_status: g&.status,
      })

      # Building Tasks
      # tasks = all_tasks.select{|t| t.facility_project_id == fp.id }.compact.uniq
      # h[:tasks] = tasks.map(&:to_json)
      tasks = all_tasks.select{|t| t.facility_project_id == fp.id }.compact.uniq
      tids = tasks.map(&:id)

      h[:tasks] = []
      tasks.each do |t| 
        h[:tasks] << t.to_json({orgaizations: all_organizations, all_task_users: all_task_users[t.id], all_users: all_users, for: :project_build_response} )
      end

      # Building Issues
      # issues = all_issues.select{|i| i.facility_project_id == fp.id}
      # h[:issues] = issues.map(&:to_json)
      issues = all_issues.select{|t| t.facility_project_id == fp.id }.compact.uniq
      iids = issues.map(&:id)

      h[:issues] = []
      issues.each do |i| 
        h[:issues] << i.to_json( {orgaizations: all_organizations, all_issue_users: all_issue_users[i.id], all_users: all_users,for: :project_build_response} )
      end

      # Building Risks
      # risks = all_risks.select{|r| r.facility_project_id == fp.id}
      # h[:risks] = risks.map(&:to_json)
      risks = all_risks.select{|t| t.facility_project_id == fp.id }.compact.uniq
      rids = risks.map(&:id)

      h[:risks] = []
      risks.each do |r| 
        h[:risks] << r.to_json( {orgaizations: all_organizations, all_risk_users: all_risk_users[r.id], all_users: all_users, for: :project_build_response} )
      end

      # Building Notes
      notes = all_notes.select{|r| r.noteable_id == fp.id}
      h[:notes] = notes.map(&:to_json)

      facility_projects_hash2[fp.id] = h
      facility_projects_hash << h
    end

    facility_groups_hash = []
    all_facility_groups.each do |fg|
      h2 = fg.attributes
      h2[:facilities] = []
      h2[:project_ids] = []
      fg.facility_projects.each do |fp|
        h2[:facilities] << facility_projects_hash2[fp.id] if facility_projects_hash2[fp.id]
        h2[:project_ids] << fp.project_id
      end
      h2[:project_ids] = h2[:project_ids].compact.uniq
      facility_groups_hash << h2
    end

    hash = self.attributes #.merge({project_type: project_type_name})

    hash.merge!({
      #users: users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email,:status ]),
      users: [], #users.as_json({only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email,:status ], all_organizations: all_organizations}),
      facilities: facility_projects_hash,
      facility_groups: facility_groups_hash,
      # statuses: statuses.as_json,
      task_types: task_types.as_json,
      # issue_types: issue_types.as_json,
      # issue_severities: issue_severities.as_json,
      # task_stages: task_stages.as_json,
      # issue_stages: issue_stages.as_json,
      # risk_stages: risk_stages.as_json
    })

    hash
  end

  def build_overview_response
    {
      
    }
  end

  def status_name
    status.try(:name)
  end

  def assign_default_status
    if !status_id.present?
      self.status_id = Status.not_started.id
      self.save
    end
  end

  # def color
  #   status.try(:color) || '#ff0000'
  # end

  def update_progress
    t = tasks
    p = 0
    if t.any?
      p = (t.map(&:progress).sum / t.size).round(0)
    end
    self.update(progress: p)
  end

  def update_color
    c = status.try(:color) || '#ff0000'
    self.update(color: c)
  end

  # def progress
  #   t = tasks
  #   (t.map(&:progress).sum / t.size).round(0) rescue 0
  # end
end
