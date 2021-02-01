describe('Admin Panel Roles', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openRoleAP()
  })

  it('Click on Roles on tabs open roles information page', function() {
    cy.get('#page_title').contains('Roles').should('be.visible')
    cy.get('#index_table_roles').should('be.visible')
    cy.get('#index_table_roles > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Open and close new Role form', function() {
    cy.get('.action_item > a').contains('New Role').click()
    cy.get('#page_title').contains('New Role').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Could not create new Role if name is blank', function() {
    cy.get('.action_item > a').contains('New Role').click()
    cy.get('#page_title').contains('New Role').should('be.visible')
    cy.get('#role_submit_action').contains('Create Role').click()
    cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Role').should('be.visible')
    cy.get('#logout').click()
  })

  it('Delete Role with foreign constraint', function() {
    cy.get('#index_table_roles').should('be.visible')
    cy.get('#index_table_roles > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Role was successfully destroyed.').should('be.visible')
    cy.get('#index_table_roles > tbody > tr').its('length').should('be.eq', 1)

    cy.get('#index_table_roles > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Role was successfully destroyed.').should('be.visible')
    cy.get('.blank_slate').contains('There are no Roles yet. Create one').should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Role contains name', function() {
    cy.get('#q_name').type('client').should('have.value', 'client')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains client').should('be.visible')
    cy.get('#index_table_roles > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Sort Role according to name', function() {
    cy.get('#index_table_roles > tbody > tr').first().contains('client').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_roles > tbody > tr').first().contains('superadmin').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_roles > tbody > tr').first().contains('client').should('be.visible')
    cy.get('#logout').click()
  })
})
