module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['./public/javascripts/*.js'],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {
          './public/javascripts/bundle.js': ['./public/javascripts/main.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
};
