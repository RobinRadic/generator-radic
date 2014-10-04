"use strict";

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: grunt.file.readYAML('config.yml'),
        meta: {
            version: ' '
        },

        copy: {
            build: {
                expand: true,
                cwd: 'bower_components',
                src: ['**/*'],
                dest: '<%= config.build.bower %>/'
            },
            dist: {expand: true, cwd: '<%= config.build.dir %>', src: ['index.html'], dest: '<%= config.dist.dir %>/'}
        },
        clean: {
            build: ['<%= config.build.dir %>'],
            dist: ['<%= config.dist.dir %>']
        },

        useminPrepare: {
            html: ['<%= config.build.dir %>/index.html']
        },


        usemin: {
            html: ['<%= config.dist.dir %>/index.html']
        },

        sass: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src.styles %>',
                    src: ['**/*.scss'],
                    dest: '<%= config.build.assets %>/styles/',
                    ext: '.css'
                }]
            }
        },
        jade: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= config.src.views %>/pages',
                    src: ['**/*.jade'],
                    dest: '<%= config.build.dir %>/',
                    ext: '.html'
                }],
                options: {
                    pretty: true,
                    data: {
                        debug: true,
                        bowerAsset: function (path) {
                            return 'assets/plugins' + path
                        },
                        timestamp: "<%= new Date().getTime() %>"
                    }
                }
            }
        },
        wiredep: {
            build: {
                src: [
                    '<%= config.src.views %>/**/*.jade',
                    '<%= config.src.styles %>/main.scss'
                ],

                fileTypes: {
                    jade: {
                        block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
                        detect: {
                            js: /script\(.*src=['"]([^'"]+)/gi,
                            css: /link\(.*href=['"]([^'"]+)/gi
                        },
                        replace: {
                            js: 'script(src=bowerAsset(\'{{filePath}}\'))',
                            css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
                        }
                    }
                },
                ignorePath: '../../../bower_components'

            }
        },


        watch: {
            gruntfile: {
                files: ['Gruntfile.js'],
                options: {
                    spawn: false
                }
            },
            wiredep: {
                src: 'bower_components/**/*',
                tasks: ['wiredep:build']
            },
            sass: {
                src: '<%= config.src.styles %>/**/*.scss',
                tasks: ['sass:build']
            },
            jade: {
                src: '<%= config.src.views %>/**/*.jade',
                tasks: ['jade:build']
            }
        }
    });


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