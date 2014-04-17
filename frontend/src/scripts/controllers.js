'use strict';

// all controllers go here
angular.module('controllers', ['nvd3ChartDirectives', 'services'])

  .controller('HistoryCtrl', function ($scope, $http) {

    /**
     * get graph data from REST interface
     */
    $scope.getData = function () {

      // resolve hour data
      // get current hour to use as default instead
      var now = new Date();
      $scope.updateHour(now.getHours());
      // resolve day data
      $scope.updateDay(now.getDate());
      // resolve month data
      $scope.updateMonth(now.getMonth());
    };

    $scope.updateHour = function (hour) {
      $scope.selectedHour = hour;
      // debug
      console.log('retrieving data with url %s', $scope.config.server + '/V?h=' + hour + '&j=1');
      // ajax
      $http({method: 'GET', url: $scope.config.server + '/V?h=' + hour + '&j=1'}).
        success(function (data) {

          // transform this data to the proper format expected by nvd3
          if ($scope.config.youlessCompatible) {
            $scope.hdata = [];
            $scope.hdata[0] = {key: 'Hour Data',
              values: []};
            for (var key in data.val) {
              $scope.hdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) * 1000 , parseFloat(data.val[key].replace(',', '.'))]);
            }
          }
          // otherwise we provided the data in the proper format
          else {
            $scope.hdata = data;
          }
        }
      ).
        error(function () {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.error = 'failed to fetch data';
        });
    };

    $scope.updateDay = function (day) {
      $scope.selectedDay = day;
      $http({method: 'GET', url: $scope.config.server + '/V?d=' + day + '&j=1'}).
        success(function (data) {

          // transform this data to the proper format expected by nvd3
          if ($scope.config.youlessCompatible) {
            $scope.ddata = [];
            $scope.ddata[0] = {key: 'Day Data',
              values: []};
            for (var key in data.val) {
              $scope.ddata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) * 1000 , parseFloat(data.val[key].replace(',', '.'))]);
            }
          }
          // otherwise we provided the data in the proper format
          else {
            $scope.ddata = data;
          }
        }
      ).
        error(function () {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.error = 'failed to fetch data';
        });
    };

    $scope.updateMonth = function (month) {
      $scope.selectedMonth = month;
      $http({method: 'GET', url: $scope.config.server + '/V?m=' + month + '&j=1'}).
        success(function (data) {

          // transform this data to the proper format expected by nvd3
          if ($scope.config.youlessCompatible) {
            $scope.mdata = [];
            $scope.mdata[0] = {key: 'Month Data',
              values: []};
            for (var key in data.val) {
              $scope.mdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) * 1000 , parseFloat(data.val[key].replace(',', '.'))]);
            }
          }
          // otherwise we provided the data in the proper format
          else {
            $scope.mdata = data;
          }
        }).
        error(function () {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.error = 'failed to fetch data';
        });
    };

    // retrieve data on load
    $scope.getData();

    $scope.xAxisTimeFormat = function () {
      return function (d) {
        return new Date(d).toTimeString();
      };
    };

    $scope.xAxisDateFormat = function () {
      return function (d) {
        return new Date(d).toDateString();
      };
    };

  })

  .
  controller('StatusCtrl', function ($scope, $http) {

    /**
     * get status from REST interface
     */
    $scope.getStatus = function () {

      // FIXME implement actual status fetching on server side
      $http({method: 'GET', url: $scope.config.server + '/a?j=1'})
        .success(function (data) {
          // this callback will be called asynchronously
          // when the response is available
          $scope.status = data;
        })
        .error(function () {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.error = 'failed to fetch data';
        });
    };

    // resolve on load
    $scope.getStatus();
  })

  .controller('AppCtrl', function ($scope, $http, configService) {

    // TODO proper resolving of config instead with promise
    configService.initConfig();

    // TODO use ui.bootstrap for alerts instead of error that is now on scope

    // settings editing flag
    $scope.editSettings = false;

    /**
     * helper to retrieve some dummy data
     */
    $scope.getDummyData = function () {
      // retrieve dummy data from service
      $http({method: 'GET', url: $scope.config.server + '/a?mock=1'})
        .success(function (data) {
          $scope.status = data;
        })
        .error(function () {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.error = 'failed to fetch data';
        });

      $http({method: 'GET', url: $scope.config.server + '/V?mock=1'})
        // FIXME this ain't working
        .success(function (data) {
          $scope.hdata = [];
          $scope.hdata[0] = {key: 'Hour Data',
            values: []};
          $scope.ddata = [];
          $scope.ddata[0] = {key: 'Day Data',
            values: []};
          $scope.mdata = [];
          $scope.mdata[0] = {key: 'Month Data',
            values: []};
          // resolve all to the same
          for (var key in data.val) {
            if (data.val[key] === null) {
              continue;
            }
            $scope.hdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) * 1000 , parseFloat(data.val[key].replace(',', '.'))]);
            $scope.ddata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) * 1000 , parseFloat(data.val[key].replace(',', '.'))]);
            $scope.mdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) * 1000 , parseFloat(data.val[key].replace(',', '.'))]);
          }
        })
        .error(function () {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          $scope.error = 'failed to fetch data';
        });
    };

    $scope.enableEditSettings = function () {
      $scope.editSettings = true;
    };

    $scope.updateConfig = function () {
      // TODO add validation here
      configService.updateConfig();
      // go out of edit mode here
      $scope.editSettings = false;
    };
  });
