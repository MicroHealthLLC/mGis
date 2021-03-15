// describe('Admin Panel Task Categories', function() {
//   beforeEach(() => {
//     cy.app('clean')
//     cy.appScenario('basic')
//     cy.login('admin@test.com', 'T3$tAdmin')
//     cy.openTaskCategoryAP()
//   })

//   it('Click on Task Categories on tabs open Task Category information page', function() {
//     cy.get('#page_title').contains('Task Categories').should('be.visible')
//     cy.get('#index_table_task_types').should('be.visible')
//     cy.get('#index_table_task_types > tbody > tr').its('length').should('be.eq', 1)
//     cy.get('#logout').click()
//   })

//   it('Open and close new Task Category form', function() {
//     cy.get('.action_item > a').contains('New Task Category').click()
//     cy.get('#page_title').contains('New Task Category').should('be.visible')
//     cy.get('.cancel > a').contains('Cancel').click()
//     cy.get('#logout').click()
//   })

//   it('Create new Task Category', function() {
//     cy.get('.action_item > a').contains('New Task Category').click()
//     cy.get('#page_title').contains('New Task Category').should('be.visible')
//     cy.get('#task_type_name').type('New Test Task Type').should('have.value', 'New Test Task Type')
//     cy.get('#task_type_submit_action').contains('Create Task Category').click()
//     cy.get('.flashes').contains('Task Category was successfully created.')
//     cy.get('#index_table_task_types > tbody > tr').its('length').should('be.eq', 2)
//     cy.get('#logout').click()
//   })

//   it('Could not create new Task Category if name is blank', function() {
//     cy.get('.action_item > a').contains('New Task Category').click()
//     cy.get('#page_title').contains('New Task Category').should('be.visible')
//     cy.get('#task_type_submit_action').contains('Create Task Category').click()
//     // cy.get('.errors').contains("Name can't be blank")
//     cy.get('.inline-errors').contains("can't be blank")
//     cy.get('#page_title').contains('New Task Category').should('be.visible')
//     cy.get('#logout').click()
//   })

//   it('Could not Delete Task Category of foreign constraint', function() {
//     cy.get('#index_table_task_types').should('be.visible')
//     cy.get('#index_table_task_types > tbody > tr').first().within(() => {
//       cy.get('.col-actions').contains('Delete').click()
//     })
//     cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
//     cy.get('#index_table_task_types > tbody > tr').its('length').should('be.eq', 1)
//     cy.get('#logout').click()
//   })

//   it('Delete Task Category', function() {
//     cy.get('.action_item > a').contains('New Task Category').click()
//     cy.get('#task_type_name').type('New Test Task Type').should('have.value', 'New Test Task Type')
//     cy.get('#task_type_submit_action').contains('Create Task Category').click()
//     cy.get('#index_table_task_types > tbody > tr').last().within(() => {
//       cy.get('.col-actions').contains('Delete').click()
//     })
//     cy.get('.flashes').contains('Task Category was successfully destroyed.').should('be.visible')
//     cy.get('#index_table_task_types > tbody > tr').its('length').should('be.eq', 1)
//     cy.get('#logout').click()
//   })

//   it('Sort Task Stage according to Name', function() {
//     cy.get('.sortable').contains('Name').click()
//     cy.get('#index_table_task_types > tbody > tr').first().contains('Test Task Type(milestone)').should('be.visible')
//     cy.get('#logout').click()
//   })

//   it('Search Task Type contains name', function() {
//     cy.get('#q_name').type('Test Task Type').should('have.value', 'Test Task Type')
//     cy.get('[type=submit]').first().contains('Filter').click()
//     cy.get('#search_status_sidebar_section').should('be.visible')
//     cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
//     cy.get('h4').contains('Current filters:').should('be.visible')
//     cy.get('.current_filter').contains('Name contains Test Task Type').should('be.visible')
//     cy.get('#index_table_task_types > tbody > tr').its('length').should('be.eq', 1)
//     cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
//     cy.get('#logout').click()
//   })
// })
