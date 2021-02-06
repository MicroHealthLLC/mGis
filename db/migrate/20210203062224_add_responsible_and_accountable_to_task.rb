class AddResponsibleAndAccountableToTask < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :responsible_id, :integer, foreign_key: true
    add_column :tasks, :accountable_id, :integer, foreign_key: true
  end
end
