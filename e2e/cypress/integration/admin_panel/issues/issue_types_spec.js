describe('Admin Panel Issue Types', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openIssueTypeAP()
  })

  it('Click on Issue Types on tabs open Issue Type information page', function() {
    cy.get('#page_title').contains('Issue Types').should('be.visible')
    cy.get('#index_table_issue_types').should('be.visible')
    cy.get('#index_table_issue_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Open and close new Issue Type form', function() {
    cy.get('.action_item > a').contains('New Issue Type').click()
    cy.get('#page_title').contains('New Issue Type').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Issue Type', function() {
    cy.get('.action_item > a').contains('New Issue Type').click()
    cy.get('#page_title').contains('New Issue Type').should('be.visible')
    cy.get('#issue_type_name').type('New Test Issue Type').should('have.value', 'New Test Issue Type')
    cy.get('#issue_type_submit_action').contains('Create Issue type').click()
    cy.get('.flashes').contains('Issue type was successfully created.')
    cy.get('#index_table_issue_types > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Could not create new Issue Type if name is blank', function() {
    cy.get('.action_item > a').contains('New Issue Type').click()
    cy.get('#page_title').contains('New Issue Type').should('be.visible')
    cy.get('#issue_type_submit_action').contains('Create Issue type').click()
    // cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Issue Type').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Issue type of foreign constraint', function() {
    cy.get('#index_table_issue_types').should('be.visible')
    cy.get('#index_table_issue_types > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_issue_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Delete Issue Type', function() {
    cy.get('.action_item > a').contains('New Issue Type').click()
    cy.get('#issue_type_name').type('New Test Issue Type').should('have.value', 'New Test Issue Type')
    cy.get('#issue_type_submit_action').contains('Create Issue type').click()
    cy.get('#index_table_issue_types > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Issue type was successfully destroyed.').should('be.visible')
    cy.get('#index_table_issue_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Sort Issue Type according to Name', function() {
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_issue_types > tbody > tr').first().contains('Test Issue Type').should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Issue Type contains name', function() {
    cy.get('#q_name').type('Test Issue Type').should('have.value', 'Test Issue Type')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Issue Type').should('be.visible')
    cy.get('#index_table_issue_types > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
