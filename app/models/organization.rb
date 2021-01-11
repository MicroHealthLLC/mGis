class Organization < ApplicationRecord
  validates :title, presence: true
  validates_uniqueness_of :title, case_sensitive: false

  has_many :users, dependent: :nullify
end
