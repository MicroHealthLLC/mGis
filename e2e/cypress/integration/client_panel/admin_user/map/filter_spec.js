// describe('Apply filters in Map Page', function() {
//   beforeEach(() => {
//     cy.app('clean')
//     cy.appScenario('basic')
//     cy.login('admin@test.com', 'T3$tAdmin')
//     cy.openMap()
//   })

//   it('Open and close filters tab', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_info]').within(() => {
//       cy.contains('ADVANCED FILTERS').should('be.visible')
//       cy.get('[data-cy=clear_filter]').contains('CLEAR').should('be.visible')
//       cy.contains('Facilities').should('be.visible')
//     })
//     cy.toggleFilterTab()
//     cy.logout()
//   })

//   it('Apply filter on active project status', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=project_status]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('Active').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.activeProjectStatus()
//     cy.logout()
//   })

//   it('Apply filter on inactive project status', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=project_status]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('InActive').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.inActiveProjectStatus()
//     cy.logout()
//   })

//   it('Apply filter on facility group', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=facility_group]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('Test Facility Group 1').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Facility Group: Test Facility Group 1').should('be.visible')
//     })
//     cy.facilityGroupFilter()
//     cy.logout()
//   })

//   it('Apply filter on facility name', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=facility_name]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').type('Test Facility 1')
//       cy.get('@list').within(() => {
//         cy.contains('Test Facility 1').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.facilityNameFilter()
//     cy.logout()
//   })

//   it('Apply filter on task category', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=clear_filter]').click()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=task_category]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('Test Task Type(milestone)').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Task Category: Test Task Type(milestone)').should('be.visible')
//     })
//     cy.facilityRollup()
//     cy.logout()
//   })

//   // it('Apply filter on task users', function() {
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=filter_bar]').within(() => {
//   //     cy.get('[data-cy=task_user]').as('list')
//   //     cy.get('@list').click()
//   //     cy.get('@list').within(() => {
//   //       cy.contains('Test Admin').click()
//   //     })
//   //   })
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=date_set_filter]').within(() => {
//   //     cy.contains('Task Users: Test Admin').should('be.visible')
//   //   })
//   //   cy.facilityGroupFilter()
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=filter_bar]').within(() => {
//   //     cy.get('[data-cy=clear_filter]').click()
//   //     cy.get('[data-cy=task_user]').as('list')
//   //     cy.get('@list').click()
//   //     cy.get('@list').within(() => {
//   //       cy.contains('Test Client').click()
//   //     })
//   //   })
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=facility_rollup]').scrollIntoView()
//   //   cy.get('[data-cy=date_set_filter]').within(() => {
//   //     cy.contains('Task Users: Test Client').should('be.visible')
//   //   })
//   //   cy.facilityClientFilter()
//   //   cy.logout()
//   // })

//   it('Apply filter on task stages', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=clear_filter]').click()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=task_stage]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('Test Task Stage').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Task Stages: Test Task Stage').should('be.visible')
//     })
//     cy.testTaskStageFilter()
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=clear_filter]').click()
//       cy.get('[data-cy=task_stage]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('New Task Stage').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=facility_rollup]').scrollIntoView()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Task Stages: New Task Stage').should('be.visible')
//     })
//     cy.testNewTaskStageFilter()
//     cy.logout()
//   })

//   it('Apply filter on issue type', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=clear_filter]').click()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=issue_type]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('Test Issue Type').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Issue Type: Test Issue Type').should('be.visible')
//     })
//     cy.facilityRollup()
//     cy.logout()
//   })

//   it('Apply filter on issue stages', function() {
//     cy.toggleFilterTab()
//     cy.get('[data-cy=clear_filter]').click()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=issue_stage]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('Test Issue Stage').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Issue Stages: Test Issue Stage').should('be.visible')
//     })
//     cy.testIssueStageFilter()
//     cy.toggleFilterTab()
//     cy.get('[data-cy=filter_bar]').within(() => {
//       cy.get('[data-cy=clear_filter]').click()
//       cy.get('[data-cy=issue_stage]').as('list')
//       cy.get('@list').click()
//       cy.get('@list').within(() => {
//         cy.contains('New Issue Stage').click()
//       })
//     })
//     cy.toggleFilterTab()
//     cy.get('[data-cy=facility_rollup]').scrollIntoView()
//     cy.get('[data-cy=date_set_filter]').within(() => {
//       cy.contains('Issue Stages: New Issue Stage').should('be.visible')
//     })
//     cy.testNewIssueStageFilter()
//     cy.logout()
//   })

//   // it('Apply filter on issue users', function() {
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=filter_bar]').within(() => {
//   //     cy.get('[data-cy=issue_user]').as('list')
//   //     cy.get('@list').click()
//   //     cy.get('@list').within(() => {
//   //       cy.contains('Test Admin').click()
//   //     })
//   //   })
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=date_set_filter]').within(() => {
//   //     cy.contains('Issue Users: Test Admin').should('be.visible')
//   //   })
//   //   cy.issueUserFilter()
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=filter_bar]').within(() => {
//   //     cy.get('[data-cy=clear_filter]').click()
//   //     cy.get('[data-cy=issue_user]').as('list')
//   //     cy.get('@list').click()
//   //     cy.get('@list').within(() => {
//   //       cy.contains('Test Client').click()
//   //     })
//   //   })
//   //   cy.toggleFilterTab()
//   //   cy.get('[data-cy=facility_rollup]').scrollIntoView()
//   //   cy.get('[data-cy=date_set_filter]').within(() => {
//   //     cy.contains('Issue Users: Test Client').should('be.visible')
//   //   })
//   //   cy.issueUserFilter()
//   //   cy.logout()
//   // })
// })
