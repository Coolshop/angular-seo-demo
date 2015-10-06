/**
 * Created by alessandro on 29/09/14.
 */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        html2js: {
            options: {
                singleModule: true
            },
            modules: {
                src: ['src/modules/**/*.html'],
                dest: 'src/resources/modules.js'
            },
            components: {
                src: ['src/components/**/*.html'],
                dest: 'src/resources/components.js'
            },
            modules_dev: {
                options:{
                    module: "templates-modules"
                },
                src: [],
                dest: 'src/resources/modules.js'
            },
            components_dev: {
                options:{
                    module: "templates-components"
                },
                src: [],
                dest: 'src/resources/components.js'
            }
        },
        cool_wiredep: {
            main: {
                //directory: "src/lib",
                baseSource: "src",
                baseDest: "build",
                src: ['src/index.html'],
                exclude: [
                    'lib/bootstrap-sass/assets/javascripts/bootstrap.js', 
                    'lib/angular/angular.js', 
                    'lib/components-font-awesome/css/font-awesome.css',
                    'lib/bootstrap/dist/css/bootstrap.css',
                    'lib/bootstrap/dist/js/bootstrap.js'
                ]
            },
            dev: {
                //directory: "src/lib",
                baseSource: "src",
                baseDest: "src",
                src: ['src/index.html']
            }
        },
        cool_inject: {
            app: {
                targetFile: "src/index.html",
                injections: {
                    js: {
                        template: '<script src="/{{f}}"></script>'
                    },
                    css: {
                        template: '<link rel="stylesheet" href="/{{f}}" />'
                    }
                },
                files: [
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['resources/*.js'],
                        dest: ''
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['js/*.js'],
                        dest: ''
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['components/**/*.js', 'modules/**/*.js'],
                        dest: ''
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['components/**/*.css', 'modules/**/*.css'],
                        dest: ''
                    },
                    {
                        expand: true,
                        cwd: 'src/',
                        src: ['css/**/*.css'],
                        dest: ''
                    }
                ]
            }
        },
        copy: {
            dev: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        cwd: "src/",
                        src: ['**/fonts/**/*'],
                        dest: 'src/fonts/',
                        filter: 'isFile'
                    },
                    {
                        expand: true,
                        cwd: "src/",
                        src: ['index.html'],
                        dest: '../back/html/'
                    }
                ]
            }
        },
        json: {
            manifest: {
                options: {
                    namespace: 'manifests',
                    includePath: true,
                    processName: function (filename) {
                        filename = filename.split("/");
                        return filename[filename.length - 2];
                    }
                },
                src: ['src/modules/**/manifest.json'],
                dest: 'src/resources/manifests.js'
            }
        },
        clean: {
            snapshot: ["snapshots/**/*",]
        },
        htmlSnapshot: {
            main: {
                options: {
                    snapshotPath: 'snapshots/',
                    sitePath: 'http://angular-seo.local/',
                    msWaitForPages: 1000,
                    urls: [
                        '/',
                        '/news',
                        '/about-us'
                    ],
                    sanitize: function (requestUri) {
                        var snap = requestUri.replace(/\//g, '');

                        if (snap === "") {
                            return 'index.html';
                        }
                        else{
                            return snap;
                        }
                    }
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-json');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-cool-wiredep');
    grunt.loadNpmTasks('grunt-cool-inject');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html-snapshot');


    // Default task(s).
    grunt.registerTask('develop', ['json', 'html2js:modules_dev', 'html2js:components_dev', 'cool_wiredep:dev', 'cool_inject', 'copy:dev', 'clean:snapshot', 'htmlSnapshot']);
    grunt.registerTask('snapshot', ['clean:snapshot', 'htmlSnapshot']);
};