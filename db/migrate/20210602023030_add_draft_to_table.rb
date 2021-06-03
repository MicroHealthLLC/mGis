class AddDraftToTable < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :draft, :boolean, default: false
    add_column :risks, :draft, :boolean, default: false
    add_column :issues, :draft, :boolean, default: false
  end
end
