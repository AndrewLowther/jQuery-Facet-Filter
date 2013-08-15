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
      options: {
        configFile: 'karma.conf.js'
      },
      unit: {
        browsers: ['Chrome']
      },
      // Continuous integration mode: run tests once in PhantomJS browser.
      continuous: {
        autoWatch: false,
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    shell: {
      jsdoc: {
        options: {
          stdout: true
        },
        command: 'jsdoc facetfilter.js --destination docs'
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['uglify', 'jshint', 'jsdoc']
    }
	});

	grunt.registerTask('default', [
    'jshint',
    'shell',
    'uglify',
    'karma:continuous'
  ]);
  grunt.registerTask('test', [
    'karma:unit'
  ]);

};
