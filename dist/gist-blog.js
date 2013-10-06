(function() {
  var Blog;

  Blog = module.exports = require('./gist-blog/blog');

  if (typeof window === 'undefined') {
    return;
  }

  if (gistBlogOptions) {
    window.gistBlog = new Blog(gistBlogOptions);
  }

}).call(this);
