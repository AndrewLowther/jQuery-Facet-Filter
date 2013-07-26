/*global module:false, require:false */
module.exports = function (grunt) {
  // 'use strict';

	// Load all grunt tasks.
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
        mangle: false,
				banner: '/*! <%= pkg.name %> - version <%= pkg.version %> */\n'
			},
			build: {
        src: '<%= pkg.scripts.main %>',
        dest: '<%= pkg.scripts.minified %>'
      }
		},
    jshint: {
      options: {
        browser: true,
        devel: true,
        eqeqeq: false,
        jquery: true,
        smarttabs: true,
        undef: true,
        unused: false
      },
      files: ['Gruntfile.js', '<%= pkg.scripts.main %>']
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['uglify', 'jshint']
    }
	});

	grunt.registerTask('default', ['uglify', 'jshint']);

  grunt.registerTask('test', ['karma']);
};
