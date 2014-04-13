/*! youless-angular-d3 v0.1.0 2014-04-13 */
"use strict";

angular.module("youlessAngularD3App", [ "ngResource", "ui.router", "nvd3ChartDirectives" ]).config(function($stateProvider, $urlRouterProvider) {
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
}).controller("HistoryCtrl", function($scope, $http) {
    $scope.config = {
        server: "http://localhost:3000",
        password: ""
    };
    $scope.getData = function() {
        $http({
            method: "GET",
            url: $scope.config.server + "/V?m=1&j=1"
        }).success(function(data, status, headers, config) {
            $scope.data = [];
            $scope.data[0] = {
                key: "Series 2",
                values: []
            };
            for (var key in data.val) $scope.data[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
        }).error(function(data, status, headers, config) {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.getData();
    $scope.xAxisTickFormatFunction = function() {
        return function(d, i) {
            return new Date(d).toUTCString();
        };
    };
}).controller("AppCtrl", function($scope, $http) {
    $scope.data;
    $scope.status;
    $scope.editSettings = false;
    $scope.config = {
        server: "http://localhost:3000",
        password: ""
    };
    var initConfig = function() {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get("server-config", function(data) {
                if (data.server - config) $scope.config = server - config;
            });
        } else {
            var config = JSON.parse(localStorage.getItem("server-config"));
            if (config) $scope.config = config;
        }
    };
    initConfig();
    $scope.getDummyData = function() {
        $scope.data = {
            un: "kWh",
            tm: "2012-01-01T00:00:00",
            dt: 86400,
            val: [ " 0,000", " 7,200", " 8,000", " 8,200", " 6,600", " 7,900", " 8,600", " 10,600", " 6,200", " 7,000", " 8,200", " 5,100", " 8,900", " 5,900", " 7,300", " 7,400", " 6,900", " 12,200", " 6,700", " 8,500", " 7,100", " 7,700", " 1,300", " 8,500", " 5,500", " 7,700", " 7,500", " 10,200", " 8,100", " 6,300", " 4,100" ]
        }, $scope.status = {
            cnt: "4457,005",
            pwr: 453,
            lvl: 0,
            dev: "",
            det: "",
            con: "OK",
            sts: "(52)",
            raw: 0
        };
    };
    $scope.getStatus = function() {
        $http({
            method: "GET",
            url: $scope.config.server + "/a?j=1"
        }).success(function(data, status, headers, config) {
            $scope.status = data;
        }).error(function(data, status, headers, config) {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.enableEditSettings = function() {
        $scope.editSettings = true;
    };
    $scope.updateConfig = function() {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
                "server-config": $scope.config
            });
        } else localStorage.setItem("server-config", JSON.stringify($scope.config));
        $scope.editSettings = false;
    };
});