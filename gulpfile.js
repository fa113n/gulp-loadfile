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

//loadfile.task('less', function (filesSrc, fileDest, metaBanner, moduleDest) {
//  return gulp.src(filesSrc)
//    .pipe(less())
//    .pipe(concat(fileDest))
//    .pipe(header(metaBanner.meta, metaBanner.pkg))
//    .pipe(gulp.dest(
//      path.join(moduleDest, 'dev')
//    ));
//});

loadfile.task('js', function (filesSrc, fileDest, metaBanner, moduleDest) {
  return gulp.src(filesSrc)
    .pipe(concat(fileDest))
    .pipe(header(metaBanner.meta, metaBanner.pkg))
    .pipe(gulp.dest(
      path.join(moduleDest, 'dist')
    ));
});

gulp.task('default', ['less']);
gulp.task('watch', ['less:watch', 'js:watch']);

gulp.task('less:watch', function () {
  gulp.watch('assets/less/*', ['frontend:less', 'backend:less']);
});
