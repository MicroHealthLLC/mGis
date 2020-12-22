client = User.find_or_initialize_by(email: 'client@test.com')
client.privilege = Privilege.new(
  overview: "R",
  tasks: "R",
  notes: "R",
  issues: "R",
  admin: "R",
  map_view: "R",
  gantt_view: "R",
  watch_view: "R",
  documents: "R",
  members: "R",
  facility_manager_view: "R",
  sheets_view: "R",
  kanban_view: "",
  risks: "R"
)
client.save(validate: false)
