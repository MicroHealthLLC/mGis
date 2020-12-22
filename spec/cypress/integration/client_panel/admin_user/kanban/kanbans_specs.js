describe('Kanban View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openKanban()
  })

  it('Open kanban view to display the tasks and issues under each facility', function() {
    cy.get('[data-cy=facility_tabs]').within(() => {
      cy.contains('Kanban Tasks').should('be.visible')
      cy.contains('Kanban Issues').should('be.visible')
    })
    cy.logout()
  })
})