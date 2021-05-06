describe('Admin Panel Task Stages', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openTaskStageAP()
  })

  it('Click on Task Stages on tabs open Task Stage information page', function() {
    cy.get('#page_title').contains('Task Stages').should('be.visible')
    cy.get('#index_table_task_stages').should('be.visible')
    cy.get('#index_table_task_stages > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Open and close new Task Stage form', function() {
    cy.get('.action_item > a').contains('New Task Stage').click()
    cy.get('#page_title').contains('New Task Stage').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Task Stage', function() {
    cy.get('.action_item > a').contains('New Task Stage').click()
    cy.get('#page_title').contains('New Task Stage').should('be.visible')
    cy.get('#task_stage_name').type('New Test Task Stage').should('have.value', 'New Test Task Stage')
    cy.get('#task_stage_submit_action').contains('Create Task stage').click()
    cy.get('.flashes').contains('Task stage was successfully created.')
    cy.get('#index_table_task_stages > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Could not create new Task stage if name is blank', function() {
    cy.get('.action_item > a').contains('New Task Stage').click()
    cy.get('#page_title').contains('New Task Stage').should('be.visible')
    cy.get('#task_stage_submit_action').contains('Create Task stage').click()
    cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Task Stage').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Task Stage of foreign constraint', function() {
    cy.get('#index_table_task_stages').should('be.visible')
    cy.get('#index_table_task_stages > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_task_stages > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Delete Task Stage', function() {
    cy.get('.action_item > a').contains('New Task Stage').click()
    cy.get('#task_stage_name').type('New Test Task Stage').should('have.value', 'New Test Task Stage')
    cy.get('#task_stage_submit_action').contains('Create Task stage').click()

    cy.get('#q_name').type('New Test Task Stage').should('have.value', 'New Test Task Stage')
    cy.get('[type=submit]').first().contains('Filter').click()

    cy.get('#index_table_task_stages > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Task stage was successfully destroyed.').should('be.visible')
    cy.get('#index_table_task_stages > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Sort Task Stage according to Name', function() {
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_task_stages > tbody > tr').first().contains('Test Task Stage').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_task_stages > tbody > tr').first().contains('New Task Stage').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_task_stages > tbody > tr').first().contains('Test Task Stage').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Task Stage according to Percentage', function() {
    cy.get('#index_table_task_stages > tbody > tr').first().contains(40).should('be.visible')
    cy.get('.sortable').contains('Percentage').click()
    cy.get('#index_table_task_stages > tbody > tr').first().contains(60).should('be.visible')
    cy.get('.sortable').contains('Percentage').click()
    cy.get('#index_table_task_stages > tbody > tr').first().contains(40).should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Task Stage contains name', function() {
    cy.get('#q_name').type('Test Task Stage').should('have.value', 'Test Task Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Task Stage').should('be.visible')
    cy.get('#index_table_task_stages > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
