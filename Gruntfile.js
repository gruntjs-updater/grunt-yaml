/*
 * grunt-yaml
 * https://github.com/shiwano/grunt-yaml
 *
 * Copyright (c) 2012 Shogo Iwano
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        'test/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    yaml: {
      default_options: {
        files: [
          {expand: true, cwd: 'test/fixtures/', src: ['**/*.yml'], dest: 'tmp/default_options/'}
        ]
      },
      custom_options: {
        options: {
          ignored: /^_/,
          space: 2,
          customTypes: {
            '!include scalar': function(value, yamlLoader) {
              return yamlLoader(value);
            },
            '!max sequence': function(values) {
              return Math.max.apply(null, values);
            },
            '!extend mapping': function(value, yamlLoader) {
              return _.extend(yamlLoader(value.basePath), value.partial);
            }
          }
        },
        files: [
          {expand: true, cwd: 'test/fixtures/', src: ['**/*.yml'], dest: 'tmp/custom_options/'}
        ]
      },
      middleware_options: {
        options: {
          disableDest: true,
          middleware: function(response, json){
            grunt.file.write('tmp/middleware_options/response.json', JSON.stringify(response));
            grunt.file.write('tmp/middleware_options/json.json', json);
          }
        },
        files: {
          'tmp/middleware_options/middleware.json': ['test/fixtures/middleware.yml']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'yaml', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
