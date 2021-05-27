desc "Update Progress"
task :update_progress => :environment do

  puts "Updating Facility Projects Progress"
  FacilityProject.all.map(&:update_progress)
  FacilityProject.all.map(&:update_color)

  puts "Updating Projects Progress"
  Project.all.map(&:update_progress)

  puts "Updating Task Type Progress"
  TaskType.all.map(&:update_progress)

  puts "Updating Facility Groups Progress"
  FacilityGroup.all.map(&:update_progress)
end

desc "Remove Query filters without Favorite filters"
task :remove_query_filters => :environment do

  puts "Removing Query Filters without Favorite filters"
  QueryFilter.where(favorite_filter_id: nil).destroy_all

end


desc 'Removes schema_migration entries for removed migration files'
task 'db:migrate:cleanup' => :environment do
  migration_context = ActiveRecord::Base.connection.migration_context
  versions_to_delete =migration_context.migrations_status.map { |_status, version, name| version if name.include?('NO FILE') }.compact.uniq

  migration_context.schema_migration.delete_by(version: versions_to_delete)

  puts "Cleaned up #{versions_to_delete.size} orphaned migrations."
end