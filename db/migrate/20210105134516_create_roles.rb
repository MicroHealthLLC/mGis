class CreateRoles < ActiveRecord::Migration[5.2]
  def change
    begin
      create_table :roles do |t|
        t.string :name
        t.text :description
        t.timestamps
      end
      add_reference :privileges, :role, foreign_key: true
      remove_column :privileges, :user_id
    rescue
    end
  end
end
