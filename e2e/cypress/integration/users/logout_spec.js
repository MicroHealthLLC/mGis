describe('Logout', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
  })

  it('Logout current user and redirect to sign in page', function() {
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.contains('Welcome, Test1!')
    cy.get('[data-cy=logout]').click()
    cy.contains('You need to sign in before continuing.')
  })
})
