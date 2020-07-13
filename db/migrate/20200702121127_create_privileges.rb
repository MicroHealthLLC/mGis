class CreatePrivileges < ActiveRecord::Migration[5.2]
  def change
    create_table :privileges do |t|
      t.string :overview, default: 'R'
      t.string :tasks, default: 'R'
      t.string :notes, default: 'R'
      t.string :issues, default: 'R'
      t.string :admin, default: ''
      t.references :user, foreign_key: true
      t.timestamps
    end

    User.find_each do |user|
      user.role = user.email == 'admin@example.com' ? :superadmin : :client
      user.privilege.create! unless user.privilege.present?
      user.save
    end

    rename_column :users, :privileges, :old_privileges
  end
end
