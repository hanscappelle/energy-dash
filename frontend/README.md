# About

Angular App for visualisation of energy monitoring data with d3js framework. This app supports the youless data format.

## Getting Started

Get the sources from github

    git clone https://github.com/hanscappelle/energy-dash.git

### Run as chrome app

Import everything from the app folder as is in chrome as an unpackaged chrome app (development option).

    cd energy-dash/frontend
    npm install
    bower install
    grunt

Now open this app in chrome from tools > extensions as an unpackaged chrome app. For this you need to check the
development options first on that same tab.

### Run as a service with nodeJS

   npm install
   grunt
   grunt serve

## Development Progress

### Building

Use grunt for building. With grunt serve resources will be served and livereload will be activated

### Troubleshooting

#### Expected 'url' to have an indentation at 9 instead at 13.

Jshint requires 2 spaces as indents for js files to pass.

### TODO

* fix safari
* refine build process (check grunt file)
* enable tests again
* enable jshint again
* fix watch for scripts
* deploy on heroku or provide instructions on how to deploy it there
* create guidelines with screenshots

#### nice to have

* add transition effects to graphs

### DONE

* have items clickable for more detail
* improve rendering based on screen size (+ package for mobile) => migrate to nvd3 first
* implement several periods/scopes/resolutions for viewing data => use angular-ui-routes
* move controllers to separate files
* test graphs
* create project structure
* fix bootstrap
* get angular en d3js scripts downloaded
* complete data visualisation from youless-mockup, DONE for bar graph, DONE for gauge
* store config on local storage
* add config page for ip, port, password

## Screen layouts

Mostly based on the windows app [http://apps.microsoft.com/windows/nl-nl/app/youless/bbf786d5-6b8a-4050-9026-dff3210a401f].
Some minor tweaks though and let's not forget this js implementation can run on browsers and mobile devices.

## gauges

Found 2 minimal projects for this [https://gist.github.com/tomerd/1499279] is nice
but the gauge example at [http://bl.ocks.org/msqr/3202712] had numbers instead of ticks already in place so picked that one.

## Just Resources

* http://angularjs.org/
* http://d3js.org/
* http://getbootstrap.com/
* bar chart example [http://bost.ocks.org/mike/bar/3/]
* time formatting & calculation with [http://momentjs.com/]
* http://nvd3.org/
* http://cmaurer.github.io/angularjs-nvd3-directives/

