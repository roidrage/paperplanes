load 'deploy' if respond_to?(:namespace) # cap2 differentiator

set :application, "static.paperplanes.de"
set :domain, "static.paperplanes.de"
set :repository, "git@github.com:mattmatt/paperplanes.git" 
set :use_sudo, false
set :deploy_to, "/var/www/#{application}"
ssh_options[:forward_agent] = true
default_run_options[:pty] = true

role :app, domain
role :web, domain
role :db,  domain, :primary => true

set :scm, :git
set :deploy_via, :remote_cache

default_run_options[:pty] = true

namespace :deploy do
  task :restart, :roles => :app do
  end

  task :start, :roles => :app do
    # nothing
  end

  task :stop, :roles => :app do
    # nothing
  end
  
  task :finalize_update do
    # nothing
  end
end

namespace :jekyll do
  desc "Generates the site on the remote server"
  task :generate_site do
    run "cd #{current_release} && rake site:generate"
  end
  
  desc "Update the jekyll gem"
  task :update_gem do
    run "gem install mattmatt-jekyll"
  end
end

after "deploy:update_code", "jekyll:generate_site"