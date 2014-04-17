/*! energy-dash-frontend v0.1.0 2014-04-17 */
"use strict";

angular.module("directives", [ "services" ]).directive("gauge", function(configService) {
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
        var range, r, pointerHeadLength;
        var svg, arc, scale, ticks, tickData, pointer;
        function deg2rad(deg) {
            return deg * Math.PI / 180;
        }
        function configure(configuration) {
            var prop;
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
                maxValue: configService.getConfig().gaugeMax ? configService.getConfig().gaugeMax : 1500,
                transitionMs: 4e3,
                pointerWidth: 1,
                pointerTailLength: 0,
                majorTicks: 10
            });
            powerGauge.render();
            scope.$watch(attrs.data, function(data) {
                if (!data) {
                    return;
                }
                powerGauge.update(data.pwr);
            });
        }
    };
});