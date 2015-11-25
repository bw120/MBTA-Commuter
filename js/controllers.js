function MenuCtrl ($scope) {
	$scope.menuOpen = false;

}


function BuilderCtrl ($scope, myData, myCommutes, Mbta) {
	var self = this;
	$scope.Data = myData;
	$scope.myCommutes = myCommutes;


	Mbta.getRoutes()
		.then(function(data) {
		    $scope.AllRoutes = data;
		    console.log(data);
	})


}

function DashboardCtrl ($scope, myData) {
	$scope.Data = myData;
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
