// All tasks related commands

// Open Tasks List of a facility
Cypress.Commands.add("tasksList", () => {
  cy.openFacility()
  cy.get('[data-cy=facility_tabs]').contains('Tasks').click()
})

// Create new task under a facility
Cypress.Commands.add("createNewTask", () => {
  var dayjs = require('dayjs')
  const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
  const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

  cy.get('[data-cy=new_task]').click()
  cy.contains('Task Name:')
  cy.get('[data-cy=task_name]').type('New test task').should('have.value', 'New test task')
  cy.get('[data-cy=task_description]').type('New test task description').should('have.value', 'New test task description')
  cy.get('[data-cy=task_type]').click().type('{enter}')
  cy.get('[data-cy=task_stage]').click().type('{enter}')

  cy.get('[data-cy=task_start_date]').type(`${start_date}{enter}`)
  cy.get('[data-cy=task_due_date]').type(`${due_date}{enter}`)

  cy.get('[data-cy=task_user]').click().type('{enter}')
  cy.get('[data-cy=task_save_btn]').should('not.be.disabled')
  cy.get('[data-cy=task_save_btn]').click()
  cy.get('[data-cy=task_list]').contains('New test task', {timeout: 60000}).should('be.visible')
})

// Open Kanban Tasks
Cypress.Commands.add("openKanbanTask", () => {
  cy.openKanban()
  cy.get('[data-cy=task_link]').within(() => {
    cy.contains('Tasks').should('be.visible').click()
  })
  // cy.facilityUnderGroup()
})

// Fill Task form
Cypress.Commands.add("fillKanbanTaskForm", () => {
  var dayjs = require('dayjs')
  const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
  const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

  cy.get('[data-cy=kanban]').within(() => {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
    })
  })

  cy.get('[data-cy=task_name]').type('New test task in kanban').should('have.value', 'New test task in kanban')
  cy.get('[data-cy=task_description]').type('Kanban task brief description').should('have.value', 'Kanban task brief description')

  cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')

  cy.get('[data-cy=task_start_date]').type(`${start_date}{enter}`)
  cy.get('[data-cy=task_due_date]').type(`${due_date}{enter}`)
})
