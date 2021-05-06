describe('Sheets Notes View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openFacilitySheet()
    cy.get('#customtabs > :nth-child(5)').contains('Notes').should('be.visible').click()
  })

  it('Open Sheets notes in a facility', function() {
    cy.get('[data-cy=search_notes]').should('be.visible')
    cy.get('[data-cy=new_note]').should('be.visible')
    cy.get('[data-cy=notes]').should('be.visible')
    cy.logout()
  })

  it('Open and Close note form sheet view', function() {
    cy.get('[data-cy=new_note]').should('be.exist').click({force: true})
    cy.get('[data-cy=note_save_btn]').should('be.exist')
    cy.get('[data-cy=note_close_btn]').should('be.exist').click({force: true})
    cy.logout()
  })

  it('Open note from sheet note table', function() {
    cy.get('[data-cy=notes]').within(() => {
      cy.get('.notes_show').first().within(() => {
        cy.get('[data-cy=note_edit_icon]').click({force: true})
      })
    })
    cy.get('[data-cy=note_close_btn]').should('be.exist').click({force: true})
    cy.logout()
  })

  it('Update note from sheet note table', function() {
    cy.get('[data-cy=notes]').within(() => {
      cy.get('.notes_show').first().within(() => {
        cy.get('[data-cy=note_edit_icon]').click({force: true})
      })
    })
    cy.get('[data-cy=note_details]').clear({force: true}).type('Updated new test note', {force: true}).should('have.value', 'Updated new test note')
    cy.get('[data-cy=note_save_btn]').click({force: true})
    cy.wait(1000)
    cy.get('[data-cy=note_close_btn]').click({force: true})
    cy.reload()
    cy.get('.notes_show').contains('Updated new test note').should('be.exist')
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
