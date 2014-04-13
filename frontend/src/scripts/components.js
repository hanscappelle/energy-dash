angular.module('components', [])

    // a directive for data visualisation with d3js as bar chart, from
    // http://stackoverflow.com/questions/22482101/angular-d3-js-data-binding-with-svg-text-attr
    .directive('barChart', function ( /* dependencies */ ) {
    // define constants and helpers used for the directive

        return {
            restrict: 'E', // the directive can be invoked only by using <bar-chart></bar-chart> tag in the template
            link: function (scope, element, attrs) {
                // initialization, done once per my-directive tag in template. If my-directive is within an
                // ng-repeat-ed template then it will be called every time ngRepeat creates a new copy of the template.

                // dimensions and margins
                //var width = 900,
                //    height = 440;
                // dimensions and margins
                                // responsive: http://eyeseast.github.io/visible-data/2013/08/28/responsive-charts-with-d3/
                                        // the ugly way but it works (for now)
                                            // http://andylangton.co.uk/blog/development/get-viewport-size-width-and-height-javascript
                                                var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],screenw=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

                var margin = {top: 10, right: 20, bottom: 60, left: 20},
                                    width = screenw,//parseInt(d3.select(element[0]).style('width')),
                                        width = width - margin.left - margin.right,
                                        mapRatio = .5,
                                        height = width * mapRatio;
                    /*
                var margin = {top: 10, right: 20, bottom: 60, left: 20},
                    width = 900 - margin.left - margin.right,
                    height = 440 - margin.top - margin.bottom;
                      */

                // add ordinal information
                var x = d3.scale.ordinal()
                    .rangeRoundBands([0, width], .1);

                var y = d3.scale.linear()
                    .range([height, 0]);

                // set up initial svg object
                var chart = d3.select(element[0])
                    .append("svg")
                    .attr("class", "chart")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                //axes
                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");


                // whenever the bound 'exp' expression changes, execute this
                scope.$watch(attrs.data, function (data, oldVal) {

                    // clear the elements inside of the directive
                    chart.selectAll('*').remove();

                    // if 'val' is undefined, exit
                    if (!data) {
                        return;
                    }

                    //transform data to some enriched format
                    var data2= {values: []};
                    for( var key in data.val ) {
                        data2.values[key] = {
                            value:type(data.val[key]),
                            time: time(data.tm, data.dt, key).format('DD-MM-YYYY')
                        };
                    }

                    // from the unbeatable tutorial http://bost.ocks.org/mike/bar/

                    // ordinals
                    x.domain(data2.values.map(function(d,i) { return d.time; }));
                    // dimensions
                    y.domain([0, d3.max(data2.values, function(d) { return d.value; })]);

                    chart.append("g")
                        .attr("class", "x axis")
                        .attr("transform", "translate(0," + height + ")")
                        .call(xAxis)//;
                        // rotate these labels so they fit
                        // http://www.d3noob.org/2013/01/how-to-rotate-text-labels-for-x-axis-of.html
                        .selectAll("text")
                        .style("text-anchor", "end")
                        .attr("dx", "-.8em")
                        .attr("dy", ".15em")
                        .attr("transform", function(d) {
                            return "rotate(-65)"
                        });

                    chart.append("g")
                        .attr("class", "y axis")
                        .call(yAxis)
                    .append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 6)
                        .attr("dy", ".71em")
                        .style("text-anchor", "end")
                        .text(data.un);

                    chart.selectAll(".bar")
                        .data(data2.values)
                        .enter().append("rect")
                        .attr("class", "bar")
                        .attr("x", function(d, i) { return x(d.time); })
                        .attr("y", function(d) { return y(d.value); })
                        .attr("height", function(d) { return height - y(d.value); })
                        .attr("width", x.rangeBand());
                },true);

                /**
                 * helper to convert the string properties to float numbers, defaults to 0
                 * @param d
                 * @returns {*}
                 */
                function type(d) {
                    if( d && d.replace)
                        return parseFloat(d.replace(',','.')); // coerce to number
                    else
                    return 0;
                }

                /**
                 * helper to parse a date and add the given interval
                 * @param tm
                 * @param dt
                 * @param i
                 * @returns {*}
                 */
                function time(tm, dt, i){
                    return moment(tm).add('second',dt*i);
                }

            }
        };
    })

    // directive for gauge meter visualisation using d3js, from
    // http://bl.ocks.org/msqr/3202712
    .directive('gauge', function( /* dependencies go here */ ){

        // gauge script definition
        var gauge = function(container, configuration) {
            var that = {};
            var config = {
                size						: 200,
                clipWidth					: 200,
                clipHeight					: 110,
                ringInset					: 20,
                ringWidth					: 20,

                pointerWidth				: 10,
                pointerTailLength			: 5,
                pointerHeadLengthPercent	: 0.9,

                minValue					: 0,
                maxValue					: 10,

                minAngle					: -90,
                maxAngle					: 90,

                transitionMs				: 750,

                majorTicks					: 5,
                labelFormat					: d3.format(',g'),
                labelInset					: 10,

                arcColorFn					: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a'))
            };
            var range = undefined;
            var r = undefined;
            var pointerHeadLength = undefined;
            var value = 0;

            var svg = undefined;
            var arc = undefined;
            var scale = undefined;
            var ticks = undefined;
            var tickData = undefined;
            var pointer = undefined;

            var donut = d3.layout.pie();

            function deg2rad(deg) {
                return deg * Math.PI / 180;
            }

            function newAngle(d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + (ratio * range);
                return newAngle;
            }

            function configure(configuration) {
                var prop = undefined;
                for ( prop in configuration ) {
                    config[prop] = configuration[prop];
                }

                range = config.maxAngle - config.minAngle;
                r = config.size / 2;
                pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

                // a linear scale that maps domain values to a percent from 0..1
                scale = d3.scale.linear()
                    .range([0,1])
                    .domain([config.minValue, config.maxValue]);

                ticks = scale.ticks(config.majorTicks);
                tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});

                arc = d3.svg.arc()
                    .innerRadius(r - config.ringWidth - config.ringInset)
                    .outerRadius(r - config.ringInset)
                    .startAngle(function(d, i) {
                        var ratio = d * i;
                        return deg2rad(config.minAngle + (ratio * range));
                    })
                    .endAngle(function(d, i) {
                        var ratio = d * (i+1);
                        return deg2rad(config.minAngle + (ratio * range));
                    });
            }
            that.configure = configure;

            function centerTranslation() {
                return 'translate('+r +','+ r +')';
            }

            function isRendered() {
                return (svg !== undefined);
            }
            that.isRendered = isRendered;

            function render(newValue) {
                svg = d3.select(container)
                    .append('svg:svg')
                    .attr('class', 'gauge')
                    .attr('width', config.clipWidth)
                    .attr('height', config.clipHeight);

                var centerTx = centerTranslation();

                var arcs = svg.append('g')
                    .attr('class', 'arc')
                    .attr('transform', centerTx);

                arcs.selectAll('path')
                    .data(tickData)
                    .enter().append('path')
                    .attr('fill', function(d, i) {
                        return config.arcColorFn(d * i);
                    })
                    .attr('d', arc);

                var lg = svg.append('g')
                    .attr('class', 'label')
                    .attr('transform', centerTx);
                lg.selectAll('text')
                    .data(ticks)
                    .enter().append('text')
                    .attr('transform', function(d) {
                        var ratio = scale(d);
                        var newAngle = config.minAngle + (ratio * range);
                        return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
                    })
                    .text(config.labelFormat);

                var lineData = [ [config.pointerWidth / 2, 0],
                    [0, -pointerHeadLength],
                    [-(config.pointerWidth / 2), 0],
                    [0, config.pointerTailLength],
                    [config.pointerWidth / 2, 0] ];
                var pointerLine = d3.svg.line().interpolate('monotone');
                var pg = svg.append('g').data([lineData])
                    .attr('class', 'pointer')
                    .attr('transform', centerTx);

                pointer = pg.append('path')
                    .attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
                    .attr('transform', 'rotate(' +config.minAngle +')');

                update(newValue === undefined ? 0 : newValue);
            }
            that.render = render;

            function update(newValue, newConfiguration) {
                if ( newConfiguration  !== undefined) {
                    configure(newConfiguration);
                }
                var ratio = scale(newValue);
                var newAngle = config.minAngle + (ratio * range);
                pointer.transition()
                    .duration(config.transitionMs)
                    .ease('elastic')
                    .attr('transform', 'rotate(' +newAngle +')');
            }
            that.update = update;

            configure(configuration);

            return that;
        };

        // gauge directive
        return {
            restrict: 'E',
            template:
                '<div id="power-gauge"></div>',
            replace: true,
            link: function(scope, elem, attrs){

                // FIXME this shouldn't work with ID or we can only have a single gauge on the page...
                // create a config
                var powerGauge = gauge('#power-gauge', {
                    size: 300,
                    clipWidth: 300,
                    clipHeight: 300,
                    ringWidth: 1,
                    maxValue: 1500,
                    transitionMs: 4000,
                    pointerWidth				: 1,
                    pointerTailLength			: 0,
                    majorTicks : 10
                });

                // initial render
                powerGauge.render();

                scope.$watch(attrs.data, function (data, oldVal) {

                    // if 'val' is undefined, exit
                    if (!data) {
                        return;
                    }

                    powerGauge.update(data.pwr);
                });

            }

        };
    })