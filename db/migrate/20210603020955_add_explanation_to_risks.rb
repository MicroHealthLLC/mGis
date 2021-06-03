class AddExplanationToRisks < ActiveRecord::Migration[6.1]
  def change
    add_column :risks, :explanation, :text
  end
end
