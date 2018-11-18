module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourcemap: false
      },
      dist: {
        files: {
          'css/custom.css' : 'scss/main.scss'
        }
      }
    },
    watch: {
      options: {
        livereload: true,
        sourcemap: false
      },
      css: {
        files: ['scss/**/*.scss'],
        tasks: ['sass']
      },
    },
  });
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['sass', 'watch']);

}