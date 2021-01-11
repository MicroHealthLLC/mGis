class User < ApplicationRecord
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :validatable, :omniauthable

  has_many :project_users, dependent: :destroy
  has_many :project_roles, through: :project_users
  has_many :projects, through: :project_roles
  has_many :roles, through: :project_roles
  has_many :facilities
  has_many :risks
  belongs_to :organization, optional: true

  validates :first_name, :last_name, presence: true
  validate :password_complexity
  before_commit :set_color, on: :create

  enum role: [:client, :superadmin].freeze
  enum status: [:inactive, :active].freeze
  ADMIN_PERMISSIONS_ENUM={can_read: 1, can_edit: 2, can_delete: 3}

  attr_accessor :current_project

  def privilege
    return nil unless current_project.present?
    roles.joins(:project_roles).where('project_roles.project_id = ? ', current_project.id).distinct.first.privilege
  end

  def admin_permission_ids
    JSON.parse(admin_permissions) rescue []
  end

  def admin_permission_vals
    admin_permission_ids.map{|e| User::ADMIN_PERMISSIONS_ENUM.key(e)}
  end

  def self.from_omniauth(auth)
    if where(email: auth.info.email || "#{auth.uid}@#{auth.provider}.com").present?
      where(email: auth.info.email || "#{auth.uid}@#{auth.provider}.com").first do |user|
        user.provider = auth.provider
        user.uid = auth.uid
        user.first_name = auth.info.first_name rescue nil
        user.last_name = auth.info.last_name rescue nil
        user.email = auth.info.email || "#{auth.uid}@#{auth.provider}.com"
        user.login = auth.info.email || "#{auth.uid}@#{auth.provider}.com"
        user.first_name ||= user.login
        user.last_name ||= user.login
        user.password = Devise.friendly_token[0, 20]
      end
    else
      nil
    end
  end

  def password_complexity
    pass_settings = JSON.parse(Setting['PASSWORDS_KEY'])
    error_message = []
    if pass_settings['range'].to_i != password&.size
      error_message.push "Length should be #{pass_settings['range']} characters"
    elsif pass_settings['uppercase']
      error_message.push "Should include 1 uppercase letter! " unless password =~ /^(?=.*?[A-Z]).{1,}$/
    elsif pass_settings['lowercase']
      error_message.push "Should include 1 lowercase letter! " unless password =~ /^(?=.*?[a-z]).{1,}$/
    elsif pass_settings['numbers']
      error_message.push "Should include 1 number! " unless password =~ /^(?=.*?[0-9]).{1,}$/
    elsif pass_settings['special_chars']
      error_message.push "Should include 1 special character! " unless password =~ /^(?=.*?[#?!@$%^&*-]).{1,}$/
    end
    return if password.blank? || error_message.empty?
    errors.add(:password, error_message.join(', '))
  rescue
    errors.add(:password, "Password validations failed!")
  end

  def full_name
    "#{first_name} #{last_name}"
  end

  def as_json(options=nil)
    json = super(options)
    json.merge(
      full_name: full_name,
      organization: organization.try(:title)  || ""
    ).as_json
  end

  def active_for_authentication?
    super and self.active?
  end

  def inactive_message
    "You are not allowed to log in!"
  end

  def admin?
    superadmin? || admin_permission_vals.any?
  end

  def admin_read?
    superadmin? || admin_permission_vals.include?(:can_read)
  end

  def admin_write?
    superadmin? || admin_permission_vals.include?(:can_edit)
  end

  def admin_delete?
    superadmin? || admin_permission_vals.include?(:can_delete)
  end

  def admin_privilege
    superadmin? ? "RWD" : admin_permission_vals.map(&:to_s).map{|u| u.sub("can_", '').sub("edit", 'W').first.upcase}.join
  end

  def download_links?
    admin_write? ? [:csv, :json] : false
  end

  def set_color
    self.color = "##{SecureRandom.hex(3)}"
  end

  def project_names
    projects.active.pluck :name
  end

  def allowed?(view)
    privilege&.send(view)&.include?("R")
  end
end
