task :default => "site:generate"

namespace :site do
  task :jekyll do
    sh "jekyll --bluecloth"
  end

  namespace :jekyll do
    task :server do
      sh "jekyll --bluecloth --server"
    end
  end
  
  task :purge do
    sh "rm _site/Capfile _site/README.markdown _site/Rakefile"
  end
  
  task :generate => ["jekyll", "purge"]
  
  task :clean do
    sh "rm -rf _site"
  end
end