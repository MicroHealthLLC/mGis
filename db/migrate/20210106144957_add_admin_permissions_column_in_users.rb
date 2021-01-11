class AddAdminPermissionsColumnInUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :admin_permissions, :text, array: true
  end
end
