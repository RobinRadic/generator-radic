'use strict';
var path = require('path'),

    yeoman = require('yeoman-generator'),
    _ = require('lodash'),
    semver = require('semver'),
    async = require('async'),
    Base = require('./base'),

    radic = require('radic'),
    util = radic.util,
    cli = radic.cli;


var Generator = module.exports = function Generator() {
  Base.apply(this, arguments);

  //this.argument('name', { type: String, required: false });

  try {
    this.appname = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));


};
util.inherits(Generator, Base);
