function MenuCtrl ($scope, Auth, $location) {
	$scope.menuOpen = false;
	$scope.showMenu = false;
	//updates the user name logged in as on the top bar
    $scope.auth = Auth.auth;
    $scope.auth.$onAuth(function(authData) {

    	if (Auth.getAuthState() != null) {
			$scope.user = Auth.getAuthState().password.email;
		}
    });

    $scope.doSomething = function () {
    	console.log("hey");
    	$scope.showMenu = true;
    };

	$scope.logout = function() {
		Auth.logout();
		$location.path('/login');
	};

}

function BuilderCtrl ($scope, $location, myData, myCommutes, Mbta) {
	var self = this;
	$scope.allCommutes = myCommutes.getData();

	$scope.modes = ["Subway", "Bus", "Commuter Rail", "Boat"];

	//overall commute details to be pushed to the myCommutes
	$scope.commute = {
		name: "My Commute",
		edit: 3,
		routeLegs: [],
	};

	//gets a list of all routes for all modes of transit
	Mbta.getRoutes()
		.then(function(data) {
		    $scope.AllRoutes = data;
	});

	//gets a list of stops for the selected route
	$scope.getStops = function(route) {
		Mbta.getStops(route.route_id)
			.then(function(data) {
			    $scope.Stops = data;
			    $scope.selectedLine = route.route_id;
			    $scope.line = route.route_name;
			    
			});
	};


	$scope.addLeg = function() {

		var leg = {
			modeID: $scope.leg.mode,
			mode: $scope.modes[$scope.leg.mode],
			lineID: $scope.leg.selectedLine.route_id,
			line: $scope.leg.selectedLine.route_name,
			direction: $scope.leg.direction.direction_name,
			boardingStopID: $scope.leg.boarding.stop_id,
			disboardStopID: $scope.leg.deboarding.stop_id,
			boardingStop: $scope.leg.boarding.stop_name,
			disboardStop: $scope.leg.deboarding.stop_name
		};

		$scope.commute.routeLegs.push(leg);
		$scope.leg = null;
		$scope.commute.edit = 1;


	};

	$scope.saveCommute = function() {
		$scope.allCommutes.$add($scope.commute);
		$location.path('/dashboard');
	};


}

function DashboardCtrl ($scope, $location, $interval, $route, $rootScope, myCommutes, Mbta, $rootScope) {
	$scope.allCommutes = myCommutes.getData();
	$scope.showAlert = [];
	$scope.allAlerts ={};
	$scope.allPredictions =[];
	var theUpdates;

	//When logging out destroy Firebase reference.
	$rootScope.$on("logout", function(){
		console.log("hey, I'm logged out");
		$scope.allCommutes.$destroy();
	});

	//Makes a request to get alerts for each line
	var updateAlerts = function () {
		for (x = 0; x < $scope.allCommutes.length; x++) {
			for (y = 0; y < $scope.allCommutes[x].routeLegs.length; y++) {
				Mbta.getAlerts($scope.allCommutes[x].routeLegs[y].lineID)
						.then(function(data) {
						    $scope.allAlerts[data.data.route_id] = data.data.alerts;
						});
			}
		}
	};

	//Makes a request to get predictions for each line
	var updatePredictions = function () {
		for (x = 0; x < $scope.allCommutes.length; x++) {
			for (y = 0; y < $scope.allCommutes[x].routeLegs.length; y++) {
				Mbta.getArrivals($scope.allCommutes[x].routeLegs[y].lineID, $scope.allCommutes[x].routeLegs[y].boardingStopID, $scope.allCommutes[x].routeLegs[y].direction)
						.then(function(data) {
							$scope.allPredictions[data.id] = data.predictions;
						});
			}
		}
	};

	//once commutes have been loaded from Firebase call updateAlerts() to get
	//alert info from MBTA API
	$scope.allCommutes.$loaded()
		.then(function() {
			//get inital data
			updateAlerts();
			updatePredictions();
			//then set alerts and predicitons up to update every 11 seconds
			theUpdates = $interval(function() {
				updateAlerts();
				updatePredictions();
				console.log("updated alerts and predicitons");
			}, 11000);

		});	
	//cancel the interval requests for updates on arrival predictions and alerts
  	$rootScope.$on("$routeChangeSuccess", 
        function (event, current, previous, rejection) {
        if (angular.isDefined(theUpdates)) {
	        $interval.cancel(theUpdates);
	        theUpdates = undefined;
    	}
  });

}

function LoginCtrl ($scope, $location, Auth) {

	$scope.whichToShow = 1;
	$scope.logError = null;


	$scope.createUser = function() {
    	Auth.createUser($scope.email, $scope.password).then(function (message) {
    		$scope.logError = message;
    	});    		
    };

    $scope.userLogin = function() {
    	var message = Auth.login($scope.email, $scope.password);

    };

    $scope.passReset = function() {
    	Auth.resetPass($scope.email);


    }
    

}


function ViewerCtrl ($scope, myData) {
	$scope.Data = myData;
}

function ExplorerCtrl ($scope, $location, myData) {
	$scope.Data = myData;
}


function firebaseCtrl ($scope) {

}