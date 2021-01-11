client = User.find_or_initialize_by(email: 'client@test.com')
project = Project.find_by(name: 'Test Project')
client_role = Role.find_by(name: 'client')
client_role.privilege.destroy!
client_role.privilege = Privilege.new(
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
client_role.save(validate: false)
project_client_role = ProjectRole.find_or_create_by(role_id: client_role.id, project_id: project.id)
ProjectUser.find_or_create_by(project_role_id: project_client_role.id, user_id: client.id)
