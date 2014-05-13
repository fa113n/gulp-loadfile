'use strict';

var path = require('path'),
  gulp   = require('gulp'),
  gutil  = require('gulp-util'),
  es     = require('event-stream'),
  _      = require('lodash');

// Config
var pkg = {},
  loadfile = {};

function IsJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

module.exports = function (packageJSON, loadfileJSON) {
  pkg = packageJSON;
  loadfile = loadfileJSON;
};

module.exports.task = function (task, cb) {
  var files = [],
    tasks = [],
    tasksDev = [],
    allTasks,
    err;

  gutil.log('gulp-loadfile', task + ' running', gutil.colors.cyan('123'));

  if(!IsJsonString(pkg) || !IsJsonString(loadfile)) {
    err = new Error("package.json or loadfile.json isn't valid");
    console.log("package.json or loadfile.json isn't valid", err);
    return err;
  }

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

    console.log(Modulekey + ':' + task);
    // Less deployment task
    gulp.task(
      Modulekey + ':' + task,
      streams
    );

    // Less development task
    gulp.task(
      Modulekey + ':' + task + ':dev',
      streams
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
};