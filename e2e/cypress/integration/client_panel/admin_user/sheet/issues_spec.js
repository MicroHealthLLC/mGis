describe('Sheets Issues View', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openFacilitySheet()
    cy.get('#customtabs > :nth-child(3) > .badge').contains('Issues').should('be.visible').click()
  })

  it('Open Sheets issues in a facility', function() {
    cy.get('[data-cy=issue_sheet_index]').within(() => {
      cy.get('[data-cy=issue_total]').contains('Total: 2').should('be.visible')
      cy.get('[data-cy=issues_table]').should('be.visible')
    })
    cy.logout()
  })

  it('Open and Close Issue form sheet view', function() {
    cy.get('[data-cy=issue_sheet_index]').within(() => {
      cy.get('[data-cy=add_issue]').should('be.exist').click({force: true})
    })
    cy.get('[data-cy=issue_save_btn]').should('be.exist')
    cy.get('[data-cy=issue_close_btn]').should('be.exist').click({force: true})
    cy.logout()
  })

  it('Open issue from sheet issue table', function() {
    cy.get('[data-cy=issues_table]').within(() => {
      cy.get('[data-cy=issue_row]').first().should('be.exist').click({force: true})
    })
    cy.get('[data-cy=issue_close_btn]').should('be.exist').click({force: true})
    cy.logout()
  })

  it('Update issue from sheet issue table', function() {
    cy.get('[data-cy=issues_table]').within(() => {
      cy.get('[data-cy=issue_row]').first().should('be.exist').click({force: true})
    })
    cy.get('[data-cy=issue_title]').clear({force: true}).type('Updated new test issue', {force: true}).should('have.value', 'Updated new test issue')
    cy.get('[data-cy=issue_save_btn]').click({force: true})
    cy.wait(1000)
    cy.get('[data-cy=issue_close_btn]').click({force: true})
    cy.get('[data-cy=issues_table]').within(() => {
      cy.get('[data-cy=issue_row]').contains('Updated new test issue').should('be.exist')
    })
    cy.logout()
  })

  it('Search issue by typing title', function() {
    cy.get('[data-cy=issues_table]').within(() => {
      cy.get('[data-cy=issue_row]').its('length').should('be.eq', 2)
    })
    cy.get('[data-cy=search_issues]').clear().type('Issue is not in the list').should('have.value', 'Issue is not in the list')
    cy.contains('No Issues found...').should('be.visible')

    cy.get('[data-cy=search_issues]').clear().type('New Issue').should('have.value', 'New Issue')
    cy.get('[data-cy=issues_table]').within(() => {
      cy.get('[data-cy=issue_row]').its('length').should('be.eq', 1)
    })
    cy.get('[data-cy=search_issues]').clear()
    cy.get('[data-cy=issues_table]').within(() => {
      cy.get('[data-cy=issue_row]').its('length').should('be.eq', 2)
    })
    cy.logout()
  })

  it('Sort Issue according to Issue name', function() {
    cy.get('[data-cy=issue_row]').first().contains('New Issue').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(1)').click()
    cy.get('[data-cy=issue_row]').first().contains('Test Issue').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(1)').click()
    cy.get('[data-cy=issue_row]').first().contains('New Issue').should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Issue type', function() {
    cy.get('.mt-3 > tr > :nth-child(2)').click()
    cy.get('[data-cy=issue_row]').first().contains('Test Issue Type').should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Issue Severity', function() {
    cy.get('.mt-3 > tr > :nth-child(3)').click()
    cy.get('[data-cy=issue_row]').first().contains('Test Issue Severity').should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Start Date', function() {
    var dayjs = require('dayjs')
    const new_start_date = dayjs().add(1, 'day').format('DD MMM YYYY')
    const test_start_date = dayjs().format('DD MMM YYYY')
    cy.get('[data-cy=issue_row]').first().contains(new_start_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(4)').click()
    cy.get('[data-cy=issue_row]').first().contains(test_start_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(4)').click()
    cy.get('[data-cy=issue_row]').first().contains(new_start_date).should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Due Date', function() {
    var dayjs = require('dayjs')
    const new_due_date = dayjs().add(6, 'day').format('DD MMM YYYY')
    const test_due_date = dayjs().add(5, 'day').format('DD MMM YYYY')
    cy.get('[data-cy=issue_row]').first().contains(new_due_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(5)').click()
    cy.get('[data-cy=issue_row]').first().contains(test_due_date).should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(5)').click()
    cy.get('[data-cy=issue_row]').first().contains(new_due_date).should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Assigned User', function() {
    cy.get('[data-cy=responsibleUsers]').click()
    cy.get('[data-cy=issue_row]').first().contains('Test1 Admin').should('be.visible')
    cy.get('[data-cy=responsibleUsers]').click()
    cy.get('[data-cy=issue_row]').first().contains('Test2 Client').should('be.visible')
    cy.get('[data-cy=responsibleUsers]').click()
    cy.get('[data-cy=issue_row]').first().contains('Test1 Admin').should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Progress', function() {
    cy.get('.mt-3 > tr > :nth-child(7)').click()
    cy.get('[data-cy=issue_row]').first().contains('10%').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(7)').click()
    cy.get('[data-cy=issue_row]').first().contains('70%').should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(7)').click()
    cy.get('[data-cy=issue_row]').first().contains('10%').should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to On Watch', function() {
    cy.get('.mt-3 > tr > :nth-child(9)').click()
    cy.get('[data-cy=issue_row]').first().should('be.visible')
    cy.get('.mt-3 > tr > :nth-child(9)').click()
    cy.get('[data-cy=issue_row]').first().contains('x').should('be.visible')
    cy.logout()
  })

  it('Sort Issue according to Last Update', function() {
    cy.get('.mt-3 > tr > :nth-child(10)').click()
    cy.get('[data-cy=issue_row]').first().contains('No Updates').should('be.visible')
    cy.logout()
  })
})
