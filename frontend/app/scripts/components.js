/*! energy-dash-frontend v0.1.0 2014-04-13 */
angular.module("components", []).directive("barChart", function() {
    return {
        restrict: "E",
        link: function(scope, element, attrs) {
            var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName("body")[0], screenw = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
            var margin = {
                top: 10,
                right: 20,
                bottom: 60,
                left: 20
            }, width = screenw, width = width - margin.left - margin.right, mapRatio = .5, height = width * mapRatio;
            var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .1);
            var y = d3.scale.linear().range([ height, 0 ]);
            var chart = d3.select(element[0]).append("svg").attr("class", "chart").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var xAxis = d3.svg.axis().scale(x).orient("bottom");
            var yAxis = d3.svg.axis().scale(y).orient("left");
            scope.$watch(attrs.data, function(data, oldVal) {
                chart.selectAll("*").remove();
                if (!data) {
                    return;
                }
                var data2 = {
                    values: []
                };
                for (var key in data.val) {
                    data2.values[key] = {
                        value: type(data.val[key]),
                        time: time(data.tm, data.dt, key).format("DD-MM-YYYY")
                    };
                }
                x.domain(data2.values.map(function(d, i) {
                    return d.time;
                }));
                y.domain([ 0, d3.max(data2.values, function(d) {
                    return d.value;
                }) ]);
                chart.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis).selectAll("text").style("text-anchor", "end").attr("dx", "-.8em").attr("dy", ".15em").attr("transform", function(d) {
                    return "rotate(-65)";
                });
                chart.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text(data.un);
                chart.selectAll(".bar").data(data2.values).enter().append("rect").attr("class", "bar").attr("x", function(d, i) {
                    return x(d.time);
                }).attr("y", function(d) {
                    return y(d.value);
                }).attr("height", function(d) {
                    return height - y(d.value);
                }).attr("width", x.rangeBand());
            }, true);
            function type(d) {
                if (d && d.replace) return parseFloat(d.replace(",", ".")); else return 0;
            }
            function time(tm, dt, i) {
                return moment(tm).add("second", dt * i);
            }
        }
    };
}).directive("gauge", function() {
    var gauge = function(container, configuration) {
        var that = {};
        var config = {
            size: 200,
            clipWidth: 200,
            clipHeight: 110,
            ringInset: 20,
            ringWidth: 20,
            pointerWidth: 10,
            pointerTailLength: 5,
            pointerHeadLengthPercent: .9,
            minValue: 0,
            maxValue: 10,
            minAngle: -90,
            maxAngle: 90,
            transitionMs: 750,
            majorTicks: 5,
            labelFormat: d3.format(",g"),
            labelInset: 10,
            arcColorFn: d3.interpolateHsl(d3.rgb("#e8e2ca"), d3.rgb("#3e6c0a"))
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
            var newAngle = config.minAngle + ratio * range;
            return newAngle;
        }
        function configure(configuration) {
            var prop = undefined;
            for (prop in configuration) {
                config[prop] = configuration[prop];
            }
            range = config.maxAngle - config.minAngle;
            r = config.size / 2;
            pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);
            scale = d3.scale.linear().range([ 0, 1 ]).domain([ config.minValue, config.maxValue ]);
            ticks = scale.ticks(config.majorTicks);
            tickData = d3.range(config.majorTicks).map(function() {
                return 1 / config.majorTicks;
            });
            arc = d3.svg.arc().innerRadius(r - config.ringWidth - config.ringInset).outerRadius(r - config.ringInset).startAngle(function(d, i) {
                var ratio = d * i;
                return deg2rad(config.minAngle + ratio * range);
            }).endAngle(function(d, i) {
                var ratio = d * (i + 1);
                return deg2rad(config.minAngle + ratio * range);
            });
        }
        that.configure = configure;
        function centerTranslation() {
            return "translate(" + r + "," + r + ")";
        }
        function isRendered() {
            return svg !== undefined;
        }
        that.isRendered = isRendered;
        function render(newValue) {
            svg = d3.select(container).append("svg:svg").attr("class", "gauge").attr("width", config.clipWidth).attr("height", config.clipHeight);
            var centerTx = centerTranslation();
            var arcs = svg.append("g").attr("class", "arc").attr("transform", centerTx);
            arcs.selectAll("path").data(tickData).enter().append("path").attr("fill", function(d, i) {
                return config.arcColorFn(d * i);
            }).attr("d", arc);
            var lg = svg.append("g").attr("class", "label").attr("transform", centerTx);
            lg.selectAll("text").data(ticks).enter().append("text").attr("transform", function(d) {
                var ratio = scale(d);
                var newAngle = config.minAngle + ratio * range;
                return "rotate(" + newAngle + ") translate(0," + (config.labelInset - r) + ")";
            }).text(config.labelFormat);
            var lineData = [ [ config.pointerWidth / 2, 0 ], [ 0, -pointerHeadLength ], [ -(config.pointerWidth / 2), 0 ], [ 0, config.pointerTailLength ], [ config.pointerWidth / 2, 0 ] ];
            var pointerLine = d3.svg.line().interpolate("monotone");
            var pg = svg.append("g").data([ lineData ]).attr("class", "pointer").attr("transform", centerTx);
            pointer = pg.append("path").attr("d", pointerLine).attr("transform", "rotate(" + config.minAngle + ")");
            update(newValue === undefined ? 0 : newValue);
        }
        that.render = render;
        function update(newValue, newConfiguration) {
            if (newConfiguration !== undefined) {
                configure(newConfiguration);
            }
            var ratio = scale(newValue);
            var newAngle = config.minAngle + ratio * range;
            pointer.transition().duration(config.transitionMs).ease("elastic").attr("transform", "rotate(" + newAngle + ")");
        }
        that.update = update;
        configure(configuration);
        return that;
    };
    return {
        restrict: "E",
        template: '<div id="power-gauge"></div>',
        replace: true,
        link: function(scope, elem, attrs) {
            var powerGauge = gauge("#power-gauge", {
                size: 300,
                clipWidth: 300,
                clipHeight: 300,
                ringWidth: 1,
                maxValue: 1500,
                transitionMs: 4e3,
                pointerWidth: 1,
                pointerTailLength: 0,
                majorTicks: 10
            });
            powerGauge.render();
            scope.$watch(attrs.data, function(data, oldVal) {
                if (!data) {
                    return;
                }
                powerGauge.update(data.pwr);
            });
        }
    };
});