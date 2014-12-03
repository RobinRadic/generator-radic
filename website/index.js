'use strict';
var path = require('path'),
    util = require('util'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('underscore'),
    fs = require('fs-extra'),
    async = require('async'),

    utils = require('../lib/utils'),
    Base = require('../lib/base.js'),
    git = require('../lib/git').git,
    common = require('../lib/common'),
    gitremote = require('../lib/gitremote');


var Generator = module.exports = function Generator(args, options, config) {
    var that = this;
    Base.apply(this, arguments);
    this.sourceRoot(path.join(__dirname, '../templates/website'));
};
util.inherits(Generator, Base);

Generator.prototype.ask = function ask() {
    var cb = this.async();
    var self = this;

    return cb();
    if(this.generated === false){
       // this.log.error('You need to generate a base project first by running ' + chalk.underline('yo radic'));
       // throw new Error();
    }
    // source dir (src)
    // build dir (build)
    // dist dir (dist)

    this.o = {};

    this.prompt([
        {
            type: 'input',
            name: 'source',
            message: 'Source directory path?',
            default: 'src'
        },
        {
            type: 'input',
            name: 'build',
            message: 'Build directory path?',
            default: 'build'
        },
        {
            type: 'input',
            name: 'dist',
            message: 'Distribution directory path?',
            default: 'dist'
        }
    ], function (props) {
        _.extend(this.o, props);
        cb();
    }.bind(this));
};


Generator.prototype.doMain = function doMain() {
    var cb = this.async();
    var self = this;


    this.dest.mkdir('src');
    this.dest.mkdir('src/scripts');
    this.template('_bower.json', 'bower.json');
    this.template('_package.json', 'package.json');
    this.template('_config.yml', 'config.yml');
    this.src.copy('_Gruntfile.js', 'Gruntfile.js');
    this.directory('views', 'src/views');
    this.directory('styles', 'src/styles');
    this.conflicter.resolve(function () {
        cb();
    });
};

Generator.prototype.doInstall = function doInstall() {

    this.installDependencies();

};

Generator.prototype.doDone = function doDone() {
    this.log.ok(chalk.green("Finished generating your website"))
};
