module.exports = {
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
    }
}
