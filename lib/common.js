var utils = require('./utils');
var c = utils.getConfig();

module.exports = {
    q: {
        gitRemoteProvider: {
            type: 'list',
            name: 'gitRemoteProvider',
            message: 'What provider?',
            choices: ['github', 'bitbucket']
        },
        gitRepository: {
            type: 'input',
            name: 'gitRepository',
            message: 'Name of the repository?',
            default: ''
        },
        gitOwner: {
            type: 'input',
            name: 'gitOwner',
            message: 'Owner/team name for the repository?',
            default: c.gitusername
        },
        gitPush: {
            type: 'confirm',
            name: 'gitPush',
            message: 'Push to origin/master?',
            default: true
        },
        gitCommitMessage: {
            type: 'input',
            name: 'gitCommitMessage',
            message: 'Git commit message?',
            default: 'Initial commit, base project setup.'
        }
    }
}
