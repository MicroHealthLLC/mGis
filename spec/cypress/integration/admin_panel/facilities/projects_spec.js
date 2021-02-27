describe('Admin Panel Project', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openProjectAP()
  })

  it('Click on Projects on tabs open Project information page', function() {
    cy.get('#page_title').contains('Project').should('be.visible')
    cy.get('#index_table_facilities').should('be.visible')
    cy.get('#index_table_facilities > tbody > tr').its('length').should('be.eq', 4)
    cy.get('#logout').click()
  })

  it('Open and close new Project form', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('.cancel > a').contains('Cancel').click()
    cy.get('#logout').click()
  })

  // it('Create new Project', function() {
  //   cy.get('.action_item > a').contains('New Project').click()
  //   cy.get('#page_title').contains('New Facility').should('be.visible')
  //   cy.get('#facility_facility_name').type('New Test Facility').should('have.value', 'New Test Facility')
  //   cy.get('#facility_address_input_gmap > input').type('2-20 Western Rd, Park Royal, London NW10 7LW, UK')
  //   cy.wait(1000)
  //   cy.get('#facility_address_input_gmap > input').type('{downarrow} {enter}', {force: true})
  //   cy.get('#facility_point_of_contact').type('Point of contact').should('have.value', 'Point of contact')
  //   cy.get('#phone-number__input_phone_number').type('07400 123456')
  //   cy.get('#facility_email').type('testfacility@mail.com').should('have.value', 'testfacility@mail.com')
  //   cy.get('#facility_submit_action').contains('Create Project').click()
  //   cy.get('.flashes').contains('Facility was successfully created.')
  //   cy.get('#index_table_facilities > tbody > tr').its('length').should('be.eq', 5)
  //   cy.get('#logout').click()
  // })

  it('Could not create new Project if name is blank', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#facility_address_input_gmap > input').type('2-20 Western Rd, Park Royal, London NW10 7LW, UK')
    cy.wait(1000)
    cy.get('#facility_address_input_gmap > input').type('{downarrow} {enter}', {force: true})
    cy.get('#facility_point_of_contact').type('Point of contact').should('have.value', 'Point of contact')
    cy.get('#phone-number__input_phone_number').type('07400 123456')
    cy.get('#facility_email').type('testfacility@mail.com').should('have.value', 'testfacility@mail.com')
    cy.get('#facility_submit_action').contains('Create Project').click()
    cy.get('.errors').contains("Facility name can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not create new Project if address is blank', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#facility_facility_name').type('New Test Facility').should('have.value', 'New Test Facility')
    cy.get('#facility_point_of_contact').type('Point of contact').should('have.value', 'Point of contact')
    cy.get('#phone-number__input_phone_number').type('07400 123456')
    cy.get('#facility_email').type('testfacility@mail.com').should('have.value', 'testfacility@mail.com')
    cy.get('#facility_submit_action').contains('Create Project').click()
    cy.get('.errors').contains("Address can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not create new Project if Point of contact is blank', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#facility_facility_name').type('New Test Facility').should('have.value', 'New Test Facility')
    cy.get('#facility_address_input_gmap > input').type('2-20 Western Rd, Park Royal, London NW10 7LW, UK')
    cy.wait(1000)
    cy.get('#facility_address_input_gmap > input').type('{downarrow} {enter}', {force: true})
    cy.get('#phone-number__input_phone_number').type('07400 123456')
    cy.get('#facility_email').type('testfacility@mail.com').should('have.value', 'testfacility@mail.com')
    cy.get('#facility_submit_action').contains('Create Project').click()
    cy.get('.errors').contains("Point of contact can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not create new Project if Phone number is blank', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#facility_facility_name').type('New Test Facility').should('have.value', 'New Test Facility')
    cy.get('#facility_address_input_gmap > input').type('2-20 Western Rd, Park Royal, London NW10 7LW, UK')
    cy.wait(1000)
    cy.get('#facility_address_input_gmap > input').type('{downarrow} {enter}', {force: true})
    cy.get('#facility_point_of_contact').type('Point of contact').should('have.value', 'Point of contact')
    cy.get('#facility_email').type('testfacility@mail.com').should('have.value', 'testfacility@mail.com')
    cy.get('#facility_submit_action').contains('Create Project').click()
    cy.get('.errors').contains("Phone number can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Could not create new Project if email is blank', function() {
    cy.get('.action_item > a').contains('New Project').click()
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#facility_facility_name').type('New Test Facility').should('have.value', 'New Test Facility')
    cy.get('#facility_address_input_gmap > input').type('2-20 Western Rd, Park Royal, London NW10 7LW, UK')
    cy.wait(1000)
    cy.get('#facility_address_input_gmap > input').type('{downarrow} {enter}', {force: true})
    cy.get('#facility_point_of_contact').type('Point of contact').should('have.value', 'Point of contact')
    cy.get('#phone-number__input_phone_number').type('07400 123456')
    cy.get('#facility_submit_action').contains('Create Project').click()
    cy.get('.errors').contains("Email can't be blank")
    cy.get('.inline-errors').contains("can't be blank")
    cy.get('#page_title').contains('New Project').should('be.visible')
    cy.get('#logout').click()
  })

  it('Delete Project', function() {
    cy.get('#index_table_facilities').should('be.visible')
    cy.get('#index_table_facilities > tbody > tr').first().within(() => {
      cy.get('.col-actions').contains('Delete').click()
    })
    cy.get('.flashes').contains('Project was successfully destroyed.').should('be.visible')
    cy.get('#index_table_facilities > tbody > tr').its('length').should('be.eq', 3)
    cy.get('#logout').click()
  })

  it('Search facility contains name', function() {
    cy.get('#index_table_facilities').should('be.visible')
    cy.get('#q_facility_name').type('Test Facility 1').should('have.value', 'Test Facility 1')
    cy.get('[type=submit]').first().contains('Filter').click()
    cy.get('#search_status_sidebar_section').scrollIntoView()
    cy.get('#search_status_sidebar_section').should('be.visible')
    cy.get('#search_status_sidebar_section > h3').contains('Search status:').should('be.visible')
    cy.get('h4').contains('Current filters:').should('be.visible')
    cy.get('.current_filter').contains('Project Name contains Test Facility 1').should('be.visible')
    cy.get('#index_table_facilities > tbody > tr').its('length').should('be.eq', 1)
    cy.get('.clear_filters_btn').last().contains('Clear Filters').click()
    cy.get('#logout').click()
  })
})