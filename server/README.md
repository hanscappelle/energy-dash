# Context

Arduino and Nodejs server code for energy monitoring dash. This is the data collection and data serving part.

TODO more context needed, improve these instructions!!

## Hardware

See arduino/src/sketch.ino comments in code for some instructions on how to connect your arduino. Th Arduino
is connected with USB to the Raspberry pi. The Pi has NodeJS installed to run this server.js script.

## Installation

Install nodejs and npm on raspberry pi. Don't install the nodejs and npm package from apt-get, instead use:

    wget http://node-arm.herokuapp.com/node_latest_armhf.deb
    sudo dpkg -i node_latest_armhf.deb

Install ino tools for controlling your arduino from the raspberry pi remotely:

    sudo apt-get install python-pip
    pip install ino

## Running

Build and upload sketch to arduino first:

    cd arduino/kwh
    ino init
    ino build
    ino upload

Check the output manually first. This should show kwh consumption on serial port each minute. In case of too much values
printed way too fast check with a resistor (around 10K Ohm) between pin and ground.

    ino serial

Exit this with CTRL+A followed by CTRL+X. Alternative is to use screen for this. Then exit is CTRL+A followed by k
and confirmation. Alternative is to use screen.

Now install [serialport](https://github.com/voodootikigod/node-serialport) and run node script.
You should have [NodeJS](http://nodejs.org) installed on your system for this to work.

   npm install
   node server

Keep the script alive with [forever](https://github.com/nodejitsu/forever). Forever will reboot the script if needed.

   npm install forever -g
   forever start server.js

## Configuration

The config folder contains several config files. The defaults.js are the properties loaded by default. These can be
overwritten with development.js or production.js files. To enable another files set the NODE_ENV variable or configure
it when running the server.

    NODE_ENV=production node server.js


## Troubleshooting

### Fix for using monk on arm

I ran into a Bus Error when trying to connect with a remote mongodb (using monk) on arm (raspberry pi). This turned out to be a [resolved issue for bson](https://github.com/mongodb/js-bson/issues/37). However monk reliese on an older version of mongoskin that doesn't include this fix yet. 

The easy fix for this is to get [my fork of the monk repo](https://github.com/hanscappelle/monk/). 

    git clone https://github.com/hanscappelle/monk.git

Or you can fix this the hard and temporary way by rebuilding the bson after updating the problematic line.   

    npm install node-gyp -g

    vi node_modules/monk/node_modules/mongoskin/node_modules/mongodb/node_modules/bson/ext/bson.h

Change #define USE_MISALIGNED_MEMORY_ACCESS from 1 to 0

    cd node_modules/monk/node_modules/mongoskin/node_modules/mongodb/node_modules/bson
    node-gyp rebuild

More info at http://stackoverflow.com/questions/16746134/bus-error-on-mongodb-mongoclient-connect-for-raspberry-pi-arm

### RangeError: Maximum call stack size exceeded

Even on Mac I got errors due to monk configuration. After running npm install go into the node_modules directory
and change the mongoskin dependency in the package.json file from 0.4.4 to 0.6.1. Now execute npm install from
within the node_modules/monk directory.

## Open points


* log more than kwh only, integrate with other sensor readings
* make youless compatibility optional and configurable
* ...

### Closed

* spit out youless compatible output
* make interval configurable, turn around? => sketch logs very minute, that is how many entries appear in db and the max resolution

## Resources

* https://github.com/voodootikigod/node-serialport
* http://www.schrankmonster.de/2014/03/22/install-nodejs-npm-raspberrypi-illegal-instruction-error-messages/
* http://inotool.org
* http://www.barryvandam.com/node-js-communicating-with-arduino/
* https://github.com/nodejitsu/forever