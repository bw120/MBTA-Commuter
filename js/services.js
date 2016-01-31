function myData () {


	return {message: "this is my message"};

};

//factory to control user authentication
//TODO: create function to for forgotten password
//		Creat function to update email
function Auth ($firebaseAuth, $location) {
	var ref = new Firebase("https://tcommutes.firebaseio.com");

	var fb = {
		username: "",
		password: "",
		auth: $firebaseAuth(ref),
		loginError: null,
		login: function(usr, pass) {
	    	
	    	this.username = usr;
	    	this.password = pass;
	    
	    
	    	var login = this.auth.$authWithPassword({
		    	email: this.username,
		        password: this.password
	     	}).then(function (authData) {

	     		this.authData = authData;
	     		$location.path('/dashboard');
	     	}).catch(function(error) {
	     		var error = "Either the username or password are not correct.";
	     		return error;
	     	});

	     	return login;

    	},
    	logout: function() {
    		this.auth.$unauth();
    	},
    	getAuthState: function() {
    		var authData = this.auth.$getAuth();
    		console.log(this.auth.$waitForAuth());

    	},
    	createUser: function(usr, pass) {

			this.auth.$createUser({
		        email: usr,
		        password: pass
		    }).then(function(userData) {
		    	console.log("User created with uid: " + userData.uid);
		    }).catch(function(error) {
		    	console.log(error);
		    });
	    }
    }


	return fb;

}


//syncs user data with Firebase
function myCommutes ($firebaseAuth) {


		var ref = new Firebase("https://tcommutes.firebaseio.com/commutes");

		//var commutes = ref.child(username);

		return $firebaseAuth(ref);


	

	// example of Json saved/returned from Firebase
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

	//gets service alerts for requested route
	this.getAlerts = function(routes) {
		var query = "alertsbyroute?route=" + routes + "&include_access_alerts=false&";
		return $http.get(apiURL(query))
			.then(
				function(res) {
					
					return res;
			},
			function(res) {
				console.log("error!");
				return res;
			});

	}

	//get service arrival prediction for each route
	this.getArrivals = function(route, stop, direction) {
		var query = "predictionsbystop?stop=" + stop + "&";
		var id = route + "-" + stop + "-" + direction;
		return $http.get(apiURL(query))
			.then(
				function(res) {
					var predictions = {};
					// var id = route + "-" + stop + "-" + direction;
					if (res.data.mode) {
						for (x = 0; x < res.data.mode.length; x++) {
							for (y = 0; y < res.data.mode[x].route.length; y++) {
								if (res.data.mode[x].route[y].route_id == route) {
									for (z = 0; z < res.data.mode[x].route[y].direction.length; z++) {
										if (res.data.mode[x].route[y].direction[z].direction_name == direction) {
											predictions = {
															"id": id,
															"route": route,
															"stop" : stop,
															"direction": direction,
															"predictions": predictions.trips = res.data.mode[x].route[y].direction[z].trip};

										}
									}
								}
							}
						}
						
					} else {
						predictions = {
										"id": id,
										"route": route,
										"stop" : stop,
										"direction": direction,
										"predictions": []};
					}
					return predictions;
			},
			function(res) {
				console.log("error!");
				return res;
			});
	}


}