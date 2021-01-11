class AddRolifyProjectToUsers < ActiveRecord::Migration[5.2]
  def change
    add_reference :project_users, :project_role, foreign_key: true

    begin
      role = Role.create(name: 'Read only role', description: 'System generated read only role')
      Project.find_each do |project|
        p_role = ProjectRole.create(role_id: role.id, project_id: project.id)
        ProjectUser.find_each do |project_user|
          project_user.project_role_id = p_role.id
          project_user.save
        end
      end
    rescue
    end

    remove_column :project_users, :project_id
  end
end
