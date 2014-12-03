var exec = require('child_process').exec,
    _ = require('underscore');

function createCallback(callback){
    return function (error, stdout, stderr) {
        if (error !== null) {
            callback(error, stderr);
        }
        callback(null, stdout);
    }
}

var Git = function Git(options) {
    if(typeof options !== 'object'){
        options = {};
    }
    this.options = {

    };
    _.extend(this.options, options);
};


Git.prototype.init = function init(cb){
    exec('git init', createCallback(cb));
};

Git.prototype.addAll = function commit(cb){
    exec('git add -A', createCallback(cb));
};

Git.prototype.commit = function commit(message, cb){
    exec('git commit -m "' + message + '"', createCallback(cb));
};

Git.prototype.push = function push(remote, branch, cb){
    exec('git push -u "' + remote + '" "' + branch + '"', createCallback(cb));
};

Git.prototype.remote = {
    add: function(type, url, cb){
        exec('git remote add ' + type + ' ' + url, createCallback(cb));
    }
};

module.exports = {
    Git: Git,
    git: new Git()
};
