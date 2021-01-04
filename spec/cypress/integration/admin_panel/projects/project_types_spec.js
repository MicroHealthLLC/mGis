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
    cy.get('#project_type_name').type('New Test Project Type')
    cy.get('#project_type_submit_action').contains('Create Project type').click()
    cy.get('.flashes').contains('Project type was successfully created.')
    cy.get('#index_table_project_types > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })
})
