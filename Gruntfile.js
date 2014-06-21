module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);
  grunt.loadNpmTasks('grunt-uncss');

  var dir = {
    app: 'app',
    dist: 'dist',
  };

  grunt.initConfig({

    /*--------------------------------------------------------*/

    app:   dir.app,
    dist:  dir.dist,

    /*--------------------------------------------------------*/

    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= dist %>/*'
          ]
        }]
      },
      server: '.tmp'
    },

    /*--------------------------------------------------------*/

    connect: {
      server: {
        options: {
          port: 9000,
          hostname: 'localhost',
          livereload: true,
          middleware: function (connect) {
            return [
              connect.static(require('path').resolve( '.tmp' )),
              connect.static(require('path').resolve( dir.app ))
            ];
          }
        }
      }
    },

    /*--------------------------------------------------------*/

    copy:{
      styles: {
        expand: true,
        cwd: '<%= app %>/css',
        dest: '.tmp/',
        src: '{,*/}*.css'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= app %>',
          dest: '<%= dist %>',
          src: [
            '*.{ico,png,txt}',
            'img/*.{png,jpeg,jpg}',
            'pt-br/*',
            '*.html'
          ]
        }]
      },
    },

    /*--------------------------------------------------------*/

    cssmin: {
      options:{
        keepSpecialComments: 0
      },
      minifyuncss: {
        files:{
          'dist/css/style.min.css': ['dist/css/style.css']
        }
      }
    },

    /*--------------------------------------------------------*/

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['<%= app %>/js/vendor/*', '<%= app %>/js/require.js']
      },
      all: [
        'Gruntfile.js',
        '<%= app %>/js/{,*/}*.js'
      ]
    },

    /*--------------------------------------------------------*/

    requirejs: {
      compile: {
        options: {
          baseUrl: '<%= app %>/js/',
          name: 'main',
          out: '<%= dist %>/js/main.js'
        }
      }
    },

    /*--------------------------------------------------------*/

    uglify: {
      options: {
        mangle: false,
        banner: '<%= banner %>'
      }
    },

    /*--------------------------------------------------------*/

    uncss: {
      options: {
        ignore: ['.active-bar', '.message-log', '.door-chosen', '.door-zonk', '.door-car', '.door-wrong', '.door-car-was', 'td.green', 'td.blue', 'td.red', '#status.won', '#status.lose']
      },
      dist: {
        files: {
          '<%= dist %>/css/style.css': ['<%= dist %>/index.html']
        }
      }
    },

    /*--------------------------------------------------------*/

    useminPrepare: {
      html: '<%= app %>/index.html',
      options: {
        dest: '<%= dist %>'
      }
    },

    /*--------------------------------------------------------*/

    usemin: {
      html: ['<%= dist %>/index.html'],
      css: ['<%= dist %>/css/{,*/}*.css'],
      options: {
        dirs: ['<%= dist %>']
      }
    },

    /*--------------------------------------------------------*/

    watch: {
      options: {
        livereload: true
      },
      css: {
        files: '<%= app %>/css/{,*/}*.css',
        tasks: 'copy:styles'
      },
      js: {
        files: '<%= jshint.all %>',
        tarks: 'jshint'
      },
      html: {
        files: '<%= app %>/*.html'
      },
      json: {
      files: '<%= app %>/js/{,*/}*.json',
      }
    }

    /*--------------------------------------------------------*/

  });

  grunt.registerTask( 'default', [
    'dist'
  ]);

  grunt.registerTask( 'dist', [
    'jshint',
    'clean:dist',
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin:generated',
    'copy:dist',
    'usemin',
    'uncss',
    'cssmin:minifyuncss'
  ]);

  grunt.registerTask( 'server', [
    'clean:server',
    'copy:styles',
    'connect',
    'watch'
  ]);

};