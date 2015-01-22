"use strict";


module.exports = function (grunt) {


    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        git: {
            docs: {
                options: {
                    cwd: 'docs',
                    ignoreErrors: true
                },
                commands: [
                    ['add', { A: true }],
                    ['commit', { m: 'Auto commit & push' }],
                    ['push', { u: 'origin' }, 'gh-pages']
                ]
            }
        }

    });


    grunt.registerTask('docs', ['radic_jsdoc:docs', 'radic_jsdoc_mdpages:docs', 'git:docs']);

};
