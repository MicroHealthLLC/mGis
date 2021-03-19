class AuthenticatedController < ApplicationController
  protect_from_forgery with: :exception, prepend: true
  before_action :authenticate_user!

  rescue_from Exception do |exception|
    render json: {error: exception.message}, status: 401
  end

end
