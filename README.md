grunt-symfony
=============

Grunt module for Symfony2.

Forked:
--------

*By*: Thomas Timmers for [Clear](http://cleardigital.be)  
*Reason*: Implementing custom workflow for our Symfony2 projects

Features
--------

  * Can use specific gruntfile (for specific tasks) for every src bundle

Links
-----

**GitHub**: https://github.com/TimmersThomas/grunt-symfony


Install
-------

    $ npm install grunt-symfony

Bundle gruntfile
-------------

[BUNDLE_ROOT]/Gruntfile.js

```javascript
module.exports = function (grunt, gruntConfig, bundle, options) {
    gruntConfig.clean = gruntConfig.clean || {};
    gruntConfig.clean['bundle-' + bundle.name + '__dev'] = {
        files: [
            {
                dot: true,
                src: [bundle.resources_public]
            }]
    };

    gruntConfig.sass = gruntConfig.sass || {};
    gruntConfig.sass['bundle-' + bundle.name + '__dev'] = {
        'options': {
            sourceMap: true,
            includePaths: [bundle.resources_private + '/styles', '<%= config.vendor %>/foundation/scss']
        },
        'files': [
            {
                'expand': true,
                'cwd': bundle.resources_private + '/styles/',
                'src': ['*.scss'],
                'dest': bundle.resources_public + '/styles/',
                'ext': '.css'
            }
        ]
    };

    gruntConfig.autoprefixer = gruntConfig.autoprefixer || {};
    gruntConfig.autoprefixer['bundle-' + bundle.name + '__dev'] = {
        files: [{
            expand: true,
            cwd: bundle.resources_public + '/styles/',
            src: '{,*/}*.css',
            dest: bundle.resources_public + '/styles/'
        }]
    };

    gruntConfig.browserify = gruntConfig.browserify || {};
    gruntConfig.browserify['bundle-' + bundle.name + '__dev'] = {
        files: {},
        options: {
            debug: true,
            external: gruntConfig.bowerBundleKeys
        }
    };
    gruntConfig.browserify['bundle-' + bundle.name + '__dev']['files'][bundle.resources_public  + '/scripts/main.js'] = [bundle.resources_private + '/scripts/main.js'];


    gruntConfig.imagemin = gruntConfig.imagemin || {};
    gruntConfig.imagemin['bundle-' + bundle.name + '__dev'] = {
        files: [{
            expand: true,
            cwd: bundle.resources_private + '/images',
            src: '{,*/}*.{gif,jpeg,jpg,png}',
            dest: bundle.resources_public + '/images'
        }]
    };

    gruntConfig.svgmin = gruntConfig.svgmin || {};
    gruntConfig.svgmin['bundle-' + bundle.name + '__dev'] = {
        files: [{
            expand: true,
            cwd: bundle.resources_private + '/images',
            src: '{,*/}*.svg',
            dest: bundle.resources_public + '/images'
        }]
    };


    gruntConfig.copy = gruntConfig.copy || {};
    gruntConfig.copy['bundle-' + bundle.name + '__dev'] = {
        files: [{
            expand: true,
            cwd: bundle.resources_private,
            src: [
                '*.{ico,png,txt}',
                '.htaccess',
                'images/{,*/}*.webp',
                'styles/fonts/{,*/}*.*',
                'styles/{,*/}*.css'
            ],
            dest: bundle.resources_public
        }]
    };

    gruntConfig.watch = gruntConfig.watch || {};
    gruntConfig.watch['sass__' + bundle.name] = {
        files: bundle.resources_private + '/styles/{,*/}*.{scss,sass}',
        tasks: ['sass:bundle-' + bundle.name + '__dev', 'autoprefixer:bundle-' + bundle.name + '__dev']
    };
    gruntConfig.watch['browserify__' + bundle.name] = {
        files: bundle.resources_private + '/scripts/{,*/}*.js',
        tasks: ['browserify:bundle-' + bundle.name + '__dev']
    };
    gruntConfig.watch['imagemin__' + bundle.name] = {
        files: bundle.resources_private + '/images/{,*/}*.{gif,jpeg,jpg,png}',
        tasks: ['newer:imagemin:bundle-' + bundle.name + '__dev']
    };
    gruntConfig.watch['svgmin__' + bundle.name] = {
        files: bundle.resources_private + '/images/{,*/}*.svg',
        tasks: ['newer:svgmin:bundle-' + bundle.name + '__dev']
    };
    gruntConfig.watch['copy__' + bundle.name] = {
        files: [
            bundle.resources_private + '/*.{ico,png,txt}',
            bundle.resources_private + '/.htaccess',
            bundle.resources_private + '/images/{,*/}*.webp',
            bundle.resources_private + '/styles/fonts/{,*/}*.*',
            bundle.resources_private + '/styles/{,*/}*.css'
        ],
        tasks: ['newer:copy:bundle-' + bundle.name + '__dev']
    };
};

```

Gruntfile implementation
------------------------

```javascript
/*global module:false*/

// grunt-symfony import
var gruntSymfony = require('grunt-symfony');

module.exports = function (grunt) {

    // Base configuration.
    var config = {

        // Metadata
        pkg: grunt.file.readJSON('package.json'),

        // [...] Your tasks

    };

    // Symfony bundles import
    gruntSymfony.importBundles(grunt, config, {
        src: 'src',
        gruntFile: 'Gruntfile.js',
        resources_private: 'Resources/private',
        resources_public: 'Resources/public',
    });

    //---

    grunt.initConfig(config);

    // Modules
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Tasks
    grunt.registerTask('default', ['build', 'watch']);
    grunt.registerTask('build', ['sass']);

};

```

API
---

### Importing

```javascript
var gruntSymfony = require('grunt-symfony');
```

### Methods

**gruntSymfony.importBundles**(grunt, config, [options])

Recursively imports bundle Gruntfile.js

#### Options

##### src

Type: `String` Default: 'src'

Resources path.

##### gruntFile

Type: `String` Default: 'Gruntfile.js'

Bundle Gruntfile filename.

##### resources_private

Type: `String` Default: 'Resources/private'

Bundle resources folder name for "private" (read: source) files.

##### resources_public

Type: `String` Default: 'Resources/public'

Bundle resources folder name for "public" (read: compiled) files.


### bundle object

#### Properties

##### name

Type: `String`

Bundle name.

##### path

Type: `String`

Bundle path.

##### resources_private

Type: `String`

Bundle private resources path.

##### resources_public

Type: `String`

Bundle public resources path.
