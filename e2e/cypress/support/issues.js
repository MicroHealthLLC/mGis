// All Issues related commands

// Open Issues List of a facility
Cypress.Commands.add('issueList', () => {
  cy.openFacility()
  cy.get('[data-cy=facility_tabs]').contains('Issues').click()
})

// Create new issue under a facility
Cypress.Commands.add("createNewIssue", () => {
  var dayjs = require('dayjs')
  const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
  const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

  cy.get('[data-cy=new_issue]').click()
  cy.contains('Issue Name:')
  cy.get('[data-cy=issue_title]').type('New test issue').should('have.value', 'New test issue')
  cy.get('[data-cy=issue_description]').type('New test issue description').should('have.value', 'New test issue description')
  cy.get('[data-cy=issue_type]').click().type('{enter}')
  cy.get('[data-cy=issue_severity]').click().type('{enter}')
  cy.get('[data-cy=issue_stage]').click().type('{enter}')

  cy.get('[data-cy=issue_start_date]').type(`${start_date}{enter}`)
  cy.get('[data-cy=issue_due_date]').type(`${due_date}{enter}`)

  cy.get('[data-cy=issue_user]').click().type('{enter}')
  cy.get('[data-cy=issue_save_btn]').should('not.be.disabled')
  cy.get('[data-cy=issue_save_btn]').click()
  cy.get('[data-cy=task_list]').contains('New test issue', {timeout: 60000}).should('be.visible')
})

// Open Kanban Isuues
Cypress.Commands.add("openKanbanIssue", () => {
  cy.openKanban()
  cy.get('[data-cy=issue_link]').within(() => {
    cy.contains('Issues').should('be.visible').click()
  })
  // cy.facilityUnderGroup()
})

// Fill Issue form
Cypress.Commands.add("fillKanbanIssueForm", () => {
  var dayjs = require('dayjs')
  const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
  const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

  cy.get('[data-cy=kanban]').within(() => {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
    })
  })

  cy.get('[data-cy=issue_title]').type('New test issue in kanban').should('have.value', 'New test issue in kanban')
  cy.get('[data-cy=issue_description]').type('Kanban Issue brief description').should('have.value', 'Kanban Issue brief description')

  cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')
  cy.get('[data-cy=issue_type_field]').click().type('{downarrow}{enter}')
  cy.get('[data-cy=issue_severity]').click().type('{downarrow}{enter}')

  cy.get('[data-cy=issue_start_date]').type(`${start_date}{enter}`)
  cy.get('[data-cy=issue_due_date]').type(`${due_date}{enter}`)
})
