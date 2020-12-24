describe('Sheet View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openSheet()
  })

  it('Open Sheet view to display the summary of project', function() {
    cy.get('[data-cy=sheets_view]').within(() => {
      cy.facilityRollup()
    })
    cy.logout()
  })
})
