describe('Sheets Notes View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
    cy.openFacilitySheet()
    cy.get('#customtabs > :nth-child(5)').contains('Notes').should('be.visible').click()
  })

  it('Open Sheets notes in a facility', function() {
    cy.get('[data-cy=search_notes]').should('be.visible')
    cy.get('[data-cy=notes]').should('be.visible')
    cy.logout()
  })

  it('Search note by typing title', function() {
    cy.get('[data-cy=notes]').its('length').should('be.eq', 1)
    cy.get('[data-cy=search_notes]').clear().type('Note is not in the list').should('have.value', 'Note is not in the list')
    cy.contains('No notes found..').should('be.visible')

    cy.get('[data-cy=search_notes]').clear().type('Test Note').should('have.value', 'Test Note')

    cy.get('[data-cy=notes]').its('length').should('be.eq', 1)
    cy.get('[data-cy=search_notes]').clear()

    cy.get('[data-cy=notes]').its('length').should('be.eq', 1)
    cy.logout()
  })
})
