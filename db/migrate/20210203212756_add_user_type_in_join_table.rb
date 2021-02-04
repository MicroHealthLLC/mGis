class AddUserTypeInJoinTable < ActiveRecord::Migration[5.2]
  def change
    add_column :task_users, :user_type, :string, default: 'responsible'
    add_column :risk_users, :user_type, :string, default: 'responsible'
    add_column :issue_users, :user_type, :string, default: 'responsible'
  end
end
