class ProjectUser < ApplicationRecord
  belongs_to :user
  belongs_to :project_role
  delegate :project, to: :project_role
end
