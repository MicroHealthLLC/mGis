// describe('Tasks Page', function() {
//   beforeEach(() => {
//     cy.app('clean')
//     cy.appScenario('basic')
//     cy.login('admin@test.com', 'T3$tAdmin')
//     cy.tasksList()
//   })

//   it('Open Task list page of a Facility', function() {
//     cy.get('[data-cy=task_list]').should('be.visible')
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
//     cy.logout()
//   })

//   it('Open new Task form', function() {
//     cy.get('[data-cy=new_task]').click()
//     cy.contains('Task Name:').should('be.visible')
//     cy.get('[data-cy=task_save_btn]').should('be.disabled')
//     cy.logout()
//   })

//   it('Close Task form', function() {
//     cy.get('[data-cy=new_task]').click()
//     cy.contains('Task Name:').should('be.visible')
//     cy.get('[data-cy=task_close_btn]').click()
//     cy.contains('Task Name:').should('not.exist')
//     cy.logout()
//   })

//   it('Create new task in a Facility', function() {
//     cy.createNewTask()
//     cy.get('[data-cy=task_list]').contains('New test task')
//     cy.logout()
//   })

//   it('Delete the task from facility manager', function() {
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_delete_btn]').click()
//     cy.contains('No tasks found..').should('not.exist')
//     cy.wait(1000)
//     cy.get('[data-cy=tasks]').its('length').should('be.gt', 0)
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_delete_btn]').click()
//     cy.contains('No tasks found..').should('be.visible')
//     cy.logout()
//   })

//   it('Update task name in a Facility', function() {
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_name]').clear().type('Updated new test task').should('have.value', 'Updated new test task')
//     cy.get('[data-cy=task_save_btn]').click()
//     cy.get('[data-cy=task_list]').contains('Updated new test task').should('be.visible')
//     cy.logout()
//   })

//   it("In Task form if name's field empty, error message display and save button must be disabled", function() {
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_name]').clear()
//     cy.get('[data-cy=task_name_error]').contains('The Name field is required.').should('be.visible')
//     cy.get('[data-cy=task_save_btn]').should('be.disabled')
//     cy.get('[data-cy=task_close_btn]').click()
//     cy.logout()
//   })

//   it('In Task form if task category not selected, save button must be disabled', function() {
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_type]').click().type('{enter}')
//     cy.get('[data-cy=task_save_btn]').should('be.disabled')
//     cy.get('[data-cy=task_close_btn]').click()
//     cy.logout()
//   })

//   it("In Task form if start date is empty, display it's error plus due date field and save button must be disabled", function() {
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_start_date]').within(() =>{
//       cy.get('.mx-icon-clear').click({ force: true})
//     })
//     cy.get('[data-cy=task_start_date_error]').scrollIntoView()
//     cy.get('[data-cy=task_start_date_error]').contains('The Start Date field is required.').should('be.visible')
//     cy.get('[data-cy=task_due_date]').within(() => {
//       cy.get('input').should('be.disabled')
//     })
//     cy.get('[data-cy=task_save_btn]').should('be.disabled')
//     cy.get('[data-cy=task_close_btn]').click()
//     cy.logout()
//   })

//   it("In Task form if due date is empty, display it's error and save button must be disabled", function() {
//     cy.get('[data-cy=tasks]').first().click()
//     cy.get('[data-cy=task_due_date]').within(() =>{
//       cy.get('.mx-icon-clear').click({ force: true})
//     })
//     cy.get('[data-cy=task_due_date_error]').scrollIntoView()
//     cy.get('[data-cy=task_due_date_error]').contains('The Due Date field is required.').should('be.visible')
//     cy.get('[data-cy=task_save_btn]').should('be.disabled')
//     cy.get('[data-cy=task_close_btn]').click()
//     cy.logout()
//   })

//   it('Search task by typing title', function() {
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
//     cy.get('[data-cy=search_tasks]').clear().type('task is not in the list').should('have.value', 'task is not in the list')
//     cy.contains('No tasks found..').should('be.visible')

//     cy.get('[data-cy=search_tasks]').clear().type('Test task').should('have.value', 'Test task')
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 1)

//     cy.get('[data-cy=search_tasks]').clear()
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
//     cy.logout()
//   })

//   it('Select task status from list to display related tasks', function() {
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
//     cy.get('[data-cy=task_status_list]').as('list')
//     cy.get('@list').click()
//     cy.get('@list').within(() => {
//       cy.contains('complete').click()
//     })
//     cy.contains('No tasks found..').should('be.visible')
//     cy.get('@list').within(() => {
//       cy.contains('all').click()
//     })
//     cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
//     cy.logout()
//   })
// })
