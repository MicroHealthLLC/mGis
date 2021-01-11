class Project < SortableRecord
  default_scope {order(Project.order_humanize)}
  has_many :tasks, through: :facilities
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

  has_many :project_roles, dependent: :destroy
  has_many :roles, through: :project_roles
  has_many :project_users, through: :project_roles
  has_many :users, through: :project_users

  enum status: [:inactive, :active].freeze

  validates_uniqueness_of :name, case_sensitive: false
  validates :name, presence: true

  before_create :set_uuid
  after_save :grant_access_to_super_roles

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

  def reject_comment(comment)
    comment['body'].blank?
  end

  def progress
    self.tasks.map(&:progress).sum / self.tasks.count rescue 0
  end

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

    def grant_access_to_super_roles
      self.roles << Role.unscoped.system.where.not(id: self.roles.ids)
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
