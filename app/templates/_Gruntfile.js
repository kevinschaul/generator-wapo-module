'use strict';

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    var distJSFile = 'dist/TWP.Module.<%= slug %>-' + pkg.version + '.min.js';
    var jsFiles = {};
    jsFiles[distJSFile] = ['build/lib.js', 'src/<%= slug %>.js'];

    var distCSSFile = 'dist/TWP.Module.<%= slug %>-' + pkg.version + '.min.css';
    var cssFiles = ['src/<%= slug %>.css'];

    grunt.initConfig({
        compress: {
            dist: {
                options: {
                    archive: 'dist/TWP.Module.<%= slug %>.zip'
                },
                files: [{
                    src: ['bower.json', 'package.json', distJSFile,
                            distCSSFile],
                    dest: '<%= slug %>'
                }]
            }
        },
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

    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-bower-concat');
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['test', 'bower_concat', 'uglify',
            'update_bower', 'cssmin', 'compress']);
    grunt.registerTask('test', ['mochaTest']);

    grunt.registerTask('update_bower', function() {
        var bowerFile = 'bower.json';
        var bowerJSON = grunt.file.readJSON(bowerFile);
        bowerJSON.main = [distJSFile, distCSSFile];
        bowerJSON.version = pkg.version;
        grunt.file.write(bowerFile, JSON.stringify(bowerJSON, null, 2));
    });
};
