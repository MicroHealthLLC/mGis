describe('Kanban Tasks View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('client@test.com', 'T3$tClient')
    cy.openKanbanTask()
  })

  it('Open kanban tasks in a facility', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_col_title]').contains('Test Task Stage').should('be.visible')
      })
    })
    cy.logout()
  })

  it('Cannot open new Task form and edit/delete existing task', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_add_btn]').should('not.exist')
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=tasks]').first().click()
      })
    })
    cy.get('[data-cy=task_read_only_btn]').should('be.disabled')
    cy.get('[data-cy=task_save_btn]').should('not.exist')
    cy.get('[data-cy=task_delete_btn]').should('not.exist')
    cy.get('[data-cy=task_close_btn]').click({force: true})
    cy.logout()
  })

  it('Search task by typing title', function() {
    cy.get('[data-cy=search_tasks]').clear({force: true}).type('task is not in the list').should('have.value', 'task is not in the list')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=tasks]').should('not.exist')
    })

    cy.get('[data-cy=search_tasks]').clear({force: true}).type('Test task').should('have.value', 'Test task')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=tasks]').its('length').should('be.eq', 1)
    })

    cy.get('[data-cy=search_tasks]').clear({force: true})
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })
})
