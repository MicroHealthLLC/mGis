describe('Kanban View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
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
