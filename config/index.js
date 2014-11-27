'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    util = require('util'),
    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('underscore'),
    utils = require('../lib/utils');

var Generator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);
};
util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {

    var u = utils.resolveUserData();
    this.c = {
        name: u.name,
        email: u.email,
        website: null,
        license: 'MIT',
        licenselink: null,
        gitusername: u.github.username,
        gitpassword: u.github.password,
        bitusername: u.bitbucket.username,
        bitpassword: u.bitbucket.password
    };
    this.firstrun = true;
    var config = utils.getConfig();
    if(config !== null){
        _.extend(this.c, config);
        this.firstrun = false;
    }

    this.log(yosay('The Radic config generator'));
    this.log(
        chalk.green(
            'This will set a global configuration in order to minimize your time spend answering questions \n'
        )
    );

};

Generator.prototype.askGeneral = function askGeneral() {
    var cb = this.async();
    var self = this;
    this.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Your name',
            default: this.c.name
        },
        {
            type: 'input',
            name: 'email',
            message: 'Your email',
            default: this.c.email
        },
        {
            type: 'input',
            name: 'website',
            message: 'Your website (write fully like: http://yourweb.com)?',
            default: this.c.website
        },
        {
            type: 'input',
            name: 'license',
            message: 'License that you\'re commonly using?',
            default: this.c.license
        },
        {
            type: 'input',
            name: 'licenselink',
            message: 'A weblink to your license (tip: check out github.com/remy/mit-license for awesome permalink MIT license generation)',
            default: this.c.licenselink
        },
        {
            type: 'input',
            name: 'gitusername',
            message: 'Github username',
            default: this.c.gitusername
        },
        {
            type: 'password',
            name: 'gitpassword',
            message: 'Github password',
            default: this.c.gitpassword
        },
        {
            type: 'input',
            name: 'bitusername',
            message: 'Bitbucket username',
            default: this.c.bitusername
        },
        {
            type: 'password',
            name: 'bitpassword',
            message: 'Bitbucket password',
            default: this.c.bitpassword
        }
    ], function (props) {
        utils.writeConfig(props);
        cb();
    }.bind(this));
};

Generator.prototype.done = function done() {
    this.log(chalk.green("\nConfiguration done.\n"));
};

