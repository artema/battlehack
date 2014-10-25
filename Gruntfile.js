module.exports = function(grunt) {

  var AWS = require('aws-sdk');
  var credentials = grunt.file.readJSON('.deploy/awscredentials.json');

  var pkg = grunt.file.readJSON('package.json');

  // Project configuration.
  grunt.initConfig({
    pkg: pkg,
    concurrent: {
      dev: {
        tasks: ['nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    nodemon: {
      dev: {
        script: './bin/www',
        nodeArgs: ['--debug'],
        options: {
          env: {
            PORT: 3000,
            DEBUG: true
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });
          }
        }
      }
    },
    watch: {
      scripts: {
        files: '**/*.js',
        tasks: [],
        options: {
          interrupt: true,
        }
      }
    },
    zip: {
      deploy: {
        src: [
          'bin/**/*',
          'public/**/*',
          'routes/**/*',
          'views/**/*',
          'app.js',
          'package.json'
        ],
        dest: '.deploy/' + pkg.version + '.zip'
      }
    },
    awsebtdeploy: {
      deploy: {
        options: {
          applicationName: 'battlehack-web',
          healthPage: '/',
          region: credentials.region,
          accessKeyId: credentials.key,
          secretAccessKey: credentials.secret,
          environmentCNAME: credentials.env,
          versionLabel: pkg.version,
          deployTimeoutMin: 5,
          healthPageTimeoutMin: 1,
          sourceBundle: '.deploy/' + pkg.version + '.zip',
          s3: {
            bucket: credentials.bucket,
            key: pkg.name + ' ' + pkg.version + '.zip'
          }
        }
      }
    },
    bump: {
      options: {
        files: ['package.json'],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json'],
        createTag: false,
        push: false
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-awsebtdeploy');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-zip');

  // Default task(s).
  grunt.registerTask('default', []);
  grunt.registerTask('dev', ['concurrent']);
  grunt.registerTask('deploy', ['bump', 'zip:deploy', 'awsebtdeploy:deploy']);

};
