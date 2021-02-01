describe('Admin Panel Risk Stages', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openRiskStageAP()
  })

  it('Click on Risk Stages on tabs open Risk Stage information page', function() {
    cy.get('#page_title').contains('Risk Stages').should('be.visible')
    cy.get('#index_table_risk_stages').should('be.visible')
    cy.get('#index_table_risk_stages > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Open and close new Risk Stage form', function() {
    cy.get('.action_item > a').contains('New Risk Stage').click()
    cy.get('#page_title').contains('New Risk Stage').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Risk Stage', function() {
    cy.get('.action_item > a').contains('New Risk Stage').click()
    cy.get('#page_title').contains('New Risk Stage').should('be.visible')
    cy.get('#risk_stage_name').type('New Test Risk Stage').should('have.value', 'New Test Risk Stage')
    cy.get('#risk_stage_submit_action').contains('Create Risk stage').click()
    cy.get('.flashes').contains('Risk stage was successfully created.')
    cy.get('#index_table_risk_stages > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Could not create new risk stage if name is blank', function() {
    cy.get('.action_item > a').contains('New Risk Stage').click()
    cy.get('#page_title').contains('New Risk Stage').should('be.visible')
    cy.get('#risk_stage_submit_action').contains('Create Risk stage').click()
    cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Risk Stage').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Risk Stage of foreign constraint', function() {
    cy.get('#index_table_risk_stages').should('be.visible')
    cy.get('#index_table_risk_stages > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_risk_stages > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Delete Risk Stage', function() {
    cy.get('.action_item > a').contains('New Risk Stage').click()
    cy.get('#risk_stage_name').type('New Test Risk Stage').should('have.value', 'New Test Risk Stage')
    cy.get('#risk_stage_submit_action').contains('Create Risk stage').click()
    cy.get('#index_table_risk_stages > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Risk stage was successfully destroyed.').should('be.visible')
    cy.get('#index_table_risk_stages > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Sort Risk Stage according to Name', function() {
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_risk_stages > tbody > tr').first().contains('Test Risk Stage').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_risk_stages > tbody > tr').first().contains('New Risk Stage').should('be.visible')
    cy.get('.sortable').contains('Name').click()
    cy.get('#index_table_risk_stages > tbody > tr').first().contains('Test Risk Stage').should('be.visible')
    cy.get('#logout').click()
  })

  it('Sort Risk Stage according to Percentage', function() {
    cy.get('#index_table_risk_stages > tbody > tr').first().contains(40).should('be.visible')
    cy.get('.sortable').contains('Percentage').click()
    cy.get('#index_table_risk_stages > tbody > tr').first().contains(60).should('be.visible')
    cy.get('.sortable').contains('Percentage').click()
    cy.get('#index_table_risk_stages > tbody > tr').first().contains(40).should('be.visible')
    cy.get('#logout').click()
  })

  it('Search Risk Stage contains name', function() {
    cy.get('#q_name').type('Test Risk Stage').should('have.value', 'Test Risk Stage')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Risk Stage').should('be.visible')
    cy.get('#index_table_risk_stages > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
