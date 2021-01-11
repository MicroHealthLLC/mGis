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
    resources :task_types, only: [:index]
    resources :facility_groups, only: [:index]
    resources :project_roles, only: [:index]
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

  resources :dashboard, only: [:index]
  resources :projects, only: [:index, :show] do
    get :gantt_chart, on: :member
    get :watch_view, on: :member
    get :sheets, on: :member
    get :member_list, on: :member
    get :facility_manager, on: :member
    get :kanban, on: :member
    resources :facilities do
      resources :notes, module: :facilities
      resources :issues do
        post :batch_update, on: :collection
      end
      resources :risks do
        post :batch_update, on: :collection
      end
      resources :tasks do
        post :batch_update, on: :collection
      end
    end
  end
  resources :facilities, only: [] do
    resources :facility_projects, only: [:index, :update, :show]
  end

  get '/profile', to: 'profiles#index'
  post '/profile', to: 'profiles#update'
  get '/current_user', to: 'profiles#current_profile'
  get '/settings', to: 'data#settings'
  get '/facility_groups', to: 'data#facility_groups'
  get '/task_types', to: 'data#task_types'
  get '/statuses', to: 'data#statuses'

  root 'landing#index'
  mount ActiveStorage::Engine, at: '/rails/active_storage'

  get '*all', to: "not_found#index", constraints: -> (req) do
    req.path.exclude? 'rails/active_storage'
  end
end
