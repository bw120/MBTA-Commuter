function MenuCtrl ($scope) {
	$scope.menuOpen = false;

}

function BuilderCtrl ($scope, $location, myData, myCommutes, Mbta) {
	var self = this;
	$scope.allCommutes = myCommutes;

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
	}


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


	}
	$scope.saveCommute = function() {
		$scope.allCommutes.$add($scope.commute);
		$location.path('/dashboard');
	};


}

function DashboardCtrl ($scope, $location, myCommutes, Mbta) {

	$scope.allCommutes = myCommutes;
	$scope.allAlerts ={};
	$scope.allPredictions =[];

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
							$scope.allPredictions[data.id] = [];
							$scope.allPredictions[data.id].push(data.predictions);
						});
			}
		}
	};

	//once commutes have been loaded from Firebase call updateAlerts() to get
	//alert info from MBTA API
	$scope.allCommutes.$loaded()
		.then(function() {
			updateAlerts();
			updatePredictions();
		});	

}


function ViewerCtrl ($scope, myData) {
	$scope.Data = myData;
}

function ExplorerCtrl ($scope, $location, myData) {
	$scope.Data = myData;
}
function LoginCtrl ($scope, $location, myData) {
	$scope.Data = myData;
}

function firebaseCtrl ($scope) {

}