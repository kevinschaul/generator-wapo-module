'use strict';

var _ = require('underscore');
var exec = require('child_process').exec;
var fs = require('fs');
var updateNotifier = require('update-notifier');
var util = require('util');
var path = require('path');
var pkg = require('../package.json');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

updateNotifier({
    packageName: pkg.name,
    packageVersion: pkg.version
}).notify();

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);

        this.pkg = require('../package.json');
    },

    askFor: function() {
        var done = this.async();

        this.log(yosay('Let’s make a module!'));

        var prompts = [{
            name: 'name',
            message: 'What is the module name?',
            validate: function(input) {
                if (!input) {
                    return 'The name cannot be empty.'
                }
                return true;
            }
        }, {
            name: 'slug',
            message: 'What is the module slug?',
            validate: function(input) {
                var re = new RegExp('^[a-zA-Z0-9\-]+$');
                if (!input.match(re)) {
                    return 'The slug must be an alphanumeric string (hypens ' +
                            'are also allowed).';
                }
                return true;
            }
        }, {
            name: 'description',
            message: 'A short description of the module:',
            validate: function(input) {
                if (!input) {
                    return 'The description cannot be empty.'
                }
                return true;
            }
        }];

        this.prompt(prompts, function(props) {
            this.name = props.name;
            this.slug = props.slug;
            this.description = props.description;

            done();
        }.bind(this));
    },

    moduleFiles: function() {
        this.mkdir('src');
        this.mkdir('dist');
        this.mkdir('example');

        this.template('_README.md', 'README.md');
        this.template('_package.json', 'package.json');
        this.template('_Gruntfile.js', 'Gruntfile.js');
        this.template('_bower.json', 'bower.json');

        this.template('_src.js', 'src/' + this.slug + '.js');
        this.template('_src.css', 'src/' + this.slug + '.css');
        this.template('_example.html', 'example/index.html');
    },

    install: function() {
        this.on('end', function () {
            this.installDependencies({
                callback: function() {
                    this.emit('dependenciesInstalled');
                }.bind(this)
            });
        });

        this.on('dependenciesInstalled', function() {
            this.spawnCommand('grunt');
        });
    }
});
