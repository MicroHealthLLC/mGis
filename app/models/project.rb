#NOTE: Project is now program in front end

class Project < SortableRecord
  # default_scope {order(Project.order_humanize)}
  has_many :tasks, through: :facilities
  has_many :project_users, dependent: :destroy
  has_many :users, through: :project_users
  has_many :facility_projects, dependent: :destroy
  has_many :facilities, through: :facility_projects
  has_many :facility_groups, through: :facilities
  has_many :tasks, through: :facility_projects
  has_many :issues, through: :facility_projects
  has_many :risks, through: :facility_projects
  has_many :comments, as: :resource, dependent: :destroy, class_name: 'ActiveAdmin::Comment'
  accepts_nested_attributes_for :comments, reject_if: :reject_comment, allow_destroy: true

  belongs_to :project_type

  has_many :project_statuses, dependent: :destroy
  has_many :statuses, through: :project_statuses
  has_many :project_task_types, dependent: :destroy
  has_many :task_types, through: :project_task_types
  has_many :project_issue_types, dependent: :destroy
  has_many :issue_types, through: :project_issue_types
  has_many :project_issue_severities, dependent: :destroy
  has_many :issue_severities, through: :project_issue_severities
  has_many :project_task_stages, dependent: :destroy
  has_many :task_stages, through: :project_task_stages

  has_many :project_risk_stages, dependent: :destroy
  has_many :risk_stages, through: :project_risk_stages

  has_many :project_issue_stages, dependent: :destroy
  has_many :issue_stages, through: :project_issue_stages

  has_many :favorite_filters, dependent: :destroy
  has_many :query_filters, dependent: :destroy

  has_many :lessons, dependent: :destroy
  has_many :project_lesson_stages, dependent: :destroy
  has_many :lesson_stages, through: :project_lesson_stages

  enum status: [:inactive, :active].freeze

  validates_uniqueness_of :name, case_sensitive: false
  validates :name, presence: true

  before_create :set_uuid
  after_save :grant_access_to_admins
  after_save :add_not_started_status

  def as_json(options=nil)
    json = super(options)
    json.merge(
      project_type: self.project_type.try(:name)
    ).as_json
  end

  def as_complete_json
    json = as_json.merge(
      users: users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email,:status ]),
      facilities: facility_projects.includes(include_fp_hash, :status).active.uniq.as_json,
      facility_groups: facility_groups.includes(include_fg_hash).active.uniq.as_json,
      statuses: statuses.as_json,
      task_types: task_types.as_json,
      issue_types: issue_types.as_json,
      issue_severities: issue_severities.as_json,
      task_stages: task_stages.as_json,
      issue_stages: issue_stages.as_json,
      risk_stages: risk_stages.as_json
    )
    json
  end

  def build_json_response_for_user_profile
    all_facility_projects = FacilityProject.includes(:tasks).where(project_id: self.id)
    all_facility_project_ids = all_facility_projects.map(&:id).compact.uniq
    all_facility_ids = all_facility_projects.map(&:facility_id).compact.uniq

    all_facilities = Facility.where(id: all_facility_ids)
    all_facility_group_ids = all_facilities.map(&:facility_group_id).compact.uniq
    all_facility_groups = FacilityGroup.includes(:facilities, :facility_projects).where(id: all_facility_group_ids)

    facility_projects_hash = []
    facility_projects_hash2 = {}

    project_type_name = self.project_type.try(:name)

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

    hash = self.attributes.merge({project_type: project_type_name})

    hash.merge!({
      facilities: facility_projects_hash,
      facility_groups: facility_groups_hash
    })

    hash
  end

  def build_json_response
    all_facility_projects = FacilityProject.includes(:tasks, :status,:facility).where(project_id: self.id, facility: {status: :active})
    all_facility_project_ids = all_facility_projects.map(&:id).compact.uniq
    all_facility_ids = all_facility_projects.map(&:facility_id).compact.uniq

    all_users = []
    all_user_ids = []

    all_tasks = Task.unscoped.includes([{task_files_attachments: :blob}, :task_type, :task_users, {users: :organization}, :task_stage, {checklists: [:user, {progress_lists: :user} ] }, { notes: :user }, :related_tasks, :related_issues, :related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility} ]).where(facility_project_id: all_facility_project_ids).sort{ |t1,t2| (t1.due_date && t2.due_date) ? (t1.due_date <=> t2.due_date) : ( t1.due_date ? -1 : 1 ) }
    all_task_users = TaskUser.where(task_id: all_tasks.map(&:id) ).group_by(&:task_id)
    all_user_ids += all_task_users.values.flatten.map(&:user_id)

    all_issues = Issue.unscoped.includes([{issue_files_attachments: :blob}, :issue_type, :task_type, :issue_users, {users: :organization}, :issue_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility}, :issue_severity ]).where(facility_project_id: all_facility_project_ids)
    all_issue_users = IssueUser.where(issue_id: all_issues.map(&:id) ).group_by(&:issue_id)
    all_user_ids += all_issue_users.values.flatten.map(&:user_id)

    all_risks = Risk.unscoped.includes([{risk_files_attachments: :blob}, :task_type, :risk_users, {user: :organization},:risk_stage, {checklists: [:user, {progress_lists: :user} ] },  { notes: :user }, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, :sub_risks, {facility_project: :facility} ]).where(facility_project_id: all_facility_project_ids).sort{ |r1,r2| (r1.due_date && r2.due_date) ? (r1.due_date <=> r2.due_date) : ( r1.due_date ? -1 : 1 ) }
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

    project_type_name = self.project_type.try(:name)

    all_facility_projects.each do |fp|

      facility = all_facilities.detect{|f| f.id == fp.facility_id}

      next if !facility

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
        # h2[:project_ids] << fp.project_id
        h2[:project_ids] << fp.facility_id
      end
      h2[:project_ids] = h2[:project_ids].compact.uniq
      facility_groups_hash << h2
    end

    hash = self.attributes.merge({project_type: project_type_name})

    hash.merge!({
      #users: users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email,:status ]),
      users: users.as_json({only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email,:status ], all_organizations: all_organizations}),
      facilities: facility_projects_hash,
      facility_groups: facility_groups_hash,
      statuses: statuses.as_json(except: [:created_at, :updated_at]),
      task_types: task_types.as_json,
      issue_types: issue_types.as_json,
      issue_severities: issue_severities.as_json,
      task_stages: task_stages.as_json,
      issue_stages: issue_stages.as_json,
      risk_stages: risk_stages.as_json,
      lesson_stages: lesson_stages.as_json
    })

    hash
  end

  def add_not_started_status
    if !self.statuses.exists?(id: Status.not_started.id)
      self.statuses << Status.not_started
    end
  end

  def reject_comment(comment)
    comment['body'].blank?
  end
  
  def update_progress
    t = self.tasks
    p = 0
    if t.any?
      p = (t.map(&:progress).sum / t.size).round(0)
    end
    self.update(progress: p)
  end

  # def progress
  #   self.tasks.map(&:progress).sum / self.tasks.count rescue 0
  # end

  def delete_nested_facilities ids
    ids = ids.reject(&:blank?)
    facility_projects.where.not(facility_id: ids).destroy_all
  end

  attr_accessor :user_alt
  attr_accessor :facility_alt
  attr_accessor :status_alt
  attr_accessor :task_type_alt
  attr_accessor :issue_type_alt
  attr_accessor :issue_severity_alt
  attr_accessor :task_stage_alt
  attr_accessor :issue_stage_alt

  private
    def set_uuid
      self.uuid = SecureRandom.uuid
    end

    def grant_access_to_admins
      self.users << User.superadmin.where.not(id: self.users.ids)
    end

    def include_fp_hash
      {
        facility: [:facility_group],
        risks: [{risk_files_attachments: :blob}, :user, :checklists, :related_tasks, :related_issues,:related_risks, :sub_tasks, :sub_issues, {facility_project: :facility} ],
        tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ],
        issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ],
        notes: [{note_files_attachments: :blob}, :user]
      }
    end

    def include_fg_hash
      {
        facility_projects: [:facility, {
          tasks: [{task_files_attachments: :blob}, :task_type, :users, :task_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility} ]
          }, {
          issues: [{issue_files_attachments: :blob}, :issue_type, :users, :issue_stage, :checklists, :notes, :related_tasks, :related_issues, :sub_tasks, :sub_issues, {facility_project: :facility}, :issue_severity ]
          }, {
            notes: [{note_files_attachments: :blob}, :user]
          }
        ]
      }
    end
end
