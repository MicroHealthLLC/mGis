if defined?(DatabaseCleaner)
  # cleaning the database using database_cleaner
  DatabaseCleaner.strategy = :truncation
  DatabaseCleaner.clean
else
  logger.warn "add database_cleaner or update cypress/app_commands/clean.rb"
  Issue.destroy_all if defined?(Issue)
  Task.destroy_all if defined?(Task)
  Risk.destroy_all if defined?(Risk)
  FacilityProject.destroy_all if defined?(FacilityProject)
  Facility.destroy_all if defined?(Facility)
  FacilityGroup.destroy_all if defined?(FacilityGroup)

  # sequence is required because of foreign key constrain
  ProjectTaskType.destroy_all
  ProjectIssueSeverity.destroy_all
  ProjectIssueType.destroy_all
  ProjectUser.destroy_all
  ProjectStatus.destroy_all
  Project.destroy_all if defined?(Project)
  ProjectType.destroy_all

  RiskStage.destroy_all if defined?(RiskStage)
  IssueType.destroy_all if defined?(IssueType)
  IssueStage.destroy_all if defined?(IssueStage)
  TaskStage.destroy_all if defined?(TaskStage)
  IssueSeverity.destroy_all
  TaskType.destroy_all if defined?(TaskType)
  Status.destroy_all if defined?(Status)
  Organization.destroy_all if defined?(Organization)
  Setting.destroy_all if defined?(Setting)
  Privilege.destroy_all if defined?(Privilege)
  Role.destroy_all if defined?(Role)
  User.destroy_all if defined?(User)
end

Rails.logger.info "APPCLEANED" # used by log_fail.rb
