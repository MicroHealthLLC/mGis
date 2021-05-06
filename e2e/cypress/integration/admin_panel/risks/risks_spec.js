describe('Admin Panel Risk', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openRiskAP()
  })

  it('Click on Risks on tabs open Risk information page', function() {
    cy.get('#page_title').contains('Risks').should('be.visible')
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Open and close new Risk form', function() {
    cy.get('.action_item > a').contains('New Risk').click()
    cy.get('#page_title').contains('New Risk').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  // it('Create new Risk', function() {
  //   var dayjs = require('dayjs')
  //   const start_date = dayjs().add(1, 'day').format('YYYY-MM-DD')
  //   const due_date = dayjs().add(7, 'day').format('YYYY-MM-DD')
  //   cy.get('.action_item > a').contains('New Risk').click()
  //   cy.get('#page_title').contains('New Risk').should('be.visible')
  //   cy.get('#risk_text').type('New Test Risk').should('have.value', 'New Test Risk')
  //   cy.get('#risk_risk_description').type('Risk description').should('have.value', 'Risk description')
  //   cy.get('#risk_impact_description').type('Risk impact description').should('have.value', 'Risk impact description')
  //   cy.get('#risk_start_date').type(`${start_date}{enter}`)
  //   cy.get('#risk_due_date').type(`${due_date}{enter}`)
  //   cy.get('#risk_risk_approach_description').type('Risk approach description').should('have.value', 'Risk approach description')
  //   cy.get('#risk_submit_action').contains('Create Risk').click()
  //   cy.get('.flashes').contains('Risk was successfully created.')
  //   cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 7)
  //   cy.get('#logout').click()
  // })

  it('Delete Risk', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Risk was successfully destroyed.').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 7)
    cy.get('#logout').click()
  })

  it('Search Risk contains name', function() {
    cy.get('#q_text').type('Test Risk 1').should('have.value', 'Test Risk 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Risk 1').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Sort Risk identified date', function() {
    var dayjs = require('dayjs')
    const start_date_from = dayjs().format('MMMM DD, YYYY')
    const start_date_to = dayjs().add(1, 'day').format('MMMM DD, YYYY')
    cy.get('.sortable').contains('Identified Date').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(start_date_to).should('be.visible')
    cy.get('.sortable').contains('Identified Date').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(start_date_from).should('be.visible')
    cy.get('.sortable').contains('Identified Date').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(start_date_to).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk Due Date', function() {
    var dayjs = require('dayjs')
    const due_date_from = dayjs().add(5, 'day').format('MMMM DD, YYYY')
    const due_date_to = dayjs().add(6, 'day').format('MMMM DD, YYYY')
    cy.get('.sortable').contains('Due Date').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(due_date_to).should('be.visible')
    cy.get('.sortable').contains('Due Date').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(due_date_from).should('be.visible')
    cy.get('.sortable').contains('Due Date').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(due_date_to).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Progress', function() {
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(100).should('be.visible')
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(10).should('be.visible')
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(100).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Probability', function() {
    cy.get('.sortable').contains('Probability').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(1).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Impact Level', function() {
    cy.get('.sortable').contains('Impact Level').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(1).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Priority Level', function() {
    cy.get('.sortable').contains('Priority Level').click()
    cy.get('#index_table_risks > tbody > tr').first().contains(1).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Risk Approach', function() {
    cy.get('.sortable').contains('Risk Approach').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_risks > tbody > tr').first().contains('Avoid').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Project', function() {
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_risks > tbody > tr').first().contains('Test Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk according to Project', function() {
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_risks > tbody > tr').first().contains('Test Facility 4').should('be.visible')
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_risks > tbody > tr').first().contains('Test Facility 1').should('be.visible')
    cy.get('.sortable').contains('Project').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_risks > tbody > tr').first().contains('Test Facility 4').should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Risk contains name', function() {
    cy.get('#q_text').type('Test Risk 1').should('have.value', 'Test Risk 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Risk 1').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Risk by Risk Stage', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_risk_stage_id').select('Test Risk Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#q_risk_stage_id').select('New Risk Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#q_risk_stage_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Risk contains risk description', function() {
    cy.get('#q_risk_description').type('Test Risk 1 description').should('have.value', 'Test Risk 1 description')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Risk description contains Test Risk 1 description').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Risk contains risk impact description', function() {
    cy.get('#q_impact_description').type('Test Risk 1 impact description').should('have.value', 'Test Risk 1 impact description')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Impact description contains Test Risk 1 impact description').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Risk by Risk probability', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_probability').type(1)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Risk by Risk Impact level', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_impact_level').type(1)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Risk by Approach', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_risk_approach').select('avoid')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)

    cy.get('#q_risk_approach').select('mitigate')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('.blank_slate').contains('No Risks found').should('be.visible')

    cy.get('#q_risk_approach').select('transfer')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('.blank_slate').contains('No Risks found').should('be.visible')

    cy.get('#q_risk_approach').select('accept')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('.blank_slate').contains('No Risks found').should('be.visible')

    cy.get('#q_risk_approach').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Risk contains risk approach description', function() {
    cy.get('#q_risk_approach_description').type('Test Risk 1 approach description').should('have.value', 'Test Risk 1 approach description')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Risk approach description contains Test Risk 1 approach description').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Risk by Task Type', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_task_type_id').select('Test Task Type(milestone)')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_task_type_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Risk start date from', function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('YYYY-MM-DD')
    cy.get('#q_start_date_gteq').type(`${start_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 7)
    cy.get('#logout').click()
  })

  it('Search Risk start date to', function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().format('YYYY-MM-DD')
    cy.get('#q_start_date_lteq').type(`${start_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Search Risk Due Date from', function() {
    var dayjs = require('dayjs')
    const due_date = dayjs().add(6, 'day').format('YYYY-MM-DD')
    cy.get('#q_due_date_gteq').type(`${due_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 6)
    cy.get('#logout').click()
  })

  it('Search Risk Due Date to', function() {
    var dayjs = require('dayjs')
    const due_date = dayjs().add(5, 'day').format('YYYY-MM-DD')
    cy.get('#q_due_date_lteq').type(`${due_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Search Risk by Project', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_facility_project_project_id').select('Test Project')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_facility_project_project_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Task contains Facility', function() {
    cy.get('#q_facility_project_facility_facility_name').type('Test Facility 1').should('have.value', 'Test Facility 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 2').should('have.value', 'Test Facility 2')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 3').should('have.value', 'Test Facility 3')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 4').should('have.value', 'Test Facility 4')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#logout').click()
  })

  it('Search Risk by Owned by', function() {
    cy.get('#index_table_risks').should('be.visible')
    cy.get('#q_user_id').select('Test1 Admin')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 4)

    cy.get('#q_user_id').select('Test2 Client')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 4)

    cy.get('#q_user_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Risk contains Progress', function() {
    cy.get('#q_progress').type('10').should('have.value', '10')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 10').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#q_progress').clear().type('100').should('have.value', '100')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 100').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#q_progress').clear().type('40').should('have.value', '40')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 40').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 4)

    cy.get('#q_progress').clear().type('70').should('have.value', '70')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 70').should('be.visible')
    cy.get('#index_table_risks > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#logout').click()
  })
})
