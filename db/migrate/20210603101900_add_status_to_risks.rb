class AddStatusToRisks < ActiveRecord::Migration[6.1]
  def change
    add_column :risks, :status, :integer, null: true
  end
end
