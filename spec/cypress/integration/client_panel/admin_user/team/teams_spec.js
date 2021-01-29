describe('Teams List', function() {
  beforeEach(() => {
    cy.app('clean')
    cy.appScenario('basic')
    cy.login('admin@test.com', 'T3$tAdmin')
    cy.openTeam()
  })

  it('Display list of team of a project', function() {
    cy.get('[data-cy=members_view]').within(() => {
      cy.contains('Team').should('be.visible')
      cy.get('[data-cy=team_total]').contains('Team Total: 2').should('be.visible')
      cy.contains('admin@test.com').should('be.visible')
      cy.contains('client@test.com').should('be.visible')
    })
    cy.logout()
  })

  it('Search team member by typing in search input field', function() {
    cy.get('[data-cy=team_members_list]').within(() => {
      cy.contains('client@test.com').should('be.visible')
      cy.contains('admin@test.com').should('be.visible')
    })
    cy.get('[data-cy=search_team_member]').clear().type('Member is not in the list').should('have.value', 'Member is not in the list')
    cy.get('[data-cy=team_members_list]').within(() => {
      cy.contains('No Data').should('be.visible')
    })
    cy.get('[data-cy=search_team_member]').clear().type('admin@test.com').should('have.value', 'admin@test.com')
    cy.get('[data-cy=team_members_list]').within(() => {
      cy.contains('admin@test.com').should('be.visible')
      cy.contains('client@test.com').should('not.exist')
    })
    cy.get('[data-cy=search_team_member]').clear().type('client@test.com').should('have.value', 'client@test.com')
    cy.get('[data-cy=team_members_list]').within(() => {
      cy.contains('client@test.com').should('be.visible')
      cy.contains('admin@test.com').should('not.exist')
    })
    cy.get('[data-cy=search_team_member]').clear()
    cy.get('[data-cy=team_members_list]').within(() => {
      cy.contains('client@test.com').should('be.visible')
      cy.contains('admin@test.com').should('be.visible')
    })
    cy.logout()
  })

  it('Sort Team according to First Name', function() {
    cy.get('.has-gutter > tr > .el-table_1_column_2 > .cell').contains('First Name').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_2 > .cell').first().contains('Test1').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_2 > .cell').contains('First Name').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_2 > .cell').first().contains('Test2').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_2 > .cell').contains('First Name').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_2 > .cell').first().contains('Test1').should('be.visible')
    cy.logout()
  })

  it('Sort Team according to Last Name', function() {
    cy.get('.has-gutter > tr > .el-table_1_column_3 > .cell').contains('Last Name').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_3 > .cell').first().contains('Admin').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_3 > .cell').contains('Last Name').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_3 > .cell').first().contains('Client').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_3 > .cell').contains('Last Name').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_3 > .cell').first().contains('Admin').should('be.visible')
    cy.logout()
  })

  it('Sort Team according to Email', function() {
    cy.get('.has-gutter > tr > .el-table_1_column_7 > .cell').contains('Email').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_7 > .cell').first().contains('admin@test.com').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_7 > .cell').contains('Email').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_7 > .cell').first().contains('client@test.com').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_7 > .cell').contains('Email').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_7 > .cell').first().contains('admin@test.com').should('be.visible')
    cy.logout()
  })

  it('Sort Team according to Position', function() {
    cy.get('.has-gutter > tr > .el-table_1_column_4 > .cell').contains('Position').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_4 > .cell').first().contains('Manager').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_4 > .cell').contains('Position').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_4 > .cell').first().contains('Mr.').should('be.visible')
    cy.get('.has-gutter > tr > .el-table_1_column_4 > .cell').contains('Position').click()
    cy.get('tbody > :nth-child(1) > .el-table_1_column_4 > .cell').first().contains('Manager').should('be.visible')
    cy.logout()
  })
})
