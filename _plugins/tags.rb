module Paperplanes
  class TagPage < Jekyll::Page
    def initialize(site, base, category, posts)
      @site = site
      @base = base
      @dir = 'tags' 
      @name = "#{category}.html"

      process(@name)
      read_yaml(File.join(base, '_layouts'), 'tag.html')
      data['tag'] = category
      data['posts'] = posts
      data['title'] = "Tag archive: #{category}"
    end
  end

  class Tags < Jekyll::Generator
    def generate(site)
      site.tags.each do |tag, posts|
        site.pages << TagPage.new(site, site.source, tag, posts.reverse)
      end
    end
  end
end
