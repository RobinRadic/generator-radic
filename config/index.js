'use strict';
var fs = require('fs-extra'),
    path = require('path'),
    os = require('os'),

    yeoman = require('yeoman-generator'),
    yosay = require('yosay'),
    chalk = require('chalk'),
    _ = require('lodash'),
    ini = require('ini'),

    radic = require('radic'),
    util = radic.util;


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

    var dir = util.getUserHomeDir();
    if(os.type() === 'Linux') {
        // we search for ~/.gitconfig, ~/.npmrc, ~/.composer/auth.json
        var paths = {
            git: path.join(dir, '.gitconfig'),
            npm: path.join(dir, '.npmrc'),
            composer:  path.join(dir, '.composer/auth.json')
        };
        if(fs.existsSync(paths.git)){
            var gitconfig = ini.parse(fs.readFileSync(paths.git, 'utf-8'));
            if(util.defined(gitconfig.user.email)){
                data.email = gitconfig.user.email;
            }
            if(util.defined(gitconfig.user.name)){
                data.name = gitconfig.user.name;
            }
        }
        if(fs.existsSync(paths.npm) && data.email.length == 0){
            var npmconfig = ini.parse(fs.readFileSync(paths.npm, 'utf-8'));
            if(util.defined(npmconfig.email)){
                data.email = npmconfig.email;
            }
        }
        if(fs.existsSync(paths.composer)){
            var cconfig = fs.readJSONFileSync(paths.composer);
            if(util.defined(cconfig['http-basic'])){
                _.each({github: 'github.com', bitbucket: 'bitbucket.org'}, function(provider, key){
                    if(util.defined(cconfig['http-basic'][provider])) {
                        data[key].username = cconfig['http-basic'][provider].username || ''
                        data[key].password = cconfig['http-basic'][provider].password || ''
                    }
                });
            }
        }

    }
    return data;
}



var Generator = module.exports = function Generator(args, options) {
    yeoman.generators.Base.apply(this, arguments);
};
util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {

    var u = resolveUserData();
    this.c = {
        general: {
            name: u.name,
            email: u.email,
            website: null,
            license: 'MIT',
            licenselink: null
        },
        git: {
            providers: {
                github: {},
                bitbucket: {}
            }
        }
    };
    _.extend(this.c.git.providers.github, u.github);
    _.extend(this.c.git.providers.bitbucket, u.bitbucket);


    this.radic = radic.app;
    var config = this.radic.config.get();
    _.extend(this.c, config);

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
            name: 'general.name',
            message: 'Your name',
            default: this.c.general.name
        },
        {
            type: 'input',
            name: 'general.email',
            message: 'Your email',
            default: this.c.general.email
        },
        {
            type: 'input',
            name: 'general.website',
            message: 'Your website (write fully like: http://yourweb.com)?',
            default: this.c.general.website
        },
        {
            type: 'input',
            name: 'general.license',
            message: 'License that you\'re commonly using?',
            default: this.c.general.license
        },
        {
            type: 'input',
            name: 'general.licenselink',
            message: 'A weblink to your license',
            default: this.c.general.licenselink
        },
        {
            type: 'input',
            name: 'git.providers.github.username',
            message: 'Github username',
            default: this.c.git.providers.github.username
        },
        {
            type: 'password',
            name: 'git.providers.github.password',
            message: 'Github password',
            default: this.c.git.providers.github.password
        },
        {
            type: 'input',
            name: 'git.providers.bitbucket.username',
            message: 'Bitbucket username',
            default: this.c.git.providers.bitbucket.username
        },
        {
            type: 'password',
            name: 'git.providers.bitbucket.password',
            message: 'Bitbucket password',
            default: this.c.git.providers.bitbucket.password
        }
    ], function (props) {
        _.each(props, function(val, key){
            self.radic.config.set(key, val);
        });
        self.radic.config.set('isConfigured', require('../package.json').version);
        self.radic.config.save();
        cb();
    }.bind(this));
};

Generator.prototype.done = function done() {
    this.log(chalk.green("\nConfiguration done.\n"));
};

