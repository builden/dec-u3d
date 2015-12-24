#!/usr/bin/env node

var fs = require('fs-extra');
var argv = require('optimist').argv;
var glob = require('glob-all');
var path = require('path');
var u3d = require('./lib/disunity.js');
var async = require('async');

var cwd = process.cwd();

function main() {
  if (argv.h || argv.help || process.argv.length === 2) {
    console.log([
      'usage: u3d glob ...',
      '',
      'options:',
      '  -h --help        print the help list'
    ].join('\n'));
    return;
  }

  var globArr = [];
  argv._.forEach(function(item) {
    globArr.push(path.join(cwd, item))
  });
  globArr.push(path.join(cwd, '!unity default resources/'));
  var files = glob.sync(globArr);
  if (argv.d || argv.debug) {
    console.log('match files:');
    console.log(files);
  }

  async.mapLimit(files, 2, function(file, callback) {
    u3d(file, callback);
  }, function(err, results) {
    console.log('extra u3d res complete');
    var dirs = glob.sync([path.join(cwd, '**/TextAsset/'), path.join(cwd, '**/Shader/'), path.join(cwd, '**/Texture2D/'),
      path.join(cwd, '**/AudioClip/'), path.join(cwd, '**/Mesh/')
    ]);
    copyFiles(dirs);
  });
}

function copyFiles(dirs) {
  dirs.forEach(function(dir) {
    var basename = path.basename(dir);
    fs.copySync(dir, path.join(cwd, 'extra/' + basename), {clobber: true});
  });
}

main();