var _ = require('underscore');
var curl = require('./curl');
var utils = require('./utils');

var c = utils.getConfig();

var bcurl = curl(c.bitusername + ':' + c.bitpassword);
var gcurl = curl(c.gitusername + ':' + c.gitpassword);

var burl = utils.getGitRemoteUrl('bitbucket', true);
var gurl = utils.getGitRemoteUrl('github', true);

var defaults = {
    repos: {
        create: {
            description: 'a repo',
            has_issues: true,
            has_wiki: false
        }
    }
};
function opts(options, defaults){
    options = options || {};
    return _.extend(options, defaults);
}
var bitbucket = {
    repos: {
        create: function(owner, name, options, cb){
            options = opts(options, defaults.repos.create);
            options.name = name;
            bcurl.post(burl + '/repositories/' + owner + '/' + name, options, cb);
        }
    }
};

var github = {
    repos: {
        create: function(owner, name, options, cb) {
            options = opts(options, defaults.repos.create);
            options.name = name;
            if(owner.toLowerCase() === c.gitusername.toLowerCase()) {
                gcurl.post(gurl + '/user/repos', options, cb);
            } else {
                gcurl.post(gurl + '/orgs/' + owner + '/repos', options, cb);
            }
        }
    }
};

module.exports = {
    github: github,
    bitbucket: bitbucket
};
