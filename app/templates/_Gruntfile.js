'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var distJSFile = 'dist/TWP.Module.<%= slug %>-' + pkg.version + '.min.js';
    var jsFiles = {};
    jsFiles[distJSFile] = ['build/lib.js', 'src/<%= slug %>.js'];

    var distCSSFile = 'dist/TWP.Module.<%= slug %>-' + pkg.version + '.min.css';
    var cssFiles = ['src/<%= slug %>.css'];

    grunt.initConfig({
        mochaTest: {
            test: {
                src: ['test/**/*.js']
            }
        },
        bower_concat: {
            dist: {
                exclude: ['jquery'],
                dest: 'build/lib.js'
            }
        },
        cssmin: {
            dist: {
                src: cssFiles,
                dest: distCSSFile
            }
        },
        uglify: {
            dist: {
                files: jsFiles
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['test', 'bower_concat', 'uglify', 'cssmin']);
    grunt.registerTask('test', ['mochaTest']);
};

