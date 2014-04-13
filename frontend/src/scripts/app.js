'use strict';

angular.module('youlessAngularD3App', [
        'ngResource', 'ui.router', 'nvd3ChartDirectives'
    ])

    // routes
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
    })

    // controllers TODO move these to separate files
    .controller('HistoryCtrl', function ($scope, $http) {

        // TODO move config to config file instead or from app storage
        $scope.config = {
            server: 'http://localhost:3000',
            password: ''
        }

        // resolve this from live data
        /**
         * get graph data from REST interface
         */
        $scope.getData = function(){
            $http({method: 'GET', url: $scope.config.server+'/V?m=1&j=1'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // transform this data to the proper format expected by nvd3
                    $scope.data = [];
                    $scope.data[0] = {key : "Series 2",
                     values : []};
                    for( var key in data.val )
                        $scope.data[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) , parseFloat(data.val[key].replace(",","."))]);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        // TODO dummy data using d param on requests

        // retrieve data on load
        $scope.getData();

        $scope.xAxisTickFormatFunction = function() {
            return function(d, i) {
                return new Date(d).toUTCString();

            };
        }

    })

    .controller('AppCtrl', function ($scope, $http) {

        // the current status data
        $scope.status;

        // settings editing flag
        $scope.editSettings = false;

        // the configuration
        $scope.config = {
            server: 'http://localhost:3000',
            password: ''
        };

        var initConfig = function () {
            // packaged chrome apps version
            if (chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get('server-config', function (data) {
                    if (data.server - config)
                        $scope.config = server - config;
                });
            }
            // html5 browser version
            else {
                var config = JSON.parse(localStorage.getItem('server-config'));
                // only set when some value found
                if (config)
                    $scope.config = config;
            }
        }

        //always init config on loading of controller
        initConfig();

        /**
         * helper to retrieve some dummy data
         */
        $scope.getDummyData = function () {
            // retrieve dummy data from service
            $http({method: 'GET', url: $scope.config.server + '/a?mock=1'})
                .success(function(data, status, headers, config){
                    $scope.status = data;
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });

            $http({method: 'GET', url: $scope.config.server + '/V?mock=1'})
                .success(function(data, status, headers, config){
                    $scope.data = data;
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        /**
         * get status from REST interface
         */
        $scope.getStatus = function () {
            $http({method: 'GET', url: $scope.config.server + '/a?j=1'
                // http://stackoverflow.com/questions/21102690/angularjs-not-detecting-access-control-allow-origin-header
                /*
                 ,headers:{
                 'Access-Control-Allow-Origin': '*',
                 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                 'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'
                 } */
            }).
                success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.status = data;
                }).
                error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        $scope.enableEditSettings = function () {
            $scope.editSettings = true;
        }

        $scope.updateConfig = function () {
            // TODO add validation here
            // save settings in local storage (chrome only?) this is the html5 approach...
            if (chrome && chrome.storage && chrome.storage.local) {
                chrome.storage.local.set({'server-config': $scope.config});
            }
            // html 5 browsers
            else
                localStorage.setItem('server-config', JSON.stringify($scope.config));
            // go out of edit mode here
            $scope.editSettings = false;
        }
    });
