class AddDurationNameToRisks < ActiveRecord::Migration[6.1]
  def change
    add_column :risks, :duration_name, :string
  end
end
