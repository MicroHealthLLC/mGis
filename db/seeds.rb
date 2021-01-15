
puts "Seed the application..."

user = User.find_or_initialize_by(email: 'admin@example.com')
user.assign_attributes(
  password: 'adminPa$$w0rd',
  password_confirmation: 'adminPa$$w0rd',
  title: 'Mr.',
  first_name: 'Super',
  role: "superadmin",
  last_name: 'Admin'
)
user.privileges = Privilege.new(overview: "RWD", tasks: "RWD", notes: "RWD", issues: "RWD", admin: "RWD", map_view: "RWD", gantt_view: "RWD", watch_view: "RWD", documents: "RWD", members: "RWD")
user.save(validate: false)

puts "superuser created with email: #{user.email}"

FacilityGroup.find_or_create_by(name: 'Sample Group', code: 'SAMP', status: 'active')
Setting.first_or_create(google_map_key: ENV['GOOGLE_MAP_KEY'])

puts "Seeds completed.."
