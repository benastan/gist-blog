var project = require('grunt-coffee-browser-project');

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mustache');
  project.init(grunt, {
    mustache: {
      files: {
        src: 'templates',
        dest: 'dist/gist-blog/templates.js',
        options: {
          prefix: 'module.exports = ',
          postfix: ';',
          verbose: true
        }
      }
    },
    watch: {
      'default': {
        files: [ 'templates/**/*', 'src/**/*.coffee' ],
        tasks: [ 'mustache', 'default' ]
      }
    }
  });
};
