# You can setup your Rails state here
# MyModel.create name: 'something'
organization = Organization.find_or_create_by(title: 'Test Organization')
admin = User.find_or_initialize_by(email: 'admin@test.com')
admin.assign_attributes(
  password: 'T3$tAdmin',
  password_confirmation: 'T3$tAdmin',
  title: 'Manager',
  first_name: 'Test1',
  role: "superadmin",
  last_name: 'Admin',
  phone_number: '+447400123440',
  address: '38 Wiltshire Rd, Leicester LE4 0JT, UK',
  organization_id: organization.id
)
admin.privilege = Privilege.new(
  overview: "RWD",
  tasks: "RWD",
  notes: "RWD",
  issues: "RWD",
  admin: "RWD",
  map_view: "RWD",
  gantt_view: "RWD",
  watch_view: "RWD",
  documents: "RWD",
  members: "RWD",
  facility_manager_view: "R",
  sheets_view: "R",
  kanban_view: "R",
  risks: "R"
)
admin.save(validate: false)

client = User.find_or_initialize_by(email: 'client@test.com')
client.assign_attributes(
  password: 'T3$tClient',
  password_confirmation: 'T3$tClient',
  title: 'Mr.',
  first_name: 'Test2',
  last_name: 'Client',
  role: 'client',
  phone_number: '+447400123450',
  address: '56 Second Ave, Pensnett Trading Estate, Kingswinford DY6 7XN, UK',
  organization_id: organization.id
)
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
  kanban_view: "R",
  risks: "R"
)
client.save(validate: false)

Setting.first_or_create(google_map_key: ENV['GOOGLE_MAP_KEY'])

project_type = ProjectType.find_or_create_by(name: 'Test Project Type')
project = Project.find_or_create_by(
  name: 'Test Project',
  description: 'Test project description',
  project_type_id: project_type.id
)

ProjectUser.find_or_create_by(project_id: project.id, user_id: admin.id)
ProjectUser.find_or_create_by(project_id: project.id, user_id: client.id)
active_status = Status.find_or_create_by(name: 'Active', color: '#0b8e1a')
inactive_status = Status.find_or_create_by(name: 'InActive', color: '#c90d0d')
ProjectStatus.find_or_create_by(project_id: project.id, status_id: active_status.id)
ProjectStatus.find_or_create_by(project_id: project.id, status_id: inactive_status.id)
task_type = TaskType.find_or_create_by(name: 'Test Task Type(milestone)')
task_stage = TaskStage.find_or_create_by(name: 'Test Task Stage', percentage: 40)
new_task_stage = TaskStage.find_or_create_by(name: 'New Task Stage', percentage: 60)
issue_stage = IssueStage.find_or_create_by(name: 'Test Issue Stage', percentage: 40)
new_issue_stage = IssueStage.find_or_create_by(name: 'New Issue Stage', percentage: 60)
risk_stage = RiskStage.find_or_create_by(name: 'Test Risk Stage', percentage: 40)
new_risk_stage = RiskStage.find_or_create_by(name: 'New Risk Stage', percentage: 60)
issue_type = IssueType.find_or_create_by(name: 'Test Issue Type')
issue_severity = IssueSeverity.find_or_create_by(name: 'Test Issue Severity')

ProjectTaskStage.find_or_create_by(project_id: project.id, task_stage_id: task_stage.id)
ProjectTaskStage.find_or_create_by(project_id: project.id, task_stage_id: new_task_stage.id)
ProjectIssueStage.find_or_create_by(project_id: project.id, issue_stage_id: issue_stage.id)
ProjectIssueStage.find_or_create_by(project_id: project.id, issue_stage_id: new_issue_stage.id)
ProjectRiskStage.find_or_create_by(project_id: project.id, risk_stage_id: risk_stage.id)
ProjectRiskStage.find_or_create_by(project_id: project.id, risk_stage_id: new_risk_stage.id)

project_task_type = ProjectTaskType.create(project_id: project.id, task_type_id: task_type.id)
project_issue_severities = ProjectIssueSeverity.create(project_id: project.id, issue_severity_id: issue_severity.id)
project_issue_type = ProjectIssueType.create(project_id: project.id, issue_type_id: issue_type.id)

facility_group_1 = FacilityGroup.find_or_create_by(
  name: 'Test Facility Group 1',
  code: 'TFG1',
  status: 'active'
)
facility_1 = Facility.find_or_create_by(
  facility_name: 'Test Facility 1',
  address: '2-20 Western Rd, Park Royal, London NW10 7LW, UK',
  point_of_contact: 'Test points',
  phone_number: '+447400123451',
  email: 'facility1@test.com',
  lat: '51.5285728',
  lng: '-0.2696692999999999' ,
  status: 'active',
  country_code: 'GB',
  creator_id: admin.id,
  facility_group_id: facility_group_1.id
)

facility_project_1 = FacilityProject.find_or_create_by(
  project_id: project.id,
  facility_id: facility_1.id,
  status_id: active_status.id,
  due_date: Date.today + 10.days
)

Note.find_or_create_by(
  noteable_type: 'FacilityProject',
  noteable_id: facility_project_1.id,
  user_id: admin.id,
  body: 'Test Note 1'
)

test_task_1 = Task.find_or_create_by(
  text: 'Test Task 1',
  description: 'Test task 1 description',
  start_date: Date.today,
  due_date: Date.today + 5.days,
  task_type_id: task_type.id,
  task_stage_id: task_stage.id,
  facility_project_id: facility_project_1.id,
  watched: true,
  progress: 10
)

TaskUser.find_or_create_by(task_id: test_task_1.id, user_id: admin.id)

new_task_1 = Task.find_or_create_by(
  text: 'New Task 1',
  description: 'New task 1 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  task_type_id: task_type.id,
  task_stage_id: new_task_stage.id,
  facility_project_id: facility_project_1.id,
  watched: false,
  progress: 70
)

TaskUser.find_or_create_by(task_id: new_task_1.id, user_id: client.id)

test_issue_1 = Issue.find_or_create_by(
  title: 'Test Issue 1',
  description: 'Test issue 1 description',
  start_date: Date.today,
  due_date: Date.today + 5.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_1.id,
  watched: true,
  progress: 10
)

IssueUser.find_or_create_by(issue_id: test_issue_1.id, user_id: admin.id)

new_issue_1 = Issue.find_or_create_by(
  title: 'New Issue 1',
  description: 'New issue 1 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: new_issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_1.id,
  watched: false,
  progress: 70
)

IssueUser.find_or_create_by(issue_id: new_issue_1.id, user_id: client.id)

test_risk_1 = Risk.find_or_create_by(
  text: 'Test Risk 1',
  risk_description: 'Test Risk 1 description',
  impact_description: 'Test Risk 1 impact description',
  start_date: Date.today,
  due_date: Date.today + 5.days,
  risk_approach_description: 'Test Risk 1 approach description',
  probability_description: 'Test Risk 1 probability description',
  user_id: admin.id,
  facility_project_id: facility_project_1.id,
  task_type_id: task_type.id,
  risk_stage_id: risk_stage.id,
  watched: true,
  progress: 10
)

RiskUser.find_or_create_by(risk_id: test_risk_1.id, user_id: admin.id)

new_risk_1 = Risk.find_or_create_by(
  text: 'New Risk 1',
  risk_description: 'New Risk 1 description',
  impact_description: 'New Risk 1 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 5.days,
  risk_approach_description: 'New Risk 1 approach description',
  probability_description: 'New Risk 1 probability description',
  user_id: client.id,
  facility_project_id: facility_project_1.id,
  task_type_id: task_type.id,
  risk_stage_id: new_risk_stage.id,
  watched: false,
  progress: 70
)

RiskUser.find_or_create_by(risk_id: new_risk_1.id, user_id: client.id)

facility_2 = Facility.find_or_create_by(
  facility_name: 'Test Facility 2',
  address: 'Abo Simbel Desert, Aswan Governorate 81514, Egypt',
  point_of_contact: 'Test points',
  phone_number: '+447400123452',
  email: 'facility2@test.com',
  lat: '23.6966498',
  lng: '32.7181375' ,
  status: 'active',
  country_code: 'GB',
  creator_id: admin.id,
  facility_group_id: facility_group_1.id
)

facility_project_2 = FacilityProject.find_or_create_by(
  project_id: project.id,
  facility_id: facility_2.id,
  status_id: inactive_status.id,
  due_date: Date.today + 10.days
)

Note.find_or_create_by(
  noteable_type: 'FacilityProject',
  noteable_id: facility_project_2.id,
  user_id: admin.id,
  body: 'Test Note 2'
)

test_task_2 = Task.find_or_create_by(
  text: 'Test Task 2',
  description: 'Test task 2 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  task_type_id: task_type.id,
  task_stage_id: task_stage.id,
  facility_project_id: facility_project_2.id,
  watched: true,
  progress: 40
)

TaskUser.find_or_create_by(task_id: test_task_2.id, user_id: admin.id)

new_task_2 = Task.find_or_create_by(
  text: 'New Task 2',
  description: 'New task 2 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  task_type_id: task_type.id,
  task_stage_id: new_task_stage.id,
  facility_project_id: facility_project_2.id,
  watched: false,
  progress: 40
)

TaskUser.find_or_create_by(task_id: new_task_2.id, user_id: client.id)

test_issue_2 = Issue.find_or_create_by(
  title: 'Test Issue 2',
  description: 'Test issue 2 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_2.id,
  watched: true,
  progress: 40
)

IssueUser.find_or_create_by(issue_id: test_issue_2.id, user_id: admin.id)

new_issue_2 = Issue.find_or_create_by(
  title: 'New Issue 2',
  description: 'New issue 2 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: new_issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_2.id,
  watched: false,
  progress: 40
)

IssueUser.find_or_create_by(issue_id: new_issue_2.id, user_id: client.id)

test_risk_2 = Risk.find_or_create_by(
  text: 'Test Risk 2',
  risk_description: 'Test Risk 2 description',
  impact_description: 'Test Risk 2 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  risk_approach_description: 'Test Risk 2 approach description',
  probability_description: 'Test Risk 2 probability description',
  user_id: admin.id,
  facility_project_id: facility_project_2.id,
  task_type_id: task_type.id,
  risk_stage_id: risk_stage.id,
  watched: true,
  progress: 40
)

RiskUser.find_or_create_by(risk_id: test_risk_2.id, user_id: admin.id)

new_risk_2 = Risk.find_or_create_by(
  text: 'New Risk 2',
  risk_description: 'New Risk 2 description',
  impact_description: 'New Risk 2 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  risk_approach_description: 'New Risk 2 approach description',
  probability_description: 'New Risk 2 probability description',
  user_id: client.id,
  facility_project_id: facility_project_2.id,
  task_type_id: task_type.id,
  risk_stage_id: new_risk_stage.id,
  watched: false,
  progress: 40
)

RiskUser.find_or_create_by(risk_id: new_risk_2.id, user_id: client.id)

facility_group_2 = FacilityGroup.find_or_create_by(
  name: 'Test Facility Group 2',
  code: 'TFG2',
  status: 'active'
)
facility_3 = Facility.find_or_create_by(
  facility_name: 'Test Facility 3',
  address: '2-20 Western Rd, Park Royal, London NW10 7LW, UK',
  point_of_contact: 'Test points',
  phone_number: '+447400123453',
  email: 'facility3@test.com',
  lat: '51.5285739',
  lng: '-0.2696692999999999' ,
  status: 'active',
  country_code: 'GB',
  creator_id: admin.id,
  facility_group_id: facility_group_2.id
)

facility_project_3 = FacilityProject.find_or_create_by(
  project_id: project.id,
  facility_id: facility_3.id,
  status_id: active_status.id,
  due_date: Date.today + 10.days
)

Note.find_or_create_by(
  noteable_type: 'FacilityProject',
  noteable_id: facility_project_3.id,
  user_id: admin.id,
  body: 'Test Note 3'
)

test_task_3 = Task.find_or_create_by(
  text: 'Test Task 3',
  description: 'Test task 3 description',
  start_date: Date.today - 1.day,
  due_date: Date.today + 4.days,
  task_type_id: task_type.id,
  task_stage_id: task_stage.id,
  facility_project_id: facility_project_3.id,
  watched: true,
  progress: 70
)

TaskUser.find_or_create_by(task_id: test_task_3.id, user_id: admin.id)

new_task_3 = Task.find_or_create_by(
  text: 'New Task 3',
  description: 'New task 3 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  task_type_id: task_type.id,
  task_stage_id: new_task_stage.id,
  facility_project_id: facility_project_3.id,
  watched: false,
  progress: 70
)

TaskUser.find_or_create_by(task_id: new_task_3.id, user_id: client.id)

test_issue_3 = Issue.find_or_create_by(
  title: 'Test Issue 3',
  description: 'Test issue 3 description',
  start_date: Date.today - 1.day,
  due_date: Date.today + 4.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_3.id,
  watched: true,
  progress: 70
)

IssueUser.find_or_create_by(issue_id: test_issue_3.id, user_id: admin.id)

new_issue_3 = Issue.find_or_create_by(
  title: 'New Issue 3',
  description: 'New issue 3 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: new_issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_3.id,
  watched: false,
  progress: 40
)

IssueUser.find_or_create_by(issue_id: new_issue_3.id, user_id: client.id)

test_risk_3 = Risk.find_or_create_by(
  text: 'Test Risk 3',
  risk_description: 'Test Risk 3 description',
  impact_description: 'Test Risk 3 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  risk_approach_description: 'Test Risk 3 approach description',
  probability_description: 'Test Risk 3 probability description',
  user_id: admin.id,
  facility_project_id: facility_project_3.id,
  task_type_id: task_type.id,
  risk_stage_id: risk_stage.id,
  watched: true,
  progress: 70
)

RiskUser.find_or_create_by(risk_id: test_risk_3.id, user_id: admin.id)

new_risk_3 = Risk.find_or_create_by(
  text: 'New Risk 3',
  risk_description: 'New Risk 3 description',
  impact_description: 'New Risk 3 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  risk_approach_description: 'New Risk 3 approach description',
  probability_description: 'New Risk 3 probability description',
  user_id: client.id,
  facility_project_id: facility_project_3.id,
  task_type_id: task_type.id,
  risk_stage_id: new_risk_stage.id,
  watched: false,
  progress: 40
)

RiskUser.find_or_create_by(risk_id: new_risk_3.id, user_id: client.id)

facility_4 = Facility.find_or_create_by(
  facility_name: 'Test Facility 4',
  address: 'Axford, Marlborough SN8, UK',
  point_of_contact: 'Test points',
  phone_number: '+447400123454',
  email: 'facility4@test.com',
  lat: '23.6966410',
  lng: '32.7181357' ,
  status: 'active',
  country_code: 'GB',
  creator_id: client.id,
  facility_group_id: facility_group_2.id
)

facility_project_4 = FacilityProject.find_or_create_by(
  project_id: project.id,
  facility_id: facility_4.id,
  status_id: inactive_status.id,
  due_date: Date.today + 10.days
)

Note.find_or_create_by(
  noteable_type: 'FacilityProject',
  noteable_id: facility_project_4.id,
  user_id: admin.id,
  body: 'Test Note 4'
)

test_task_4 = Task.find_or_create_by(
  text: 'Test Task 4',
  description: 'Test task description',
  start_date: Date.today + 2.days,
  due_date: Date.today + 7.days,
  task_type_id: task_type.id,
  task_stage_id: task_stage.id,
  facility_project_id: facility_project_4.id,
  progress: 100
)

TaskUser.find_or_create_by(task_id: test_task_4.id, user_id: admin.id)

new_task_4 = Task.find_or_create_by(
  text: 'New Task 4',
  description: 'New task 4 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  task_type_id: task_type.id,
  task_stage_id: new_task_stage.id,
  facility_project_id: facility_project_4.id,
  watched: false,
  progress: 70
)

TaskUser.find_or_create_by(task_id: new_task_4.id, user_id: client.id)
test_issue_4 = Issue.find_or_create_by(
  title: 'Test Issue 4',
  description: 'Test issue description',
  start_date: Date.today + 2.days,
  due_date: Date.today + 7.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_4.id,
  progress: 100
)

IssueUser.find_or_create_by(issue_id: test_issue_4.id, user_id: admin.id)

new_issue_4 = Issue.find_or_create_by(
  title: 'New Issue 4',
  description: 'New issue 4 description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  issue_type_id: issue_type.id,
  task_type_id: task_type.id,
  issue_stage_id: new_issue_stage.id,
  issue_severity_id: issue_severity.id,
  facility_project_id: facility_project_4.id,
  watched: false,
  progress: 40
)

IssueUser.find_or_create_by(issue_id: new_issue_4.id, user_id: client.id)

test_risk_4 = Risk.find_or_create_by(
  text: 'Test Risk 4',
  risk_description: 'Test Risk 4 description',
  impact_description: 'Test Risk 4 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  risk_approach_description: 'Test Risk 4 approach description',
  probability_description: 'Test Risk 4 probability description',
  user_id: admin.id,
  facility_project_id: facility_project_4.id,
  task_type_id: task_type.id,
  risk_stage_id: risk_stage.id,
  progress: 100
)

RiskUser.find_or_create_by(risk_id: test_risk_4.id, user_id: admin.id)

new_risk_4 = Risk.find_or_create_by(
  text: 'New Risk 4',
  risk_description: 'New Risk 4 description',
  impact_description: 'New Risk 4 impact description',
  start_date: Date.today + 1.day,
  due_date: Date.today + 6.days,
  risk_approach_description: 'New Risk 4 approach description',
  probability_description: 'New Risk 4 probability description',
  user_id: client.id,
  facility_project_id: facility_project_4.id,
  task_type_id: task_type.id,
  risk_stage_id: new_risk_stage.id,
  watched: false,
  progress: 40
)

RiskUser.find_or_create_by(risk_id: new_risk_4.id, user_id: client.id)