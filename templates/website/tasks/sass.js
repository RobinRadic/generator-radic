module.exports = {

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
    }
};
