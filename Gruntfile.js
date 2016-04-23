module.exports = function (grunt) {
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
        }
    });

    // register dask runner to run web server
    grunt.registerTask('default-server-tsobb-de', 'Start the flippin web server', function () {

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

}