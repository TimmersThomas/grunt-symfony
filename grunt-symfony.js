/**
 * grunt-symfony
 * @author vitre
 * @contributor Thomas Timmers
 * @licence MIT
 * @version 1.1.22
 * @url https://www.npmjs.org/package/grunt-symfony
 */
"use strict"

var fs = require('fs'),
    path = require('path'),
    extend = require('node.extend');

//---
var defaults = {
      src: 'src',
      gruntFile: 'Gruntfile.js',
      resources_private: 'Resources/private',
      resources_public: 'Resources/public',
    },
    options,
    bundles,
    grunt;

/**
 * getBundles
 * @param root
 * @param r
 */
var getBundles = function(root, r) {
    if (typeof root === 'undefined') {
        root = defaults.src;
    }
    if (typeof r === 'undefined') {
        r = [];
    }
    var files = fs.readdirSync(root);
    for (var i in files) {
        var dirPath = root + '/' + files[i];
        if (fs.statSync(dirPath).isDirectory()) {
            if (dirPath.match(/Bundle$/) && fs.existsSync(path.join(dirPath, defaults.gruntFile))) {
                //grunt.log.writeln("[Clear-Grunt-Symfony]",dirPath, "- match");

                var bundle = {
                    name: path.basename(dirPath),
                    path: dirPath,
                    resources_private: path.join(dirPath,defaults.resources_private),
                    resources_public:  path.join(dirPath,defaults.resources_public)
                };

                grunt.log.writeln("[Clear-Grunt-Symfony]",dirPath, " - config: ", JSON.stringify(bundle));

                r.push(bundle);
            } else {
                getBundles(dirPath, r);
            }
        }
    }
    return r;
};

/**
 * importBundle
 * @param bundle
 * @param config
 */
var importBundle = function(bundle, config) {
    var gruntFile = bundle.path + '/' + defaults.gruntFile;
    if (fs.existsSync(gruntFile)) {
        var filePath = path.resolve(gruntFile);
        grunt.log.writeln("[Clear-Grunt-Symfony]",'Importing bundle: ' + bundle.name + ' [' + gruntFile + ']');
        require(filePath)(grunt, config, bundle, options);
    }
};

/**
 * importBundles
 * @param config
 */
var importBundles = function(config) {
    bundles = getBundles();
    for (var i = 0; i < bundles.length; i++) {
        importBundle(bundles[i], config);
    }
};

/**
 * Export importBundles
 * @param _grunt
 * @param config
 * @param _options
 */
exports.importBundles = function(_grunt, config, _options) {
    grunt = _grunt;

    if (typeof _options === 'undefined') {
        options = defaults;
    } else {
        options = extend(true, {}, defaults, _options);
    }

    importBundles(config);
}