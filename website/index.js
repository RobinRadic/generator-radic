'use strict';
var path = require('path'),
    util = require('util'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('lodash'),
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

    if(this.generated === false){
       this.log.error('You need to generate a base project first by running ' + chalk.underline('yo radic'));
       throw new Error();
    }

    cb();

};


Generator.prototype.doMain = function doMain() {
    var cb = this.async();
    var self = this;


    var pkg = utils.readJSON(this, 'package.json');

    this.src.mergeJson('_package.json', 'package.json')

    this.options = {
        version: pkg.version
    };

    this.dest.mkdir('src');
    this.dest.mkdir('src/scripts');
    this.directory('tasks', 'src/tasks');
    this.directory('views', 'src/views');
    this.directory('styles', 'src/styles');

    this.src.copy('_Gruntfile.js', 'Gruntfile.js');

    this.template('_bower.json', 'bower.json');
    this.template('_config.yml', 'config.yml');


    this.conflicter.resolve(function () {
        cb();
    });
};

Generator.prototype.doInstall = function doInstall() {

    this.installDependencies();

};

Generator.prototype.doDone = function doDone() {
    this.addGenerated('website');
    this.log.ok(chalk.green("Finished generating your website"))
};
