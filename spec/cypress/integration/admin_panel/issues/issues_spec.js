describe('Admin Panel Issue', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openIssueAP()
  })

  it('Click on Issues on tabs open Issue information page', function() {
    cy.get('#page_title').contains('Issues').should('be.visible')
    cy.get('#index_table_issues').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Delete Issue', function() {
    cy.get('#index_table_issues').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Issue was successfully destroyed.').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 7)
    cy.get('#logout').click()
  })

  it('Delete all Issue', function() {
    cy.get('.disabled').contains('Batch Actions').should('be.visible')
    cy.get('#collection_selection_toggle_all').click()
    cy.get('.dropdown_menu_button').click()
    cy.get('.batch_action').contains('Delete Selected').click()
    cy.get('.ui-dialog-buttonset > :nth-child(1)').contains('OK').click()
    cy.get('.flashes').contains('Successfully deleted 8 Issues').should('be.visible')
    cy.get('.blank_slate').contains('There are no Issues yet.').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Title', function() {
    cy.get('.sortable').contains('Title').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Issue 4').should('be.visible')
    cy.get('.sortable').contains('Title').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('New Issue 1').should('be.visible')
    cy.get('.sortable').contains('Title').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Issue 4').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Issue Type', function() {
    cy.get('.sortable').contains('Issue Type').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Issue Type').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Issue Severity', function() {
    cy.get('.sortable').contains('Issue Severity').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Issue Severity').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Issue Stage', function() {
    cy.get('.sortable').contains('Issue Stage').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Issue Stage').should('be.visible')
    cy.get('.sortable').contains('Issue Stage').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('New Issue Stage').should('be.visible')
    cy.get('.sortable').contains('Issue Stage').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Issue Stage').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Progress', function() {
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(100).should('be.visible')
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(10).should('be.visible')
    cy.get('.sortable').contains('Progress').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(100).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue start date', function() {
    const start_date_from = Cypress.moment().subtract(1, 'day').format('MMMM DD, YYYY')
    const start_date_to = Cypress.moment().add(2, 'day').format('MMMM DD, YYYY')
    cy.get('.sortable').contains('Start Date').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(start_date_to).should('be.visible')
    cy.get('.sortable').contains('Start Date').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(start_date_from).should('be.visible')
    cy.get('.sortable').contains('Start Date').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(start_date_to).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue Estimated Completion Date', function() {
    const due_date_from = Cypress.moment().add(4, 'day').format('MMMM DD, YYYY')
    const due_date_to = Cypress.moment().add(7, 'day').format('MMMM DD, YYYY')
    cy.get('.sortable').contains('Estimated Completion Date').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(due_date_to).should('be.visible')
    cy.get('.sortable').contains('Estimated Completion Date').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(due_date_from).should('be.visible')
    cy.get('.sortable').contains('Estimated Completion Date').click()
    cy.get('#index_table_issues > tbody > tr').first().contains(due_date_to).should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Project', function() {
    cy.get('.sortable').contains('Project').click()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Issue according to Facility', function() {
    cy.get('.sortable').contains('Facility').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Facility 4').should('be.visible')
    cy.get('.sortable').contains('Facility').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Facility 1').should('be.visible')
    cy.get('.sortable').contains('Facility').click()
    cy.get('.sortable').last().scrollIntoView()
    cy.get('#index_table_issues > tbody > tr').first().contains('Test Facility 4').should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Issue contains name', function() {
    cy.get('#q_title').type('Test Issue 1').should('have.value', 'Test Issue 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Title contains Test Issue 1').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Issue by Issue Type', function() {
    cy.get('#index_table_issues').should('be.visible')
    cy.get('#q_issue_type_id').select('Test Issue Type')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_issue_type_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Issue by Issue Severity', function() {
    cy.get('#index_table_issues').should('be.visible')
    cy.get('#q_issue_severity_id').select('Test Issue Severity')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_issue_severity_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Issue by Issue Stage', function() {
    cy.get('#index_table_issues').should('be.visible')
    cy.get('#q_issue_stage_id').select('Test Issue Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#q_issue_stage_id').select('New Issue Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#q_issue_stage_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Issue contains Progress', function() {
    cy.get('#q_progress').type('10').should('have.value', '10')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 10').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#q_progress').clear().type('100').should('have.value', '100')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 100').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#q_progress').clear().type('40').should('have.value', '40')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 40').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 4)

    cy.get('#q_progress').clear().type('70').should('have.value', '70')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('.current_filter').contains('Progress equals 70').should('be.visible')
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#logout').click()
  })

  it('Search Issue start date from', function() {
    const start_date = Cypress.moment().add(1, 'day').format('YYYY-MM-DD')
    cy.get('#q_start_date_gteq').type(`${start_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 5)
    cy.get('#logout').click()
  })

  it('Search Issue start date to', function() {
    const start_date = Cypress.moment().format('YYYY-MM-DD')
    cy.get('#q_start_date_lteq').type(`${start_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Search Issue Estimated Completion Date from', function() {
    const completion_date = Cypress.moment().add(6, 'day').format('YYYY-MM-DD')
    cy.get('#q_due_date_gteq').type(`${completion_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 5)
    cy.get('#logout').click()
  })

  it('Search Issue Estimated Completion Date to', function() {
    const completion_date = Cypress.moment().add(5, 'day').format('YYYY-MM-DD')
    cy.get('#q_due_date_lteq').type(`${completion_date}{enter}`)
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Search Issue by Project', function() {
    cy.get('#index_table_issues').should('be.visible')
    cy.get('#q_facility_project_project_id').select('Test Project')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#q_facility_project_project_id').select('Any')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 8)
    cy.get('#logout').click()
  })

  it('Search Issue contains Facility', function() {
    cy.get('#q_facility_project_facility_facility_name').type('Test Facility 1').should('have.value', 'Test Facility 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 2').should('have.value', 'Test Facility 2')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 3').should('have.value', 'Test Facility 3')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#q_facility_project_facility_facility_name').clear().type('Test Facility 4').should('have.value', 'Test Facility 4')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#index_table_issues > tbody > tr').its('length').should('be.eq', 2)

    cy.get('#logout').click()
  })
})
