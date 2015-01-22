'use strict';
var path = require('path'),


    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    async = require('async'),

    radic = require('radic'),
    git = radic.git,

    util = radic.util,
    defined = util.defined,

    Base = require('../lib/base.js');


var Generator = module.exports = function Generator(args, options, config) {
    Base.apply(this, arguments);
    var self = this;

    this._arguments = [];
    this.argument('what', { type: String, required: true });

    this.projectType = this.config.get('type');
    if(this.projectType !== 'node'){
      //  this.env.error(new Error('Can only do this for a node project'));
    }
    this.sourceRoot(path.join(__dirname, '../templates/grunt'));
    //this.requireGenerated('project', 'gitinit');
    this.props = {};
};
util.inherits(Generator, Base);

Generator.prototype.askFirst = function askFirst() {
    require('./' + this.what).apply(this);
};
/*
Generator.prototype.askGeneral = function askGit() {
    var cb = this.async();
    var self = this;

    // project title, use jsdoc? create default test?
    this.prompt([{
        type: 'input',
        name: 'title',
        message: 'Project title?'
    },{
        type: 'confirm',
        name: 'bower',
        message: 'Use bower?'
    },{}], function (props) {
        _.extend(this.props, props);
        cb();
    }.bind(this));
};
*/
