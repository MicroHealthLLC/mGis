class ResourceAccessRequest < ApplicationRecord
  belongs_to :user
  belongs_to :granted_by, class_name: "User"
  belongs_to :resource, polymprphic: true
end
