'use strict';
var path = require('path'),
    util = require('util'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('underscore'),
    fs = require('fs-extra'),
    async = require('async'),

    utils = require('../lib/utils'),
    defined = utils.defined,
    Base = require('../lib/base.js'),
    git = require('../lib/git').git,
    common = require('../lib/common'),
    gitremote = require('../lib/gitremote');


var Generator = module.exports = function Generator(args, options, config) {
    var that = this;
    Base.apply(this, arguments);
};
util.inherits(Generator, Base);

Generator.prototype.askGit = function askGit() {
    var cb = this.async();
    var self = this;



    // Use git?
    this.prompt([{
        type: 'confirm',
        name: 'gitGenerate',
        message: 'Generate .gitignore, .gitattributes?',
        default: true
    },
        common.q.gitCommitMessage,
        {
            type: 'list',
            name: 'gitRemote',
            message: 'Add a remote or create a new remote repository (github or bitbucket)?',
            choices: ['dont', 'add', 'create']
        }], function (props) {
        this.gitGenerate = props.gitGenerate;
        this.gitCommitMessage = props.gitCommitMessage;
        this.gitRemote = props.gitRemote;
        cb();
    }.bind(this));
};

Generator.prototype.askGitRemote = function askGitExtra() {
    var cb = this.async();
    var self = this;

    if (this.gitRemote === 'dont') {
        return cb();
    }

    var q = _.pick(common.q, 'gitRemoteType', 'gitRepository', 'gitOwner', 'gitPush')

    var prompts = [];
    if (this.gitRemote === 'add') {
        prompts.push(q.gitRemoteType, q.gitOwner, q.gitRepository);
    } else if (this.gitRemote === 'create') {
        prompts.push(q.gitRemoteType, q.gitOwner, q.gitRepository, q.gitPush);
    } else {
        // whuut?
        return cb();
    }
    // Use git?
    this.prompt(prompts, function (props) {
        this.gitRemoteType = props.gitRemoteType;
        this.gitOwner = props.gitOwner;
        this.gitRepository = props.gitRepository;
        if (this.gitRemote === 'create') {
            this.gitUsername = props.gitUsername;
            this.gitPassword = props.gitPassword;
            this.gitPush = props.gitPush;
        }
        cb();
    }.bind(this));
};

Generator.prototype.doGit = function doGit() {
    var cb = this.async();
    var self = this;
    async.waterfall([
        function (done) {
            git.init(function (err, out) {
                self.log.ok('Initialized git');
                done(err);
            });
        },
        function (done) {
            self.src.copy('_.gitignore', '.gitignore');
            self.conflicter.resolve(function () {
                done(null);
            });
        },
        function (done) {
            git.addAll(function (err, out) {
                self.log.ok('Added all files to git');
                done(err);
            })
        },
        function (done) {
            git.commit(self.gitCommitMessage, function (err, out) {
                self.log.ok('Commited pending files');
                done(err);
            });
        }
    ], function (err, result) {
        if(err) self.env.error(new Error(err));
        cb();
    });
};

Generator.prototype.doGitRemote = function doGitRemote() {
    var cb = this.async();
    var self = this;
    if (this.gitRemote === 'dont') {
        return cb();
    }

    var prefix = this.c.bitusername + ':' + this.c.bitpassword + '@';
    if(this.gitRemoteType === 'github'){
        prefix = this.c.gitusername + ':' + this.c.gitpassword + '@';
    }
    var remoteUrl = utils.getGitRemoteUrl(this.gitRemoteType, false, prefix) + '/' + this.gitOwner + '/' + this.gitRepository;

    async.waterfall([
        function (done) {
            git.remote.add('origin', remoteUrl, function (err, out) {
                self.log.ok('Added remote origin ' + self.gitRemoteType);
                done(err);
            });
        },
        function (done) {
            if(self.gitRemote !== 'create') return done(null);

            gitremote[self.gitRemoteType].repos.create(self.gitOwner, self.gitRepository, null, function(err, out){
                self.log.ok('Created remote repository' + self.gitOwner + '/' + self.gitRepository);
                done(err);
            }, true);

        },
        function (done) {
            if(self.gitPush !== true) return done(null);
            git.push('origin', 'master', function (err, out) {
                self.log.ok('Pushed origin master to ' + self.gitRemoteType);
                done(err);
            });
        }
    ], function (err, result) {
        if(err) self.env.error(new Error(err));
        cb();
    });
};

Generator.prototype.doDone = function doDone() {

    this.log.ok(chalk.green("Finished gitinit"))
};
