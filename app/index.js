'use strict';

var path = require('path'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    Base = require('../lib/base'),
    _ = require('lodash'),
    semver = require('semver'),
    async = require('async'),

    radic = require('radic'),
    util = radic.util,
    cli = radic.cli;

var Generator = module.exports = function Generator(args, options) {
    Base.apply(this, arguments);

    this.pkg = require('../package.json');


    this.on('end', function(){
        if(this.git === true){
            this.invoke('radic:gitinit')
        }
    });

};

util.inherits(Generator, Base);

Generator.prototype.welcome = function welcome() {

    this.log(yosay('The Radic generator'));
    this.log(
        cli.magenta(
            'You\'re about to generate radicalized files. Be prepared....' +
            '\n'
        ) +
        cli.green(
            'The base generator will intitialize a global project. Things like \n' +
            cli.blue('git ') + cli.red('node ') + cli.yellow('License, readme, travis, jshint ') + ' etc..'
        )
    );

    if (this.options.minsafe) {
        this.log.error(
            'The --minsafe flag has been removed. For more information, see' +
            '\nhttps://github.com/yeoman/generator-angular#minification-safe.' +
            '\n'
        );
    }



};

Generator.prototype.askGeneral = function askGeneral() {
    var cb = this.async();
    var self = this;
    this.prompt([{
        type: 'input',
        name: 'appname',
        message: 'Appname?',
        default: this.appname
    }, {
        type: 'input',
        name: 'version',
        message: 'What version?',
        default: '0.0.1'
    }, {
        type: 'confirm',
        name: 'license',
        message: 'Generate default MIT license?',
        default: true
    }, {
        type: 'confirm',
        name: 'jshint',
        message: 'Generate default .jshinitrc?',
        default: true
    }], function (props) {
        this.appname = self._.slugify(self._.humanize(props.appname));

        this.config.set('appname', this.appname);

        this.version = props.version;
        this.license = props.license;
        this.jshint = props.jshint;
        cb();
    }.bind(this));
};

Generator.prototype.askProjectType = function askProjectType() {
    var cb = this.async();
    var self = this;
    // Use git?
    this.prompt([{
        type: 'list',
        name: 'projectType',
        message: 'What kind of project (extendable afterwards with commands like yo radic:laravel, radic:website etc..)?',
        choices: [
            {value: 'composer', name: 'PHP / composer.json'},
            {value: 'node', name: 'Node website or server / package.json'},
            {value: 'other', name: 'Something else'}
        ]
    }], function (props) {
        this.projectType = props.projectType;
        cb();
    }.bind(this));
};


Generator.prototype.askGit = function askGit() {
    var cb = this.async();
    var self = this;
    // Use git?
    this.prompt([{
        type: 'confirm',
        name: 'git',
        message: 'Use git?',
        default: true
    }], function (props) {
        this.git = props.git;
        cb();
    }.bind(this));
};



// appname, version, license, jshint, projectType, git, gitGenerate, gitCommit, gitRemote,
// gitRemoteType, gitUsername, gitPassword, gitOwner, gitRepository, gitPush

Generator.prototype.doGeneral = function doGeneral() {

    this.data = {
        date: new Date(Date.now()),
        user: this.radic.config.get('general')
    };
    this.data.year = this.data.date.getFullYear();

    if(this.license === true) {
        this.src.copy('_LICENSE', 'LICENSE');
    }
    this.template('_README.md', 'README.md');
    this.src.copy('editorconfig', '.editorconfig');
    if (this.jshint === true) {
        this.src.copy('jshintrc', '.jshintrc');
    }
    this.src.copy('travis.yml', '.travis.yml');

    if(this.projectType === 'node'){
        utils.createNode(this);
    } else if(this.projectType === 'composer'){
        utils.createComposer(this)
    }

    this.config.set('type', this.projectType);
    this.addGenerated('project');
};

