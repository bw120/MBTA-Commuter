//factory to control user authentication
//TODO: create function to for forgotten password
//		Creat function to update email
function Auth($firebaseAuth, $firebaseArray, $location, $rootScope) {
	var ref = new Firebase("https://tcommutes.firebaseio.com");

	var fb = {
		username: "",
		password: "",
		auth: $firebaseAuth(ref),
		login: function(usr, pass) {

			this.username = usr;
			this.password = pass;


			return this.auth.$authWithPassword({
				email: this.username,
				password: this.password
			}).then(function(authData) {

				this.authData = authData;
				$location.path('/dashboard');

			}).catch(function(error) {
				var message = "Either the username or password are not correct.";
				return message;
			});

		},
		logout: function() {
			this.auth.$unauth();
			$rootScope.$broadcast('logout');
		},
		getAuthState: function() {
			var authData = this.auth.$getAuth();
			return authData;

		},
		createUser: function(usr, pass) {

			return this.auth.$createUser({
				email: usr,
				password: pass
			}).then(function(userData) {
				console.log("User created with uid: " + userData.uid);
				return "Account created! Please login using your email and password";
			}).catch(function(error) {
				console.log(error);
				return "Sorry, an error occured. We were not able to set up an account";
			});
		},
		resetPass: function(email) {
			return this.auth.$resetPassword({
				email: email
			}).then(function() {
				var message = "Password reset email sent successfully!";
				console.log(message);
				return message;
			}).catch(function(error) {
				console.log(error);
				return "Error: Check that your email was entered correctly";
			});
		},
		updatePass: function(email, oldEmail, newEmail) {

			return this.auth.$changePassword({
				email: email,
				oldPassword: oldEmail,
				newPassword: newEmail
			}).then(function() {
				console.log("Password changed successfully!");
				return "Password changed successfully!";
			}).catch(function(error) {
				var message = "" + error;
				return message;
			});
		}

	};

	return fb;

}


//syncs user data with Firebase
function myCommutes($firebaseArray, Auth) {

	var commutes = {
		getData: function() {
			if (Auth.getAuthState().uid) {
				var user = Auth.getAuthState().uid;
				var ref = new Firebase("https://tcommutes.firebaseio.com/").child("commutes").child(user);
				return $firebaseArray(ref);

			} else {
				var error = "authentication_error";
				return error;
			}
		}

	};
	return commutes;
}


//loads various info from MBTA API
function Mbta($http, $q) {
	var apiURL = function(query) {

		return "http://realtime.mbta.com/developer/api/v2/" + query + "api_key=wX9NwuHnZU2ToO7GmGR9uw&format=json"; //developement api key
		//return "http://realtime.mbta.com/developer/api/v2/" + query + "api_key=ed9Jx40ToEWg1VNZqWyYaw&format=json"; // production api Key
	};

	this.getRoutes = function() {
		var query = "routes?";
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

	};
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

	};

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
	};


	//get service arrival prediction for each route
	//get scheduled trips to destination stop. Filter predictions for trips going to destination stop
	this.getArrivals = function(route, boardstop, exitStop, direction, id) {
		var query1 = "predictionsbystop?stop=" + boardstop + "&";
		//this request pulls predictions from the MBTA Api
		var request1 = $http.get(apiURL(query1));
		//this pulls from pre-configured json files for list of scheduled trips gong to the destination stop
		var request2 = $http.get("../json/stops/" + exitStop + ".json");

		//sorts data and pull out predictions just for the selected route and direction
		var sortPredictions = function(data) {
			var predictions = {};
			if (data.mode) {
				for (x = 0; x < data.mode.length; x++) {
					for (y = 0; y < data.mode[x].route.length; y++) {
						if (data.mode[x].route[y].route_id == route) {
							for (z = 0; z < data.mode[x].route[y].direction.length; z++) {
								if (data.mode[x].route[y].direction[z].direction_name == direction) {
									predictions = data.mode[x].route[y].direction[z].trip;

								}
							}
						}
					}
				}

			} else {
				predictions = [];

			}
			return predictions;
		};

		//fire off two request to the MBTA API
		//once the data comes back from both, filter on the tripID's that will go to the destination stop
		return $q.all([request1, request2]).then(function(data) {
				var predictArray = [];
				var predictData = sortPredictions(data[0].data);
				var predictions = predictData;
				var destIDs = data[1].data[exitStop];

				//add to array only those who are scheduled to go to the destination stop
				if (predictData && predictData.length > 0) {
					for (var t = 0; t < predictData.length; t++) {
						for (var u = 0; u < destIDs.length; u++) {
							if (predictData[t].trip_id === destIDs[u]) {
								predictArray.push(predictData[t]);
							}
						}
					}
				}

				//sort predictions in order of arrival time
				if (predictArray.length > 0) {
					predictArray = predictArray.sort(function(a, b) {
						return parseInt(a.pre_away) - parseInt(b.pre_away);
					});
				}

				return {
					"id": id,
					"route": route,
					"stop": stop,
					"direction": direction,
					"predictions": predictArray
				};

			},
			function(res) {
				console.log("error!");
				return res;
			});
	};
}