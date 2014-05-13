'use strict';

var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
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
    .pipe(gulp.dest(
      path.join(__dirname, '..', 'public', moduleDest, 'css')
    ));
});

gulp.task('default', ['less']);
