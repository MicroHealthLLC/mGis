class Role < ApplicationRecord
  has_many :project_roles, dependent: :destroy
  has_many :projects, through: :project_roles
  has_one :privilege, dependent: :destroy
  accepts_nested_attributes_for :privilege, reject_if: :all_blank

  def initialize(*args)
    privilege ||= Privilege.new
    super
  end
end
