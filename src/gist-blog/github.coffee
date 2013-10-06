Smoother = require('../../node_modules/breathe-easy/dist/smoother')

Github = Smoother.new('https://api.github.com')

Github.register 'User', ->
  @base 'users'
  @member ->
    @setup (@username) ->
    @base -> @username
    @get 'gists'

Github.register 'Gist', ->
  @base 'gists'
  @member ->
    @setup (@id) ->
    @base -> @id

Github.register 'Repo', ->
  @base 'repos'
  @member ->
    @setup (@owner, @repo) ->
    @base -> "#{@owner}/#{@repo}"

module.exports = Github
