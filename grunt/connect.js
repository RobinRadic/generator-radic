module.exports = function Generator(){
    console.log(this);
    var data = {
        gruntfile: {
            connect: {
                options: {
                    port: 9009,
                    // Change this to '0.0.0.0' to access the server from outside.
                    hostname: 'localhost',
                    livereload: 35729
                },
                livereload: {
                    options: {
                        open: true,
                        base: 'preview'
                    }
                }
            },
            watch: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                livereload: {
                    options: {
                        livereload: '<%= connect.options.livereload %>'
                    },
                    files: [
                        'src/**/*',
                        'preview/**'
                    ]
                }
            }
        },
        package: {

        },
        bower: {

        }
    }
};
