var app = angular.module('myApp', ['ngRoute']);
//configuring
app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
            .when('/home', {
                templateUrl: "views/home.html",
                controller: "homeCtrl",
                resolve: {
                    isloggedIn: function(ResolveService){
                        return ResolveService.isLoggedIn();
                    }

                }
            })
            .when('/', {
                templateUrl: "views/login.html",
                controller: "loginCtrl"
            })
            .when('/register', {
                templateUrl: "views/register.html",
                controller: "regCtrl"
            })
            .when('/postjob', {
                templateUrl: "views/postjob.html",
                controller: "postjobCtrl",
                resolve: {
                    isloggedIn: function(ResolveService1){
                        return ResolveService1.isLoggedIn1();
                    }

                }
                    
            })
            .when('/search', {
                templateUrl: "views/search.html",
                controller: "searchCtrl",
                resolve: {
                    isloggedIn: function(ResolveService){
                        return ResolveService.isLoggedIn();
                    }

                }
            })
            .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);

});

app.run(function ($rootScope, $location) {
    $rootScope.userInfo = {};
});
//controllers

app.controller('regCtrl', ['$scope', 'regService', function ($scope, regService) {
        $scope.regUser = function () {
            regService.regObj = {
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                location: $scope.location,
                userType: $scope.userType
            };
            regService.regData(regService.regObj);
            console.log(regService.regObj);
        };

    }]);

app.controller('loginCtrl', ['$scope', 'loginService', function ($scope, loginService) {
        $scope.loginUser = function () {
            var user = {
                username: $scope.username,
                password: $scope.password
            };
            loginService.isLogged(user);
        };

    }]);
app.controller('homeCtrl', ['$scope', '$rootScope', 'loginService', function ($scope, $rootScope, loginService) {

        $scope.userType = loginService.getDetails().userType;
        
        $scope.username = sessionStorage.username;
        console.log($scope.username);
        


    }]);

app.controller('postjobCtrl', ['$scope', 'jobService', '$location', function ($scope, jobService, $location) {
        $scope.postjob = function () {
            jobService.jobObj = {
                jobTitle: $scope.jobTitle,
                jobDescription: $scope.jobDescription,
                keywords: $scope.keywords,
                jobLocation: $scope.jobLocation
            };
            jobService.regJobData(jobService.jobObj);

        };


    }]);

app.controller('searchCtrl', ['$scope', '$http', function ($scope, $http) {
       
        $scope.searchjob = function () {

            $scope.searchObj = {
                searchTitle: $scope.searchTitle,
                searchKeyword: $scope.searchKeyword,
                searchLocation: $scope.searchLocation
            };
            console.log(this.searchObj);
            $http.post('/search', $scope.searchObj).then(function (res) {
                console.log(res);
                console.log('in http post of search');

                $scope.inputs = res.data;
                console.log(res.data);

            });
        };
        $scope.clear = function () {

        };
    }]);


//services



app.factory("jobService", function ($http, $location) {
    var jobObj = {};

    jobObj.regJobData = function (jobObj) {
        return $http.post('/postjob', jobObj).then(function (data) {
            console.log(jobObj);
            if (data.data.success) {
                $location.path('/home');
            }

        });
    };
    return jobObj;
});


app.factory("regService", function ($http, $location) {
    var regObj = {};
    regObj.regData = function (regObj) {
        return $http.post('/register', regObj).then(function (data) {
            if (data.data.success) {
                $location.path('/');
            }

        });
    };
    return regObj;
});

app.factory("loginService", function ($http, $location) {
    var userLog = {};
    return{
        isLogged: function (user) {
            console.log(user);
            
            $http.post('/login', user).then(function (data) {
                if (data.data.success) {
                    $http.post('/session', {CLoggedin: true}).then(function (res) {
                        console.log('succes posted');

                    });
                    console.log('working');
                    $location.path('/home');
                    userLog = data.data.user;
                    sessionStorage.userType = data.data.user.userType;
                    sessionStorage.username = data.data.user.username;
                    

                }
            });
            return userLog;
        },
        getDetails: function () {
            return userLog;
        }

    };
});




//var isLoggedIn = function ($scope, $location) {
//    console.log("in loggedIn")
//    app.run(function ($http, $q, $timeout) {
//
//        var deferred = $q.defer();
//
//        $http.get('/session', {timeout: deferred.promise})
//                .then(function (response) {
//                    $scope.response = response.data;
//
//                    if ($scope.response.loggedIn === true) {
//                        deferred.resolve();
//                        console.log("heyyyyyyyyyy")
//                    } else {
//                        deferred.reject();
//                        $location.path('/');
//                        console.log("reject")
//                    }
//                });
//
//        $timeout(function() {
//            deferred.resolve(); // this aborts the request!
//        }, 1000);
//    });
//};
    
app.factory("ResolveService", function ($http, $location, $q) {
    var storedObject = {
            
            isLoggedIn : function(){
                var deferred = $q.defer();
                $http.get('/session').then(function(res){
                if(res.data.loggedIn || res.data.CLoggedin === 'true') {
                    deferred.resolve();
                } 
                else {
                    deferred.reject();
                    $location.path('/');
                }
                });
                return deferred.promise;
            } 
        };
        console.log(storedObject);
        return storedObject;
});

app.factory("ResolveService1", function ($http, $location, $q) {
    var storedObject1 = {
            
            isLoggedIn1 : function(){
                var deferred = $q.defer();
                $http.get('/session').then(function(res){
                if(res.data.CLoggedin === 'true') {
                    deferred.resolve();
                } 
                else {
                    deferred.reject();
                    $location.path('/');
                }
                });
                return deferred.promise;
            } 
        };
        console.log(storedObject1);
        return storedObject1;
});

    
    
//       $http.get("/session")
//    .then(function(response) {
//         $scope.response = response.data;
// console.log($scope.response);
//    
//        var deferred = $q.defer();
//   
//    if ($scope.response.loggedIn) {
//        deferred.resolve();
//    } else {
//        deferred.reject();
//        $location.path('/');
//    }
//    return deferred.promise;
//    });
//    
    
    




//directives

app.directive("navDir", function () {


    return{
        restrict: 'EA',
        templateUrl: 'views/navdir.html',
        replace: true,
        scope: {
            datasource: "=",
            add: '&'

        },
        controller: function ($scope, $location, $http) {
            $scope.userType = sessionStorage.userType;
            $scope.username= sessionStorage.username;
            $scope.logout = function () {
                    console.log('in nav controller');
                    $http.get('/logout').then(function(response){
                        console.log(response.data);
                        response.data.data="false";
                    });
                        $location.path("/");
                    sessionStorage.userType = "";
                    sessionStorage.username ="";
                    console.log(sessionStorage.userType);
                    
                    
                    
              
            };
        }


    };
});

