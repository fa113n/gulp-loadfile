'use strict';

var path = require('path'),
  gulp   = require('gulp'),
  gutil  = require('gulp-util'),
  _      = require('lodash');

// Config
var pkg = {},
  loadfile = {};

module.exports = function (packageJSON, loadfileJSON) {
  pkg = packageJSON;
  loadfile = loadfileJSON;

  if (_.isEmpty(pkg) || _.isEmpty(loadfile)) {
    gutil.log('gulp-loadfile', gutil.colors.red('warning jsonfiles not valid'));
    return;
  }
  return module.exports;
};

module.exports.task = function (task, cb) {
  var files = [],
    tasks = [];

  if (_.isEmpty(pkg) || _.isEmpty(loadfile)) {
    gutil.log('gulp-loadfile', gutil.colors.red('warning jsonfiles not valid'));
  }
  gutil.log('Using gulp-loadfile', gutil.colors.cyan(task));

  // modules definition
  _.forEach(loadfile.modules, function (module, Modulekey) {

    var streams = false;
    tasks.push(Modulekey + ':' + task);

    // tasks definition
    _.forEach(module[task], function (taskStream) {
      var moduleFiles = [],
        stream,
        args;

      // add all sub files
      _.forEach(taskStream.src, function (file) {
        var filePath = path.join(loadfile.config.src, task, file);
        moduleFiles.push(filePath);
        files.push(filePath);
      });

      args = [
        moduleFiles,
        taskStream.dest,
        {meta: loadfile.config.meta.banner.join('\n'), pkg: { pkg: pkg }},
        loadfile.config.dist + '/' + Modulekey + '/' + pkg.version + '/' + task
      ];

      // gulp stream injection
      stream = cb.apply(this, args);

      // concat all streams
      if (streams !== false) {
        streams = gutil.combine(streams, stream, stream.pipe(gulp.dest(
          path.join(loadfile.config.dist, Modulekey, 'latest', task)
        )));
      } else {
        streams = gutil.combine(stream, stream.pipe(gulp.dest(
          path.join(loadfile.config.dist, Modulekey, 'latest', task)
        )));
      }
    });

    // Less deployment task
    gulp.task(
      Modulekey + ':' + task,
      function () {
        return streams;
      }
    );
  });

  // only dist tasks
  gulp.task(task, tasks);

  // watch all and run less tasks
//  gulp.task(
//    task + ':watch',
//    tasks,
//    function () {
//      var watch = gulp.watch(files, tasks);
//      watch.on('change', function (event) {
//        gutil.log(
//          gutil.colors.green(" " + event.type + " '"),
//          gutil.colors.cyan(event.path.replace(__dirname, "")),
//          gutil.colors.green("'"),
//          gutil.colors.magenta('running tasks...')
//        );
//      });
//    }
//  );

  return true;
};
