'use strict';
var util = require('util');
var path = require('path');
var fse = require('fs-extra');
var fs = require('fs');
var _ = require('underscore');
var ini = require('ini');
var os = require('os');


function getUserHomeDir(){
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function defined(val){
    return typeof val !== 'undefined';
}

function resolveUserData(){
    var data = {
        email: '',
        name: '',
        github: {
            username: '',
            password: ''
        },
        bitbucket: {
            username: '',
            password: ''
        }
    };

    var dir = getUserHomeDir();
    if(os.type() === 'Linux') {
        // we search for ~/.gitconfig, ~/.npmrc, ~/.composer/auth.json
        var paths = {
            git: path.join(dir, '.gitconfig'),
            npm: path.join(dir, '.npmrc'),
            composer:  path.join(dir, '.composer/auth.json')
        };
        if(fs.existsSync(paths.git)){
            var gitconfig = ini.parse(fs.readFileSync(paths.git, 'utf-8'));
            if(defined(gitconfig.user.email)){
                data.email = gitconfig.user.email;
            }
            if(defined(gitconfig.user.name)){
                data.name = gitconfig.user.name;
            }
        }
        if(fs.existsSync(paths.npm) && data.email.length == 0){
            var npmconfig = ini.parse(fs.readFileSync(paths.npm, 'utf-8'));
            if(defined(npmconfig.email)){
                data.email = npmconfig.email;
            }
        }
        if(fs.existsSync(paths.composer)){
            var cconfig = fse.readJSONFileSync(paths.composer);
            if(defined(cconfig['http-basic'])){
                _.each({github: 'github.com', bitbucket: 'bitbucket.org'}, function(provider, key){
                    if(defined(cconfig['http-basic'][provider])) {
                        data[key].username = cconfig['http-basic'][provider].username || ''
                        data[key].password = cconfig['http-basic'][provider].password || ''
                    }
                });
            }
        }

    }
    return data;
}

function createComposer(gen){
    var user = resolveUserData();
    var json = {
        "name": gen.appname + "/" + gen.appname,
        "description": gen.appname + ' created by ' + user.name,
        "keywords": [gen.appname],
        "license": "MIT",
        "authors": [
            {
                "name": user.name,
                "email": user.email
            }
        ],
        "require": {
        },
        "autoload": {
        },
        "scripts": {
        },
        "config": {
            "preferred-install": "dist"
        },
        "minimum-stability": "dev"
    };
    fse.outputJSONSync(path.join(gen.env.cwd, 'composer.json'), json);
}

function createNode(gen){
    var user = resolveUserData();
    var json = {
        "name": gen.appname,
        "version": gen.version,
        "description": gen.appname + ' created by ' + user.name,
        "main": "index.js",
        "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "license": "MIT",
        "author": {
            "name": user.name,
            "email": user.email
        }
    };
    fse.outputJSONSync(path.join(gen.env.cwd, 'package.json'), json);
}

function readJSON(gen, file){
    return fse.readJSONFileSync(path.join(gen.env.cwd, file));
}

function writeJSON(gen, file, json){
    fse.outputJSONSync(path.join(gen.env.cwd, file), json);
}

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

var configFilePath = path.join(getUserHomeDir(), '.radicrc');

function getConfig(){
    return fse.readJsonFileSync(configFilePath, {throws: false});
}
function writeConfig(content){
    fse.outputJSONSync(configFilePath, content);
}

module.exports = {
    createComposer: createComposer,
    createNode: createNode,
    resolveUserData: resolveUserData,
    getUserHomeDir: getUserHomeDir,
    getConfig: getConfig,
    writeConfig: writeConfig,
    getGitRemoteUrl: getGitRemoteUrl,
    defined: defined,
    readJSON: readJSON,
    writeJSON: writeJSON
};



