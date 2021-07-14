Rails.application.routes.draw do

  devise_for :users, controllers: {omniauth_callbacks: 'callbacks'}
  authenticate :user, lambda {|u| u.admin?} do
    begin
      ActiveAdmin.routes(self)
    rescue Exception => e
      puts "ActiveAdmin: #{e.class}: #{e}"
    end
  end

  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      get "/portfolio/programs", to: "portfolio#programs"
      get "/portfolio/lessons", to: "portfolio#lessons"
      get "/portfolio/tasks", to: "portfolio#tasks"
      get "/portfolio/risks", to: "portfolio#risks"
      get "/portfolio/issues", to: "portfolio#issues"
      # get "/portfolio", to: "portfolio#index"
    end
    resources :task_types, only: [:index]
    resources :facility_groups, only: [:index]
    resources :statuses, only: [:index]
    resources :issue_severities, only: [:index]
    resources :issue_types, only: [:index]
    resources :issue_stages, only: [:index]
    resources :task_stages, only: [:index]
    resources :users, only: [:index]
    get '/facility_projects/:project_id/:facility_id', to: 'facility_projects#index'
    get '/projects/:id/task_issues', to: 'projects#index'
    get '/settings', to: 'settings#index'
    post '/settings', to: 'settings#update'
    post '/sort-by', to: 'sorts#update'
  end

  get '/facility_privileges/facility_privileges_partial' => "facility_privileges#facility_privileges_partial", as: :facility_privileges_partial
  get '/facility_privileges/add_facility_privilege_form' => "facility_privileges#add_facility_privilege_form", as: :add_facility_privilege_form

  get '/project_privileges/load_form' => "project_privileges#load_form", as: :project_privileges_load_form


  ## New Routes for Vue
  get "/programs/:id/"  => "projects#show"

  get "/programs/:program_id/:tab" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/new" => "projects#vue_js_route"
  get "/programs/:program_id/lessons/:lesson_id" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/projects/:project_id/" => "projects#vue_js_route"

  get "/programs/:program_id/:tab/projects/:project_id/overview" => "projects#vue_js_route"

  get "/programs/:program_id/:tab/projects/:project_id/tasks" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/projects/:project_id/tasks/:id" => "projects#vue_js_route"

  get "/programs/:program_id/:tab/projects/:project_id/issues" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/projects/:project_id/issues/:id" => "projects#vue_js_route"

  get "/programs/:program_id/:tab/projects/:project_id/risks" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/projects/:project_id/risks/:id" => "projects#vue_js_route"

  get "/programs/:program_id/:tab/projects/:project_id/notes" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/projects/:project_id/notes/:id" => "projects#vue_js_route"

  get "/programs/:program_id/:tab/projects/:project_id/lessons" => "projects#vue_js_route"
  get "/programs/:program_id/:tab/projects/:project_id/lessons/:id" => "projects#vue_js_route"

  # TODO: add in namespace instead of this. This is to make front end working
  get "/api/v1/programs/:program_id/lessons" => "lessons#index"
  get "/api/v1/programs/:program_id/projects/:project_id/lessons" => "lessons#index"
  get "/api/v1/programs/:program_id/projects/:project_id/lessons/:lesson_id" => "lessons#show"
  post "/api/v1/programs/:program_id/projects/:project_id/lessons" => "lessons#create"
  patch "/api/v1/programs/:program_id/projects/:project_id/lessons/:lesson_id" => "lessons#update"
  delete "/api/v1/programs/:program_id/projects/:project_id/lessons/:lesson_id" => "lessons#destroy"

  get "/portfolio" => "dashboard#portfolio"

  resources :dashboard, only: [:index]
  resources :projects, only: [:index, :show] do
    get :gantt_chart, on: :member
  ##  get :watch_view, on: :member
    get :sheet, on: :member
    get :member_list, on: :member
  ##  get :facility_manager, on: :member
    get :kanban, on: :member
    get :map, on: :member    
    get :calendar, on: :member

    resources :lessons

    resources :query_filters do
      collection do
        delete "reset" => "query_filters#reset"
      end
    end

    resources :facilities do
      resources :notes #, module: :facilities
      resources :issues do
        post :batch_update, on: :collection
        post :create_duplicate, on: :member
        post :create_bulk_duplicate, on: :member
      end
      resources :risks do
        post :batch_update, on: :collection
        post :create_duplicate, on: :member
        post :create_bulk_duplicate, on: :member
      end
      resources :tasks do
        post :batch_update, on: :collection
        post :create_duplicate, on: :member
        post :create_bulk_duplicate, on: :member
      end
    end
  end
  resources :facilities, only: [] do
    resources :facility_projects, only: [:index, :update, :show]
  end
  resources :facility_projects, only: [:index, :update, :show] do
    resources :issues do
      post :batch_update, on: :collection
      post :create_duplicate, on: :member
      post :create_bulk_duplicate, on: :member
    end
    resources :risks do
      post :batch_update, on: :collection
      post :create_duplicate, on: :member
      post :create_bulk_duplicate, on: :member
    end
    resources :tasks do
      post :batch_update, on: :collection
      post :create_duplicate, on: :member
      post :create_bulk_duplicate, on: :member
    end
  end

  get '/profile', to: 'profiles#index'
  get '/profile', to: 'profiles#index'
  post '/profile', to: 'profiles#update'
  get '/current_user', to: 'profiles#current_profile'
  get '/settings', to: 'data#settings'
  get '/facility_groups', to: 'data#facility_groups'
  get '/task_types', to: 'data#task_types'
  get '/statuses', to: 'data#statuses'

  post '/progress_lists', to: 'progress_lists#create'

  root 'landing#index'
  mount ActiveStorage::Engine, at: '/rails/active_storage'

  get '*all', to: "not_found#index", constraints: -> (req) do
    req.path.exclude? 'rails/active_storage'
  end
end
