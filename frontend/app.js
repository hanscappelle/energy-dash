
// let's use this service also for serving all this data
var express = require('express');
var http = require('http');
var path = require('path');

// using express for static content handling here
var app = express();

// Configuration
app.use(express.static(path.join(__dirname, 'app'))); // this ensures all files in public folder are served

// development mode, handle errors with details
app.use(express.errorHandler());

// start serving
http.createServer(app).listen(3030, function() {
    console.log("Express server listening on port %d", 3030);
});
