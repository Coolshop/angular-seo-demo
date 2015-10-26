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
        },
        wiredep: {
            task: {
                src: ['src/index.html']
            }
        },
        includeSource: {
            options: {
                basePath: "src"
            },
            mytarget: {
                files: {
                    'src/index.html': 'src/index.html'
                }
            }
        }

    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-json');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-wiredep');
    grunt.loadNpmTasks('grunt-include-source');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-html-snapshot');


    // Default task(s).
    grunt.registerTask('develop', ['json', 'html2js:modules_dev', 'html2js:components_dev', 'wiredep', 'includeSource', 'copy:dev', 'clean:snapshot', 'htmlSnapshot']);
    grunt.registerTask('snapshot', ['clean:snapshot', 'htmlSnapshot']);
};