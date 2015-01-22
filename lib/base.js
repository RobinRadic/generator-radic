'use strict';
var path = require('path'),

    yeoman = require('yeoman-generator'),
    _ = require('lodash'),
    semver = require('semver'),
    async = require('async'),

    radic = require('radic'),
    util = radic.util,
    cli = radic.cli;

var Generator = module.exports = function Generator(args, options) {
    var self = this;
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', {type: String, required: false});
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.slugify(this._.humanize(this.appname));

    this.config.set('appname', this.appname);

    this.pkg = require('../package.json');
    this.sourceRoot(path.join(__dirname, '../templates'));

    this.conf = new radic.Config('generator-radic');


};
util.inherits(Generator, yeoman.generators.Base);
