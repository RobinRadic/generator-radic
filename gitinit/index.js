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

var git = radic.binwraps.create('git');

var Generator = module.exports = function Generator(args, options, config) {
    var that = this;
    Base.apply(this, arguments);
    this._arguments = [];
    this.argument('what', { type: String, required: false });
    console.log();
};
util.inherits(Generator, Base);

Generator.prototype.execute = function execute() {

    var done = this.async();
    var self = this;
    var config = this.conf;

    var prompts = {
        generate: {
            name: 'generate',
            type: 'confirm',
            message: 'Generate a .gitignore?', //'Which files should i generate?',
            default: true
        },
        add: {
            name: 'add',
            type: 'confirm',
            message: 'Git add all?',
            default: true
        },
        commit: {
            name: 'commit',
            type: 'confirm',
            message: 'Commit?',
            default: true
        },
        commitMessage: {
            name: 'commitMessage',
            type: 'input',
            message: 'Commit message',
            default: 'Initial commit'
        },
        remote: {
            name: 'remote',
            type: 'list',
            message: 'Do you want to define/create a remote?',
            choices: ['create', 'add', 'skip'],
            default: 'create'
        },
        remoteProvider: {
            name: 'remoteProvider',
            type: 'list',
            message: 'Remote provider',
            choices: ['github', 'bitbucket'],
            default: 'github'
        },
        remoteOwner: {
            name: 'remoteOwner',
            type: 'input',
            message: 'Remote owner/user',
            default: 'Initial commit'
        },
        remoteRepo: {
            name: 'remoteRepo',
            type: 'input',
            message: 'Repository name',
            default: path.basename(process.cwd())
        },
        push: {
            name: 'push',
            type: 'confirm',
            message: 'Do you want to push to remote?',
            default: true
        }
    };
    var answers = this.answers = {};
    async.waterfall([
        function(next){
            cli.prompt([prompts.generate, prompts.add, prompts.commit], function(opts){
                _.merge(answers, opts);
                next();
            })
        },
        function(next){
            var proms = [];
            if(answers.commit === true){
                proms.push(prompts.commitMessage);
            }
            proms.push(prompts.remote);
            cli.prompt(proms, function(opts){
                _.merge(answers, opts);
                next();
            })
        },
        function(next){
            if(answers.remote === 'skip') return next();
            cli.prompt([prompts.remoteProvider], function(opts){
                _.merge(answers, opts);
                next();
            })
        },
        function(next){
            if(answers.remote === 'skip') return next();
            prompts.remoteOwner.default = config.get('credentials.' + answers.remoteProvider + '.username');
            cli.prompt([prompts.remoteOwner, prompts.remoteRepo, prompts.push], function(opts){
                _.merge(answers, opts);
                next();
            })
        }
    ], function(err, opts){
        if(err) throw new Error(err);
        cli.log(git('init').stdout);
        if(answers.generate === true){
            self.src.copy('common/_.gitignore', '.gitignore');
            self.conflicter.resolve(function () {
                done();
            });
        } else {
            done();
        }

    })
};


Generator.prototype.afterFileCopy = function afterFileCopy(){
    var answers = this.answers;
    var done = this.async();
    var config = this.conf;
    if(answers.add === true) {
        git('add', { A: true });
        cli.log('Added all to git');
    }
    if(answers.commit === true) {
        cli.log(git('commit', { m: answers.commitMessage }).stdout);
    }
    if(answers.remote !== 'skip'){
        var url = (answers.remoteProvider === 'github' ? 'https://github.com' : 'https://bitbucket.org') + "/:owner/:repo";
        url = url.replace(':owner', answers.remoteOwner).replace(':repo', answers.remoteRepo);
        git('remote', 'add', 'origin', url);
        cli.log('Added remote origin ' + url);

        // @todo switch node-github with radic.git.api
        if(answers.remote === 'create'){
            var GitHubApi = require("node-github");

            var github = new GitHubApi({
                version: "3.0.0"
            });
            var creds = config.get('credentials.github');
            github.authenticate({
                type: "basic",
                username: creds.username,
                password: creds.password
            });
            github.repos.create({
                name: answers.remoteRepo
            }, function(err, data){
                if(err) throw new Error(err);
                cli.log('Created remote repository');
                if(answers.push === true) {
                    git('push', {u: 'origin master'});
                    done();
                    cli.log.ok('Done!');
                } else {
                    done();
                    cli.log.ok('Done!');
                }
            })
        } else {
            done();
            cli.log.ok('Done!');
        }
    }
};
