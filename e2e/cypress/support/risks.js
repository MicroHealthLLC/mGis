// All Risks related commands

// Open Risks List of a facility
Cypress.Commands.add("risksList", () => {
  cy.openFacility()
  cy.get('[data-cy=facility_tabs]').contains('Risks').click()
})

// Open Kanban Risks
Cypress.Commands.add("openKanbanRisk", () => {
  cy.openKanban()
  cy.get('[data-cy=risk_link]').within(() => {
    cy.contains('Risks').should('be.visible').click()
  })
  cy.facilityUnderGroup()
})

// Fill Risk form
Cypress.Commands.add("fillRiskForm", () => {
  var dayjs = require('dayjs')
  const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
  const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

  cy.get('[data-cy=kanban]').within(() => {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
    })
  })

  cy.get('[data-cy=risk_description]').type('Kanban risk brief description').should('have.value', 'Kanban risk brief description')

  cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')

  cy.get('[data-cy=risk_start_date]').type(`${start_date}{enter}`)
  cy.get('[data-cy=risk_due_date]').type(`${due_date}{enter}`)

  cy.get('[data-cy=risk_name]').type('New test risk in kanban').should('have.value', 'New test risk in kanban')
})
