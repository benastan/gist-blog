Github = require './github'
Entry = require './entry'
mustache = require 'mustache'
JST = require './templates'

class Blog

  constructor: ({@username, @password, @repo, @branch}) ->
    @branch ||= 'gh-pages'
    unless @repo
      @branch ||= 'master'
      @repo = "#{@username}.github.io"
    @fullRepo = "#{@username}/#{@repo}"
    @repoUrl = "https://rawgithub.com/#{@fullRepo}"
    @templatesUrl = "#{@repoUrl}/tree/#{@branch}/templates"
    @user = Github.User.new(@username)

  fetchEntries: (callback) ->
    @user.gists().done (gists) =>
      @entries = []
      for gist in gists
        Github.Gist.new(gist.id).get().done (gist) =>
          @entries.push(new Entry(gist))
          callback() if @entries.length is gists.length

  fetchTemplates: (callback) ->
    @templates = {}
    compiledCount = 0
    types = @templateTypes()
    for type in types
      ((type) =>
        promise = $.get("#{@templatesUrl}/#{type}.mustache")
        addTemplate = (template) =>
          compiledCount += 1
          @templates[type] = mustache.compile(template)
          callback() if compiledCount is types.length
        promise.done (template) => addTemplate(template)
        promise.error => addTemplate(JST[type])
      )(type)

  render: (object) ->
    if typeof object is 'function'
      @renderContent(object)
    else
      @templates[object.constructor.name.toLowerCase()](object)

  templateTypes: -> [ 'entry' ]

  renderContent: (callback) ->
    return callback(@content) if @content
    @fetchEntries =>
      @fetchTemplates =>
        @content = []
        for entry in @entries
          @content.push(@render(entry))
        @content = @content.join('')
        callback(@content)

module.exports = Blog
