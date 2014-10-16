'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var radic = require('../radic.js');
var _ = require('underscore');
var chalk = require('chalk');


var RadicJqPluginGenerator = yeoman.generators.NamedBase.extend({
    initializing: function () {
        this.pkg = require('../package.json');
        this.pluginName = this.args[0];
    },

    prompting: function () {
        var done = this.async();
        //console.log(this);
        // Have Yeoman greet the user.
        this.log(yosay('Starting generator for ' + this.options.namespace));

        var prompts = [
            {
                type: 'input',
                name: 'pluginName',
                message: 'Plugin name name? (without extension)',
                default: this.pluginName //+ '.js'
            },
            {
                type: 'input',
                name: 'jqVersion',
                message: 'jQuery version?',
                default: '*' //+ '.js'
            }
        ];

        // defaults
        this.options = {
            pluginName: '',
            dirPath: '',
            fileName: '',
            jqVersion: '*',
            jqSafeName: ''
        };

        // user config
        this.prompt(prompts, function (props) {
            this.pluginName = props.pluginName;
            _.extend(this.options, {
                pluginName: props.pluginName,
                dirPath: path.join(process.env.cwd, props.pluginName),
                fileName: props.pluginName + '.jquery.js',
                jqVersion: props.jqVersion,
                jqSafeName: props.pluginName
            });
            this.destinationRoot(this.options.dirPath);
            done();
        }.bind(this));



    },

    writing: {

        app: function () {

            this.src.copy('_Gruntfile.js', 'Gruntfile.js');
            this.src.copy('gitignore', '.gitignore');

            this.template('_package.json', 'package.json');

            this.mkdir('src');
            this.mkdir('test');
            this.directory('libs', 'libs');

            this.src.copy('src/.jshintrc', 'src/.jshintrc');
            this.template('src/name.js', 'src/' + this.pluginName + '.jquery.js');

            this.src.copy('test/.jshintrc', 'test/.jshintrc');
        },

        projectfiles: function () {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function () {

        this.installDependencies({ bower: false });
    }
});

module.exports = RadicJqPluginGenerator;
