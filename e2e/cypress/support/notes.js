// All notes related commands

// Open Notes List of a facility
Cypress.Commands.add("notesList", () => {
  cy.openFacility()
  cy.get('[data-cy=facility_tabs]').contains('Notes').click()
})

// Create new note under a facility
Cypress.Commands.add("createNewNote", () => {
  cy.get('[data-cy=new_note]').click()
  cy.get('[data-cy=note_save_btn]').should('be.disabled')
  cy.get('[data-cy=note_details]').type('New test note').should('have.value', 'New test note')
  cy.get('[data-cy=note_save_btn]').should('not.be.disabled')
  cy.get('[data-cy=note_save_btn]').click()
})
