describe('Kanban Issues View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openKanbanIssue()
  })

  it('Open kanban issues in a facility', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col_title]').contains('Test Issue Stage').should('be.visible')
    })
    cy.logout()
  })

  it('Open and close Kanban Issue new form', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })
    cy.get('[data-cy=issue_save_btn]').should('be.exist')
    cy.get('[data-cy=issue_close_btn]').click({force: true})
    cy.logout()
  })

  // it("Create new issue in kanban issue page", function() {
  //   cy.fillKanbanIssueForm()
  //   cy.get('[data-cy=issue_save_btn]').click({force: true})
  //   cy.get('.el-message__content').contains('New test issue in kanban was saved successfully.').should('be.visible')
  //   cy.logout()
  // })


  it("In Issue form if title's field empty, error message display", function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
    const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=issue_description]').type('Kanban Issue brief description').should('have.value', 'Kanban Issue brief description')

    cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')
    cy.get('[data-cy=issue_type_field]').click().type('{downarrow}{enter}')
    cy.get('[data-cy=issue_severity]').click().type('{downarrow}{enter}')

    cy.get('[data-cy=issue_start_date]').type(`${start_date}{enter}`)
    cy.get('[data-cy=issue_due_date]').type(`${due_date}{enter}`)

    cy.get('[data-cy=issue_save_btn]').click()
    cy.get('[data-cy=issue_title]').scrollIntoView()
    cy.get('[data-cy=issue_title_error]').contains('The Issue Name field is required.').should('be.visible')
    cy.get('[data-cy=issue_save_btn]').click()
    cy.get('.text-danger.mx-4').scrollIntoView()
    cy.get('.text-danger.mx-4').contains('Please fill the required fields before submitting').should('be.visible')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.logout()
  })

  it("In Issue form if issue type  field empty, error message display", function() {
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
    cy.get('[data-cy=issue_severity]').click().type('{downarrow}{enter}')

    cy.get('[data-cy=issue_start_date]').type(`${start_date}{enter}`)
    cy.get('[data-cy=issue_due_date]').type(`${due_date}{enter}`)

    cy.get('[data-cy=issue_save_btn]').click()
    cy.get('[data-cy=issue_type_error]').contains('The Issue Type field is required.').should('be.visible')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.logout()
  })

  it("In Issue form if issue severity field empty, error message display", function() {
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

    cy.get('[data-cy=issue_start_date]').type(`${start_date}{enter}`)
    cy.get('[data-cy=issue_due_date]').type(`${due_date}{enter}`)

    cy.get('[data-cy=issue_save_btn]').click()
    cy.get('[data-cy=issue_severity_error]').contains('The Issue Severity field is required.').should('be.visible')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.logout()
  })


  it("In Issue form if start date empty, error message display", function() {
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

    cy.get('[data-cy=issue_save_btn]').click()

    cy.get('[data-cy=issue_start_date_error]').contains('The Start Date field is required.').should('be.visible')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.logout()
  })

  it("In Issue form if due date empty, error message display", function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')

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

    cy.get('[data-cy=issue_save_btn]').click()

    cy.get('[data-cy=issue_due_date_error]').contains('The Estimated Completion Date field is required.').should('be.visible')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.logout()
  })

  it('Update on watch state of a issue', function() {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=issues]').first().within(() => {
          cy.get('[data-cy=on_watch_icon]').should('be.visible')
        })
        cy.get('[data-cy=issues]').first().click()
      })
    })
    cy.get('[data-cy=issue_on_watch]').click({force: true})
    cy.get('[data-cy=issue_save_btn]').click({force: true})
    cy.wait(1000)
    cy.get('[data-cy=issue_close_btn]').click({force: true})
    cy.get('[data-cy=kanban_draggable]').within(() => {
      cy.get('[data-cy=issues]').first().within(() => {
        cy.get('[data-cy=on_watch_icon]').should('not.exist')
      })
    })
    cy.logout()
  })

  it('Drag an issue from first stage and drop it to next stage', function() {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=issues]').first().as('origin')
    })

    cy.get('[data-cy=kanban_col]').last().within(() => {
      cy.get('[data-cy=issues]').as('destination')
    })

    cy.get('@origin').drag('@destination', {force: true})

    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=issues]').should('not.exist')
    })

    cy.get('[data-cy=kanban_col]').last().within(() => {
      cy.get('[data-cy=issues]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  it('Search issue by typing title', function() {
    cy.get('[data-cy=search_issues]').clear({force: true}).type('Issue is not in the list').should('have.value', 'Issue is not in the list')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=issues]').should('not.exist')
    })

    cy.get('[data-cy=search_issues]').clear({force: true}).type('Test Issue').should('have.value', 'Test Issue')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=issues]').its('length').should('be.eq', 1)
    })

    cy.get('[data-cy=search_issues]').clear({force: true})
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=issues]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  describe('Kanban Issues Actions', function() {
    beforeEach(() => {
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=issues]').first().click()
      })
    })

    it('Update issue from kanban', function() {
      cy.get('[data-cy=issue_title]').clear({force: true}).type('Updated new test issue').should('have.value', 'Updated new test issue')
      cy.get('[data-cy=issue_save_btn]').click({force: true})
      cy.wait(1000)
      cy.get('[data-cy=issue_close_btn]').click({force: true})
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=issues]').first().contains('Updated new test issue').should('be.visible')
      })
      cy.logout()
    })
  })
})
