task :default => "site:generate"

task :server => "site:jekyll:server"

task :clean => "site:clean"

namespace :site do
  task :jekyll => :pre do
    sh "PATH=$PATH:~/.gem/ruby/1.8/bin jekyll --bluecloth --permalink shortdate"
  end

  task :pre do
    require 'jekyll'
    require 'bluecloth'
    Jekyll.markdown_proc = Proc.new { |x| BlueCloth.new(x).to_html }
    site = Jekyll::Site.new('.', File.join('.', '_site'))
    site.read_posts('.')
    
    topics = site.posts.collect do |post|
      post.topics
    end.flatten.uniq!
    
    FileUtils.mkdir_p("tags")
    topics.each do |topic|
      tag_template =<<-END
---
layout: default
title: "Tag archive: #{topic}"
---
  {% for post in site.topics.#{topic} %}
  <div class="item">
    <div class="item_details">
      <h3><a href="{{ post.url }}">{{ post.title }}</h3>
      <h4>Posted  on <a href="{{ post.url }}" title="Permalink for this post">{{ post.date | date_to_string }}</a></h4>
    </div>
    <div class="item_content">
      {{ post.content }}
    </div>
    <div class="item_meta">
      <span class="item_tags">
        Tags: 
        {% for topic in post.topics %}
        <a href="http://www.paperplanes.de/tags/{{ topic }}.html" title="View posts tagged with &quot;{{ topic }}&quot;">{{ topic }}</a>{% if forloop.last != true %}, {% endif %}
        {% endfor %}
      </span>
    </div>
  </div>
  {% endfor %}
</ul>
END
      File.open("tags/#{topic}.html", "w") do |f|
        f.write(tag_template)
      end
    end
  end
  
  namespace :jekyll do
    task :server do
      sh "jekyll --bluecloth --permalink shortdate --server --auto"
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

task :publish do
  sh "git push origin master && cap deploy "
end