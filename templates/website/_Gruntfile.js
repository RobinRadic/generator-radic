"use strict";

var _ = require('lodash');

module.exports = function (grunt) {


    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var pkg = grunt.file.readJSON('package.json');
    var config = grunt.file.readYAML('config.yml');
    var configs = require('load-grunt-configs')(grunt, {
        config: {
            src: config.src.tasks
        }
    });

    grunt.initConfig(_.merge({
        pkg: pkg,
        config: config,
        useminPrepare: {
            html: ['<%= config.build.dir %>/index.html']
        }
    }, configs));

    grunt.registerTask('default', ['dist']);
    grunt.registerTask('build', ['clean:build', 'copy:build', 'wiredep:build', 'sass:build', 'jade:build']);
    grunt.registerTask('dist', [
        'build',
        'clean:dist', 'copy:dist',
        'useminPrepare:html',
        'concat:generated',
        'uglify:generated',
        'cssmin:generated',
        'usemin'
    ]);
};
