class LessonDetail < ApplicationRecord
  # Detail Type: [success, failure, best_practices]
  belongs_to :lesson
  def to_json
    #self.as_json
    {
      id: id,
      finding: finding,
      recommendation: recommendation,
      detail_type: detail_type,
      user_id: user_id,
      updated_at: updated_at
    }
  end

end
