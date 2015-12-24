var exec = require('child_process').exec;
var path = require('path');

module.exports = function disunity(file, cb) {
  var jar = path.join(__dirname, '../bin/disunity.jar');
  var cmd = 'java -jar "' + jar + '" extract "' + file + '"';
  exec(cmd, function(err, stdout, stderr) {
    console.log(stdout);
    if (err) {
      console.log('disunity ' + file + ' err:' + err);
      console.log(stderr);
    }
    cb && cb(err, stdout);
  });
};