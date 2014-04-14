/*! energy-dash-frontend v0.1.0 2014-04-14 */
"use strict";

angular.module("controllers", [ "nvd3ChartDirectives" ]).controller("HistoryCtrl", function($scope, $http) {
    $scope.getData = function() {
        var now = new Date();
        $scope.updateHour(now.getHours());
        $scope.updateDay(now.getDate());
        $scope.updateMonth(now.getMonth());
    };
    $scope.updateHour = function(hour) {
        $scope.selectedHour = hour;
        console.log("retrieving data with url %s", $scope.config.server + "/V?h=" + hour + "&j=1");
        $http({
            method: "GET",
            url: $scope.config.server + "/V?h=" + hour + "&j=1"
        }).success(function(data) {
            $scope.hdata = [];
            $scope.hdata[0] = {
                key: "Hour Data",
                values: []
            };
            for (var key in data.val) {
                $scope.hdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
            }
        }).error(function() {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.updateDay = function(day) {
        $scope.selectedDay = day;
        $http({
            method: "GET",
            url: $scope.config.server + "/V?d=" + day + "&j=1&full=1"
        }).success(function(data) {
            $scope.ddata = [];
            $scope.ddata[0] = {
                key: "Day Data ",
                values: []
            };
            for (var key in data.val) {
                $scope.ddata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
            }
        }).error(function() {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.updateMonth = function(month) {
        $scope.selectedMonth = month;
        $http({
            method: "GET",
            url: $scope.config.server + "/V?m=" + month + "&j=1"
        }).success(function(data) {
            $scope.mdata = [];
            $scope.mdata[0] = {
                key: "Month Data ",
                values: []
            };
            for (var key in data.val) {
                $scope.mdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt), parseFloat(data.val[key].replace(",", ".")) ]);
            }
        }).error(function() {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.getData();
    $scope.xAxisTimeFormat = function() {
        return function(d) {
            return new Date(d).toTimeString();
        };
    };
    $scope.xAxisDateFormat = function() {
        return function(d) {
            return new Date(d).toDateString();
        };
    };
}).controller("StatusCtrl", function($scope, $http) {
    $scope.getStatus = function() {
        $http({
            method: "GET",
            url: $scope.config.server + "/a?j=1"
        }).success(function(data) {
            $scope.status = data;
        }).error(function() {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.getStatus();
}).controller("AppCtrl", function($scope, $http) {
    $scope.editSettings = false;
    $scope.config = {
        server: "http://localhost:3000",
        password: ""
    };
    var initConfig = function() {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get("serverConfig", function(data) {
                if (data.serverConfig) {
                    $scope.config = data.serverConfig;
                }
            });
        } else {
            var config = JSON.parse(localStorage.getItem("serverConfig"));
            if (config) {
                $scope.config = config;
            }
        }
    };
    initConfig();
    $scope.getDummyData = function() {
        $http({
            method: "GET",
            url: $scope.config.server + "/a?mock=1"
        }).success(function(data) {
            $scope.status = data;
        }).error(function() {
            $scope.error = "failed to fetch data";
        });
        $http({
            method: "GET",
            url: $scope.config.server + "/V?mock=1"
        }).success(function(data) {
            $scope.hdata = $scope.ddata = $scope.mdata = data;
        }).error(function() {
            $scope.error = "failed to fetch data";
        });
    };
    $scope.enableEditSettings = function() {
        $scope.editSettings = true;
    };
    $scope.updateConfig = function() {
        if (chrome && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
                serverConfig: $scope.config
            });
        } else {
            localStorage.setItem("serverConfig", JSON.stringify($scope.config));
        }
        $scope.editSettings = false;
    };
});