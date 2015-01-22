module.exports = function Generator(){
   // console.log(this);
    var data = {
        gruntfile: {

        },
        package: {
            devDependencies: {
                "grunt-radic": "~0.1.0",
                "grunt-image-base64-sass": "~1.0.4",
                "grunt-radic-widget": "0.0.1",
                "grunt": "~0.4.5",
                "grunt-concurrent": "~1.0.0",
                "grunt-contrib-clean": "~0.6.0",
                "grunt-contrib-concat": "~0.4.0",
                "grunt-contrib-connect": "~0.9.0",
                "grunt-contrib-copy": "~0.7.0",
                "grunt-contrib-cssmin": "~0.10.0",
                "grunt-contrib-jshint": "~0.10.0",
                "grunt-contrib-sass": "0.7.3",
                "grunt-contrib-uglify": "~0.5.0",
                "grunt-contrib-watch": "~0.6.1",
                "grunt-preprocess": "~4.1.0",
                "grunt-shell": "~1.1.1",
                "load-grunt-tasks": "~0.4.0",
                "preprocess": "~2.1.0",
                "time-grunt": "~0.3.1"
            }
        },
        bower: {

        }
    }

    this.src.copy('_Gruntfile.js', 'Gruntfile.js');

    this.src.mergeJson(data.package, 'package.json')
};
