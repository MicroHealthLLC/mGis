class AddOnHoldToTable < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :on_hold, :boolean, default: false
    add_column :risks, :on_hold, :boolean, default: false
    add_column :issues, :on_hold, :boolean, default: false
  end
end
