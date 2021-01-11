describe('Admin Panel Project Types', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openProjectTypeAP()
  })

  it('Click on Project Types on tabs open Project Type information page', function() {
    cy.get('#page_title').contains('Project Types').should('be.visible')
    cy.get('#index_table_project_types').should('be.visible')
    cy.get('#index_table_project_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Open and close new Project Type form', function() {
    cy.get('.action_item > a').contains('New Project Type').click()
    cy.get('#page_title').contains('New Project Type').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new project Type', function() {
    cy.get('.action_item > a').contains('New Project Type').click()
    cy.get('#page_title').contains('New Project Type').should('be.visible')
    cy.get('#project_type_name').type('New Test Project Type').should('have.value', 'New Test Project Type')
    cy.get('#project_type_submit_action').contains('Create Project type').click()
    cy.get('.flashes').contains('Project type was successfully created.')
    cy.get('#index_table_project_types > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Could not create new Project Type if name is blank', function() {
    cy.get('.action_item > a').contains('New Project Type').click()
    cy.get('#page_title').contains('New Project Type').should('be.visible')
    cy.get('#project_type_submit_action').contains('Create Project type').click()
    cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Project Type').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Project type of foreign constraint', function() {
    cy.get('#index_table_project_types').should('be.visible')
    cy.get('#index_table_project_types > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_project_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Delete Project Type', function() {
    cy.get('.action_item > a').contains('New Project Type').click()
    cy.get('#project_type_name').type('New Test Project Type').should('have.value', 'New Test Project Type')
    cy.get('#project_type_submit_action').contains('Create Project type').click()
    cy.get('#index_table_project_types > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Project type was successfully destroyed.').should('be.visible')
    cy.get('#index_table_project_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Search Project type contains name', function() {
    cy.get('#q_name').type('Test Project Type').should('have.value', 'Test Project Type')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Project Type').should('be.visible')
    cy.get('#index_table_project_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
