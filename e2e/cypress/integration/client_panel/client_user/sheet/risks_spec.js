describe('Sheets Risks View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openFacilitySheet()
    cy.get('#customtabs > :nth-child(4) > .badge').contains('Risks').should('be.visible').click()
  })

  it('Open Sheets Risks in a facility', function() {
    cy.get('[data-cy=risk_sheet_index]').within(() => {
      cy.get('[data-cy=risk_total]').contains('Total: 2').should('be.visible')
      cy.get('[data-cy=risks_table]').should('be.visible')
    })
    cy.logout()
  })

  it('Open and Close risk form sheet view', function() {
    cy.get('[data-cy=risk_sheet_index]').within(() => {
      cy.get('[data-cy=add_risk]').should('be.exist').click({force: true})
    })
    cy.get('[data-cy=risk_save_btn]').should('be.exist')
    cy.get('[data-cy=risk_close_btn]').should('be.exist').click({force: true})
    cy.logout()
  })

  it('Open risk from sheet risk table', function() {
    cy.get('[data-cy=risks_table]').within(() => {
      cy.get('[data-cy=risk_row]').first().should('be.exist').click({force: true})
    })
    cy.get('[data-cy=risk_close_btn]').should('be.exist').click({force: true})
    cy.logout()
  })

  it('Search risk by typing title', function() {
    cy.get('[data-cy=risks_table]').within(() => {
      cy.get('[data-cy=risk_row]').its('length').should('be.eq', 2)
    })
    cy.get('[data-cy=search_risks]').clear().type('risk is not in the list').should('have.value', 'risk is not in the list')
    cy.contains('No Risks found...').should('be.visible')

    cy.get('[data-cy=search_risks]').clear().type('New risk').should('have.value', 'New risk')
    cy.get('[data-cy=risks_table]').within(() => {
      cy.get('[data-cy=risk_row]').its('length').should('be.eq', 1)
    })
    cy.get('[data-cy=search_risks]').clear()
    cy.get('[data-cy=risks_table]').within(() => {
      cy.get('[data-cy=risk_row]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  it('Sort risk according to risk name', function() {
    cy.get('[data-cy=risk_row]').first().contains('New Risk').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(1)').click()
    cy.get('[data-cy=risk_row]').first().contains('Test Risk').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(1)').click()
    cy.get('[data-cy=risk_row]').first().contains('New Risk').should('be.visible')
    cy.logout()
  })

  it('Sort risk according to risk approach', function() {
    cy.get('.mt-3 > tr > :nth-child(2)').click()
    cy.get('[data-cy=risk_row]').first().contains('Avoid').should('be.visible')
    cy.logout()
  })

  it('Sort risk according to priority level', function() {
    cy.get('.mt-3 > tr > :nth-child(3)').click()
    cy.get('[data-cy=risk_row]').first().contains('Very Low').should('be.visible')
    cy.logout()
  })

  it('Sort risk according to Start Date', function() {
    var dayjs = require('dayjs')
    const new_start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
    const test_start_date = dayjs().format('DD MMM YYYY')
    cy.get('[data-cy=risk_row]').first().contains(new_start_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(4)').click()
    cy.get('[data-cy=risk_row]').first().contains(test_start_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(4)').click()
    cy.get('[data-cy=risk_row]').first().contains(new_start_date).should('be.visible')
    cy.logout()
  })

  it('Sort risk according to Due Date', function() {
    var dayjs = require('dayjs')
    const due_date = dayjs().add(5, 'day').format('DD MMM YYYY')
    cy.get('[data-cy=risk_row]').first().contains(due_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(5)').click()
    cy.get('[data-cy=risk_row]').first().contains(due_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(5)').click()
    cy.get('[data-cy=risk_row]').first().contains(due_date).should('be.visible')
    cy.logout()
  })

  it('Sort risk according to Assigned User', function() {
    cy.get('[data-cy=responsibleUsers]').click()
    cy.get('[data-cy=risk_row]').first().contains('Test1 Admin').should('be.visible')
    cy.get('[data-cy=responsibleUsers]').click()
    cy.get('[data-cy=risk_row]').first().contains('Test2 Client').should('be.visible')
    cy.get('[data-cy=responsibleUsers]').click()
    cy.get('[data-cy=risk_row]').first().contains('Test1 Admin').should('be.visible')
    cy.logout()
  })

  it('Sort risk according to Progress', function() {
    cy.get('.mt-3 > tr > :nth-child(7)').click()
    cy.get('[data-cy=risk_row]').first().contains('10%').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(7)').click()
    cy.get('[data-cy=risk_row]').first().contains('70%').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(7)').click()
    cy.get('[data-cy=risk_row]').first().contains('10%').should('be.visible')
    cy.logout()
  })

  it('Sort risk according to On Watch', function() {
    cy.get('.mt-3 > tr > :nth-child(9)').click()
    cy.get('[data-cy=risk_row]').first().should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(9)').click()
    cy.get('[data-cy=risk_row]').first().contains('x').should('be.visible')
    cy.logout()
  })

  it('Sort risk according to Last Update', function() {
    cy.get('.mt-3 > tr > :nth-child(10)').click()
    cy.get('[data-cy=risk_row]').first().contains('No Updates').should('be.visible')
    cy.logout()
  })
})
