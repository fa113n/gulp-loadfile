#gulp-loadfile


##Bsp. usage:

    'use strict';

    var path = require('path');
    var gulp = require('gulp');
    var less = require('gulp-less');
    var rename = require('gulp-rename');
    var header = require('gulp-header');
    var minifyCSS = require('gulp-minify-css');
    var concat = require('gulp-concat');
    var pkg = require('./package.json');
    var loadfileJSON = require('./loadfile.json');
    var loadfile = require('./gulp-loadfile.js')(pkg, loadfileJSON);

    loadfile.task('less', function (filesSrc, fileDest, metaBanner, moduleDest) {
      return gulp.src(filesSrc)
        .pipe(less())
        .pipe(concat(fileDest))
        .pipe(minifyCSS({relativeTo : '/', keepSpecialComments: 0}))
        .pipe(header(metaBanner.meta, metaBanner.pkg))
        .pipe(rename({
          suffix: ".min"
        }))
        .pipe(gulp.dest(
          path.join(moduleDest, 'dist')
        ));
    });

    loadfile.task('less', function (filesSrc, fileDest, metaBanner, moduleDest) {
      return gulp.src(filesSrc)
        .pipe(less())
        .pipe(concat(fileDest))
        .pipe(header(metaBanner.meta, metaBanner.pkg))
        .pipe(gulp.dest(
          path.join(moduleDest, 'dev')
        ));
    });

    loadfile.task('js', function (filesSrc, fileDest, metaBanner, moduleDest) {
      return gulp.src(filesSrc)
        .pipe(concat(fileDest))
        .pipe(header(metaBanner.meta, metaBanner.pkg))
        .pipe(gulp.dest(
          path.join(moduleDest, 'dist')
        ));
    });

    gulp.task('default', ['less']);

##Bsp. loadfile:

    {
      "//": "Config",
      "config": {
        "src": "assets",
        "dist": "dist",
        "dev": "dev",
        "meta": {
          "banner": [
            "/**",
            " * <%= pkg.name %> - <%= pkg.description %>'",
            " * @version v<%= pkg.version %>'",
            " * @license <%= pkg.license %>'",
            " */\n"
          ]
        }
      },

      "//": "Every module ",
      "modules": {
        "frontend": {
          "js": [{
            "dest": "frontend.min.js",
            "src": ["frontend.js"]
          }],

          "less": [
            {
              "dest": "frontendAll.min.css",
              "src": [
                "frontend.less",
                "frontend2.less"
              ]
            },
            {
              "dest": "frontend.min.css",
              "src": ["frontend.less"]
            }
          ]
        },

        "backend": {
          "js": [{
            "dest": "backend.min.js",
            "src": ["backend.js"]
          }],

          "less": [{
            "dest": "backend.min.css",
            "src": ["backend.less"]
          }]
        }
      }
    }
