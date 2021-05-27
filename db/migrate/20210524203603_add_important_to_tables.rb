class AddImportantToTables < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :important, :boolean, default: false
    add_column :risks, :important, :boolean, default: false
    add_column :issues, :important, :boolean, default: false
    add_column :lessons, :important, :boolean, default: false
  end
end
