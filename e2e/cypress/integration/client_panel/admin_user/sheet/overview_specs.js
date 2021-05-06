describe('Sheet Overview Page', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openFacilitySheet()
  })

  it('Open Sheet overview to display the summary of a facility', function() {
    cy.get('[data-cy=facility_sheets]').within(() => {
      // cy.get('[data-cy=facility_tabs]').first().contains('Overview').should('be.visible')
      cy.contains('Project Group:').should('be.visible')
      cy.contains('Completion Date:').should('be.visible')
      cy.contains('Status:').should('be.visible')

      // In overview display task summary
      cy.get('[data-cy=facility_tasks]').scrollIntoView()
      cy.get('[data-cy=facility_tasks]').within(() => {
        cy.contains('TASKS').should('be.visible')
        cy.contains('2').should('be.visible')
      })

      // In overview display Issues summary
      cy.get('[data-cy=facility_issues]').scrollIntoView()
      cy.get('[data-cy=facility_issues]').within(() => {
        cy.contains('ISSUES').should('be.visible')
        cy.contains('2').should('be.visible')
      })

      // In overview display Issues summary
      cy.get('[data-cy=facility_risks]').scrollIntoView()
      cy.get('[data-cy=facility_risks]').within(() => {
        cy.contains('RISKS').should('be.visible')
        cy.contains('2').should('be.visible')
      })
    })
    cy.logout()
  })
})
