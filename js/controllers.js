function MenuCtrl ($scope) {
	$scope.menuOpen = false;

}

function BuilderCtrl ($scope, myData, myCommutes, Mbta) {
	var self = this;
	$scope.Data = myData;
	$scope.myCommutes = myCommutes;

	var commutes = [{
		name: "",
		routeLeg: [{
			line: "",
			direction: "",
			boardingStop: "",
			disboardStop: ""
		}],

	}];


	$scope.selectedLine;

	//gets a list of all routes for all modes of transit
	Mbta.getRoutes()
		.then(function(data) {
		    $scope.AllRoutes = data;
		    console.log(data);
	});

	//gets a list of stops for the selected route
	$scope.getStops = function(route) {
		console.log(route);
		Mbta.getStops(route)
			.then(function(data) {
			    $scope.Stops = data;
			    $scope.selectedLine = route;
			});
	}


}

function DashboardCtrl ($scope, myData) {
	$scope.myCommutes = myCommutes;

}


function ViewerCtrl ($scope, myData) {
	$scope.Data = myData;
}

function ExplorerCtrl ($scope, myData) {
	$scope.Data = myData;
}
function LoginCtrl ($scope, myData) {
	$scope.Data = myData;
}
