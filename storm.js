'use strict';

var path = require('path');
var util = require('util');
var storm = require('storm-http');
var configDir = path.resolve(process.argv[2] || './');
var statsConfig = require(path.join(configDir, 'statsd'));

var async = require('async');

util.log('starting...');
util.log(`using config from ${configDir}`);

var stormServers = require(path.join(configDir, 'storm.json')).map(function(c){
  var client = storm.createClient({
    host: c.host,
    username: c.username,
    password: c.password
  });
  client.host = c.host;
  client.tags = c.tags;
  client.prefix = c.prefix;
  return client;
});

stormServers.forEach((c) => {
  setInterval(() => {
    c.topologies((err, topologies) => {
      if(err){
        util.log(`[${c.host}] ${err}`);
        return;
      }
      require('./lib/topologies')(c, topologies);
    });
  }, (statsConfig.interval || 10) * 1000);
});
