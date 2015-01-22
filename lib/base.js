'use strict';
var fs = require('fs-extra'),
    path = require('path'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('lodash'),
    semver = require('semver'),

    radic = require('radic'),
    util = radic.util;

var Generator = module.exports = function Generator(args, options) {
    var self = this;
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', {type: String, required: false});
    this.appname = this.appname || path.basename(process.cwd());
    this.appname = this._.slugify(this._.humanize(this.appname));

    this.config.set('appname', this.appname);

    this.pkg = require('../package.json');
    this.sourceRoot(path.join(__dirname, '../templates/common'));

    this.radic = radic.app;

    var configured = this.radic.config.get('isConfigured');
    if (util.defined(configured) === false) {
        this.env.error(new Error('No config set. Run radic:config first'));
    } else if (typeof configured === 'string' && semver.valid(configured)) {
        if (!semver.gte(configured, this.pkg.version)) {
            this.env.error(new Error('Configuration(' + configured + '/' + this.pkg.version + ') is outdated. Run radic:config.'));
        }
    }

    this.generated = util.defined(this.config.get('generated'));

    //  { "a" } 'string'
    this.src.mergeJson = function (src, dest) {

        var currentData, newData;
        if (typeof src === 'string') {
            src = path.join(self._sourceRoot, src);
            newData = fs.readJSONFileSync(src);
        } else {
            newData = src;
        }

        if (typeof dest === 'string') {
            dest = path.join(self.env.cwd, dest);
            currentData = fs.readJSONFileSync(dest);
        } else {
            currentData = dest;
        }

        fs.writeJSONFileSync(dest, _.merge(currentData, newData));
    };

    this.hasGenerated = function (what) {
        return self.config.get('generated').indexOf(what) !== -1;
    };
    this.requireGenerated = function () {
        var requirements = _.toArray(arguments);
        _.each(requirements, function (req) {
            if (!this.hasGenerated(req)) {
                this.env.error(new Error('This generator requires ' + req + ' to be runned first'));
            }
        }.bind(this))
    };

    this.getGenerated = function () {
        return self.config.get('generated');
    };
    this.setGenerated = function (val) {
        self.config.set('generated', val);
    };
    this.addGenerated = function (val) {
        var gen = self.config.get('generated');
        if (_.isArray(gen)) {
            gen.push(val);
        } else {
            gen = [];
        }
        self.config.set('generated', gen);
    };

    this.createConfig = function (filePath) {
        return new radic.Config('', {path: filePath, ext: ''});
    }

};
util.inherits(Generator, yeoman.generators.Base);
