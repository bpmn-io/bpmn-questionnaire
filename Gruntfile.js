'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  // project configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      src: [ 'lib' ],
      options: {
        jshintrc: true
      }
    },

    karma: {
      options: {
        configFile: 'test/config/karma.conf.js'
      },
      single: {
        singleRun: true,
        autoWatch: false,
        browsers: [ 'Chrome' ]
      },
      unit: {
        browsers: [ 'Chrome' ]
      }
    },

    css_wrap: {
      compile: {
        src: 'dist/css/bpmn-questionnaire.css',
        dest: 'dist/css/bpmn-questionnaire.css',
        options: {
          selector: '.bpmn-questionnaire'
        }
      }
    },

    cssmin: {
      concat: {
        files: {
          'dist/css/bpmn-questionnaire.css': [
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'assets/css/app.css'
          ]
        }
      },
      minify: {
        files: [{
          expand: true,
          cwd: 'dist/css',
          src: ['*.css', '!*.min.css'],
          dest: 'dist/css',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      css: {
        files: 'assets/css/**/*.css',
        tasks: ['build-css']
      },
      js: {
        files: [ 'lib/**/*.js', 'test/**/*.css' ],
        tasks: [ 'build-js' ]
      }
    },

    browserify: {
      dist: {
        src: 'lib/BpmnQuestionnaire.js',
        dest: 'dist/js/bpmn-questionnaire.js',
        options: {
          browserifyOptions: {
            standalone: 'BpmnQuestionnaire'
          }
        }
      }
    },

    uglify: {
      main: {
        files: {
          'dist/js/bpmn-questionnaire.min.js': ['dist/js/bpmn-questionnaire.js']
        }
      }
    }

  });


  // Tasks
  grunt.registerTask('build-css', [ 'cssmin:concat', 'css_wrap', 'cssmin:minify' ]);
  grunt.registerTask('build-js', [ 'browserify:dist', 'uglify' ]);
  grunt.registerTask('test', [ 'karma:single' ]);
  grunt.registerTask('auto-test', [ 'karma:unit' ]);
  grunt.registerTask('build', [ 'build-js', 'build-css' ]);
  grunt.registerTask('auto-build', [ 'watch:js', 'watch:css' ]);

};