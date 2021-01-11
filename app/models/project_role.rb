class ProjectRole < ApplicationRecord
  belongs_to :project
  belongs_to :role
  has_many :project_users

  after_create :grand_access_to_admins

  def grand_access_to_admins
    if self.role.system == true
      User.superadmin.each do |user|
        ProjectUser.create(user: user, project_role: self)
      end
    end
  end
end
