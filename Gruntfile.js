module.exports = function (grunt) {

    // task configuration
    "use strict";

    // load modules
    var connect, serveStatic;

    connect = require('connect');
    serveStatic = require('serve-static');

    // initport and base folder of server
    grunt.initConfig( {

        connect: {
            port: 8080,
            base: './src/de'
        },

        watch: {
            sass: {
                files: "./src/scss/**/*.scss",
                tasks: ['sass']
            }
        },

        sass: {
            dev: {
                files: {
                    // destination         // source file
                    "./src/css/styles.css" : "./src/scss/styles.scss"
                }
            }
        },

        browserSync: {
            default_options: {
                bsFiles: {
                    // these file types cause a live reload
                    src: [
                        "./src/css/*.css",
                        "./scr/*.html"
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "./src",
                        index: "/de/nav.html",
                    },
                    debugInfo: true
                }
            }
        },

        bake: {
            build: {
                options: {
                    basePath: "src/"
                },

                files: {
                    "src/dist/index.html" : "src/index.html",

                    "src/dist/de/index.html": "src/de/index.html",

                    "src/dist/de/about-the-show/index.html" : "src/de/about-the-show/index.html",
                    "src/dist/de/about-the-show/dramatic-structure.html" : "src/de/about-the-show/dramatic-structure.html",
                    "src/dist/de/about-the-show/formal-structure.html" : "src/de/about-the-show/formal-structure.html",
                    "src/dist/de/about-the-show/genre.html" : "src/de/about-the-show/genre.html",
                    "src/dist/de/about-the-show/making-of.html" : "src/de/about-the-show/making-of.html",
                    "src/dist/de/about-the-show/overview.html" : "src/de/about-the-show/overview.html",
                    "src/dist/de/about-the-show/storyline.html" : "src/de/about-the-show/storyline.html",
                    "src/dist/de/about-the-show/visual-style.html" : "src/de/about-the-show/visual-style.html"
                }
            }
        }
    });

    // register dask runner to run web server
    grunt.registerTask('server-tsobb-de', 'Start the flippin web server', function () {

        var app, options;

        // run async to not end when this method ends
        this.async();

        // store options in a local object
        options = grunt.config("connect");

        // init connect web server
        // set static content path
        // start listening to the port
        app = connect();
        app.use(serveStatic(options.base)).listen(options.port);

        // output sever startet and the port number
        grunt.log.write('Started web server, aw yeah. Port: ' + options.port);

    });
    grunt.registerTask('default', ['browserSync', 'watch']);

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-bake');
}

