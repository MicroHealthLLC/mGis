describe('Kanban Risks View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openKanbanRisk()
  })

  it('Open kanban risks in a facility', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_col_title]').contains('Test Risk Stage').should('be.visible')
      })
    })
    cy.logout()
  })

  it('Open and close Kanban risk new form', function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })
    cy.get('[data-cy=risk_save_btn]').should('be.exist')
    cy.get('[data-cy=risk_close_btn]').click({force: true})
    cy.logout()
  })

  // it("Create new risk in kanban risk page", function() {
  //   cy.fillRiskForm()
  //   cy.get('[data-cy=risk_save_btn]').click({force: true})
  //   cy.get('.el-message__content').contains('New test risk in kanban was saved successfully.').should('be.visible')
  //   cy.logout()
  // })

  it("In Risk form if title's field empty, error message display", function() {
    cy.fillRiskForm()
    cy.get('[data-cy=risk_name]').clear({force: true})
    cy.get('[data-cy=risk_name_error]').contains('The Risk Name field is required.').should('be.visible')
    cy.get('.text-danger.mx-4').scrollIntoView()
    cy.get('.text-danger.mx-4').contains('Please fill the required fields before submitting').should('be.visible')
    cy.get('[data-cy=risk_close_btn]').click()
    cy.logout()
  })

  it("In risk form if risk Category field empty, error message display", function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
    const due_date = dayjs().add(7, 'day').format('DD MMM YYYY')

    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=risk_name]').type('New test risk in kanban').should('have.value', 'New test risk in kanban')
    cy.get('[data-cy=risk_description]').type('Kanban risk brief description').should('have.value', 'Kanban risk brief description')

    cy.get('[data-cy=risk_start_date]').type(`${start_date}{enter}`)
    cy.get('[data-cy=risk_due_date]').type(`${due_date}{enter}`)

    cy.get('[data-cy=risk_save_btn]').click()
    cy.get('[data-cy=risk_milestone_error]').contains('The Category field is required.').should('be.visible')
    cy.get('[data-cy=risk_close_btn]').click()
    cy.logout()
  })

  it("In risk form if start date empty, error message display", function() {
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=risk_name]').type('New test risk in kanban').should('have.value', 'New test risk in kanban')
    cy.get('[data-cy=risk_description]').type('Kanban risk brief description').should('have.value', 'Kanban risk brief description')

    cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')

    cy.get('[data-cy=risk_save_btn]').click()

    cy.get('[data-cy=risk_start_date_error]').scrollIntoView()
    cy.get('[data-cy=risk_start_date_error]').contains('The Identified Date field is required.').should('be.visible')
    cy.get('[data-cy=risk_close_btn]').click()
    cy.logout()
  })

  it("In risk form if due date empty, error message display", function() {
    var dayjs = require('dayjs')
    const start_date = dayjs().add(1, 'day').format('DD MMM YYYY')

    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=kanban_col]').eq(1).within(() => {
        cy.get('[data-cy=kanban_add_btn]').should('be.visible').click()
      })
    })

    cy.get('[data-cy=risk_name]').type('New test risk in kanban').should('have.value', 'New test risk in kanban')
    cy.get('[data-cy=risk_description]').type('Kanban risk brief description').should('have.value', 'Kanban risk brief description')

    cy.get('[data-cy=task_type]').click().type('{downarrow}{enter}')

    cy.get('[data-cy=risk_start_date]').type(`${start_date}{enter}`)

    cy.get('[data-cy=risk_save_btn]').click()

    cy.get('[data-cy=risk_due_date_error]').scrollIntoView()
    cy.get('[data-cy=risk_due_date_error]').contains('The Risk Approach Due Date field is required.').should('be.visible')
    cy.get('[data-cy=risk_close_btn]').click()
    cy.logout()
  })

  // it("In Risk form if Risk probability description field empty, error message display", function() {
  //   cy.fillRiskForm()
  //   cy.get('[data-cy=probability_description]').clear()
  //   cy.get('[data-cy=probability_description_error]').contains('The Probability Description field is required.').should('be.visible')
  //   cy.get('[data-cy=risk_close_btn]').click()
  //   cy.logout()
  // })

  // it("In Risk form if Risk impact description field empty, error message display", function() {
  //   cy.fillRiskForm()
  //   cy.get('[data-cy=impact_description]').clear()
  //   cy.get('[data-cy=impact_description_error]').contains('The Impact Description field is required.').should('be.visible')
  //   cy.get('[data-cy=risk_close_btn]').click()
  //   cy.logout()
  // })

  // it("In Risk form if Risk approach description field empty, error message display", function() {
  //   cy.fillRiskForm()
  //   cy.get('.col-md-12 > [data-cy=approach_description]').clear()
  //   cy.get('.col-md-12 > [data-cy=approach_description_error]').contains('The Risk Approach Description field is required.').should('be.visible')
  //   cy.get('[data-cy=risk_close_btn]').click()
  //   cy.logout()
  // })

  it('Update on watch state of a risk', function() {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=risks]').first().within(() => {
          cy.get('[data-cy=on_watch_icon]').should('be.visible')
        })
        cy.get('[data-cy=risks]').first().click()
      })
    })
    cy.get('[data-cy=risk_on_watch]').click({force: true})
    cy.get('[data-cy=risk_save_btn]').click({force: true})
    cy.wait(1000)
    cy.get('[data-cy=risk_close_btn]').click({force: true})
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=kanban_draggable]').within(() => {
        cy.get('[data-cy=risks]').first().within(() => {
          cy.get('[data-cy=on_watch_icon]').should('not.exist')
        })
      })
    })
    cy.logout()
  })

  it('Drag a risk from first stage and drop it to next stage', function() {
    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=risks]').first().as('origin')
    })

    cy.get('[data-cy=kanban_col]').last().within(() => {
      cy.get('[data-cy=risks]').as('destination')
    })

    cy.get('@origin').drag('@destination', {force: true})

    cy.get('[data-cy=kanban_col]').eq(1).within(() => {
      cy.get('[data-cy=risks]').should('not.exist')
    })

    cy.get('[data-cy=kanban_col]').last().within(() => {
      cy.get('[data-cy=risks]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  it('Search risk by typing title', function() {
    cy.get('[data-cy=search_risks]').clear({force: true}).type('Risk is not in the list').should('have.value', 'Risk is not in the list')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=risks]').should('not.exist')
    })

    cy.get('[data-cy=search_risks]').clear({force: true}).type('Test Risk').should('have.value', 'Test Risk')
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=risks]').its('length').should('be.eq', 1)
    })

    cy.get('[data-cy=search_risks]').clear({force: true})
    cy.get('[data-cy=kanban]').within(() => {
      cy.get('[data-cy=risks]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })
})
