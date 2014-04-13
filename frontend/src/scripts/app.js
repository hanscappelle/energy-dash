'use strict';

angular.module('youlessAngularD3App', ['ngResource', 'ui.router', 'filters', 'controllers', 'directives'])

    // routes configuration
    .config(function ($stateProvider, $urlRouterProvider) {

        // For any unmatched url, send to /route1
        $urlRouterProvider.otherwise("/status")

        $stateProvider

            .state('status', {
                url: "/status",
                templateUrl: "partials/status.html"
            })

            .state('history', {
                url: "/history",
                templateUrl: "partials/history.html"
            })

            .state('settings', {
                url: "/settings",
                templateUrl: "partials/settings.html"
            })
    });