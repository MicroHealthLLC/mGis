class Task < ApplicationRecord
  include Normalizer
  include Tasker

  belongs_to :task_type
  belongs_to :task_stage, optional: true
  has_many :task_users, dependent: :destroy
  has_many :users, through: :task_users
  has_many_attached :task_files, dependent: :destroy
  has_many :notes, as: :noteable, dependent: :destroy

  validates :text, :start_date, :due_date, presence: true
  accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true

  before_update :update_progress_on_stage_change, if: :task_stage_id_changed?
  before_save :init_kanban_order, if: Proc.new {|task| task.task_stage_id_was.nil?}

  def to_json
    attach_files = []
    tf = self.task_files
    if tf.attached?
      attach_files = tf.map do |file|
        {
          id: file.id,
          name: file.blob.filename,
          uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)
        }
      end
    end
    fp = self.facility_project
    users = self.users.active
    sub_tasks = self.sub_tasks
    sub_issues = self.sub_issues
    progress_status = "active"
    if(progress >= 100)
      progress_status = "completed"
    end
    self.as_json.merge(
      class_name: self.class.name,
      attach_files: attach_files,
      is_overdue: progress < 100 && (due_date < Date.today),
      progress_status: progress_status,
      task_type: task_type.try(:name),
      task_stage: task_stage.try(:name),
      user_ids: users.map(&:id).compact.uniq,
      user_names: users.map(&:full_name).compact.join(", "),
      users: users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email]),
      checklists: checklists.as_json,
      notes: notes.as_json,
      facility_id: fp.try(:facility_id),
      facility_name: fp.try(:facility).facility_name,
      project_id: fp.try(:project_id),
      sub_tasks: sub_tasks.as_json(only: [:text, :id]),
      sub_issues: sub_issues.as_json(only: [:title, :id]),
      sub_task_ids: sub_tasks.map(&:id),
      sub_issue_ids: sub_issues.map(&:id)
    ).as_json
  end

  # This method is currently just creating Task and not updating it
  # In future we will use this method in background process
  def create_or_update_task(params, user)

    task_params = params.require(:task).permit(
      :text,
      :task_type_id,
      :task_stage_id,
      :due_date,
      :start_date,
      :description,
      :progress,
      :auto_calculate,
      :watched,
      :kanban_order,
      task_files: [],
      user_ids: [],
      sub_task_ids: [],
      sub_issue_ids: [],
      checklists_attributes: [
        :id,
        :_destroy,
        :text,
        :user_id,
        :checked,
        :due_date,
        :listable_type,
        :listable_id,
        :position
      ],
      notes_attributes: [
        :id,
        :_destroy,
        :user_id,
        :body
      ]
    )

    project = user.projects.active.find_by(id: params[:project_id])
    facility_project = project.facility_projects.find_by(facility_id: params[:facility_id])

    task = self
    t_params = task_params.dup
    user_ids = t_params.delete(:user_ids)
    sub_task_ids = t_params.delete(:sub_task_ids)
    sub_issue_ids = t_params.delete(:sub_issue_ids)
    checklists_attributes = t_params.delete(:checklists_attributes)
    notes_attributes = t_params.delete(:notes_attributes)

    task.attributes = t_params
    task.facility_project_id = facility_project.id

    all_checklists = task.checklists

    task.transaction do
      task.save
      if user_ids && user_ids.present?
        task_users_obj = []
        user_ids.each do |uid|
          next if !uid.present?
          task_users_obj << TaskUser.new(task_id: task.id, user_id: uid)
        end
        TaskUser.import(task_users_obj) if task_users_obj.any?
      end

      if sub_task_ids && sub_task_ids.any?
        related_task_objs = []
        sub_task_ids.each do |sid|
          related_task_objs << RelatedTask.new(relatable_id: task.id, relatable_type: "Task", task_id: sid)
        end
        RelatedTask.import(related_task_objs) if related_task_objs.any?
      end

      if sub_issue_ids && sub_issue_ids.any?
        related_issue_objs = []
        sub_issue_ids.each do |sid|
          related_issue_objs << RelatedIssue.new(relatable_id: task.id, relatable_type: "Task", issue_id: sid)
        end
        RelatedIssue.import(related_issue_objs) if related_issue_objs.any?
      end

      if checklists_attributes.present?
        checklist_objs = []
        checklists_attributes.each do |key, value|
          if value["id"].present?
            c = all_checklists.detect{|cc| cc.id == value["id"].to_i}
            if value["_destroy"].present? && value["_destroy"] == "true"
              c.destroy
            else
              # TODO: Use upsert_all in Rails 6
              c.attributes = value
              c.save
            end
          else
            value.delete("_destroy")
            checklist_objs << Checklist.new(value.merge({listable_id: task.id, listable_type: "Task"}) )
          end
        end
        Checklist.import(checklist_objs) if checklist_objs.any?
      end

      if notes_attributes.present?
        notes_objs = []
        notes_attributes.each do |key, value|
          value.delete("_destroy")
          notes_objs << Note.new(value.merge({noteable_id: task.id, noteable_type: "Task"}) )
        end
        Note.import(notes_objs) if notes_objs.any?
      end

    end

    task.reload
  end

  def files_as_json
    task_files.map do |file|
      {
        id: file.id,
        name: file.blob.filename,
        uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true)
      }
    end.as_json
  end

  def manipulate_files(params)
    return unless params[:task][:task_files].present?
    file_blobs = JSON.parse(params[:task][:task_files])
    file_blobs.each do |file|
      if file['_destroy']
        task_files.find_by_id(file['id'])&.purge
      elsif file['_new']
        task_files.new(blob_id: file['id'])
      end
    end
  end

  def nuke_it!
    RelatedTask.where(task_id: self.id).or(RelatedTask.where(relatable: self)).destroy_all
  end

  def destroy
    nuke_it!
    super
  end

  def update_progress_on_stage_change
    if task_stage.present?
      self.progress = task_stage.percentage
      self.auto_calculate = false
    end
  end

  def init_kanban_order
    self.kanban_order = facility_project.tasks.where(task_stage_id: task_stage_id).maximum(:kanban_order) + 1 rescue 0 if self.task_stage_id.present?
  end
end
