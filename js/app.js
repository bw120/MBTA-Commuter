angular
	.module('app', ['ngRoute'])
	.controller('BuilderCtrl', BuilderCtrl )
	.controller('DashboardCtrl', DashboardCtrl)
	.controller('ViewerCtrl', ViewerCtrl)
	.controller('ExplorerCtrl', ExplorerCtrl)
	.controller('LoginCtrl', LoginCtrl)
	.factory('myData', myData)
	.factory('myCommutes', myCommutes)
	.service('Mbta', Mbta)
	.config(router);

function router ($routeProvider) {
	$routeProvider
	.when('/login', {
		templateUrl: 'templates/login.html',
		controller: 'LoginCtrl'
	})
	.when('/builder', {
		templateUrl: 'templates/builder.html'
		// controller: 'BuilderCtrl'
	})
	.when('/dashboard', {
		templateUrl: 'templates/dashboard.html',
		controller: 'DashboardCtrl'
	})
	.when('/viewer', {
		templateUrl: 'templates/viewer.html',
		controller: 'ViewerCtrl'
	})
	//view for exploring MBTA system
	.when('/explorer', {
		templateUrl: 'templates/explorer.html',
		controller: 'ExplorerCtrl'
	})
	.otherwise({
        redirectTo: '/builder'
	});
}