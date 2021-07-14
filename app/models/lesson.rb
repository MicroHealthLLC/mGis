class Lesson < ApplicationRecord

  belongs_to :user
  belongs_to :task_type, optional: true

  belongs_to :lesson_stage, optional: true
    
  has_many :lesson_users, dependent: :destroy
  has_many :users, through: :lesson_users
  
  belongs_to :facility_project
  has_one :facility, through: :facility_project
  has_one :project, through: :facility_project

  has_many :notes, as: :noteable, dependent: :destroy
  has_many_attached :lesson_files, dependent: :destroy

  has_many :lesson_details, dependent: :destroy

  has_many :related_tasks, as: :relatable, dependent: :destroy
  has_many :related_issues, as: :relatable, dependent: :destroy
  has_many :related_risks, as: :relatable, dependent: :destroy
  has_many :sub_tasks, through: :related_tasks
  has_many :sub_issues, through: :related_issues
  has_many :sub_risks, through: :related_risks

  validates :title, :description, :date, :facility_project_id, presence: true
  accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true

  def lesson_json
    {
      id: id,
      text: text,
      project_id: facility.id,
      project_name: facility.facility_name
    }
  end

  def porfolio_json
    resource_users = self.lesson_users #.where(user_id: self.users.active.uniq.map(&:id) )
    p_users = users.select(&:active?)


    users_hash = {} 
    p_users.map{|u| users_hash[u.id] = {id: u.id, name: u.full_name} }

    # Last name values added for improved sorting in datatables
    users_last_name_hash = {} 
    p_users.map{|u| users_last_name_hash[u.id] = u.last_name }

    # First name values added for improved sorting in datatables
    users_first_name_hash = {} 
    p_users.map{|u| users_first_name_hash[u.id] = u.first_name }

    s_notes = notes.sort{|n| n.created_at }
    latest_update = s_notes.first ? s_notes.first.json_for_lasson : {}
    self.as_json.merge(
      class_name: self.class.name,
      user_ids: p_users.map(&:id).compact.uniq,
      user_names: p_users.map(&:full_name).compact.join(", "),
      users: p_users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email]),
      created_by: {
        id: user.id,
        full_name: user.full_name
      },
      last_update: latest_update,
      notes: notes.as_json,
      added_by: user.full_name,
      project_name: facility.facility_name, 
      program_name: project.name, 
      lesson_stage_id: self.lesson_stage_id,
      lesson_stage: lesson_stage.try(:name),
      notes_updated_at: notes.map(&:updated_at).compact.uniq,
      project_id: facility_project.facility_id,
    ).as_json

  end

  def to_json(options = {})
    attach_files = []
    tf = self.lesson_files
    if tf.attached?
      attach_files = tf.map do |file|
        next if !file.blob.filename.instance_variable_get("@filename").present?
        begin
          if file.blob.content_type == "text/plain" && valid_url?(file.blob.filename.instance_variable_get("@filename"))
            {
              id: file.id,
              name: file.blob.filename.instance_variable_get("@filename"),
              uri: file.blob.filename.instance_variable_get("@filename"),
              link: true
            }
          else
            {
              id: file.id,
              name: file.blob.filename,
              uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true),
              link: false
            }
          end
        rescue Exception => e
          puts "There is an exception"
        end
      end.compact.uniq
    end
    
    t_users = options[:all_lesson_users] || []
    all_users = options[:all_users] || []
    if options[:for].present? && [:project_build_response, :lesson_index].include?(options[:for])
      resource_users = t_users
    else
      resource_users = self.lesson_users #.where(user_id: self.users.active.uniq.map(&:id) )
    end
 
    resource_user_ids = resource_users.to_a.map(&:user_id).compact.uniq
    accountable_user_ids = resource_users.map{|ru| ru.user_id if ru.accountable? }.compact.uniq
    responsible_user_ids = resource_users.map{|ru| ru.user_id if ru.responsible? }.compact.uniq
    consulted_user_ids = resource_users.map{|ru| ru.user_id if ru.consulted? }.compact.uniq
    informed_user_ids = resource_users.map{|ru| ru.user_id if ru.informed? }.compact.uniq
    
    p_users = []

    if all_users.any?
      p_users = all_users.select{|u| resource_user_ids.include?(u.id) }
    else
      p_users = users.select(&:active?)
    end

    users_hash = {} 
    p_users.map{|u| users_hash[u.id] = {id: u.id, name: u.full_name} }

    # Last name values added for improved sorting in datatables
    users_last_name_hash = {} 
    p_users.map{|u| users_last_name_hash[u.id] = u.last_name }

    # First name values added for improved sorting in datatables
    users_first_name_hash = {} 
    p_users.map{|u| users_first_name_hash[u.id] = u.first_name }

    all_lesson_details = self.lesson_details.sort{|n| n.updated_at }
    successes = all_lesson_details.select{|l| l.detail_type == "success"}
    failures = all_lesson_details.select{|l| l.detail_type == "failure"}
    best_practices = all_lesson_details.select{|l| l.detail_type == "best_practices"}
    s_tasks = []
    s_issues = []
    s_risks = []
    s_notes = notes.sort{|n| n.created_at && n.created_by }
    latest_update = s_notes.first ? s_notes.first.json_for_lasson : {}

    self.as_json.merge(
      class_name: self.class.name,
      attach_files: attach_files,
      user_ids: p_users.map(&:id).compact.uniq,
      user_names: p_users.map(&:full_name).compact.join(", "),
      users: p_users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email]),
      created_by: {
        id: user.id,
        full_name: user.full_name
      },
      lesson_details: self.lesson_details.map(&:to_json),
      lesson_stage_id: self.lesson_stage_id,
      lesson_stage: lesson_stage.try(:name),
      last_update: latest_update,
      notes: s_notes.as_json,
      notes_updated_at: notes.map(&:updated_at).compact.uniq,
      project_id: facility_project.facility_id,

      # Add RACI user names
      # Last name values added for improved sorting in datatables
      responsible_users: responsible_user_ids.map{|id| users_hash[id] }.compact,
      responsible_users_last_name: responsible_user_ids.map{|id| users_last_name_hash[id] }.compact,
      responsible_users_first_name: responsible_user_ids.map{|id| users_first_name_hash[id] }.compact,
      accountable_users: accountable_user_ids.map{|id| users_hash[id] }.compact,
      accountable_users_last_name: accountable_user_ids.map{|id| users_last_name_hash[id] }.compact,
      accountable_users_first_name: accountable_user_ids.map{|id| users_first_name_hash[id] }.compact,
      consulted_users: consulted_user_ids.map{|id| users_hash[id] }.compact, 
      informed_users: informed_user_ids.map{|id| users_hash[id] }.compact, 

      # Add RACI user ids
      responsible_user_ids: responsible_user_ids,
      accountable_user_ids: accountable_user_ids,    
      consulted_user_ids: consulted_user_ids,
      informed_user_ids: informed_user_ids, 

      sub_tasks: sub_tasks.map(&:lesson_json),
      sub_issues: sub_issues.map(&:lesson_json),
      sub_risks: sub_risks.map(&:lesson_json),

      sub_task_ids: sub_tasks.map(&:id),
      sub_issue_ids: sub_issues.map(&:id),
      sub_risk_ids: sub_risks.map(&:id),

      successes: successes.map(&:to_json),
      failures: failures.map(&:to_json),
      best_practices: best_practices.map(&:to_json)

    ).as_json
  end

  def build_response_for_index(options = {})
    
    t_users = options[:all_lesson_users] || []
    all_users = options[:all_users] || []
    if options[:for].present? && [:project_build_response, :lesson_index].include?(options[:for])
      resource_users = t_users
    else
      resource_users = self.lesson_users #.where(user_id: self.users.active.uniq.map(&:id) )
    end
 
    p_users = []

    if all_users.any?
      p_users = all_users.select{|u| resource_user_ids.include?(u.id) }
    else
      p_users = users.select(&:active?)
    end

    users_hash = {} 
    p_users.map{|u| users_hash[u.id] = {id: u.id, name: u.full_name} }

    # Last name values added for improved sorting in datatables
    users_last_name_hash = {} 
    p_users.map{|u| users_last_name_hash[u.id] = u.last_name }

    # First name values added for improved sorting in datatables
    users_first_name_hash = {} 
    p_users.map{|u| users_first_name_hash[u.id] = u.first_name }

    s_notes = notes.sort{|n| n.created_at }
    latest_update = s_notes.first ? s_notes.first.json_for_lasson : {}
    self.as_json.merge(
      class_name: self.class.name,
      user_ids: p_users.map(&:id).compact.uniq,
      user_names: p_users.map(&:full_name).compact.join(", "),
      users: p_users.as_json(only: [:id, :full_name, :title, :phone_number, :first_name, :last_name, :email]),
      created_by: {
        id: user.id,
        full_name: user.full_name
      },
      last_update: latest_update,
      notes: s_notes.map(&:json_for_lasson),
      lesson_stage_id: self.lesson_stage_id,
      lesson_stage: lesson_stage.try(:name),
      notes_updated_at: notes.map(&:updated_at).compact.uniq,
      project_id: facility_project.facility_id,
    ).as_json
  end

  def self.lesson_preload_array
    [:user, :task_type, :lesson_details, :lesson_users, :lesson_stage, :related_tasks, :related_issues, :related_risks, { notes: :user }, {users: :organization}, {lesson_files_attachments: :blob},  {sub_tasks: [:facility]}, {sub_issues: [:facility] }, {sub_risks: [:facility] }, :project, :facility, {facility_project: :facility} ]
  end

  def self.params_to_permit
    [
      :title, 
      :description, 
      :date, 
      :task_type_id,  
      :facility_project_id,
      :reportable, 
      :important, 
      :draft, 
      :reportable, 
      :lesson_stage_id,
      sub_task_ids: [],
      sub_issue_ids: [],
      sub_risk_ids: [],
      lesson_files: [],
      user_ids: [],
      destroy_file_ids: [],
      notes_attributes: [
        :id,
        :_destroy,
        :user_id,
        :body
      ],
      # lesson_details: [
      #   :id,
      #   :_destroy,
      #   :user_id,
      #   :finding,
      #   :recommendation,
      #   :detail_type
      # ]
      successes: [
        :id,
        :_destroy,
        :user_id,
        :finding,
        :recommendation
      ],
      failures: [
        :id,
        :_destroy,
        :user_id,
        :finding,
        :recommendation
      ],
      best_practices: [
        :id,
        :_destroy,
        :user_id,
        :finding,
        :recommendation
      ]
    ]
  end

  def create_or_update_lesson(params, user)

    lesson_params = params.require(:lesson).permit(Lesson.params_to_permit)

    lesson = self
    lesson.user_id = user.id
    t_params = lesson_params.dup
    sub_task_ids = t_params.delete(:sub_task_ids)
    sub_issue_ids = t_params.delete(:sub_issue_ids)
    sub_risk_ids = t_params.delete(:sub_risk_ids)
    notes_attributes = t_params.delete(:notes_attributes)
    destroy_file_ids = t_params.delete(:destroy_file_ids)&.map(&:to_i)
    # params_lesson_details = t_params.delete(:lesson_details)
    
    # NOTE: This code is written  based on request to overcome confusion for front end.
    # It can be simplify by sending lesson_details parameters from front end which is currently commented.
    params_lesson_details = []
    params_successes = t_params.delete(:successes)
    params_failures = t_params.delete(:failures)
    params_best_practices = t_params.delete(:best_practices)

    if params_successes
      params_successes.each do |h|
        h[:detail_type] = "success"
      end
      params_lesson_details = ( params_lesson_details + params_successes ).compact
    end

    if params_failures
      params_failures.each do |h|
        h[:detail_type] = "failure"
      end
      params_lesson_details = ( params_lesson_details + params_failures ).compact
    end

    if params_best_practices
      params_best_practices.each do |h|
        h[:detail_type] = "best_practices"
      end
      params_lesson_details = ( params_lesson_details + params_best_practices ).compact
    end

    if params[:project_id] && params[:program_id]
      fp = FacilityProject.where(project_id: params[:program_id], facility_id: params[:project_id]).first
      t_params[:facility_project_id] = fp.id
    end

    lesson.attributes = t_params
    lesson.date ||= Date.today
     
    lesson.transaction do
      lesson.save
      lesson.add_link_attachment(params)
      lesson.remove_attachment(destroy_file_ids)

      if notes_attributes.present?
        existing_notes = self.notes
        notes_objs = []
        notes_attributes.each do |value|
          if value[:_destroy].present?
            n = existing_notes.detect{|e| e.id == value[:id].to_i}
            n.destroy if n
          elsif value[:id].present?
            n = existing_notes.detect{|e| e.id == value[:id].to_i}
            n.update(value) if n
          else
            notes_objs << Note.new(value.merge({user_id: user.id, noteable_id: lesson.id, noteable_type: "Lesson"}) )
          end
        end
        Note.import(notes_objs) if notes_objs.any?
      end

      if params_lesson_details.present?
        existing_lesson_details = self.lesson_details
        lesson_detail_objs = []

        params_lesson_details.each do |value|
          if value[:_destroy].present?
            l = existing_lesson_details.detect{|e| e.id == value[:id].to_i}
            l.destroy if l
          elsif value[:id].present?
            l = existing_lesson_details.detect{|e| e.id == value[:id].to_i}
            l.update(value) if l
          else
            lesson_detail_objs << LessonDetail.new(value.merge({lesson_id: lesson.id,user_id: user.id}) )
          end
        end
        LessonDetail.import(lesson_detail_objs) if lesson_detail_objs.any?
      end

      if sub_task_ids && sub_task_ids.any?
        sub_task_ids = sub_task_ids.map(&:to_i).uniq
        existing_task_ids = self.sub_task_ids
        related_task_objs = []
        related_task_objs2 = []
        (sub_task_ids - existing_task_ids).each do |sid|
          related_task_objs << RelatedTask.new(relatable_id: lesson.id, relatable_type: "Lesson", task_id: sid)
          # related_task_objs2 << RelatedTask.new(relatable_id: sid, relatable_type: "Task", task_id: task.id)
        end
        RelatedTask.import(related_task_objs) if related_task_objs.any?
        RelatedTask.import(related_task_objs2) if related_task_objs2.any?
        ids_to_destroy = (existing_task_ids - sub_task_ids)
        RelatedTask.where(relatable_id: lesson.id, relatable_type: "Lesson", task_id: ids_to_destroy ).destroy_all if ids_to_destroy.any?
      else
        lesson.sub_task_ids = []
      end

      if sub_issue_ids && sub_issue_ids.any?
        sub_issue_ids = sub_issue_ids.map(&:to_i).uniq
        existing_issue_ids = self.sub_issue_ids
        related_issue_objs = []
        related_issue_objs2 = []
        (sub_issue_ids - existing_issue_ids).each do |sid|
          related_issue_objs << RelatedIssue.new(relatable_id: lesson.id, relatable_type: "Lesson", issue_id: sid)
          # related_issue_objs2 << RelatedTask.new(relatable_id: sid, relatable_type: "Issue", task_id: task.id)
        end
        RelatedIssue.import(related_issue_objs) if related_issue_objs.any?
        RelatedTask.import(related_issue_objs2) if related_issue_objs2.any?
        ids_to_destroy = (existing_issue_ids - sub_issue_ids)
        RelatedIssue.where(relatable_id: lesson.id, relatable_type: "Lesson", issue_id: ids_to_destroy ).destroy_all if ids_to_destroy.any?
      else
        lesson.sub_issue_ids = []
      end
      
      if sub_risk_ids && sub_risk_ids.any?
        sub_risk_ids = sub_risk_ids.map(&:to_i).uniq
        existing_risk_ids = self.sub_risk_ids
        related_risk_objs = []
        related_risk_objs2 = []
        (sub_risk_ids - existing_risk_ids).each do |sid|
          related_risk_objs << RelatedRisk.new(relatable_id: lesson.id, relatable_type: "Lesson", risk_id: sid)
          # related_risk_objs2 << RelatedTask.new(relatable_id: sid, relatable_type: "Risk", task_id: task.id)
        end
        RelatedRisk.import(related_risk_objs) if related_risk_objs.any?
        RelatedTask.import(related_risk_objs2) if related_risk_objs2.any?
        ids_to_destroy = (existing_risk_ids - sub_risk_ids)
        RelatedIssue.where(relatable_id: lesson.id, relatable_type: "Lesson", risk_id: ids_to_destroy ).destroy_all if ids_to_destroy.any?
      else
        lesson.sub_risk_ids = []
      end
      
      lesson.assign_users(params)

    end
    lesson.persisted?  ? Lesson.includes(Lesson.lesson_preload_array).find(lesson.id) : lesson
  end


  def valid_url?(url)
    uri = URI.parse(url)
    (uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS) ) && !uri.host.nil?
  rescue URI::InvalidURIError
    false
  end

  def remove_attachment(dids = [])
    lesson_files.where(id: dids)&.map(&:purge) if dids && dids.any?
  end

  def add_link_attachment(params = {})
    link_files = params[:file_links]
    if link_files && link_files.any?
      link_files.each do |f|
        next if !f.present? || f.nil? || !valid_url?(f)
        self.lesson_files.attach(io: StringIO.new(f), filename: f, content_type: "text/plain")
      end
    end
  end

  def assign_users(params)
    accountable_resource_users = []
    responsible_resource_users = []
    consulted_resource_users = []
    informed_resource_users = []

    resource = self
    resource_users = resource.lesson_users
    accountable_user_ids = resource_users.map{|ru| ru.user_id if ru.accountable? }.compact
    responsible_user_ids = resource_users.map{|ru| ru.user_id if ru.responsible? }.compact
    consulted_user_ids = resource_users.map{|ru| ru.user_id if ru.consulted? }.compact
    informed_user_ids = resource_users.map{|ru| ru.user_id if ru.informed? }.compact

    users_to_delete = []

    if params[:accountable_user_ids].present?
      params[:accountable_user_ids].each do |uid|
        next if uid == "undefined"
        if !accountable_user_ids.include?(uid.to_i)
          accountable_resource_users << LessonUser.new(user_id: uid, lesson_id: resource.id, user_type: 'accountable')
        end
      end
      users_to_delete += accountable_user_ids - params[:accountable_user_ids].map(&:to_i)
    end

    if params[:responsible_user_ids].present?
      params[:responsible_user_ids].each do |uid|
        next if uid == "undefined"
        if !responsible_user_ids.include?(uid.to_i)
          responsible_resource_users << LessonUser.new(user_id: uid, lesson_id: resource.id, user_type: 'responsible')
        end
      end
      users_to_delete += responsible_user_ids - params[:responsible_user_ids].map(&:to_i)
    end

    if params[:consulted_user_ids].present?
      params[:consulted_user_ids].each do |uid|
        next if uid == "undefined"
        if !consulted_user_ids.include?(uid.to_i)
          consulted_resource_users << LessonUser.new(user_id: uid, lesson_id: resource.id, user_type: 'consulted')
        end
      end
      users_to_delete += consulted_user_ids - params[:consulted_user_ids].map(&:to_i)
    end

    if params[:informed_user_ids].present?
      params[:informed_user_ids].each do |uid|
        next if uid == "undefined"
        if !informed_user_ids.include?(uid.to_i)
          informed_resource_users << LessonUser.new(user_id: uid, lesson_id: resource.id, user_type: 'informed')
        end
      end
      users_to_delete += informed_user_ids - params[:informed_user_ids].map(&:to_i)
    end
    
    records_to_import = accountable_resource_users + responsible_resource_users + consulted_resource_users + informed_resource_users
    
    if users_to_delete.any?
      resource_users.where(user_id: users_to_delete).destroy_all
    end

    if records_to_import.any?
      LessonUser.import(records_to_import)
    end
  end

  def files_as_json
    lesson_files.map do |file|
      if file.blob.content_type == "text/plain"
        {
          id: file.id,
          name: file.blob.filename.instance_variable_get("@filename"),
          uri: file.blob.filename.instance_variable_get("@filename"),
          link: true
        }
      else
        {
          id: file.id,
          name: file.blob.filename,
          uri: Rails.application.routes.url_helpers.rails_blob_path(file, only_path: true),
          link: false
        }
      end
    end.as_json
  end

  def manipulate_files(params)
    return unless params[:lesson][:lesson_files].present?
    file_blobs = JSON.parse(params[:lesson][:lesson_files])
    file_blobs.each do |file|
      if file['_destroy']
        lesson_files.find_by_id(file['id'])&.purge
      elsif file['_new']
        lesson_files.new(blob_id: file['id'])
      end
    end
  end

end
