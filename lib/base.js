'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    util = require('util'),
    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('lodash'),
    utils = require('./utils');

var Generator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', {type: String, required: false});
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.slugify(this._.humanize(this.appname));

    this.config.set('appname', this.appname);

    this.pkg = require('../package.json');
    this.sourceRoot(path.join(__dirname, '../templates/common'));

    this.c = utils.getConfig();
    if(this.c === null) {
        this.env.error(new Error('No config set. Run radic:config first'));
    }

    this.generated = utils.defined(this.config.get('generated'))

    var self = this;
    this.src.mergeJson = function(src, dest){
        src = path.join(self._sourceRoot, src);
        dest = path.join(self.env.cwd, dest);

        var newData = fs.readJSONFileSync(src);
        var currentData = fs.readJSONFileSync(dest);

        fs.writeJSONFileSync(dest, _.merge(currentData, newData));
    };

    this.getGenerated = function(){
        return self.config.get('generated');
    };
    this.setGenerated = function(val){
        self.config.set('generated', val);
    };
    this.addGenerated = function(val){
        var gen = self.config.get('generated');
        if(_.isArray(gen)){
            gen.push(val);
        } else {
            gen = [];
        }
        self.config.set('generated', gen);
    };

};
util.inherits(Generator, yeoman.generators.Base);
