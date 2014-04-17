var config = require('../config');

// use monk for db connection pooling
// see https://github.com/LearnBoost/monk
var db = require('monk')(config.databaseUrl)
  , logs = db.get('logs')

var routes = function (app) {

  // get status
  app.get('/a', function (req, res) {

    // debug response
    if (req.query.mock) {
      res.send('{"cnt":"4457,005","pwr":453,"lvl":0,"dev":"","det":"","con":"OK","sts":"(52)","raw":0}')
      return;
    }
    // TODO implement real data here
    else {
      res.send('{"cnt":"4457,005","pwr":453,"lvl":0,"dev":"","det":"","con":"OK","sts":"(52)","raw":0}')
      return;
    }
  });

  app.get('/V', function (req, res) {

    // h for all results of one hour of day
    if (req.query.h) {
      var hour = req.query.h;

      var now = new Date(); // TODO shouldn't we be able to resolve from other days too? use d param combined here?
      now.setHours(hour)
      now.setMinutes(0)
      now.setSeconds(0)
      now.setMilliseconds(0);
      // one hour later
      var later = new Date(now);
      later.setHours(now.getHours() + 1);

      // FIXME check data ranges
      console.log("getting data from %s to %s", now.toUTCString(), later.toUTCString());

      // init our data format
      var data = [];
      data[0] = {key: 'Hour Data',
        values: []};

      // fetch the data
      logs.find({timestamp: {$gt: now.getTime(), $lt: later.getTime()}}, function (err, values) {
        if (err)
          throw err;
        //console.log("data is: ", values);
        for (var key in values) {
          // we need to respect the youless format...
          var watts = parseFloat(values[key].watts);
          if (watts != NaN && watts)
            // and populate it
            data[0].values.push([ values[key].timestamp, watts]);
        }
        // send the result
        res.send(data);
        return;

      });
    }

    // d for day of month
    if (req.query.d) {

      var day = req.query.d;

      var now = new Date();
      now.setDate(day)
      now.setHours(0)
      now.setMinutes(0)
      now.setSeconds(0)
      now.setMilliseconds(0);
      // one hour later
      var later = new Date(now);
      later.setDate(now.getDate() + 1);

      console.log("getting data from %s to %s", now.toUTCString(), later.toUTCString());

      // no concatenation needed for this data

      var data = [];
      data[0] = {key: 'Day Data',
        values: []};

      // fetch the data
      logs.find({timestamp: {$gt: now.getTime(), $lt: later.getTime()}}, function (err, values) {
        if (err)
          throw err;
        //console.log("data is: ", values);
        for (var key in values) {
          // we need to respect the youless format...
          var watts = parseFloat(values[key].watts);
          if (watts != NaN && watts)
            // and populate it
            data[0].values.push([ values[key].timestamp, watts]);
        }
        // send the result
        res.send(data);
        return;

      });
    }

    // m param for month resolution
    if (req.query.m) {

      var month = req.query.m;

      var now = new Date();
      now.setMonth(month);
      now.setDate(1)
      now.setHours(0)
      now.setMinutes(0)
      now.setSeconds(0)
      now.setMilliseconds(0);
      // one hour later
      var later = new Date(now);
      later.setMonth(now.getMonth() + 1);

      console.log("getting data from %s to %s", now.toUTCString(), later.toUTCString());

      // here we have to concatenate some data to show data per day

      var data = [];
      data[0] = {key: 'Month Data',
        values: []};

      // fetch the data
      logs.find({timestamp: {$gt: now.getTime(), $lt: later.getTime()}}, function (err, values) {
        if (err)
          throw err;

        // for concatentation
        var currentDate, previousDate, total = 0;

        for (var key in values) {
          // we need to respect the youless format...
          var watts = parseFloat(values[key].watts);
          if (watts != NaN && watts){

            // and populate it
            //data[0].values.push([ values[key].timestamp, watts]);

            // concatenation here
            currentDate = new Date(values[key].timestamp);
            if (previousDate && currentDate.getDate() != previousDate.getDate()) {
              // another hour has passed just append the data
              data[0].values.push([ values[key].timestamp, total]);
              // start counting again
              total = watts;
            }
            // otherwise we can combine the values
            else {
              total += watts;
            }
          }
          previousDate = currentDate;
        }
        // if still some watts left add these to
        if (total > 0 ) {
          data[0].values.push([ values[key].timestamp, total]);
        }
        // send the result
        res.send(data);
        return;

      });
    }

    res.send("non supported params");
  });

}

module.exports = routes;