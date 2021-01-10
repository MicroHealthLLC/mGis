describe('Admin Panel Facility Group', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openFacilityGroupAP()
  })

  it('Click on Facility Groups on tabs open facility Group information page', function() {
    cy.get('#page_title').contains('Facility Groups').should('be.visible')
    cy.get('#index_table_facility_groups').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Open and close new Facility Group form', function() {
    cy.get('.action_item > a').contains('New Facility Group').click()
    cy.get('#page_title').contains('New Facility Group').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  it('Create new Facility Group', function() {
    cy.get('.action_item > a').contains('New Facility Group').click()
    cy.get('#page_title').contains('New Facility Group').should('be.visible')
    cy.get('#facility_group_name').type('New Test Facility Group').should('have.value', 'New Test Facility Group')
    cy.get('#facility_group_code').type('NTFG').should('have.value', 'NTFG')
    cy.get('#facility_group_submit_action').contains('Create Facility group').click()
    cy.get('.flashes').contains('Facility group was successfully created.')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Could not create new Facility Group if name is blank', function() {
    cy.get('.action_item > a').contains('New Facility Group').click()
    cy.get('#page_title').contains('New Facility Group').should('be.visible')
    cy.get('#facility_group_submit_action').contains('Create Facility group').click()
    cy.get('.errors').contains("Name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Facility Group').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not Delete Facility Group of foreign constraint', function() {
    cy.get('#index_table_facility_groups').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Not able to delete this! Violates foreign key constraint.').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Delete Facility Group', function() {
    cy.get('.action_item > a').contains('New Facility Group').click()
    cy.get('#facility_group_name').type('New Test Facility Group').should('have.value', 'New Test Facility Group')
    cy.get('#facility_group_code').type('NTFG').should('have.value', 'NTFG')
    cy.get('#facility_group_submit_action').contains('Create Facility group').click()
    cy.get('#index_table_facility_groups > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Facility group was successfully destroyed.').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })

  it('Search facility group contains name', function() {
    cy.get('#q_name').type('Test Facility Group 1').should('have.value', 'Test Facility Group 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Name contains Test Facility Group 1').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })

  it('Search facility group contains code', function() {
    cy.get('#q_code').type('TFG1').should('have.value', 'TFG1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Code contains TFG1').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})
