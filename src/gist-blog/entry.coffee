markdown = require('markdown').markdown

class Entry
  constructor: ({@id, @files, @history, @description, @public, created_at, updated_at}) ->
    @filenames = []
    @filesArray = []
    for filename, file of @files
      @filenames.push(filename)
      @filesArray.push(file)
    @entry = @files['Readme.md']
    @entry = @files['README.md'] unless @entry
    @entry = @filesArray[0] unless @entry
    @language = @entry.language

    @text = (
      if typeof @["render#{@language}"] is 'function'
        @["render#{@language}"]() 
      else
        @renderDefault(@entry.content)
    )

    @createdAt = new Date(created_at)
    @updatedAt = new Date(updated_at)
    @createdAtFormatted = @formatDate(@createdAt)
    @updatedAtFormatted = @formatDate(@updatedAt)

  formatDate: (date) ->
    day = date.getDate()
    year = date.getYear() + 1900
    month = date.getMonth()
    "#{month}/#{day}/#{year}"

  renderMarkdown: -> markdown.toHTML(@entry.content)
  renderDefault: -> "<pre><code>#{@entry.content}</code></pre>"

module.exports = Entry
