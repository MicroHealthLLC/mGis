describe('Sheet View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
    cy.openSheet()
  })

  it('Open Sheet view to display the summary of project', function() {
    cy.facilityRollup()
    cy.logout()
  })
})

describe('Client do not have permission of sheets view', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.appScenario('remove_sheets_view_permission')
    cy.login('client@test.com', 'T3$tClient')
  })

  it('Sheets tab not display in tab panel', function() {
    cy.openProject()
    cy.get('[data-cy=sheets_tab]').should('not.exist')
    cy.logout()
  })
})
