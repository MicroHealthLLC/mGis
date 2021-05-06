describe('Admin Panel Settings', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openSettingAP()
  })

  it('Click on Setting to open setting information page', function() {
    cy.get('#ui-id-1').contains('Office 365').should('be.visible')
    cy.get('#ui-id-2').contains('Google OAuth').should('be.visible')
    cy.get('[aria-controls="google_map"] > #ui-id-3').contains('Google Maps').should('be.visible')
    cy.get('[aria-controls="password_generator"] > #ui-id-3').contains('Password Generator').should('be.visible')
    cy.get('#logout').click()
  })

  it('Input fields should not be editable until edit button press', function() {
    cy.get('#office365_key').should('have.attr', 'readonly', 'readonly')
    cy.get('.edit-creds').click()
    cy.get('#office365_key').should('not.have.attr', 'readonly')
    cy.get('#submit_settings').should('be.visible')
    cy.get('.edit-creds').should('have.class', 'vue__disabled')
    cy.get('#logout').click()
  })
})
