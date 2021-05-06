// check facility rollup
Cypress.Commands.add("facilityRollup", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.get('span > .d-inline').should('contain', 'Test Project')
    cy.get('.col-3 .badge').should('contain', '4')
    cy.contains('Projects Status').should('be.visible')

    // cy.get('[data-cy=date_set_filter]').within(() => {
    //   cy.contains('Data Set Filters').should('be.visible')
    // })

    // Display task summary
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.get('h5').should('contain', 'TASKS')
      cy.get('.float-right').should('contain', '7')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.get('h5').should('contain', 'ISSUES')
      cy.get('.float-right').should('contain', '7')
    })

    // Display Risks summary
    cy.get('[data-cy=risk_summary]').scrollIntoView()
    cy.get('[data-cy=risk_summary]').within(() => {
      cy.get('h5').should('contain', 'RISKS')
      cy.get('.float-right').should('contain', '7')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
      cy.contains('Project Groups').should('be.visible')
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('3 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('3 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('3 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('3 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('2 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('2 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
    })
  })
})

Cypress.Commands.add("facilityClientFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('2 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('2 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('6 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('2 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('6 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})

Cypress.Commands.add("issueUserFilter", () => {
  cy.get('[data-cy=facility_rollup]').within(() => {
    cy.contains('Facility Project Status').should('be.visible')
    cy.contains('2 Facilities').should('be.visible')

    cy.get('[data-cy=date_set_filter]').within(() => {
      cy.contains('Data Set Filters').should('be.visible')
    })

    // Display task summary
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('4 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('2 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('6 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('4 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
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
    cy.get('[data-cy=task_summary]').scrollIntoView()
    cy.get('[data-cy=task_summary]').within(() => {
      cy.contains('6 Tasks').should('be.visible')
      cy.contains('Task Categories').should('be.visible')
      cy.contains('Test Task Type(milestone)').should('be.visible')
    })

    // Display Issues summary
    cy.get('[data-cy=issue_summary]').scrollIntoView()
    cy.get('[data-cy=issue_summary]').within(() => {
      cy.contains('2 Issues').should('be.visible')
      cy.contains('Issue Types').should('be.visible')
      cy.contains('Test Issue Type').should('be.visible')
    })

    // Display Facility group summary
    cy.get('[data-cy=projet_group_summary]').scrollIntoView()
    cy.get('[data-cy=projet_group_summary]').within(() => {
      cy.contains('Facility Groups').should('be.visible')
      cy.contains('Test Facility Group 1').should('be.visible')
      cy.contains('Test Facility Group 2').should('be.visible')
    })
  })
})
