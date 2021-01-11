class AddSuperRoleToRoles < ActiveRecord::Migration[5.2]
  def change
    add_column :roles, :system, :boolean, default: false

    begin
      Role.create(name: 'superadmin_role', system: true)
    rescue
    end
  end
end
