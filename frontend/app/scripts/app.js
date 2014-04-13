/*! energy-dash-frontend v0.1.0 2014-04-13 */
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
    $scope.getData = function() {
        var now = new Date();
        $scope.updateHour(now.getHours());
        $http({
            method: "GET",
            url: $scope.config.server + "/V?d=13&j=1"
        }).success(function(data, status, headers, config) {
            $scope.ddata = [];
            $scope.ddata[0] = {
                key: "Day Data ",
                values: []
            };
            for (var key in data.val) $scope.ddata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
        }).error(function(data, status, headers, config) {
            $scope.error = "failed to fetch data";
        });
        $http({
            method: "GET",
            url: $scope.config.server + "/V?m=3&j=1"
        }).success(function(data, status, headers, config) {
            $scope.mdata = [];
            $scope.mdata[0] = {
                key: "Month Data ",
                values: []
            };
            for (var key in data.val) $scope.mdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
        }).error(function(data, status, headers, config) {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.updateHour = function(hour) {
        $scope.selectedHour = hour;
        console.log("retrieving data with url $s", $scope.config.server + "/V?h=" + hour + "&j=1");
        $http({
            method: "GET",
            url: $scope.config.server + "/V?h=" + hour + "&j=1"
        }).success(function(data, status, headers, config) {
            $scope.hdata = [];
            $scope.hdata[0] = {
                key: "Hour Data",
                values: []
            };
            for (var key in data.val) $scope.hdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
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
        $http({
            method: "GET",
            url: $scope.config.server + "/a?mock=1"
        }).success(function(data, status, headers, config) {
            $scope.status = data;
        }).error(function(data, status, headers, config) {
            $scope.error = "failed to fetch data";
        });
        $http({
            method: "GET",
            url: $scope.config.server + "/V?mock=1"
        }).success(function(data, status, headers, config) {
            $scope.data = data;
        }).error(function(data, status, headers, config) {
            $scope.error = "failed to fetch data";
        });
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
}).filter("range", function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
});