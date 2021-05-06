describe('Admin Panel Setting Password Generator', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openSettingAP()
    cy.get('[aria-controls="password_generator"] > #ui-id-3').contains('Password Generator').should('be.visible').click()
  })

  it('Click on Password Generator tab to open Password Generator  setting page', function() {
    cy.get('#password_generator').contains('Password Generator').should('be.visible')
    cy.get('#logout').click()
  })

  it('Input fields should not be editable until edit button press', function() {
    cy.get('.range > input').should('have.attr', 'readonly', 'readonly')
    cy.get(':nth-child(2) > label > input').should('have.attr', 'readonly', 'readonly')
    cy.get(':nth-child(3) > label > input').should('have.attr', 'readonly', 'readonly')
    cy.get(':nth-child(4) > label > input').should('have.attr', 'readonly', 'readonly')
    cy.get(':nth-child(5) > label > input').should('have.attr', 'readonly', 'readonly')
    cy.get('.edit-creds').click()
    cy.get('.range > input').should('not.have.attr', 'readonly')
    cy.get(':nth-child(2) > label > input').should('not.have.attr', 'readonly')
    cy.get(':nth-child(3) > label > input').should('not.have.attr', 'readonly')
    cy.get(':nth-child(4) > label > input').should('not.have.attr', 'readonly')
    cy.get(':nth-child(5) > label > input').should('not.have.attr', 'readonly')
    cy.get('#submit_settings').should('be.visible')
    cy.get('.edit-creds').should('have.class', 'vue__disabled')
    cy.get('#logout').click()
  })
})
