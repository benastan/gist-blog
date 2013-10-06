(function() {
  var Github, Smoother;

  Smoother = require('../../node_modules/breathe-easy/dist/smoother');

  Github = Smoother["new"]('https://api.github.com');

  Github.register('User', function() {
    this.base('users');
    return this.member(function() {
      this.setup(function(username) {
        this.username = username;
      });
      this.base(function() {
        return this.username;
      });
      return this.get('gists');
    });
  });

  Github.register('Gist', function() {
    this.base('gists');
    return this.member(function() {
      this.setup(function(id) {
        this.id = id;
      });
      return this.base(function() {
        return this.id;
      });
    });
  });

  Github.register('Repo', function() {
    this.base('repos');
    return this.member(function() {
      this.setup(function(owner, repo) {
        this.owner = owner;
        this.repo = repo;
      });
      return this.base(function() {
        return "" + this.owner + "/" + this.repo;
      });
    });
  });

  module.exports = Github;

}).call(this);
