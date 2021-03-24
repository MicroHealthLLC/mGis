desc "Assign default status"
task :assign_default_status_to_project => :environment do

  # if !Rails.env.development?
  #   puts "This command is for Development environment."
  #   Kernel.exit(0)
  # end
  
  FacilityProject.all.map(&:assign_default_status)

end

task :assign_not_started_status_to_program => :environment do

  # if !Rails.env.development?
  #   puts "This command is for Development environment."
  #   Kernel.exit(0)
  # end
  
  Project.all.map(&:add_not_started_status)

end