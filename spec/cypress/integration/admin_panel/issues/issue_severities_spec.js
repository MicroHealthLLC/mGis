describe('Admin Panel Issue Severities', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openIssueSeverityAP()
  })

  it('Click on Issue Severities on tabs open Issue Severity information page', function() {
    cy.get('#page_title').contains('Issue Severities').should('be.visible')
    cy.get('#index_table_issue_severities').should('be.visible')
    cy.get('#index_table_issue_severities > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Open and close new Issue Severity form', function() {
    cy.get('.action_item > a').contains('New Issue Severity').click()
    cy.get('#page_title').contains('New Issue Severity').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Issue Severity', function() {
    cy.get('.action_item > a').contains('New Issue Severity').click()
    cy.get('#page_title').contains('New Issue Severity').should('be.visible')
    cy.get('#issue_severity_name').type('New Test Issue Severity')
    cy.get('#issue_severity_submit_action').contains('Create Issue severity').click()
    cy.get('.flashes').contains('Issue severity was successfully created.')
    cy.get('#index_table_issue_severities > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Could not create new Issue Severity if name is blank', function() {
    cy.get('.action_item > a').contains('New Issue Severity').click()
    cy.get('#page_title').contains('New Issue Severity').should('be.visible')
    cy.get('#issue_severity_submit_action').contains('Create Issue severity').click()
    // cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Issue Severity').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Issue severity of foreign constraint', function() {
    cy.get('#index_table_issue_severities').should('be.visible')
    cy.get('#index_table_issue_severities > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_issue_severities').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })

  it('Delete Issue Severity', function() {
    cy.get('.action_item > a').contains('New Issue Severity').click()
    cy.get('#issue_severity_name').type('New Test Issue Severity')
    cy.get('#issue_severity_submit_action').contains('Create Issue severity').click()
    cy.get('#index_table_issue_severities > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Issue severity was successfully destroyed.').should('be.visible')
    cy.get('#index_table_issue_severities > tbody > tr').its('length').should('be.eq', 1)
    cy.get('#logout').click()
  })
})
