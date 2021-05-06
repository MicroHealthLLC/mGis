// Toggle filter tab
Cypress.Commands.add("toggleFilterTab", () => {
  cy.get('[data-cy=advanced_filter]').contains('ADVANCED FILTERS').should('be.visible').click()
})
