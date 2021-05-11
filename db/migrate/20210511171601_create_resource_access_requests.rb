class CreateResourceAccessRequests < ActiveRecord::Migration[6.1]
  def change
    create_table :resource_access_requests do |t|
      t.integer :resource_id, null: false
      t.string :resource_type, null: false
      t.integer :user_id, null: false
      t.string :status, default: "pending"
      t.integer :granted_by_id, null: false
      t.string :permissions

      t.timestamps
    end
  end
end
