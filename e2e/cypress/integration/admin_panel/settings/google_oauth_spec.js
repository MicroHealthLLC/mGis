describe('Admin Panel Setting Google OAuth', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openSettingAP()
    cy.get('#ui-id-2').contains('Google OAuth').should('be.visible').click()
  })

  it('Click on Google OAuth tab to open Google OAuth  setting page', function() {
    cy.get('#google_oauth').contains('Google OAuth').should('be.visible')
    cy.get('#google_oauth_key').should('be.visible')
    cy.get('#google_oauth_secret').should('be.visible')
    cy.get('#logout').click()
  })

  it('Input fields should not be editable until edit button press', function() {
    cy.get('#google_oauth_key').should('have.attr', 'readonly', 'readonly')
    cy.get('#google_oauth_secret').should('have.attr', 'readonly', 'readonly')
    cy.get('.edit-creds').click()
    cy.get('#google_oauth_key').should('not.have.attr', 'readonly')
    cy.get('#google_oauth_secret').should('not.have.attr', 'readonly')
    cy.get('#submit_settings').should('be.visible')
    cy.get('.edit-creds').should('have.class', 'vue__disabled')
    cy.get('#logout').click()
  })
})
