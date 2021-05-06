describe('Admin Panel Setting Google Maps', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openSettingAP()
    cy.get('[aria-controls="google_map"] > #ui-id-3').contains('Google Maps').should('be.visible').click()
  })

  it('Click on Google Maps tab to open Google Maps  setting page', function() {
    cy.get('#google_map').contains('Google Maps').should('be.visible')
    cy.get('#google_maps_key').should('be.visible')
    cy.get('#logout').click()
  })

  it('Input fields should not be editable until edit button press', function() {
    cy.get('#google_maps_key').should('have.attr', 'readonly', 'readonly')
    cy.get('.edit-creds').click()
    cy.get('#google_maps_key').should('not.have.attr', 'readonly')
    cy.get('#submit_settings').should('be.visible')
    cy.get('.edit-creds').should('have.class', 'vue__disabled')
    cy.get('#logout').click()
  })
})
