var Application     = require('../application/application');
var http            = require('http');
var https           = require('https');
var Router          = require('../router/router');
var config          = {};
var cluster         = require('cluster');
var fs              = require('fs');
var Notifier        = require('update-notifier');


/**
 * The main class of our framework. This object will help with registring our applications.
 * @constructor
 */
function Raddish() {

};

/**
 * This will set an application handler.
 *
 * @param {String} alias The alias of the application
 * @param {String} path The path to the application.
 * @returns {*}
 */
Raddish.prototype.setApplication = function(alias, path) {
    return Application.setApplication(alias, path);
};

/**
 * This function will set the config of Raddish which is located in a JSON file..
 *
 * @param config
 */
Raddish.prototype.setConfig = function(cnf) {
    var tmp = fs.readFileSync(cnf);

    config = JSON.parse(tmp);
};

Raddish.prototype.getConfig = function(key) {
    if(key) {
        return config[key];
    } else {
        return config;
    }
};

/**
 * This is a config helper to set the public path.
 *
 * @param path
 */
Raddish.prototype.setPublicFolder = function(path) {
    this.config.public = path;
};

/**
 * This will start the listener for http traffic, and will route it to the correct application (if there it isn't a file)
 *
 * @param {Int} port A override for the port given in the config.
 */
Raddish.prototype.start = function(port) {
    var Threads = require('../threads/threads');

    if(!port && !config.port) {
        throw new Error('No port found to start on!');
    } else {
        if(config.threads) {
            if(!cluster.isMaster) {
                this.startWebServer(port);
            } else {
                console.log('Server started on port: ' + (port || config.port));
            }
        } else {
            this.startWebServer(port);
            console.log('Server started on port: ' + (port || config.port));
        }
    }
};

/**
 * This is part of an ExpressJS middleware application.
 * And is supposed to listen to them as well.
 *
 * @method express
 * @param {Object} req ExpressJS request object.
 * @param {Object} res ExpressJS response object.
 * @param {Function} next ExpressJS next handler.
 */
Raddish.prototype.express = function(req, res, next) {
    new Router().route(req, res);
};

Raddish.prototype.startWebServer = function(port) {
    if(config.ssl) {
        var cnf = {
            key: fs.readFileSync(config.ssl.key),
            cert: fs.readFileSync(config.ssl.cert)
        };

        https.createServer(cnf, function(req, res) {
            new Router().route(req, res);
        }).listen(port || config.port);
    } else {
        http.createServer(function(req, res) {
            new Router().route(req, res);
        }).listen(port || config.port);
    }
};

Raddish.prototype.checkUpdate = function() {
    if(!config.threads || cluster.isMaster) {
        var notifier = Notifier({
            packagePath: '../../package.json'
        });

        if (notifier.update) {
            notifier.notify();
        }
    }
}

module.exports = new Raddish();