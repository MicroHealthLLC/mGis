class AddStatusNameToRisks < ActiveRecord::Migration[6.1]
  def change
    add_column :risks, :status_name, :string
  end
end
