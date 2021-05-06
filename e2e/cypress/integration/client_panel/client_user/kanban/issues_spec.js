describe('Kanban Issues View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
    cy.openKanbanIssue()
  })

  it('Open kanban issues in a facility', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col_title]').contains('Test Issue Stage').should('be.visible')
    })
    cy.logout()
  })

  it('Cannot open new Issue form and edit/delete existing issue', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_add_btn]').should('not.exist')
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=issues]').first().click()
      })
    })
    cy.get('[data-cy=issue_read_only_btn]').should('be.disabled')
    cy.get('[data-cy=issue_save_btn]').should('not.exist')
    cy.get('[data-cy=issue_delete_btn]').should('not.exist')
    cy.get('[data-cy=issue_close_btn]').click({force: true})
    cy.logout()
  })

  it('Search issue by typing title', function() {
    cy.get('[data-cy=search_issues]').clear({force: true}).type('Issue is not in the list').should('have.value', 'Issue is not in the list')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=issues]').should('not.exist')
    })

    cy.get('[data-cy=search_issues]').clear({force: true}).type('Test Issue').should('have.value', 'Test Issue')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=issues]').its('length').should('be.eq', 1)
    })

    cy.get('[data-cy=search_issues]').clear({force: true})
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=issues]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })
})
