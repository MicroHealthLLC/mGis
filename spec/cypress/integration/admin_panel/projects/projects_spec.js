describe('Admin Panel Project', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openProjectAP()
  })

  it('Click on Projects on tabs open Project information page', function() {
    cy.get('#page_title').contains('Projects').should('be.visible')
    cy.get('#index_table_projects').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Open and close new Project form', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new project', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#project_name').type('New Test Project').should('have.value', 'New Test Project')
    cy.get('#project_submit_action').contains('Create Project').click()
    cy.get('.flashes').contains('Project created Successfully')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Could not Delete Project of foreign constraint', function() {
    cy.get('#index_table_projects').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Delete Project', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#project_name').type('New Test Project').should('have.value', 'New Test Project')
    cy.get('#project_submit_action').contains('Create Project').click()
    cy.get('#index_table_projects > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Project was successfully destroyed.').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Search Project contains name', function() {
    cy.get('#q_name').type('Test Project').should('have.value', 'Test Project')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Project').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
