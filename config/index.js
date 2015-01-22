'use strict';

var path = require('path'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    Base = require('../lib/base'),
    ScriptBase = require('../lib/script-base'),
    _ = require('lodash'),
    semver = require('semver'),
    async = require('async'),

    radic = require('radic'),
    util = radic.util,
    cli = radic.cli;



var Generator = module.exports = function Generator(args, options) {
    ScriptBase.apply(this, arguments);

    this.action = args[0];
    this.key = args[1];
    this.value = args[2];

    this.configItem = function(name, type, message, options) {
        options = options || {};
        var defaults = {
            type: type,
            name: name,
            message: message,
            default: this.conf.get(name)
        };
        return _.merge(defaults, options);
    }.bind(this);

    this.configWizard = function(done) {
        var self = this;
        cli.prompt([
            this.configItem('user.fullname', 'input', 'Your full name'),
            this.configItem('user.email', 'input', 'Your public email'),
            this.configItem('user.website', 'input', 'Your website (full url, use http://)'),
            this.configItem('credentials.github.username', 'input', 'Github username'),
            this.configItem('credentials.github.password', 'password', 'Github password'),
            this.configItem('credentials.bitbucket.username', 'input', 'Bitbucket password'),
            this.configItem('credentials.bitbucket.password', 'password', 'Bitbucket password')
        ], function (answers) {
            _.forEach(answers, function (val, key) {
                self.conf.set(key, val);
            });
            self.conf.save();
            cli.log.ok('Configuration saved!');
            done();
        });
    }.bind(this);

};
util.inherits(Generator, ScriptBase);

Generator.prototype.execute = function execute() {
    var done = this.async();
    var self = this;

    var config = this.conf;

    var action = this.action,
        key = this.key,
        value = this.value;


    if (typeof action === 'undefined') {
        cli.log.fatal('Not enough arguments, config requires an action');
    } else {
        switch (action) {
            case "show":
                util.log(config.get());
                break;
            case "wizard":
                self.configWizard(done);
                break;
            case "open":
                cli.log('Opening configuration file in text editor (' + config.get('textEditorCommand') + ')');
                var result = sh.execSync(config.get('textEditorCommand') + ' ' + config.path)
                if(result.code == 1){
                    cli.log.fatal('An error occurred while trying to open the configuration file: "' + result.stdout + '"')
                }
                done();
                break;
            case "get":
                if(util.defined(key)){
                    var val = config.get(key);
                    if(typeof val === 'object'){
                        cli.writeln(util.inspect(val, { colors: true }));
                    } else {
                        cli.writeln(val.toString());
                    }
                }
                done();
                break;
            case "set":
                if(util.defined(key) && util.defined(value)){
                    config.get(key, value, true);
                    cli.log.ok('Config key added');
                }
                done();
                break;
            case "del":
                if(util.defined(key)){
                    config.del(key, true);
                    cli.log.ok('Config key deleted');
                }
                done();
                break;
            case "clear":
                cli.prompt([{
                    name: 'clear',
                    type: 'confirm',
                    message: 'Are you sure you want to delete all configuration values?',
                    default: false
                }], function(answer){
                    if(answer.clear === true){
                        config.clear(true);
                        cli.log.ok('Configuration cleared');
                    } else {
                        cli.log.info('Operation canceled. Configuration has not been altered')
                    }
                    done();
                });

                break;
            default:
                done();
                break;
        }
    }
};


