class User < ApplicationRecord
  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :validatable, :omniauthable

  has_many :project_users, dependent: :destroy
  has_many :projects, through: :project_users
  has_many :facilities
  has_many :risks
  has_one :privilege, dependent: :destroy
  belongs_to :organization, optional: true
  has_many :query_filters, dependent: :destroy
  has_many :facility_privileges, dependent: :destroy

  validates :first_name, :last_name, presence: true
  validate :password_complexity
  before_commit :set_color, on: :create

  enum role: [:client, :superadmin].freeze
  enum status: [:inactive, :active].freeze

  scope :admin, -> {joins(:privilege).where("privileges.admin LIKE ? OR role = ?", "%R%", 1).distinct}

  accepts_nested_attributes_for :privilege, reject_if: :all_blank
  accepts_nested_attributes_for :facility_privileges, reject_if: :all_blank, allow_destroy: true

  PREFERENCES_HASH =  {
      navigation_menu: 'map', 
      sub_navigation_menu: nil,
      program_id: nil, 
      project_id: nil,
      project_group_id: nil
    }
  has_settings do |s|
    s.key :preferences, defaults: PREFERENCES_HASH
  end

  def active_admin_facility_project_select_options
    fps_hash = FacilityProject.includes(:facility, :project).where(project_id: self.projects.active).group_by(&:project)
    options = []
    fps_hash.each do |project, fps|
      options << [project.name, project.id, {disabled: true}]
      fps.each do |f|
        options << ["&nbsp;#{f.facility.facility_name}".html_safe, f.id]
      end
    end    
    options
  end

  def facility_privileges_hash
    self.facility_privileges.includes(:facility, :facility_project)
  end

  def encrypted_authentication_token
    self.save unless self.authentication_token.present?
    crypt = ActiveSupport::MessageEncryptor.new([ENV["MESSAGE_ENCRYPTOR_KEY"]].pack("H*"))
    return crypt.encrypt_and_sign(self.authentication_token)
  end
  
  def valid_encrypted_authentication_token?(token)
    return false unless self.authentication_token.present?
    crypt = ActiveSupport::MessageEncryptor.new([ENV["MESSAGE_ENCRYPTOR_KEY"]].pack("H*"))
    return crypt.decrypt_and_verify(token) == self.authentication_token rescue false
  end

  def allowed_navigation_tabs(right = 'R')
    nagivation_tabs = ["member_list", "map_view", "gantt_view", "sheets_view", "kanban_view", "calendar_view"] - ["calendar_view", "gantt_view"]
    self.privilege.attributes.select{|k,v| v.is_a?(String) && v.include?(right)}.keys & nagivation_tabs
  end

  def build_navigation_tabs_for_profile
    n = []
    allowed_navigation_tabs.each do |t|
      name = "map" if t == "map_view"
      name = "kanban" if t == "kanban_view"
      name = "sheet" if t == "sheets_view"
      name = "member_list" if t == "member_list"
      
      #NOTE: Once front end routes are working, uncomment it.
      #name = "gantt_chart" if t == "gantt_view"      

      # name = "calendar" if t == "calendar_view"

      n << {id: name.downcase, name: name.humanize, value: name.downcase}
    end
    n
    #n << {id: 'member_list', name: 'Team', value: 'member_list'}
  end

  def allowed_sub_navigation_tabs(right = 'R')
    sub_nagivation_tabs = ["tasks", "issues", "notes", "risks", "overview"]
    self.privilege.attributes.select{|k,v| v.is_a?(String) && v.include?(right)}.keys & sub_nagivation_tabs
  end

  def build_sub_navigation_tabs_for_profile
    allowed_sub_navigation_tabs.map{|s| {id: s.downcase, name: s.humanize, value: s.downcase} }
  end

  def preference_url
    p = self.get_preferences
    url = "/"
    if p.program_id.present?
      url = "/programs/#{p.program_id}/sheet" # map must be  
      if p.navigation_menu.present?        
        url = "/programs/#{p.program_id}/#{p.navigation_menu}"
        if p.project_id.present?
          url = "/programs/#{p.program_id}/#{p.navigation_menu}/projects/#{p.project_id}"
          if p.sub_navigation_menu.present?
            if p.sub_navigation_menu == "overview"
              url = "/programs/#{p.program_id}/#{p.navigation_menu}/projects/#{p.project_id}/"
            else
              url = "/programs/#{p.program_id}/#{p.navigation_menu}/projects/#{p.project_id}/#{p.sub_navigation_menu}"
            end
          end
        end
      end
    end
    url
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
      organization: organization&.title  || ""
    ).as_json
  end

  # def to_json(options={})
  #   json = super(options)
  #   all_organisations = options[:all_organisations]
  #   o = all_organisations.detect{|oo| oo.id == self.organisation_id}
  #   json.merge(
  #     full_name: full_name,
  #     organization: o&.title  || ""
  #   )
  # end

  def get_preferences
    # if preferences.project_group_id.present?
    #   preferences.project_group = FacilityGroup.find(preferences.project_group_id)
    # end
    # if preferences.project_id.present?
    #   preferences.project = FacilityProject.where(facility_id: preferences.project_id).first
    # end
    p = self.settings(:preferences)
    if p.new_record?
      p.value =  PREFERENCES_HASH
      p.save
    end
    p
  end

  def active_for_authentication?
    super and self.active?
  end

  def inactive_message
    "You are not allowed to log in!"
  end

  def abilities
    Ability.new(self).permissions
  end

  def admin?
    superadmin? || privilege.admin.include?("R")
  end

  def initialize(*args)
    privilege ||= Privilege.new
    super
  end

  def admin_read?
    superadmin? || privilege.admin.include?("R")
  end

  def admin_write?
    superadmin? || (admin_read? && privilege.admin.include?("W"))
  end

  def admin_delete?
    superadmin? || (admin_read? && privilege.admin.include?("D"))
  end

  def admin_privilege
    superadmin? ? "RWD" : privilege.admin
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
    privilege.send(view)&.include?("R") || superadmin? || privilege.admin.include?("R")
  end
end
