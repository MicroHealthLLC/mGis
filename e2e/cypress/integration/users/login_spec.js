describe('Login', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
  })

  it('Open login page if user not signed in', function() {
    cy.visit('/')
    cy.contains('You need to sign in before continuing.')
  })

  it ('Test login functionality for admin', function() {
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.contains('Welcome, Test1!')
    cy.logout()
  })

  it ('Test login functionality for client', function() {
    cy.login('client@test.com', 'T3$tClient')
    cy.contains('Welcome, Test2!')
    cy.logout()
  })

  it('Login with wrong email', function() {
    cy.visit('/')
    cy.get('[data-cy=user_email]').type('client@exapmle.com', {force: true}).should('have.value', 'client@exapmle.com')
    cy.get('[data-cy=user_password]').type('password', {force: true}).should('have.value', 'password')
    cy.get('[data-cy=user_remember_me]').click({force: true})
    cy.get('[data-cy=submit]').click({force: true})
    cy.contains('Invalid Email or password.')
  })

  it('Login with wrong password', function() {
    cy.visit('/')
    cy.get('[data-cy=user_email]').type('admin@test.com', {force: true}).should('have.value', 'admin@test.com')
    cy.get('[data-cy=user_password]').type('password', {force: true}).should('have.value', 'password')
    cy.get('[data-cy=user_remember_me]').click({force: true})
    cy.get('[data-cy=submit]').click({force: true})
    cy.contains('Invalid Email or password.')
  })

})
