var express = require('express');
var app = express();
var fs = require('fs');

var exec = require('exec');

app.use(express.static('build'));

app.get('/bundlejs', function(req, res) {
  res.set('Content-Type', 'text/javascript');
  exec(['gulp'], function(err, out, code) {
    if (err instanceof Error)
      throw err;
    fs.readFile('./build/bundle.js', 'utf8', function(err, contents) {
      res.send(contents);
    });
    process.stderr.write(err);
    process.stdout.write(out);
  });

});

app.get('/', function(req, res) {
  res.set('Content-Type', 'text/html');
  fs.readFile('./index.html', 'utf8', function(err, contents) {
    res.send(contents);
  });
});

app.listen(8080, function() {
  console.log('Example app listening on port 8080!');
});