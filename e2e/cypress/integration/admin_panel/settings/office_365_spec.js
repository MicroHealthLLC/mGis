describe('Admin Panel Setting Office 365', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openSettingAP()
    cy.get('#ui-id-1').contains('Office 365').should('be.visible').click()
  })

  it('Click on Office 365 tab to open office setting page', function() {
    cy.get('#office365').contains('Office 365').should('be.visible')
    cy.get('#office365_key').should('be.visible')
    cy.get('#office365_secret').should('be.visible')
    cy.get('#logout').click()
  })

  it('Input fields should not be editable until edit button press', function() {
    cy.get('#office365_key').should('have.attr', 'readonly', 'readonly')
    cy.get('#office365_secret').should('have.attr', 'readonly', 'readonly')
    cy.get('.edit-creds').click()
    cy.get('#office365_key').should('not.have.attr', 'readonly')
    cy.get('#office365_secret').should('not.have.attr', 'readonly')
    cy.get('#submit_settings').should('be.visible')
    cy.get('.edit-creds').should('have.class', 'vue__disabled')
    cy.get('#logout').click()
  })
})
