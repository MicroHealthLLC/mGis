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
    cy.get('#facility_group_name').type('New Test Facility Group')
    cy.get('#facility_group_code').type('NTFG')
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
    cy.get('#facility_group_name').type('New Test Facility Group')
    cy.get('#facility_group_code').type('NTFG')
    cy.get('#facility_group_submit_action').contains('Create Facility group').click()
    cy.get('#index_table_facility_groups > tbody > tr').last().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Facility group was successfully destroyed.').should('be.visible')
    cy.get('#index_table_facility_groups > tbody > tr').its('length').should('be.eq', 2)
    cy.get('#logout').click()
  })
})
