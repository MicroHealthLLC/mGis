describe('Issue List', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.issueList()
  })

  it('Open Issue list page of a Facility', function() {
    cy.contains('My Issues')
    cy.get('[data-cy=issue_list]').contains('Total: 1')
    cy.logout()
  })

  it('Open new Issue form', function() {
    cy.get('[data-cy=new_issue]').click()
    cy.contains('Issue Name:')
    cy.get('[data-cy=issue_save_btn]').should('be.disabled')
    cy.logout()
  })

  it('Close new Issue form', function() {
    cy.get('[data-cy=new_issue]').click()
    cy.contains('Issue Name:')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.contains('Issue Name:').should('not.exist')
    cy.logout()
  })

  // it('Create new Issue in a Facility', function() {
  //   cy.get('[data-cy=issue_total]').contains('Total: 1')
  //   cy.createNewIssue()
  //   cy.get('[data-cy=issue_total]').contains('Total: 2')
  //   cy.get('[data-cy=issue_list]').contains('New test issue')
  //   cy.logout()
  // })

  it('Delete the Issue form facility', function() {
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_delete_btn]').click()
    cy.contains('No issues found..').should('be.visible')
    cy.logout()
  })

  it('Update issue name in a Facility', function() {
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_title]').clear().type('Updated new test issue').should('have.value', 'Updated new test issue')
    cy.get('[data-cy=issue_save_btn]').click()
    cy.get('[data-cy=issue_list]').contains('Updated new test issue')
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.logout()
  })

  it("In Issue form if title's field empty, error message display and save button must be disabled", function() {
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_title]').clear()
    cy.get('[data-cy=issue_title_error]').contains('The title field is required.')
    cy.get('[data-cy=issue_save_btn]').should('be.disabled')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.logout()
  })

  it("In Issue form if issue type not selected, save button must be disabled", function() {
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_type]').click().type('{enter}')
    cy.get('[data-cy=issue_save_btn]').should('be.disabled')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.logout()
  })

  it("In Issue form if issue severity not selected, save button must be disabled", function() {
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_severity]').click().type('{enter}')
    cy.get('[data-cy=issue_save_btn]').should('be.disabled')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.logout()
  })

  it("In Issue form if start date is empty, display it's error plus due date field and save button must be disabled", function() {
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_start_date]').within(() =>{
      cy.get('.mx-icon-clear').click({ force: true})
    })
    cy.get('[data-cy=issue_start_date_error]').contains('The Start Date field is required.')
    cy.get('[data-cy=issue_due_date]').within(() => {
      cy.get('input').should('be.disabled')
    })
    cy.get('[data-cy=issue_save_btn]').should('be.disabled')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.logout()
  })

  it("In Issue form if due date is empty, display it's error and save button must be disabled", function() {
    cy.get('[data-cy=issues]').first().click()
    cy.get('[data-cy=issue_due_date]').within(() =>{
      cy.get('.mx-icon-clear').click({ force: true})
    })
    cy.get('[data-cy=issue_due_date_error]').contains('The Estimated Completion Date field is required.')
    cy.get('[data-cy=issue_save_btn]').should('be.disabled')
    cy.get('[data-cy=issue_close_btn]').click()
    cy.get('[data-cy=issue_total]').contains('Total: 1')
    cy.logout()
  })
})
