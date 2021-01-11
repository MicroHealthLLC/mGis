module Normalizer
  extend ActiveSupport::Concern

  included do
    before_validation :nilify_blanks
  end

  def nilify_blanks
    attributes.each do |column, value|
      self[column] = nil if column.include? "id" and self[column] == 0
    end
  end
end
