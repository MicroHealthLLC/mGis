describe('Admin Panel Statuses', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openStatusAP()
  })

  it('Click on Statuses on tabs open Status information page', function() {
    cy.get('#page_title').contains('Statuses').should('be.visible')
    cy.get('#index_table_statuses').should('be.visible')
    cy.get('#index_table_statuses > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Open and close new Status form', function() {
    cy.get('.action_item > a').contains('New Status').click()
    cy.get('#page_title').contains('New Status').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Status', function() {
    cy.get('.action_item > a').contains('New Status').click()
    cy.get('#page_title').contains('New Status').should('be.visible')
    cy.get('#status_name').type('New Test Status').should('have.value', 'New Test Status')
    cy.get('#status_submit_action').contains('Create Status').click()
    cy.get('.flashes').contains('Status was successfully created.')
    cy.get('#index_table_statuses > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#logout').click()
  })

  it('Could not create new Status if name is blank', function() {
    cy.get('.action_item > a').contains('New Status').click()
    cy.get('#page_title').contains('New Status').should('be.visible')
    cy.get('#status_submit_action').contains('Create Status').click()
    // cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Status').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Status of foreign constraint', function() {
    cy.get('#index_table_statuses').should('be.visible')
    cy.get('#index_table_statuses > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_statuses > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Delete Status', function() {
    cy.get('.action_item > a').contains('New Status').click()
    cy.get('#status_name').type('New Test Status').should('have.value', 'New Test Status')
    cy.get('#status_submit_action').contains('Create Status').click()

    cy.get('#q_name').type('New Test Status').should('have.value', 'New Test Status')
    cy.get('[type=submit]').first().contains('Filter').click()

    cy.get('#index_table_statuses > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('#q_name').clear()
    cy.get('.flashes').contains('Status was successfully destroyed.').should('be.visible')
    cy.get('#index_table_statuses > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  // it('Sort Status according to Name', function() {
  //   cy.get('.sortable').contains('Name').click()
  //   cy.get('#index_table_statuses > tbody > tr').first().contains('Active').should('be.visible')
  //   cy.get('.sortable').contains('Name').click()
  //   cy.get('#index_table_statuses > tbody > tr').first().contains('Not Started').should('be.visible')
  //   cy.get('.sortable').contains('Name').click()
  //   cy.get('#index_table_statuses > tbody > tr').first().contains('Active').should('be.visible')
  //   cy.get('#logout').click()
  // })

  it('Search Status contains name', function() {
    cy.get('#q_name').type('InActive').should('have.value', 'InActive')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains InActive').should('be.visible')
    cy.get('#index_table_statuses > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search Status contains color', function() {
    cy.get('#q_color').type('0b8e1a').should('have.value', '0b8e1a')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Color contains 0b8e1a').should('be.visible')
    cy.get('#index_table_statuses > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
