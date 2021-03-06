'use strict';

module.exports = function (grunt) {

    grunt.initConfig( {

        watch: {
            sass: {
                files: './src/scss/**/*.scss',
                tasks: ['sass', 'sync']
            },
            bake: {
                files: ['./src/**/*.html', './src/**/*.js'],
                tasks: ['bake', 'sync']
            }
        },

        sass: {
            dev: {
                files: {
                    // destination         // source file
                    './src/css/styles.css' : './src/scss/styles.scss'
                }
            }
        },

        browserSync: {
            default_options: {
                bsFiles: {
                    // these file types cause a live reload
                    src: [
                        '**/*.css',
                        '**/*.scss',
                        '**/*.js',
                        '**/*.svg',
                        '**/*.html'
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: 'dist',
                        index: '/de/index.html'
                    },
                    debugInfo: true
                }
            }
        },

        bake: {
            build: {
                options: {
                    basePath: 'src/'
                },

                files: {
                    // German version
                    'dist/de/index.html' : 'src/de/index.html',
                    'dist/de/404.html' : 'src/de/404.html',

                    'dist/de/introduction/introduction.html' : 'src/de/introduction/introduction.html',

                    'dist/de/about-the-show/background.html' : 'src/de/about-the-show/background.html',
                    'dist/de/about-the-show/structure.html' : 'src/de/about-the-show/structure.html',
                    'dist/de/about-the-show/production-1.html' : 'src/de/about-the-show/production-1.html',
                    'dist/de/about-the-show/production-2.html' : 'src/de/about-the-show/production-2.html',
                    'dist/de/about-the-show/storyline.html' : 'src/de/about-the-show/storyline.html',

                    'dist/de/analysis-music/introduction.html' : 'src/de/analysis-music/introduction.html',
                    'dist/de/analysis-music/blurring-boundaries.html' : 'src/de/analysis-music/blurring-boundaries.html',
                    'dist/de/analysis-music/diegetic-elements.html' : 'src/de/analysis-music/diegetic-elements.html',
                    'dist/de/analysis-music/external-elements.html' : 'src/de/analysis-music/external-elements.html',
                    'dist/de/analysis-music/composed-music.html' : 'src/de/analysis-music/composed-music.html',
                    'dist/de/analysis-music/preexisting-music.html' : 'src/de/analysis-music/preexisting-music.html',

                    'dist/de/analysis-sound/acoustic-scenography.html' : 'src/de/analysis-sound/acoustic-scenography.html',
                    'dist/de/analysis-sound/introduction.html' : 'src/de/analysis-sound/introduction.html',
                    'dist/de/analysis-sound/language.html' : 'src/de/analysis-sound/language.html',
                    'dist/de/analysis-sound/noises.html' : 'src/de/analysis-sound/noises.html',
                    'dist/de/analysis-sound/silence-and-dynamics.html' : 'src/de/analysis-sound/silence-and-dynamics.html',
                    'dist/de/analysis-sound/subjectivization.html' : 'src/de/analysis-sound/subjectivization.html',

                    'dist/de/conclusion/conclusion.html' : 'src/de/conclusion/conclusion.html',

                    'dist/de/about/origin-story.html' : 'src/de/about/origin-story.html',
                    'dist/de/about/references.html' : 'src/de/about/references.html',
                    
                    // English version
                    'dist/en/index.html' : 'src/en/index.html',
                    'dist/en/404.html' : 'src/en/404.html',

                    'dist/en/introduction/introduction.html' : 'src/en/introduction/introduction.html',

                    'dist/en/about-the-show/background.html' : 'src/en/about-the-show/background.html',
                    'dist/en/about-the-show/structure.html' : 'src/en/about-the-show/structure.html',
                    'dist/en/about-the-show/production-1.html' : 'src/en/about-the-show/production-1.html',
                    'dist/en/about-the-show/production-2.html' : 'src/en/about-the-show/production-2.html',
                    'dist/en/about-the-show/storyline.html' : 'src/en/about-the-show/storyline.html',

                    'dist/en/analysis-music/introduction.html' : 'src/en/analysis-music/introduction.html',
                    'dist/en/analysis-music/blurring-boundaries.html' : 'src/en/analysis-music/blurring-boundaries.html',
                    'dist/en/analysis-music/diegetic-elements.html' : 'src/en/analysis-music/diegetic-elements.html',
                    'dist/en/analysis-music/external-elements.html' : 'src/en/analysis-music/external-elements.html',
                    'dist/en/analysis-music/composed-music.html' : 'src/en/analysis-music/composed-music.html',
                    'dist/en/analysis-music/preexisting-music.html' : 'src/en/analysis-music/preexisting-music.html',

                    'dist/en/analysis-sound/acoustic-scenography.html' : 'src/en/analysis-sound/acoustic-scenography.html',
                    'dist/en/analysis-sound/introduction.html' : 'src/en/analysis-sound/introduction.html',
                    'dist/en/analysis-sound/language.html' : 'src/en/analysis-sound/language.html',
                    'dist/en/analysis-sound/noises.html' : 'src/en/analysis-sound/noises.html',
                    'dist/en/analysis-sound/silence-and-dynamics.html' : 'src/en/analysis-sound/silence-and-dynamics.html',
                    'dist/en/analysis-sound/subjectivization.html' : 'src/en/analysis-sound/subjectivization.html',

                    'dist/en/conclusion/conclusion.html' : 'src/en/conclusion/conclusion.html',

                    'dist/en/about/origin-story.html' : 'src/en/about/origin-story.html',
                    'dist/en/about/references.html' : 'src/en/about/references.html'
                }
            }
        },

        sync: {
            main: {
                files: [{
                    cwd: 'src',
                    src: ['css/*.css', 'js/**', 'img/**', 'fonts/**', 'data/**',
                        'apple-touch-icon.png', 'sitemap.xml'],
                    dest: 'dist'
                }],
                pretend: false,
                verbose: true,
                failOnError: true,
                updateAndDelete: true,
                ignoreInDest: ['de/**', 'en/**', '**.html']
            }
        },

        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({
                        browsers: ['last 2 versions']
                    })
                ]
            },
            dist: {
                src: 'dist/css/*.css'
            }
        }
    });

    grunt.registerTask('default', ['sass', 'bake', 'postcss', 'sync', 'browserSync', 'watch']);

    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-bake');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-postcss');
};
