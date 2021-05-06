describe('Map Page', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
    cy.openMap()
  })

  it('Open Map overview to display the summary of a Project', function() {
    cy.facilityRollup()
    cy.logout()
  })
})

describe('Client do not have permission of map view', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.appScenario('remove_map_view_permission')
    cy.login('client@test.com', 'T3$tClient')
  })

  it('Map tab not display in tab panel', function() {
    cy.openProject()
    cy.get('[data-cy=map_tab]').should('not.exist')
    cy.logout()
  })
})
