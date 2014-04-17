
var config = require('../config');

// use monk for db connection pooling
// see https://github.com/LearnBoost/monk
var db = require('monk')(config.databaseUrl)
  , logs = db.get('logs')

// the exported routes. Since we want these to be youless compatible they are not as optimised towards db format
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
  })

// get actual values
  app.get('/V', function (req, res) {

    // debug response
    if (req.query.mock) {
      res.send('{"un":"kWh","tm":"2012-01-01T00:00:00","dt":86400,"val":["  0,000","  7,200","  8,000","  8,200","  6,600","  7,900","  8,600"," 10,600","  6,200","  7,000","  8,200","  5,100","  8,900","  5,900","  7,300","  7,400","  6,900"," 12,200","  6,700","  8,500","  7,100","  7,700","  1,300","  8,500","  5,500","  7,700","  7,500"," 10,200","  8,100","  6,300","  4,100",null]}');
      return;
    }

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

      // prepare data
      var data = {
        un: "kWh", // TODO consider using another unit here, will all be 0.xxx anyway
        tm: now.toISOString(),
        dt: 60, //minute interval
        val: []
      }


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

      // prepare data
      var data = {
        un: "kWh",
        tm: now.toISOString(),
        dt: 3600, //hour interval
        val: []
      }

      // try to concatenate some of our data

      // retrieve logs for given date
      logs.find({timestamp: {$gt: now.getTime(), $lt: later.getTime()}}, function (err, values) {

        if (err)
          throw err;

        var currentDate, previousDate, total = 0;
        for (var key in values) {
          // try parsing as float first
          var watts = parseFloat(values[key].watts);
          // should at least be a valid value
          if (watts != NaN && watts) {
            // combine readings into one hour interval
            currentDate = new Date(values[key].timestamp);
            if (previousDate && currentDate.getHours() != previousDate.getHours()) {
              // another hour has passed just reset
              data.val.push((total + "").replace(".", ","));  // all this shouldn't be needed
              // start counting again
              total = parseFloat(values[key].watts);
            }
            // otherwise we can combine the values
            else {
              total += parseFloat(values[key].watts);
            }

          }
          previousDate = currentDate;
        }
        // if still some watts left add these to
        if (total) {
          data.val.push((total + "").replace(".", ","));
        }
        // always finish with null termination
        data.val.push(null);
        // send the result
        res.send(data);
      });
      return;

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

      // prepare data
      var data = {
        un: "kWh",
        tm: now.toISOString(),
        dt: 86400, //day interval
        val: []
      }

      // concatenate the month data somewat
      // retrieve logs for given date
      logs.find({timestamp: {$gt: now.getTime(), $lt: later.getTime()}}, function (err, values) {

        if (err)
          throw err;

        var currentDate, previousDate, total = 0;
        for (var key in values) {
          // try parsing as float first
          var watts = parseFloat(values[key].watts);
          // should at least be a valid value
          if (watts != NaN && watts) {
            // combine readings into one hour interval
            currentDate = new Date(values[key].timestamp);
            if (previousDate && currentDate.getDate() != previousDate.getDate()) {
              // another hour has passed just reset
              data.val.push((total + "").replace(".", ","));  // all this shouldn't be needed
              // start counting again
              total = parseFloat(values[key].watts);
            }
            // otherwise we can combine the values
            else {
              total += parseFloat(values[key].watts);
            }

          }
          previousDate = currentDate;
        }
        // if still some watts left add these to
        if (total) {
          data.val.push((total + "").replace(".", ","));
        }
        // always finish with null termination
        data.val.push(null);
        // send the result
        res.send(data);
      });

      return;
    }

    // this server will be returning data with a 60 seconds interval when in youless compatible format
    // nog longer needed, was only for the extra full param
    // data.dt = 60;

    // retrieve logs for given date
    logs.find({timestamp: {$gt: now.getTime(), $lt: later.getTime()}}, function (err, values) {
      if (err)
        throw err;
      //console.log("data is: ", values);
      for (var key in values) {
        // we need to respect the youless format...
        var watts = parseFloat(values[key].watts);
        if (watts != NaN && watts)
        //data.val.push(watts);
          data.val.push((watts + "").replace(".", ","));  // all this shouldn't be needed
      }
      // always finish with null termination
      data.val.push(null);
      // send the result
      res.send(data);
    });

  })

}

module.exports = routes;