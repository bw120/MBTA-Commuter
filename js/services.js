function myData () {
	//this factory could possibly used to store user info and to sync with localstorage or Firebase.
	//check firebase website. They have a way of doing 3-way bindings

	return {message: "this is my message"};

};


//holds user data about defined commutes
function myCommutes () {
	var commutes = [{
		name: "sample commute",
		routeLeg: [{
			line: "101",
			direction: "inbound",
			boardingStop: "Marion",
			disboardStop: "Sulivan Sqr"
		},{
			line: "orange",
			direction: "inbound",
			boardingStop: "Sullivan Sqr",
			disboardStop: "Back Bay"
		}],

	}];

	return commutes;

};


//loads various info from MBTA API
function Mbta ($http, $q) {
	var apiURL = function(query) {
		return "http://realtime.mbta.com/developer/api/v2/" + query + "api_key=ed9Jx40ToEWg1VNZqWyYaw&format=json";
	}

	this.getRoutes = function() {
		var query = "routes?"
		return $http.get(apiURL(query))
			.then(
				function(res) {
					//organize list
					var routes = {};
					routes.subway = res.data.mode[0].route.concat(res.data.mode[1].route);
					routes.cRail = res.data.mode[2].route;
					routes.bus = res.data.mode[3].route;
					routes.boat = res.data.mode[4].route;

					console.log("success!");
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

					console.log(res.data.direction);
					return res.data.direction;
			},
			function(res) {
				console.log("error!");
				return res;
			});

	}


}