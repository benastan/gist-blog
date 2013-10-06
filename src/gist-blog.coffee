Blog = module.exports = require './gist-blog/blog'

return if typeof window is 'undefined'

if gistBlogOptions

  window.gistBlog = new Blog(gistBlogOptions)
