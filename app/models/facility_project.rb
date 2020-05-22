class FacilityProject < ApplicationRecord
  belongs_to :facility
  belongs_to :project
  belongs_to :status, optional: true
  has_many :tasks, dependent: :destroy
  has_many :notes, as: :noteable

  scope :active, -> { joins(:facility).where("facilities.status = ?", 1).distinct }

  def as_json(options=nil)
    json = super(options)
    json.merge(
      facility: self.facility.as_json,
      tasks: self.tasks.map(&:to_json),
      notes: self.notes.map(&:to_json),
      project_status: self.status.try(:name),
      progress: progress
    ).as_json
  end

  def progress
    self.tasks.map(&:progress).sum / self.tasks.count rescue 0
  end
end
