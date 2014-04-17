energy-dash
===========

Energy Monitoring Dashboard with youless API support

![dashboard screenshot](https://dl.dropboxusercontent.com/u/30939008/remo/Screen%20Shot%202014-04-13%20at%2023.46.00.png)

* Youless API documentation: http://wiki.td-er.nl/index.php?title=YouLess
* Graphs rendering: https://github.com/cmaurer/angularjs-nvd3-directives


## TODO

* fix safari
* enable tests again
* improve gui controls for date selection

* make tabs for the different resolutions

### nice to have

* youless security, for details check: https://bitbucket.org/magic_monkey/youless/raw/3480eb99e2e29d8ca142f3cccef5c2d4eb26fccf/classes/request.class.php
* data compare in graph: http://cmaurer.github.io/angularjs-nvd3-directives/stacked.area.chart.html

## Version History

### v0.1.0

* remove dummy data options
* make youless optional (on by default though)
* check in v 0.1.0 and tag it
* add null termination youless
* add j param to youless urls (needed in frontend only, our backend ignores)

### dev

* deploy on heroku or provide instructions on how to deploy it there
* provide local storage config in frontend
* create controls for resolutions, use http://www.yearofmoo.com/2012/10/more-angularjs-magic-to-supercharge-your-webapp.html#more-about-loops
* fix watch for scripts
* enable jshint again
* refine build process (check grunt file)
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
* add transition effects to graphs
