'use strict';

var path = require('path'),
  gulp   = require('gulp'),
  gutil  = require('gulp-util'),
  es     = require('event-stream'),
  _      = require('lodash');

// Config
var pkg = {},
  loadfile = {};

var isJsonString = function (str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

module.exports = function (packageJSON, loadfileJSON) {
  pkg = packageJSON;
  loadfile = loadfileJSON;

  return module.exports;
};

module.exports.task = function (task, cb) {
  var files = [],
    tasks = [],
    tasksDev = [],
    allTasks,
    err;

  if (!isJsonString(pkg) || !isJsonString(loadfile)) {
    gutil.log('gulp-loadfile', gutil.colors.red('warning jsonfiles not valid'));
  }
  gutil.log('Using gulp-loadfile', gutil.colors.cyan('added'));

  _.forEach(loadfile.modules, function (module, Modulekey) {

    var streams = false;
    tasks.push(Modulekey + ':' + task);
    tasksDev.push(Modulekey + ':' + task + ':dev');
    _.forEach(module[task], function (taskStream) {

      var moduleFiles = [],
        stream;
      _.forEach(taskStream.src, function (file) {
        var filePath = path.join(__dirname, '..', loadfile.config.src, task, file);
        moduleFiles.push(filePath);
        files.push(filePath);
      });

      stream = cb(
        moduleFiles,
        taskStream.dest,
        {meta: loadfile.config.meta.banner.join('\n'), pkg: { pkg: pkg }},
        Modulekey + '/' + loadfile.config.dist + '/' + pkg.version
      );

      if (streams !== false) {
        streams = es.concat(streams, stream);
      } else {
        streams = stream;
      }
    });

    // Less deployment task
    gulp.task(
      Modulekey + ':' + task,
      function () {
        return streams;
      }
    );

    // Less development task
    gulp.task(
      Modulekey + ':' + task + ':dev',
      function () {
        return streams;
      }
    );
  });

  // only dist tasks
  gulp.task(task, tasks);

  // only dev tasks
  gulp.task(task + ':dev', tasksDev);

  // watch all and run less tasks
  allTasks = tasks.concat(tasksDev);
  gulp.task(
    task + ':watch',
    allTasks,
    function () {
      gulp.watch(files, allTasks);
    }
  );

  return true;
};