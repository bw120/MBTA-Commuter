angular
	.module('app', ['ngRoute','firebase'])
	.controller('MenuCtrl', MenuCtrl)
	.controller('BuilderCtrl', BuilderCtrl)
	.controller('DashboardCtrl', DashboardCtrl)
	.controller('ViewerCtrl', ViewerCtrl)
	.controller('ExplorerCtrl', ExplorerCtrl)
	.controller('LoginCtrl', LoginCtrl)
	.controller('firebaseCtrl', firebaseCtrl)
	.factory('myData', myData)
	.factory('Auth', Auth)
	.factory('myCommutes', myCommutes)
	.service('Mbta', Mbta)
	.run(authCheck)
	.config(router);

//If user is not logged in, route them to login screen
function authCheck ($rootScope, $location) {
	$rootScope
	.$on("$routeChangeError", function(event, next, previous, error){
		if (error === "AUTH_REQUIRED") {
			$location.path("/login");
		}
	});
}

function router ($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})
	.when('/builder', {
		templateUrl: 'templates/builder.html',
		resolve: {
		    "currentAuth": ["Auth", function(Auth) {
		     return Auth.auth.$requireAuth();
	    }]
	  }
	})
	.when('/dashboard', {
		templateUrl: 'templates/dashboard.html',
		resolve: {
		    "currentAuth": ["Auth", function(Auth) {
		     return Auth.auth.$requireAuth();
	    }]
	  }
	})
	.when('/viewer', {
		templateUrl: 'templates/viewer.html',
		resolve: {
		    "currentAuth": ["Auth", function(Auth) {
		     return Auth.auth.$requireAuth();
	    }]
	  }
	})
	//view for exploring MBTA system
	.when('/explorer', {
		templateUrl: 'templates/explorer.html',
		resolve: {
		    "currentAuth": ["Auth", function(Auth) {
		     return Auth.auth.$requireAuth();
	    }]
	  }
	})
	.otherwise({
        redirectTo: '/dashboard'
	});
}