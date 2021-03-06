class TaskType < SortableRecord
  # default_scope {order(TaskType.order_humanize)}
  has_many :tasks
  has_many :facility_projects, through: :tasks
  has_many :facilities, through: :facility_projects
  validates :name, presence: true
  validates_uniqueness_of :name, case_sensitive: false

  has_many :project_task_types
  has_many :projects, through: :project_task_types

  def update_progress
    t = self.facility_projects
    p = 0
    if t.any?
      p = (t.map(&:progress).sum / t.size).round(0)
    end
    self.update(progress: p)
  end

  # def progress
  # 	fp = self.facility_projects
  #   (fp.map(&:progress).sum / fp.size).round(0) rescue 0
  # end
  
end
