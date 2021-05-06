describe('Projects List', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
  })

  it('Display list of projects', function() {
    cy.get('[data-cy=project_list_items]').first().within(() => {
      cy.get('[data-cy=project_name]').should('contain', 'Test Project')
      cy.get('[data-cy=project_count]').should('contain', 'PROJECTS: 4')
      cy.get('[data-cy=user_count]').should('contain', 'USERS: 2')
      cy.get('[data-cy=actions]').should('contain', 'Actions')
      cy.get('[data-cy=progress]').should('contain', 'Progress')
      cy.get('[data-cy=tasks]').should('contain', 'TASKS')
      cy.get('[data-cy=issues]').should('contain', 'ISSUES')
      cy.get('[data-cy=risks]').should('contain', 'RISKS')
      cy.get('[data-cy=overall_progress]').should('contain', 'Overall Program Progress')
    })
    cy.get('[data-cy=project_list_items]').its('length').should('be.eq', 1)
    cy.logout()
  })

  it('Open a particular project', function() {
    cy.openProject()
    cy.get('[data-cy=facility_rollup]').within(() => {
      cy.contains('Test Project').should('be.visible')
      cy.contains('4').should('be.visible')
    })
    cy.logout()
  })

  it('Open a facility of a project', function() {
    cy.openFacility()
    cy.facilityRollup()
    cy.logout()
  })
})
