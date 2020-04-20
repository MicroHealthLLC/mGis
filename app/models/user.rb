class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :omniauthable

  has_many :project_users, dependent: :destroy
  has_many :projects, through: :project_users
  has_many :facilities

  validates :first_name, :last_name, presence: true, on: :update

  enum role: [:subscriber, :admin].freeze
  enum status: [:inactive, :active].freeze

  def self.from_omniauth(auth)
    if where(email: auth.info.email || "#{auth.uid}@#{auth.provider}.com").present?
      return where(email: auth.info.email || "#{auth.uid}@#{auth.provider}.com").first
    end
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.email = auth.info.email || "#{auth.uid}@#{auth.provider}.com"
      user.login = auth.info.email || "#{auth.uid}@#{auth.provider}.com"
      user.password = Devise.friendly_token[0, 20]
    end
  end

  def active_for_authentication?
    super and self.active?
  end

  def inactive_message
    "You are not allowed to log in!"
  end
end
