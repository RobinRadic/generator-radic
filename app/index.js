'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var yosay = require('yosay');


var RadicGenerator = yeoman.generators.Base.extend({
    initializing: function () {
        this.pkg = require('../package.json');

        this.argument('appname', {type: String, required: false});
        this.appname = this.appname || path.basename(process.cwd());
        this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

    },

    prompting: function () {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the super Radic generator! ' + this.appname
        ));

        var prompts = [{
            type: 'input',
            name: 'appname',
            message: 'App name?',
            default: this.appname
        }, {
            type: 'input',
            name: 'version',
            message: 'Version?',
            default: '0.1.0'
        }];

        //this.prompt(prompts, function (props) {
            this.appname = 'radio'; // props.appname;
            this.version = '0.1.0'; //props.version;
            done();
        //}.bind(this));
    },

    writing: {

        app: function () {
            this.dest.mkdir('src');
            this.dest.mkdir('src/scripts');


            this.src.copy('_.gitignore', '.gitignore');
            this.template('_bower.json', 'bower.json');
            this.template('_config.yml', 'config.yml');
            this.src.copy('_Gruntfile.js', 'Gruntfile.js');
            // this.template('', '');
            // this.src.copy('', '')

            this.src.copy('_LICENSE', 'LICENSE');
            this.src.copy('_main.scss', 'src/styles/main.scss');
            this.template('_package.json', 'package.json');
            this.src.copy('_README.md', 'README.md');
            this.src.copy('travis.yml', 'travis.yml');
            this.src.copy('_README.md', 'README.md');


            this.directory('views', 'src/views');
        },

        projectfiles: function () {
            this.src.copy('editorconfig', '.editorconfig');
            this.src.copy('jshintrc', '.jshintrc');
        }
    },

    end: function () {
        this.installDependencies();
    }
});

module.exports = RadicGenerator;
