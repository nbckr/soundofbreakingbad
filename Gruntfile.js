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
                tasks: ['sass', 'sync']
            },
            bake: {
                files: "./src/**.html",
                tasks: ['bake', 'sync']
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
                        baseDir: "dist",
                        index: "/de/index.html"
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
                    "dist/index.html" : "src/index.html",

                    "dist/de/index.html": "src/de/index.html",

                    "dist/de/about-the-show/index.html" : "src/de/about-the-show/index.html",
                    "dist/de/about-the-show/dramatic-structure.html" : "src/de/about-the-show/dramatic-structure.html",
                    "dist/de/about-the-show/formal-structure.html" : "src/de/about-the-show/formal-structure.html",
                    "dist/de/about-the-show/genre.html" : "src/de/about-the-show/genre.html",
                    "dist/de/about-the-show/making-of.html" : "src/de/about-the-show/making-of.html",
                    "dist/de/about-the-show/overview.html" : "src/de/about-the-show/overview.html",
                    "dist/de/about-the-show/storyline.html" : "src/de/about-the-show/storyline.html",
                    "dist/de/about-the-show/visual-style.html" : "src/de/about-the-show/visual-style.html",

                    "dist/de/analysis-music/index.html" : "src/de/analysis-music/index.html",
                    "dist/de/analysis-music/blurring-boundaries.html" : "src/de/analysis-music/blurring-boundaries.html",
                    "dist/de/analysis-music/diegetic-elements.html" : "src/de/analysis-music/diegetic-elements.html",
                    "dist/de/analysis-music/external-elements.html" : "src/de/analysis-music/external-elements.html",
                    "dist/de/analysis-music/extra-diegetic-elements.html" : "src/de/analysis-music/extra-diegetic-elements.html",
                    "dist/de/analysis-music/filmmusic-and-identification.html" : "src/de/analysis-music/filmmusic-and-identification.html",
                    "dist/de/analysis-music/quality-and-quantity.html" : "src/de/analysis-music/quality-and-quantity.html",
                    "dist/de/analysis-music/terminology.html" : "src/de/analysis-music/terminology.html",

                    "dist/de/analysis-sound/index.html" : "src/de/analysis-sound/index.html",
                    "dist/de/analysis-sound/acoustic-scenography.html" : "src/de/analysis-sound/acoustic-scenography.html",
                    "dist/de/analysis-sound/language.html" : "src/de/analysis-sound/language.html",
                    "dist/de/analysis-sound/noises.html" : "src/de/analysis-sound/noises.html",
                    "dist/de/analysis-sound/silence-and-dynamics.html" : "src/de/analysis-sound/silence-and-dynamics.html",
                    "dist/de/analysis-sound/subjectivization.html" : "src/de/analysis-sound/subjectivization.html",

                    "dist/de/etc/index.html" : "src/de/etc/index.html",
                    "dist/de/etc/about.html" : "src/de/etc/about.html",
                    "dist/de/etc/acknowledgements.html" : "src/de/etc/acknowledgements.html",
                    "dist/de/etc/basics.html" : "src/de/etc/basics.html",
                    "dist/de/etc/conclusion.html" : "src/de/etc/conclusion.html",
                    "dist/de/etc/intro.html" : "src/de/etc/intro.html",
                    "dist/de/etc/references.html" : "src/de/etc/references.html"
                }
            }
        },

        sync: {
            main: {
                files: [{
                    cwd: 'src',
                    src: ['css/*.css', 'js/**', 'img/**', 'fonts/**', 'data/**'],
                    dest: 'dist'
                }],
                pretend: false,
                verbose: true,
                failOnError: true,
                updateAndDelete: true,
                ignoreInDest: ['de/**', '**.html']
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
    grunt.registerTask('default', ['browserSync', 'sync', 'watch']);

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-bake');
    grunt.loadNpmTasks('grunt-sync');
}

