/*! energy-dash-frontend v0.1.0 2014-04-17 */
"use strict";

angular.module("youlessAngularD3App", [ "ui.router", "filters", "controllers", "directives" ]).config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/status");
    $stateProvider.state("status", {
        url: "/status",
        templateUrl: "partials/status.html"
    }).state("history", {
        url: "/history",
        templateUrl: "partials/history.html"
    }).state("settings", {
        url: "/settings",
        templateUrl: "partials/settings.html"
    });
});