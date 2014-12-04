module.exports = {

    watch: {
        options: {
            livereload: true
        },
        gruntfile: {
            files: ['Gruntfile.js'],
            options: {
                spawn: false
            }
        },
        wiredep: {
            files: ['bower_components/**/*'],
            tasks: ['wiredep:build', 'newer:sass:build', 'newer:jade:build']
        },
        sass: {
            files: ['<%= config.src.styles %>/**/*.scss'],
            tasks: ['wiredep:build', 'newer:sass:build']
        },
        jade: {
            files: ['<%= config.src.views %>/**/*.jade'],
            tasks: ['wiredep:build', 'newer:jade:build']
        }
    }
};
