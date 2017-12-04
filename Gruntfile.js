'use strict';

module.exports = function(grunt) {

    // 1. All configuration goes here 
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        babel: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            files: {
                    src: 'site/js/production.js',
                    dest: 'site/build/js/production.js'
            }
        },

        uglify: {
            build: {
                src: 'site/build/js/production.js',
                dest: 'site/build/js/production.min.js'
            }
        },

        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'site/build/css/stylesheet.css': 'site/scss/stylesheet.scss',
                }
            } 
        },

        delete_sync : {
            dist : {
                cwd : 'site/build/images',
                src : ['**'],
                syncWith : 'site/images'
            }
        }, // end of delete sync

        imagemin : {
            all : {
                files : [{
                    expand : true, // Enable dynamic expansion
                    cwd: 'site/images/', // source images (not compressed)
                    src : ['**/*.{png,jpg,gif,svg}'], // Actual patterns to match
                    dest: 'site/build/images/' // Destination of compressed files
                }]
            }
        }, //end imagemin

        // Build the site using grunt-includes
        includes: {
          build: {
            cwd: 'site',
            src: ['*.html', 'site/_includes/*.html'],
            dest: 'site/build/',
            options: {
              flatten: true,
              includePath: 'site'
            }
          }
        }, 

        connect: {
            server: {
              options: {
                port: 8000,
                base: 'site/build'
              }
            }
        },

        copy: {
            main: {
                files: [
                    {
                        cwd: 'site/fonts',  // set working folder / root to copy
                        src: '**/*',           // copy all files and subfolders
                        dest: 'site/build/fonts',    // destination folder
                        expand: true           // required when using cwd
                    },
                    {
                        cwd: 'site/js/vendor',  // set working folder / root to copy
                        src: '**/*',           // copy all files and subfolders
                        dest: 'site/build/js/vendor',    // destination folder
                        expand: true           // required when using cwd
                    },
                ]
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'site/*.html',
                        'site/_includes/*.html',
                        'site/build/*.html',
                        'site/build/_includes/*.html',
                        'site/*.php',
                        'site/_includes/*.php',
                        'site/build/css/*.css'
                    ]
                },
                options: {
                    open: true,
                    notify: true,
                    watchTask: true,
                    server: 'site/build'
                }
            }
        },

        watch: {

            scripts: {
                files: ['site/js/*.js', 'site/js/modules/*.js'],
                tasks: ['babel', 'uglify'],
                options: {
                  spawn: false,
                },
            },

            css: {
                files: ['site/scss/*.scss', 'site/scss/**/*.scss'],
                tasks: ['sass'],
                options: {
                  spawn: false,
                }
            },

            images: {
                files: ['site/images/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin']
            }, /* watch images added to src */

            deleting: {
                files: ['site/images/*.{png,jpg,gif,svg}'],
                tasks: ['delete_sync']
            }, /* end of delete sync*/

            includes: {
                files: ['site/*.html', 'site/build/*.html', 'site/_includes/*.html'],
                tasks: ['includes'],
                options: {
                    spawn: false,
                }
            },

            copy: {
                files: ['site/fonts/*.{svg,ttf,otf,eot, woff,woff2}', 'site/js/vendor/*.{js}'],
                tasks: ['copy']
            } /* watch images added to src */
        },


    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-browser-sync');
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-connect');   
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-delete-sync');
    grunt.loadNpmTasks('grunt-includes');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', ['browserSync', 'includes', 'copy', 'babel', 'uglify', 'sass', 'connect', 'watch']);
};