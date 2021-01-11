describe('Kanban View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
    cy.openKanban()
  })

  it('Open kanban view to display the tasks and issues under each facility', function() {
    cy.get('[data-cy=facility_tabs]').within(() => {
      cy.contains('Tasks').should('be.visible')
      cy.contains('Issues').should('be.visible')
      // cy.contains('Risks').should('be.visible')
    })
    cy.logout()
  })
})

describe('Client do not have permission of kanban view', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.appScenario('remove_kanban_view_permission')
    cy.login('client@test.com', 'T3$tClient')
  })

  it('kanban tab not display in tab panel', function() {
    cy.openProject()
    cy.get('[data-cy=kanban_tab]').should('not.exist')
    cy.logout()
  })
})
