describe('Kanban View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
  })

  it('Open kanban view without selecting any project', function() {
    cy.openProject()
    cy.get('[data-cy=kanban_tab]').contains('Kanban').should('be.visible').click()
    cy.get('.el-card__body').contains('Please select a project.').should('be.visible')
    cy.logout()
  })

  it('Open kanban view to display the tasks and issues under each facility', function() {
    cy.openKanban()
    cy.get('[data-cy=task_link]').contains('Tasks').should('be.visible')
    cy.get('[data-cy=issue_link]').contains('Issues').should('be.visible')
    cy.get('[data-cy=risk_link]').contains('Risks').should('be.visible')
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
