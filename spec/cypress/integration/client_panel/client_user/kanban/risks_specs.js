// describe('Kanban Risks View', function() {
//   beforeEach(() => {
//     cy.app('clean')
//     cy.appScenario('basic')
//     cy.login('client@test.com', 'T3$tClient')
//     cy.openKanbanRisk()
//   })

//   it('Open kanban risks in a facility', function() {
//     cy.get('[data-cy=kanban]').within(() => {
//       cy.get('[data-cy=kanban_col]').first().within(() => {
//         cy.get('[data-cy=kanban_col_title]').contains('Test Risk Stage').should('be.visible')
//       })
//     })
//     cy.logout()
//   })

//   it('Cannot open new Risk form and edit/delete existing risk', function() {
//     cy.get('[data-cy=kanban]').within(() => {
//       cy.get('[data-cy=kanban_add_btn]').should('not.exist')
//       cy.get('[data-cy=kanban_col]').first().within(() => {
//         cy.get('[data-cy=risks]').first().click()
//       })
//     })
//     cy.get('[data-cy=risk_read_only_btn]').should('be.disabled')
//     cy.get('[data-cy=risk_save_btn]').should('not.exist')
//     cy.get('[data-cy=risk_delete_btn]').should('not.exist')
//     cy.get('[data-cy=risk_close_btn]').click({force: true})
//     cy.logout()
//   })

//   it('Drag a risk from first stage and drop it to next stage', function() {
//     cy.get('[data-cy=kanban_col]').first().within(() => {
//       cy.get('[data-cy=risks]').first().as('origin')
//     })

//     cy.get('[data-cy=kanban_col]').last().within(() => {
//       cy.get('[data-cy=risks]').as('destination')
//     })

//     cy.get('@origin').drag('@destination', {force: true})

//     cy.get('[data-cy=kanban_col]').first().within(() => {
//       cy.get('[data-cy=risks]').should('not.exist')
//     })

//     cy.get('[data-cy=kanban_col]').last().within(() => {
//       cy.get('[data-cy=risks]').its('length').should('be.eq', 2)
//     })
//     cy.logout()
//   })

//   // it('Search risk by typing title', function() {
//   //   cy.get('[data-cy=kanban_search]').should('be.visible').first().click({force: true})
//   //   cy.get('[data-cy=search_risk_total]').contains('Total: 2').should('be.visible')

//   //   cy.get('[data-cy=search_risks]').clear({force: true}).type('risk is not in the list').should('have.value', 'risk is not in the list')
//   //   cy.get('[data-cy=kanban]').within(() => {
//   //     cy.get('[data-cy=risks]').should('not.exist')
//   //   })
//   //   cy.get('[data-cy=search_risk_total]').contains('Total: 0').should('be.visible')

//   //   cy.get('[data-cy=search_risks]').clear({force: true}).type('Test risk').should('have.value', 'Test risk')
//   //   cy.get('[data-cy=kanban]').within(() => {
//   //     cy.get('[data-cy=risks]').its('length').should('be.eq', 1)
//   //   })
//   //   cy.get('[data-cy=search_risk_total]').contains('Total: 1').should('be.visible')

//   //   cy.get('[data-cy=search_risks]').clear({force: true})
//   //   cy.get('[data-cy=kanban]').within(() => {
//   //     cy.get('[data-cy=risks]').its('length').should('be.eq', 2)
//   //   })
//   //   cy.get('[data-cy=search_risk_total]').contains('Total: 2').should('be.visible')
//   //   cy.logout()
//   // })
// })
