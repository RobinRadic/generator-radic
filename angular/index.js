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
    this.sourceRoot(path.join(__dirname, '../templates/angular'));
};
util.inherits(Generator, Base);



Generator.prototype.doMain = function doMain() {
    var cb = this.async();
    var self = this;


    this.src.mergeJson('_package.json', 'package.json');
    this.src.mergeJson('_bower.json', 'bower.json');
    this.dest.mkdir('src/scripts');
    this.template('scripts/_app.js', 'src/scripts/app.js');
    this.template('views/layouts/default.jade', 'src/views/layouts/default.jade');
    cb();

};


Generator.prototype.doDone = function doDone() {
    this.addGenerated('angular');
    this.log.ok(chalk.green("Finished generating angular shizzle"))
};
