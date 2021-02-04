class RiskUser < ApplicationRecord
  belongs_to :user
  belongs_to :risk

  # Different User types https://github.com/MicroHealthLLC/mGis/issues/888
  # Responsible
  # Accountable
  # Consulted
  # Informed

  def accountable?
    user_type == "accountable"
  end

  def responsible?
    user_type == "responsible"
  end

  def counsulted?
    user_type == "counsulted"
  end

  def informed?
    user_type == "informed"
  end

end
