describe('Kanban Tasks View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openKanbanTask()
  })

  it('Open kanban tasks in a facility', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_col_title]').contains('Test Task Stage').should('be.visible')
      })
    })
    cy.logout()
  })

  it('Open and close Kanban task new form', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })
    cy.get('[data-cy=task_save_btn]').should('be.exist')
    cy.get('[data-cy=task_close_btn]').click({force: true})
    cy.logout()
  })

  // it("Create new task in kanban task page", function() {
  //   cy.fillKanbanTaskForm()
  //   cy.get('[data-cy=task_save_btn]').click({force: true})
  //   cy.get('.el-message__content').contains('New test task in kanban was saved successfully.').should('be.visible')
  //   cy.logout()
  // })

  it("In Task form if title's field empty, error message display", function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
    const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=task_description]').type('Kanban task brief description').should('have.value', 'Kanban task brief description')
    cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')
    cy.get('[data-cy=task_start_date]').type(`${start_date}{enter}`)
    cy.get('[data-cy=task_due_date]').type(`${due_date}{enter}`)

    cy.get('[data-cy=task_save_btn]').click()
    cy.get('[data-cy=task_name]').scrollIntoView()
    cy.get('[data-cy=task_name_error]').contains('The Task Name field is required.').should('be.visible')
    cy.get('.text-danger.mx-4').scrollIntoView()
    cy.get('.text-danger.mx-4').contains('Please fill the required fields before submitting').should('be.visible')
    cy.get('[data-cy=task_close_btn]').click()
    cy.logout()
  })

  it("In task form if task type  field empty, error message display", function() {
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

    cy.get('[data-cy=task_start_date]').type(`${start_date}{enter}`)
    cy.get('[data-cy=task_due_date]').type(`${due_date}{enter}`)

    cy.get('[data-cy=task_save_btn]').click()
    cy.get('[data-cy=task_category_error]').contains('The Category field is required.').should('be.visible')
    cy.get('[data-cy=task_close_btn]').click()
    cy.logout()
  })

  it("In task form if start date empty, error message display", function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=task_name]').type('New test task in kanban').should('have.value', 'New test task in kanban')
    cy.get('[data-cy=task_description]').type('Kanban task brief description').should('have.value', 'Kanban task brief description')

    cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')

    cy.get('[data-cy=task_save_btn]').click()

    cy.get('[data-cy=task_start_date_error]').contains('The Start Date field is required.').should('be.visible')
    cy.get('[data-cy=task_close_btn]').click()
    cy.logout()
  })

  it("In task form if due date empty, error message display", function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')

    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=task_name]').type('New test task in kanban').should('have.value', 'New test task in kanban')
    cy.get('[data-cy=task_description]').type('Kanban task brief description').should('have.value', 'Kanban task brief description')

    cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')

    cy.get('[data-cy=task_start_date]').type(`${start_date}{enter}`)

    cy.get('[data-cy=task_save_btn]').click()

    cy.get('[data-cy=task_due_date_error]').contains('The Due Date field is required.').should('be.visible')
    cy.get('[data-cy=task_close_btn]').click()
    cy.logout()
  })

  it('Update on watch state of a task', function() {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=tasks]').first().within(() => {
          cy.get('[data-cy=on_watch_icon]').should('be.visible')
        })
        cy.get('[data-cy=tasks]').first().click()
      })
    })
    cy.get('[data-cy=task_on_watch]').click({force: true})
    cy.get('[data-cy=task_save_btn]').click({force: true})
    cy.wait(1000)
    cy.get('[data-cy=task_close_btn]').click({force: true})
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=tasks]').first().within(() => {
          cy.get('[data-cy=on_watch_icon]').should('not.exist')
        })
      })
    })
    cy.logout()
  })

  it('Drag a task from first stage and drop it to next stage', function() {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=tasks]').first().as('origin')
    })

    cy.get('[data-cy=kanban_col]').last().within(() => {
      cy.get('[data-cy=tasks]').as('destination')
    })

    cy.get('@origin').drag('@destination', {force: true})

    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=tasks]').should('not.exist')
    })

    cy.get('[data-cy=kanban_col]').last().within(() => {
      cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  it('Search task by typing title', function() {
    cy.get('[data-cy=search_tasks]').clear({force: true}).type('task is not in the list').should('have.value', 'task is not in the list')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=tasks]').should('not.exist')
    })

    cy.get('[data-cy=search_tasks]').clear({force: true}).type('Test task').should('have.value', 'Test task')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=tasks]').its('length').should('be.eq', 1)
    })

    cy.get('[data-cy=search_tasks]').clear({force: true})
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=tasks]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  describe('Kanban Tasks Actions', function() {
    beforeEach(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_draggable]').within(() => {
          cy.get('[data-cy=tasks]').first().click()
        })
      })
    })

    it('Update task from kanban', function() {
      cy.get('[data-cy=task_name]').clear({force: true}).type('Updated new test task').should('have.value', 'Updated new test task')
      cy.get('[data-cy=task_save_btn]').click({force: true})
      cy.wait(1000)
      cy.get('[data-cy=task_close_btn]').click({force: true})
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_draggable]').within(() => {
          cy.get('[data-cy=tasks]').first().contains('Updated new test task').should('be.visible')
        })
      })
      cy.logout()
    })
  })
})
