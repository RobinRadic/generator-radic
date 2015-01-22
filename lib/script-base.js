'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var radic = require('radic');


var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  //this.argument('name', { type: String, required: false });

  try {
    this.appname = require(path.join(process.cwd(), 'package.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));

  this.pkg = require('./../package.json');
  this.sourceRoot(path.join(__dirname, 'templates/common'));

  this.conf = new radic.Config('generator-radic');

};
util.inherits(Generator, yeoman.generators.Base);
