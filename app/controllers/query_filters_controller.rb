class QueryFiltersController < AuthenticatedController

  def index
    project = Project.find(params[:project_id])
    render json: project.query_filters.where(user_id: current_user.id).map(&:to_json)
  end

  def create
    p_params = query_filters_params[:query_filters]
    fav_params = query_filters_params[:favorite_filter]


    if p_params.nil? || fav_params.nil?
      render json: {error: "No filter found"}, status: 403
      return
    end

    project = Project.find(params[:project_id])

    favorite_filter = nil
    if fav_params[:id].present?
      favorite_filter = project.favorite_filters.where(user_id: current_user.id, id: fav_params[:id]).first
    end

    if favorite_filter.nil?
      favorite_filter = FavoriteFilter.create(project_id: project.id, name: fav_params[:name], user_id: current_user.id)
    end

    existing_query_filters = project.query_filters.where(user_id: current_user.id, favorite_filter_id: favorite_filter.id)
    query_filters = []

    p_params.each do |filter|
      f = existing_query_filters.detect{|qf| qf.filter_key == filter[:filter_key] }
      if f.present?
        f.update(filter)
      else
        query_filters << QueryFilter.new(filter.merge({project_id: project.id, user_id: current_user.id, favorite_filter_id: favorite_filter.id }))
      end
    end
    QueryFilter.import(query_filters) if query_filters.any?

    render json: {query_filters: query_filters, favorite_filter: favorite_filter}
  end

  def reset
    project = Project.find(params[:project_id])
    project.query_filters.where(user_id: current_user.id).destroy_all
    render json: {message: "Filters destroyed successfully"}
  end

  def query_filters_params
    params.permit!
  end
end
