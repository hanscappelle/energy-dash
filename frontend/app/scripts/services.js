/*! energy-dash-frontend v0.1.0 2014-04-17 */
"use strict";

angular.module("services", []).service("configService", function($rootScope) {
    $rootScope.config = {
        server: "http://localhost:3000",
        password: "",
        gaugeMax: 1500,
        interval: 60,
        timec: 1,
        youlessCompatible: true
    };
    var initConfig = function() {
        if (typeof chrome === "object" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get("serverConfig", function(data) {
                if (data.serverConfig) {
                    $rootScope.config = data.serverConfig;
                }
            });
        } else {
            var config = JSON.parse(localStorage.getItem("serverConfig"));
            if (config) {
                $rootScope.config = config;
            }
        }
    };
    var updateConfig = function() {
        if (typeof chrome === "object" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
                serverConfig: $rootScope.config
            });
        } else {
            localStorage.setItem("serverConfig", JSON.stringify($rootScope.config));
        }
    };
    var getConfig = function() {
        return $rootScope.config;
    };
    return {
        initConfig: initConfig,
        updateConfig: updateConfig,
        getConfig: getConfig
    };
});