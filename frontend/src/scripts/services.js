'use strict';

// all services go here
angular.module('services', [])

.service('configService', function($rootScope){

    // the default configuration
    $rootScope.config = {
      server: 'http://localhost:3000',
      password: '',
      gaugeMax : 1500,
      interval : 60,
      timec : 1
    };

    var initConfig = function () {
      // packaged chrome apps version
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get('serverConfig', function (data) {
          if (data.serverConfig) {
            $rootScope.config = data.serverConfig;
          }
        });
      }
      // html5 browser version
      else {
        var config = JSON.parse(localStorage.getItem('serverConfig'));
        // only set when some value found
        if (config) {
          $rootScope.config = config;
        }
      }
    };

    var updateConfig = function(){
      // save settings in local storage (chrome only?) this is the html5 approach...
      if (chrome && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({'serverConfig': $rootScope.config});
      }
      // html 5 browsers
      else {
        localStorage.setItem('serverConfig', JSON.stringify($rootScope.config));
      }
    }

    var getConfig = function(){
      return $rootScope.config;
    }

    return {
      "initConfig" : initConfig,
      "updateConfig" : updateConfig,
      "getConfig" : getConfig
    }

  });
