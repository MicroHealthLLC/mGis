class FacilityPrivilege < ApplicationRecord
  belongs_to :user
  belongs_to :facility_project
  belongs_to :facility, optional: true

  after_create :update_facility_id

  serialize :overview, Array
  serialize :admin, Array
  serialize :tasks, Array
  serialize :issues, Array
  serialize :risks, Array
  serialize :lessons, Array
  serialize :notes, Array

  def update_facility_id
    unless self.facility_id.present?
      f = self.facility_project
      self.update(facility_id: f.facility_id)
    end
  end 

  def get_permission_hash(permission_str)
    h = {read: false, write: false, delete: false, hide: true}
    permission_str.chars.each do |r|
      h[:read] = true if r == "R"
      h[:write] = true if r == "W"
      h[:delete] = true if r == "D"
      h[:hide] = (!h[:read] && !h[:write] && !h[:delete])
    end
    h
  end

  def to_json
    {
      overview: get_permission_hash( self.overview.join("") ),
      admin: get_permission_hash(  self.admin.join("") ),
      tasks: get_permission_hash(  self.tasks.join("") ),
      issues: get_permission_hash( self.issues.join("") ),
      risks: get_permission_hash( self.risks.join("") ),
      notes: get_permission_hash( self.notes.join("")),
      lessons: get_permission_hash( self.lessons.join("")),
      facility_project_id: self.facility_project_id,
      project_id: self.facility_id,
      program_id: self.facility_project.project_id
    }
  end

end
