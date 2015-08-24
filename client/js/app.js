var xively = angular.module('xively', [
    'ngRoute',
    'ui.bootstrap',
    'ngAnimate',
    'btford.socket-io',
    'infinite-scroll',
    'LocalStorageModule',
    'firebase'])
    .config(['localStorageServiceProvider',function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('xy')
    }])
    .config(['$routeProvider', '$locationProvider', '$httpProvider', function($routeProvider, $locationProvider, $httpProvider){
        
        //typical routes... when someone navigates to a given directory, load the partial, and use the controller
        
        $routeProvider.when('/settings', {
                templateUrl: '/partials/setup.html', 
                controller: 'splashController',
                resolve: {
                    app: function($q) {
                        var  defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    }
                }
            
        });
        
        $routeProvider.when('/splash', {
                templateUrl: '/partials/splash.html', 
                controller: 'splashController',
                resolve: {
                    authenticate: authenticate
                }
            
        });
        
        $routeProvider.when('/kiosk/welcome', {templateUrl: '/partials/kiosk/welcome.html', controller: 'welcomeController'});
        $routeProvider.when('/kiosk/menubar', {templateUrl: '/partials/kiosk/menubar.html', controller: 'menubarController'});
        $routeProvider.when('/kiosk/thankyou', {templateUrl: '/partials/kiosk/thankyou.html', controller: 'thankyouController'});
        $routeProvider.when('/kiosk/register', {templateUrl: '/partials/kiosk/register.html', controller: 'registerController'});
        $routeProvider.when('/kiosk/select', {templateUrl: '/partials/kiosk/select.html', controller: 'selectController' });
        $routeProvider.when('/kiosk/settings', {templateUrl: '/partials/kiosk/settings.html', controller: 'settingsController' });
        
        //if no valid routes are found, redirect to /home
        $routeProvider.otherwise({redirectTo: '/settings'});
        //new comment
        $locationProvider.html5Mode({enabled: true, requireBase: false});
        $httpProvider.interceptors.push('AuthInterceptor');
        
        function authenticate($q, LSFactory , $timeout, $location) {
              if (LSFactory.getSessionId()) {
                // Resolve the promise successfully
                return $q.when()
              } else {
                // The next bit of code is asynchronously tricky.
        
                $timeout(function() {
                  // This code runs after the authentication promise has been rejected.
                  // Go to the log-in page
                  	 $location.path('/settings');
                })
        
                // Reject the authentication promise to prevent the state from loading
                return $q.reject()
              }
        }
        
    }])
    .filter('startFrom', function(){
        return function(data, start){
            return data.slice(start);
        }
    })
    .constant('FIREBASE_URI', 'https://kxively.firebaseio.com/people')
    .constant("API_URL", 'http://kiosk-mmayorivera.c9.io');
    