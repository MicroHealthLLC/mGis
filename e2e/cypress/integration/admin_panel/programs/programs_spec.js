describe('Admin Panel Program', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openProgramAP()
  })

  it('Click on Programs on tabs open Program information page', function() {
    cy.get('#page_title').contains('Programs').should('be.visible')
    cy.get('#index_table_projects').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Open and close new Program form', function() {
    cy.get('.action_item > a').contains('New Program').click()
    cy.get('#page_title').contains('New Program').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Program', function() {
    cy.get('.action_item > a').contains('New Program').click()
    cy.get('#page_title').contains('New Program').should('be.visible')
    cy.get('#project_name').type('New Test Project').should('have.value', 'New Test Project')
    cy.get('#project_submit_action').contains('Create Program').click()
    cy.get('.flashes').contains('Program created Successfully')
    cy.get('#index_table_projects > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Delete Program', function() {
    cy.get('#index_table_projects').should('be.visible')
    cy.get('#index_table_projects > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Program was successfully destroyed.').should('be.visible')
    cy.get('#index_table_projects').should('not.exist')
    cy.get('#logout').click()
  })

  it('Sort Program according to Name', function() {
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_projects > tbody > tr').first().contains('Test Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Program according to Description', function() {
    cy.get('thead > tr > .col-description').contains('Description').click()
    cy.get('#index_table_projects > tbody > tr').first().contains('Test project description').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Program according to Project Type', function() {
    cy.get('.sortable').contains('Program Type').click()
    cy.get('#index_table_projects > tbody > tr').first().contains('Test Project Type').should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Program contains name', function() {
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
