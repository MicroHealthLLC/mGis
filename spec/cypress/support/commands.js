import '@4tw/cypress-drag-drop'

// Login command
Cypress.Commands.add("login", (email, password) => {
  cy.visit('/')
  cy.get('[data-cy=user_email]').type(email).should('have.value', email)
  cy.get('[data-cy=user_password]').type(password).should('have.value', password)
  cy.get('[data-cy=user_remember_me]').click()
  cy.get('[data-cy=submit]').click()
  cy.contains('Welcome to MicroHealth Geographical Information System').should('be.visible')
})

// Logout Command
Cypress.Commands.add("logout", () => {
  cy.get('[data-cy=logout]').click()
  cy.contains('You need to sign in before continuing.', { timeout: 60000 }).should('be.visible')
})

// Open first Project
Cypress.Commands.add("openProject", () => {
  cy.get('[data-cy=project_list_items]').first().click()
  // cy.get('#facility_view', { timeout: 60000 }).should('be.visible')
  cy.get('[data-cy=facility_list]', { timeout: 60000 }).should('be.visible')
  // cy.get('#facility_view').within(() => {
    // cy.get('[data-cy=facility_list]').contains('Facility Manager')
  // })
})

Cypress.Commands.add("facilityUnderGroup", () => {
  cy.get('[data-cy=facility_groups]').first().click()
  cy.get('[data-cy=facilities]').first().click({force: true})
})

// Open Facility Manager of a project
Cypress.Commands.add("openFacility", () => {
  cy.openProject()
  cy.facilityUnderGroup()
  cy.contains('Facility Summary')
})

// Open Teams page of a project
Cypress.Commands.add("openTeam", () => {
  cy.openProject()
  cy.get('[data-cy=team_tab]').contains('Team').should('be.visible').click()
})

// Open Kanban view of a project
Cypress.Commands.add("openKanban", () => {
  cy.openProject()
  cy.get('[data-cy=kanban_tab]').contains('Kanban').should('be.visible').click()
})

// Open Sheet view of a project
Cypress.Commands.add("openSheet", () => {
  cy.openProject()
  cy.get('[data-cy=sheets_tab]').contains('Sheets').should('be.visible').click()
})

// Open sheet of a facility
Cypress.Commands.add("openFacilitySheet", () => {
  cy.openSheet()
  cy.facilityUnderGroup()
})

// Open On watch view of a project
Cypress.Commands.add("openOnWatch", () => {
  cy.openProject()
  cy.get('[data-cy=on_watch_tab]').contains('On Watch').should('be.visible').click()
})

// Open map view of a project
Cypress.Commands.add("openMap", () => {
  cy.openProject()
  cy.get('[data-cy=map_tab]').contains('Map').should('be.visible').click()
})

// Open gantt view of a project
Cypress.Commands.add("openGantt", () => {
  cy.openProject()
  cy.get('[data-cy=gantt_tab]').contains('Gantt').should('be.visible').click()
})

// Open organization in admin panel
Cypress.Commands.add("openOrganization", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#organizations').contains('Organizations').click({force: true})
  })
})

// Open project from admin panel
Cypress.Commands.add("openProjectAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#projects').contains('Projects').click()
  })
})

// Open facility from Admin panel
Cypress.Commands.add("openFacilityAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#facilities').contains('Facilities').click()
  })
})

// Open Issue from Admin panel
Cypress.Commands.add("openIssueAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#issues').contains('Issues').click()
  })
})

// Open Task from Admin panel
Cypress.Commands.add("openTaskAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#tasks').contains('Tasks').click()
  })
})

// Open Risk from Admin panel
Cypress.Commands.add("openRiskAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#risks').contains('Risks').click()
  })
})

// Open Risk Stages from Admin panel
Cypress.Commands.add("openRiskStageAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#risk_stages').contains('Risk Stages').click({force: true})
  })
})

// Open User from Admin panel
Cypress.Commands.add("openUserAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#users').contains('Users').click()
  })
})

// Open Project Type from Admin panel
Cypress.Commands.add("openProjectTypeAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#project_types').contains('Project Types').click({force: true})
  })
})

// Open Facility Group from Admin panel
Cypress.Commands.add("openFacilityGroupAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#facility_groups').contains('Facility Groups').click({force: true})
  })
})

// Open Status from Admin panel
Cypress.Commands.add("openStatusAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#statuses').contains('Statuses').click({force: true})
  })
})

// Open Issue Severities from Admin panel
Cypress.Commands.add("openIssueSeverityAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#issue_severities').contains('Issue Severities').click({force: true})
  })
})

// Open Issue Stage from Admin panel
Cypress.Commands.add("openIssueStageAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#issue_stages').contains('Issue Stages').click({force: true})
  })
})

// Open Issue Type from Admin panel
Cypress.Commands.add("openIssueTypeAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#issue_types').contains('Issue Types').click({force: true})
  })
})

// Open Task Category from Admin panel
Cypress.Commands.add("openTaskCategoryAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#task_types').contains('Task Categories').click({force: true})
  })
})

// Open Task Stage from Admin panel
Cypress.Commands.add("openTaskStageAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#task_stages').contains('Task Stages').click({force: true})
  })
})

// Open Role from Admin panel
Cypress.Commands.add("openRoleAP", () => {
  cy.get('[data-cy=admin_panel]').click()
  cy.get('#tabs').within(() => {
    cy.get('#roles').contains('Roles').click({force: true})
  })
})
