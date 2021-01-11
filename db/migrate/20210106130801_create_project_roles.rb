class CreateProjectRoles < ActiveRecord::Migration[5.2]
  def change
    create_table :project_roles do |t|
      t.references :role, foreign_key: true
      t.references :project, foreign_key: true
      t.timestamps
    end
  end
end
