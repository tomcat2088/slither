#!/usr/bin/env node

var exec = require('exec');

exec(['./run_http.sh'], function(err, out, code) {
	console.log(err);
    if (err instanceof Error)
      throw err;
    process.stderr.write(err);
    process.stdout.write(out);
  });

exec(['./run_ws.sh'], function(err, out, code) {
    if (err instanceof Error)
      throw err;
    process.stderr.write(err);
    process.stdout.write(out);
  });