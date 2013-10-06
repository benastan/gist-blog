(function() {
  var Blog, Entry, Github, JST, mustache;

  Github = require('./github');

  Entry = require('./entry');

  mustache = require('mustache');

  JST = require('./templates');

  Blog = (function() {
    function Blog(_arg) {
      this.username = _arg.username, this.password = _arg.password, this.repo = _arg.repo, this.branch = _arg.branch;
      this.branch || (this.branch = 'gh-pages');
      if (!this.repo) {
        this.branch || (this.branch = 'master');
        this.repo = "" + this.username + ".github.io";
      }
      this.fullRepo = "" + this.username + "/" + this.repo;
      this.repoUrl = "https://rawgithub.com/" + this.fullRepo;
      this.templatesUrl = "" + this.repoUrl + "/tree/" + this.branch + "/templates";
      this.user = Github.User["new"](this.username);
    }

    Blog.prototype.fetchEntries = function(callback) {
      var _this = this;
      return this.user.gists().done(function(gists) {
        var gist, _i, _len, _results;
        _this.entries = [];
        _results = [];
        for (_i = 0, _len = gists.length; _i < _len; _i++) {
          gist = gists[_i];
          _results.push(Github.Gist["new"](gist.id).get().done(function(gist) {
            _this.entries.push(new Entry(gist));
            if (_this.entries.length === gists.length) {
              return callback();
            }
          }));
        }
        return _results;
      });
    };

    Blog.prototype.fetchTemplates = function(callback) {
      var compiledCount, type, types, _i, _len, _results,
        _this = this;
      this.templates = {};
      compiledCount = 0;
      types = this.templateTypes();
      _results = [];
      for (_i = 0, _len = types.length; _i < _len; _i++) {
        type = types[_i];
        _results.push((function(type) {
          var addTemplate, promise;
          promise = $.get("" + _this.templatesUrl + "/" + type + ".mustache");
          addTemplate = function(template) {
            compiledCount += 1;
            _this.templates[type] = mustache.compile(template);
            if (compiledCount === types.length) {
              return callback();
            }
          };
          promise.done(function(template) {
            return addTemplate(template);
          });
          return promise.error(function() {
            return addTemplate(JST[type]);
          });
        })(type));
      }
      return _results;
    };

    Blog.prototype.render = function(object) {
      if (typeof object === 'function') {
        return this.renderContent(object);
      } else {
        return this.templates[object.constructor.name.toLowerCase()](object);
      }
    };

    Blog.prototype.templateTypes = function() {
      return ['entry'];
    };

    Blog.prototype.renderContent = function(callback) {
      var _this = this;
      if (this.content) {
        return callback(this.content);
      }
      return this.fetchEntries(function() {
        return _this.fetchTemplates(function() {
          var entry, _i, _len, _ref;
          _this.content = [];
          _ref = _this.entries;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            entry = _ref[_i];
            _this.content.push(_this.render(entry));
          }
          _this.content = _this.content.join('');
          return callback(_this.content);
        });
      });
    };

    return Blog;

  })();

  module.exports = Blog;

}).call(this);
