/*! energy-dash-frontend v0.1.0 2014-04-17 */
"use strict";

angular.module("filters", []).filter("range", function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
});