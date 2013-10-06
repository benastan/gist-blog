(function() {
  var Entry, markdown;

  markdown = require('markdown').markdown;

  Entry = (function() {
    function Entry(_arg) {
      var created_at, file, filename, updated_at, _ref;
      this.id = _arg.id, this.files = _arg.files, this.history = _arg.history, this.description = _arg.description, this["public"] = _arg["public"], created_at = _arg.created_at, updated_at = _arg.updated_at;
      this.filenames = [];
      this.filesArray = [];
      _ref = this.files;
      for (filename in _ref) {
        file = _ref[filename];
        this.filenames.push(filename);
        this.filesArray.push(file);
      }
      this.entry = this.files['Readme.md'];
      if (!this.entry) {
        this.entry = this.files['README.md'];
      }
      if (!this.entry) {
        this.entry = this.filesArray[0];
      }
      this.language = this.entry.language;
      this.text = (typeof this["render" + this.language] === 'function' ? this["render" + this.language]() : this.renderDefault(this.entry.content));
      this.createdAt = new Date(created_at);
      this.updatedAt = new Date(updated_at);
      this.createdAtFormatted = this.formatDate(this.createdAt);
      this.updatedAtFormatted = this.formatDate(this.updatedAt);
    }

    Entry.prototype.formatDate = function(date) {
      var day, month, year;
      day = date.getDate();
      year = date.getYear() + 1900;
      month = date.getMonth();
      return "" + month + "/" + day + "/" + year;
    };

    Entry.prototype.renderMarkdown = function() {
      return markdown.toHTML(this.entry.content);
    };

    Entry.prototype.renderDefault = function() {
      return "<pre><code>" + this.entry.content + "</code></pre>";
    };

    return Entry;

  })();

  module.exports = Entry;

}).call(this);
