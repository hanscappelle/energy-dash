// all controllers go here
angular.module('controllers', ['nvd3ChartDirectives'])

    .controller('HistoryCtrl', function ($scope, $http) {

        /**
         * get graph data from REST interface
         */
        $scope.getData = function(){

            // resolve hour data
            // get current hour to use as default instead
            var now = new Date();
            $scope.updateHour(now.getHours());

            // resolve day data
            $scope.updateDay(now.getDate());

            // resolve month data
            $scope.updateMonth(now.getMonth());
        }

        $scope.updateHour = function(hour){
            $scope.selectedHour = hour;
            // debug
            console.log('retrieving data with url $s', $scope.config.server+'/V?h='+hour+'&j=1');
            // ajax
            $http({method: 'GET', url: $scope.config.server+'/V?h='+hour+'&j=1'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // transform this data to the proper format expected by nvd3
                    $scope.hdata = [];
                    $scope.hdata[0] = {key : "Hour Data",
                        values : []};
                    for( var key in data.val )
                        $scope.hdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) , parseFloat(data.val[key].replace(",","."))]);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        $scope.updateDay = function(day){
            $scope.selectedDay = day;
            $http({method: 'GET', url: $scope.config.server+'/V?d='+day+'&j=1'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // transform this data to the proper format expected by nvd3
                    $scope.ddata = [];
                    $scope.ddata[0] = {key : "Day Data ",
                        values : []};
                    for( var key in data.val )
                        $scope.ddata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) , parseFloat(data.val[key].replace(",","."))]);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        $scope.updateMonth = function(month){
            $scope.selectedMonth = month;
            $http({method: 'GET', url: $scope.config.server+'/V?m='+month+'&j=1'}).
                success(function(data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available

                    // transform this data to the proper format expected by nvd3
                    $scope.mdata = [];
                    $scope.mdata[0] = {key : "Month Data ",
                        values : []};
                    for( var key in data.val )
                        $scope.mdata[0].values.push([ new Date(data.tm).getTime() + key * parseInt(data.dt) , parseFloat(data.val[key].replace(",","."))]);
                }).
                error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        // retrieve data on load
        $scope.getData();

        $scope.xAxisTickFormatFunction = function() {
            return function(d, i) {
                return new Date(d).toUTCString();

            };
        }

    })

    .controller('StatusCtrl', function($scope, $http){
        // the current status data
        $scope.status;

        /**
         * get status from REST interface
         */
        $scope.getStatus = function () {

            // FIXME implement actual status fetching on server side
            $http({method: 'GET', url: $scope.config.server + '/a?j=1'})
                .success(function (data, status, headers, config) {
                    // this callback will be called asynchronously
                    // when the response is available
                    $scope.status = data;
                })
                .error(function (data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    $scope.error = "failed to fetch data";
                });
        }

        // resolve on load
        $scope.getStatus();
    })

    .controller('AppCtrl', function ($scope, $http) {

        // TODO use ui.bootstrap for alerts instead of error that is now on scope

        // settings editing flag
        $scope.editSettings = false;

        // the default configuration
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
    })
