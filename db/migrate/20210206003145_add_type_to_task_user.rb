class AddTypeToTaskUser < ActiveRecord::Migration[5.2]
  def change
    add_column :task_users, :type, :integer, default: 0

    begin
      TaskUser.find_each do |task_user|
        task_user.type = 0
        task_user.save
      end
    rescue
    end
  end
end
