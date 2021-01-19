class Role < ApplicationRecord
  default_scope {where(system: false)}

  has_many :project_roles, dependent: :destroy
  has_many :projects, through: :project_roles
  has_one :privilege, dependent: :destroy
  accepts_nested_attributes_for :privilege, reject_if: :all_blank

  validates :name, presence: true
  validates_uniqueness_of :name, case_sensitive: false

  scope :system, -> {where(system: true)}

  def initialize(*args)
    privilege ||= Privilege.new
    super
  end
end
