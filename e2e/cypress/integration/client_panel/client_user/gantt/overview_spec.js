describe('Client do not have permission of Gantt view', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.appScenario('remove_gantt_view_permission')
    cy.login('client@test.com', 'T3$tClient')
  })

  it('Gantt tab not display in tab panel', function() {
    cy.openProject()
    cy.get('[data-cy=gantt_tab]').should('not.exist')
    cy.logout()
  })
})
