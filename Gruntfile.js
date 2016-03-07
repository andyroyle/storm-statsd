module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'index.js',
        'lib/**'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    mochaTest: {
      all: {
        src: ['tests/**/*.js']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.registerTask('default', ['jshint', 'mochaTest']);
};
