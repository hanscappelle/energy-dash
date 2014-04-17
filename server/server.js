var config = require('./config');

// use monk for db connection pooling
// see https://github.com/LearnBoost/monk
var db = require('monk')(config.databaseUrl)
  , logs = db.get('logs')

// this part of the code is the serial connection
if (!config.serveDataOnly) {

  // reading serialport, only on raspberry pi, not during development, can be ignored
  var serialport = require("serialport");
  var SerialPort = serialport.SerialPort; // localize object constructor

  var sp = new SerialPort(config.serialPort, {
    baudrate: 9600,
    parser: serialport.parsers.readline(config.parser)
  }, false); // this is the openImmediately flag [default is true]

  sp.open(function () {
    // debug
    console.log('opening serial port');
    sp.on('data', function (data) {
      // debug
      console.log('data received: ' + data);
      // write to db
      //console.log('write data to db');
      logs.insert({'watts': data, 'time': new Date().getTime()}, function (err) {
        if (err) console.log('err conn mongodb: ' + err);
        // on suc6 we should return some response that can be checked on the client side
      })
    });
    sp.write("ls\n", function (err, results) {
      console.log('err: ' + err);
      if (results)
        console.log('results: ' + results);
    });
  });

}

// let's use this service also for serving all this data
var express = require('express');
var http = require('http');

var app = express();

// Configuration
app.use(express.logger('dev'));
// TODO implement security
//app.use(express.cookieParser(config.secret));
//app.use(express.session());
//app.use(app.router);

// form http://stackoverflow.com/questions/8067789/how-to-make-web-service-available-for-cross-domain-access
//CORS middleware
//var allowCrossDomain = function(req, res, next) {
//    res.header('Access-Control-Allow-Origin', config.allowedDomains);
//    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//    res.header('Access-Control-Allow-Headers', 'Content-Type');

//    next();
//}
//app.use(allowCrossDomain);
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

// development only, provide proper err handling & logging
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// start running service here
http.createServer(app).listen(config.port, function () {
  console.log("Express server listening on port %d in %s mode", config.port, app.settings.env);
});

// load routes depending on config
if( config.youlessCompatible ){
  require('./routes/youless')(app);
}

// otherwise let's rock our world with these alternative routes
else {
  require('./routes/custom')(app);
}
