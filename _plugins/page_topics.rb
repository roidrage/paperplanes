module Jekyll
  class Post
    def tags
      @tags + data.pluralized_array("topic", "topics")
    end
  end
end
