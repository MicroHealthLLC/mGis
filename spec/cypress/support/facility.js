// check facility rollup
Cypress.Commands.add("facilityRollup", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Project Type: Test Project Type').should('be.visible')
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('7 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('7 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("activeProjectStatus", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Project Type: Test Project Type').should('be.visible')
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('2 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
      cy.contains('Project Status: Active').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("inActiveProjectStatus", () => {
  cy.get('[data-cy=facility_rollup]').scrollIntoView()
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('2 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
      cy.contains('Project Status: InActive').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("facilityGroupFilter", () => {
  cy.get('[data-cy=facility_rollup]').scrollIntoView()
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('2 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
    })
  })
})

Cypress.Commands.add("facilityNameFilter", () => {
  cy.get('[data-cy=facility_rollup]').scrollIntoView()
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('1 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('2 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('2 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
    })
  })
})

Cypress.Commands.add("facilityClientFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('8 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
    })
  })
})

Cypress.Commands.add("testTaskStageFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('8 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("testNewTaskStageFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('2 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('6 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("issueUserFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('8 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
    })
  })
})

Cypress.Commands.add("testIssueStageFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('8 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("testNewIssueStageFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('6 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('2 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("taskCategoryAndIssueTypeFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Project Type: Test Project Type').should('be.visible')
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('4 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=tasks_summary]').scrollIntoView()
    cy.get('[data-cy=tasks_summary]').within(() => {
      cy.contains('7 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issues_summary]').scrollIntoView()
    cy.get('[data-cy=issues_summary]').within(() => {
      cy.contains('7 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=facility_group_summary]').scrollIntoView()
    cy.get('[data-cy=facility_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})
