/**
 * Created by jbeck on 9/2/2014.
 */
(function () {
    'use strict';

    // this service keeps track of the http requests
    var pendingRequestsServiceId = 'pendingRequests';
    angular.module('app').service(pendingRequestsServiceId, [pendingRequests]);

    function pendingRequests() {
        var pending = [],
            objects = [],
            pendingId = 1,
            objectId = 1,
            logging = true;
        var get = function () {
                return pending;
            },
            add = function (request) {
                request.uId = pendingId++;
                pending.push(request);
                if(logging) {
                    console.log("[HttpRequest] New " + request.uId + " : " + request.url);
                }
            },
            addObject = function (object) {
                object.uId = objectId++;
                objects.push(object);
                if(logging) {
                    console.log("[HttpObject] New " + object.uId + " : " + object.url);
                }
            },
            remove = function (request) {
                pending = _.filter(pending, function (p) {
                    return p.url !== request;
                });
            },
            removeObject = function(object) {
                objects = _.filter(objects, function (p) {
                    return p.url !== object;
                });
            },
            cancelAll = function () {
                angular.forEach(pending, function (p) {
                    p.canceller.resolve();
                });
                this.pending.length = 0;
            },
            count = function () {
                return (pending) ? pending.length : 0;
            },
            objectCount = function () {
                return (objects) ? objects.length : 0;
            };

        var service = {
            get: get,
            add: add,
            addObject: addObject,
            remove: remove,
            removeObject: removeObject,
            cancelAll: cancelAll,
            count: count,
            objectCount: objectCount
        };

        return service;
    }

    // This service wraps $http to make sure pending requests are tracked
    // to use, replace common.$http = httpService;
    var httpServiceId = 'httpService';
    angular.module('app').service(httpServiceId, ['$http', '$q', 'pendingRequests', '$interval', httpService]);

    function httpService($http, $q, pendingRequests, $interval) {
        var get = function(url) {
                var canceller = $q.defer();
                pendingRequests.add({
                    url: url,
                    canceller: canceller
                });
                //Request gets cancelled if the timeout-promise is resolved
                var requestPromise = $http.get(url, { timeout: canceller.promise });
                //Once a request has failed or succeeded, remove it from the pending list
                requestPromise.finally(function (result) {
                    pendingRequests.remove(url);
                });
                return requestPromise;
            },
            logStats = function() {
                console.log("[HttpService] Requests (" + pendingRequests.count() + ") Objects (" + pendingRequests.objectCount() + ")");
            };

        function activate() {
            $interval(logStats, 1000);
        }

        activate();

        var service = function(options) {
                var canceller = $q.defer();
                pendingRequests.addObject({
                    url: options.url,
                    canceller: canceller
                });
                options.timeout = canceller.promise;
                //Request gets cancelled if the timeout-promise is resolved
                var httpObject = $http(options);
                httpObject.finally(function (result) {
                    pendingRequests.removeObject(options.url);
                });
                return httpObject;
            };

        service.get = get;

        return service;
    }
}());