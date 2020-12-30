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
})
