describe('Admin Panel Task', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openTaskAP()
  })

  it('Click on Tasks on tabs open Task information page', function() {
    cy.get('#page_title').contains('Tasks').should('be.visible')
    cy.get('#index_table_tasks').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Open and close new Task form', function() {
    cy.get('.action_item > a').contains('New Task').click()
    cy.get('#page_title').contains('New Task').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Delete Task', function() {
    cy.get('#index_table_tasks').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Task was successfully destroyed.').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 7)
    cy.get('#logout').click()
  })

  it('Sort Task according to Name', function() {
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Task 4').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('New Task 1').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Task 4').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task according to Task Category', function() {
    cy.get('.sortable').contains('Category').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Task Type(milestone)').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task according to Task Stage', function() {
    cy.get('.sortable').contains('Stage').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Task Stage').should('be.visible')
    cy.get('.sortable').contains('Stage').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('New Task Stage').should('be.visible')
    cy.get('.sortable').contains('Stage').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Task Stage').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task start date', function() {
    var dayjs = require('dayjs')
    const start_date_from = dayjs().subtract(1, 'day').format('MMMM DD, YYYY')
    const start_date_to = dayjs().add(2, 'day').format('MMMM DD, YYYY')
    cy.get('.sortable').contains('Start Date').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(start_date_to).should('be.visible')
    cy.get('.sortable').contains('Start Date').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(start_date_from).should('be.visible')
    cy.get('.sortable').contains('Start Date').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(start_date_to).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task Due Date', function() {
    var dayjs = require('dayjs')
    const due_date_from = dayjs().add(4, 'day').format('MMMM DD, YYYY')
    const due_date_to = dayjs().add(7, 'day').format('MMMM DD, YYYY')
    cy.get('.sortable').contains('Due Date').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(due_date_to).should('be.visible')
    cy.get('.sortable').contains('Due Date').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(due_date_from).should('be.visible')
    cy.get('.sortable').contains('Due Date').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(due_date_to).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task according to Progress', function() {
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(100).should('be.visible')
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(10).should('be.visible')
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains(100).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task according to Project', function() {
    cy.get('.sortable').contains('Project').click()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task according to Project', function() {
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Facility 4').should('be.visible')
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Facility 1').should('be.visible')
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_tasks > tbody > tr').first().contains('Test Facility 4').should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Task contains name', function() {
    cy.get('#q_text').type('Test Task 1').should('have.value', 'Test Task 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Task 1').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Task by Task Category', function() {
    cy.get('#index_table_tasks').should('be.visible')
    cy.get('#q_task_type_id').select('Test Task Type(milestone)')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_task_type_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Task by Task Stage', function() {
    cy.get('#index_table_tasks').should('be.visible')
    cy.get('#q_task_stage_id').select('Test Task Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#q_task_stage_id').select('New Task Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#q_task_stage_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Task start date from', function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('YYYY-MM-DD')
    cy.get('#q_start_date_gteq').type(`${start_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 6)
    cy.get('#logout').click()
  })

  it('Search Task start date to', function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().format('YYYY-MM-DD')
    cy.get('#q_start_date_lteq').type(`${start_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Search Task Due Date from', function() {
    var dayjs = require('dayjs')
    const completion_date = dayjs().add(6, 'day').format('YYYY-MM-DD')
    cy.get('#q_due_date_gteq').type(`${completion_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 6)
    cy.get('#logout').click()
  })

  it('Search Task Due Date to', function() {
    var dayjs = require('dayjs')
    const completion_date = dayjs().add(5, 'day').format('YYYY-MM-DD')
    cy.get('#q_due_date_lteq').type(`${completion_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Search Task by Project', function() {
    cy.get('#index_table_tasks').should('be.visible')
    cy.get('#q_facility_project_project_id').select('Test Project')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_facility_project_project_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Task contains Facility', function() {
    cy.get('#q_facility_project_facility_facility_name').type('Test Facility 1').should('have.value', 'Test Facility 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 2').should('have.value', 'Test Facility 2')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 3').should('have.value', 'Test Facility 3')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 4').should('have.value', 'Test Facility 4')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#logout').click()
  })

  it('Search Task contains Progress', function() {
    cy.get('#q_progress').type('10').should('have.value', '10')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 10').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#q_progress').clear().type('100').should('have.value', '100')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 100').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#q_progress').clear().type('40').should('have.value', '40')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 40').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_progress').clear().type('70').should('have.value', '70')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 70').should('be.visible')
    cy.get('#index_table_tasks > tbody > tr').its('length').should('be.eq', 4)

    cy.get('#logout').click()
  })
})
