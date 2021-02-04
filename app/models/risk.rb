class Risk < ApplicationRecord
  include Normalizer
  include Tasker

  belongs_to :user
  has_many :risk_users, dependent: :destroy
  belongs_to :risk_stage, optional: true
  has_many :users, through: :risk_users
  belongs_to :task_type, optional: true
  has_many_attached :risk_files, dependent: :destroy
  has_many :notes, as: :noteable, dependent: :destroy

  enum risk_approach: [:avoid, :mitigate, :transfer, :accept]
  accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true

  # validates_inclusion_of :probability, in: 1..5
  # validates_inclusion_of :impact_level, in: 1..5
  validates_presence_of :risk_description, :start_date, :due_date

  before_validation :cast_constants_to_i
  before_destroy :nuke_it!
  before_update :update_progress_on_stage_change, if: :risk_stage_id_changed?
  before_save :init_kanban_order, if: Proc.new {|risk| risk.risk_stage_id_was.nil?}

  def files_as_json
    risk_files.map do |file|
      {
        id: file.id,
        name: file.blob.filename,
        uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)
      }
    end.as_json
  end

  def priority_level_name
    n = 'Very Low'
    n = 'Very Low' if [1].include?(priority_level)
    n = "Low" if [2,3].include?(priority_level)
    n = "Moderate" if [4,5,6].include?(priority_level)
    n = "High" if [8,9,10,12].include?(priority_level)
    n = "Extreme" if [15,16,20,25].include?(priority_level)
    n
  end

  def impact_level_name_hash
    {
      1 => "1 - Negligible",
      2 => "2 - Minor",
      3 => "3 - Moderate",
      4 => "4 - Major",
      5 => "5 - Catastrophic"
    }
  end

  def impact_level_name
    impact_level_name_hash[impact_level] || impact_level_name_hash[1]
  end

  def probability_name_hash
    {
      1 => "1 - Rare",
      2 => "2 - Unlikely",
      3 => "3 - Possible",
      4 => "4 - Likely",
      5 => "5 - Almost Certain"
    }
  end
  
  def probability_name
    probability_name_hash[probability] || probability_name_hash[1]
  end

  def to_json
    attach_files = []
    rf = self.risk_files
    if rf.attached?
      attach_files = rf.map do |file|
        {
          id: file.id,
          name: file.blob.filename,
          uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)
        }
      end
    end
    fp = self.facility_project
    users = self.users.active

    resource_users = self.risk_users.where(user_id: users.map(&:id) )
    accountable_user_ids = resource_users.map{|ru| ru.user_id if ru.accountable? }.compact
    responsible_user_ids = resource_users.map{|ru| ru.user_id if ru.responsible? }.compact
    counsulted_user_ids = resource_users.map{|ru| ru.user_id if ru.counsulted? }.compact
    informed_user_ids = resource_users.map{|ru| ru.user_id if ru.informed? }.compact

    sub_tasks = self.sub_tasks
    sub_issues = self.sub_issues
    sub_risks = self.sub_risks
    progress_status = "active"
    if(progress >= 100)
      progress_status = "completed"
    end
    self.as_json.merge(
      priority_level_name: priority_level_name,
      probability_name: probability_name,
      impact_level_name: impact_level_name,
      task_type: task_type.as_json, 
      risk_stage: risk_stage.try(:name),
      class_name: self.class.name,
      attach_files: attach_files,
      is_overdue: progress < 100 && (due_date < Date.today),
      progress_status: progress_status,
      checklists: checklists.as_json,
      facility_id: fp.try(:facility_id),
      facility_name: fp.try(:facility)&.facility_name,
      # Remove this
      user_ids: users.map(&:id).compact.uniq,
      risk_owners: users.map(&:full_name).compact.join(", "),
      users: users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email]),
      user_names: users.map(&:full_name).compact.join(", "),

      # Add accountable users
      accountable_user_ids: accountable_user_ids,
      responsible_user_ids: responsible_user_ids,
      counsulted_user_ids: counsulted_user_ids,
      informed_user_ids: informed_user_ids,

      notes: notes.as_json,
      project_id: fp.try(:project_id),
      sub_tasks: sub_tasks.as_json(only: [:text, :id]),
      sub_issues: sub_issues.as_json(only: [:title, :id]),
      sub_risks: sub_risks.as_json(only: [:risk_description, :id]),
      sub_task_ids: sub_tasks.map(&:id),
      sub_issue_ids: sub_issues.map(&:id),
      sub_risk_ids: sub_risks.map(&:id)
    ).as_json
  end

  def manipulate_files(params)
    return unless params[:risk][:risk_files].present?
    file_blobs = JSON.parse(params[:risk][:risk_files])
    file_blobs.each do |file|
      if file['_destroy']
        risk_files.find_by_id(file['id'])&.purge
      elsif file['_new']
        risk_files.new(blob_id: file['id'])
      end
    end
  end

  def nuke_it!
    RelatedRisk.where(risk_id: self.id).or(RelatedRisk.where(relatable: self)).destroy_all
  end

  def init_kanban_order
    self.kanban_order = facility_project.risks.where(risk_stage_id: risk_stage_id).maximum(:kanban_order) + 1 rescue 0 if self.risk_stage_id.present?
  end

  def update_progress_on_stage_change
    if risk_stage.present?
      self.progress = risk_stage.percentage
      self.auto_calculate = false
    end
  end

  private
  def cast_constants_to_i
    self.probability = self.probability.to_i
    self.impact_level = self.impact_level.to_i
    self.priority_level = self.probability * self.impact_level
  end
end
