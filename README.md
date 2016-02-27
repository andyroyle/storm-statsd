Storm StatsD [![Build Status](https://travis-ci.org/andyroyle/storm-statsd.svg?branch=master)](https://travis-ci.org/andyroyle/storm-statsd)
---

A little app that will poll one or more storm instances and push their statistics out to statsd.

Uses the [storm-ui rest api](https://github.com/Parth-Brahmbhatt/incubator-storm/blob/master/STORM-UI-REST-API.md).

```
npm i storm-statsd
cd node_modules/storm-statsd/
node storm.js /path/to/config/files/
```

###Config Files

###storm.json
```javascript
[
  {
    "host": "https://my.storm.cluster",
    "username": "user",
    "password": "password",        // optional
    "prefix": "foo.bar.storm.yay", // optional prefix for metrics from this instance
    "tags": {                      // optional, tags are supported by the influxdb backend
      "foo": "bar"
    }
  },
  {
     //...
  }
]
```

###statsd.json
```javascript
{
  "host": "localhost",
  "port": 8125,          // default: 8125
  "interval": 10,        // how often to poll the storm servers, default: 10 seconds
  "debug": true,         // show debug output from the statsd client
  "prefix": "my.stats"   // global prefix for metrics
}
```
