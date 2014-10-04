"use strict";

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readYAML('config.yml'),
        meta: {
            version: '<%='
        },


        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                options: {
                    spawn: false
                }
            }
        }
    });



    grunt.registerTask('default', ['dist']);
    grunt.registerTask('build', ['']);
    grunt.registerTask('dist', ['']);
}