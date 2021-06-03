class AddOngoingToTable < ActiveRecord::Migration[6.1]
  def change
    add_column :tasks, :ongoing, :boolean, default: false
    add_column :risks, :ongoing, :boolean, default: false
  end
end
