function myData () {


	return {message: "this is my message"};

};


//syncs user data with Firebase
function myCommutes ($firebaseArray) {


		var ref = new Firebase("https://tcommutes.firebaseio.com/commutes");

		//var commutes = ref.child(username);

		return $firebaseArray(ref);


	

	// var commutes = $firebaseObject(ref);
	// [
	// 	{
	// 	name: "sample commute",
	// 		routeLegs: [{
	// 			modeID: "0",
	// 			mode: "Subway",
	// 			lineID: "Red",
	// 			line: "Red Line",
	// 			direction: "Southbound",
	// 			boardingStopID: "70063",
	// 			disboardStopID: "70073",
	// 			boardingStop: "Davis - Inbound",
	// 			disboardStop: "Charles/MGH - Inbound"
	// 		},{
	// 			modeID: "0",
	// 			mode: "Subway",
	// 			lineID: "Green-B",
	// 			line: "Green Line B",
	// 			direction: "Westbound",
	// 			boardingStopID: "70196",
	// 			disboardStopID: "70155",
	// 			boardingStop: "Park Street - Green Line - B Branch Berth",
	// 			disboardStop: "Copley - Outbound"
	// 		}]
	// 	}
	// ];

	// return commutes;

};


//loads various info from MBTA API
function Mbta ($http, $q) {
	var apiURL = function(query) {

		
		return "http://realtime.mbta.com/developer/api/v2/" + query + "api_key=wX9NwuHnZU2ToO7GmGR9uw&format=json"; //developement api key
		//return "http://realtime.mbta.com/developer/api/v2/" + query + "api_key=ed9Jx40ToEWg1VNZqWyYaw&format=json"; // production api Key
	}

	this.getRoutes = function() {
		var query = "routes?"
		return $http.get(apiURL(query))
			.then(
				function(res) {
					//organize list
					var routes = {};
					routes[0] = res.data.mode[0].route.concat(res.data.mode[1].route);
					routes[1] = res.data.mode[2].route;
					routes[2] = res.data.mode[3].route;
					routes[3] = res.data.mode[4].route;
					return routes;
			},
			function(res) {
				console.log("error!");
				return res;
			});

	}
	this.getStops = function(route) {
		var query = "stopsbyroute?route=" + route + "&";
		return $http.get(apiURL(query))
			.then(
				function(res) {
					return res.data.direction;
			},
			function(res) {
				console.log("error!");
				return res;
			});

	}


}