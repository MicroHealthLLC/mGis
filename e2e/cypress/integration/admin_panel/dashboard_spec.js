describe('Admin Panel Dashboard', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
  })

  it('Click on Admin Panel redirect to admin dashboard', function() {
    cy.get('[data-cy=admin_panel]').click()
    cy.contains('Dashboard')
    cy.get('.blank_slate').contains('Welcome to Active Admin. This is the default dashboard page.')
    cy.get('#logout').click()
  })
})
