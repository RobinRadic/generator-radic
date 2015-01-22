'use strict';
var path = require('path'),


    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('lodash'),
    //fs = require('fs-extra'),
    async = require('async'),

    radic = require('radic'),
    git = radic.git,

    util = radic.util,
    defined = util.defined,

    Base = require('../lib/base.js'),

    common = require('../lib/common'),
    gitremote;

function getGitRemoteUrl(name, api, prefix){
    prefix = prefix || '';
    var url = 'https://' + prefix;
    if(api && name == 'github'){
        url += 'api.github.com';
    } else if(api && name == 'bitbucket'){
        url += 'bitbucket.org/api/2.0'
    } else {
        url += name + (name === 'github' ? '.com' : '.org')
    }
    return url;
}

var Generator = module.exports = function Generator(args, options, config) {
    var that = this;
    Base.apply(this, arguments);
    this._arguments = [];
    this.argument('what', { type: String, required: false });
    console.log();
};
util.inherits(Generator, Base);

Generator.prototype.askGit = function askGit() {

    var cb = this.async();
    if(this.what == 'remote') return cb();
    var self = this;


    this.prompt([{
        type: 'confirm',
        name: 'gitGenerate',
        message: 'Generate .gitignore, .gitattributes?',
        default: true
    },{
        type: 'confirm',
        name: 'gitCommit',
        message: 'commit?',
        default: true
    }], function (props) {
        this.gitGenerate = props.gitGenerate;
        this.gitCommit = props.gitCommit;
        if(this.gitCommit == true){
            this.prompt([common.q.gitCommitMessage], function(p){
                this.gitCommitMessage = p.gitCommitMessage;
                cb();
            }.bind(this))
        } else {
            cb();
        }

    }.bind(this));
};
Generator.prototype.askGitRemoteProvider = function askGitRemoteProvider() {

    var cb = this.async();
    this.prompt([{
        type: 'list',
        name: 'gitRemote',
        message: 'Add a remote or create a new remote repository (github or bitbucket)?',
        choices: ['dont', 'add', 'create']
    }], function(opts){
        this.gitRemote = opts.gitRemote;
        cb();
    }.bind(this));
};

Generator.prototype.askGitRemote = function askGitRemote() {
    var cb = this.async();
    var self = this;

    if (this.gitRemote === 'dont') {
        return cb();
    }

    var q = _.pick(common.q, 'gitRemoteProvider', 'gitRepository', 'gitOwner', 'gitPush')

    var prompts = [];
    if (this.gitRemote === 'add') {
        prompts.push(q.gitRemoteProvider, q.gitOwner, q.gitRepository);
    } else if (this.gitRemote === 'create') {
        prompts.push(q.gitRemoteProvider, q.gitOwner, q.gitRepository, q.gitPush);
    } else {
        // whuut?
        return cb();
    }

    if(this.projectType === 'node'){
        prompts.push({
            type: 'confirm',
            message: 'Add git repository to package.json?',
            default: true,
            name: 'gitRepo2Pkg'
        })
    }

    // Use git?
    this.prompt(prompts, function (props) {
        this.gitRemoteProvider = props.gitRemoteProvider;
        this.gitOwner = props.gitOwner;
        this.gitRepository = props.gitRepository;
        this.gitRepo2Pkg = props.gitRepo2Pkg;
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

    var providerConfig = this.radic.config.get('git.providers.' + this.gitRemoteProvider);
    var prefix = providerConfig.username + ':' + providerConfig.password + '@';
    var remoteUrl = getGitRemoteUrl(this.gitRemoteProvider, false, prefix) + '/' + this.gitOwner + '/' + this.gitRepository;

    async.waterfall([
        function(done){
            if(this.projectType === 'node'){
                this.prompt([{
                    type: 'confirm',
                    message: 'Add repository to package.json?',


                }])
            }
        }.bind(this),
        function (done) {
            git.remote.add('origin', remoteUrl, function (err, out) {
                self.log.ok('Added remote origin ' + self.gitRemoteProvider);
                done(err);
            });
        },
        function (done) {
            if(self.gitRemote !== 'create') return done(null);

            git.getApi(self.gitRemoteProvider).repos.create(self.gitOwner, self.gitRepository, null, function(err, out){
                self.log.ok('Created remote repository' + self.gitOwner + '/' + self.gitRepository);
                done(err);
            }, true);

        },
        function (done) {
            if(self.gitPush !== true) return done(null);
            git.push('origin', 'master', function (err, out) {
                self.log.ok('Pushed origin master to ' + self.gitRemoteProvider);
                done(err);
            });
        }
    ], function (err, result) {
        if(err) self.env.error(new Error(err));
        cb();
    });
};

Generator.prototype.doDone = function doDone() {
    this.addGenerated('gitinit');
    this.log.ok(chalk.green("Finished gitinit"))
};
