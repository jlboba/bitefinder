var app = angular.module('BiteFinder', []);

app.controller('MainController', ['$http', function($http){
  // freezing this
  var controller = this;

  // toggle navigation tabs
  this.tab = 1;

  // variables
  this.newUserData = {};

  // geolocator method to grab user's latitude and longitude
  this.geolocator = function(){
    var success = function(pos){
      controller.newUserData.latitude = pos.coords.latitude;
      controller.newUserData.longitude = pos.coords.longitude;
      return controller.createUser();
    }

    var error = function(){
      // if the user blocks geolocator, it sets default as new york, new york lat/long
      controller.newUserData.latitude = '40.730610';
      controller.newUserData.longitude = '-73.935242';
      return controller.createUser();
    }

    navigator.geolocation.getCurrentPosition(success, error);
  };

  // ajax request to create a new user
  this.createUser = function(){
    // http request to create the user
    $http({
      method:'POST',
      url: '/users',
      data: controller.newUserData
    }).then(function(response){
      controller.newUserData = {}; // empties the array after the user is created
    }, function(error){
        console.log(error);
    });

  };

  // object to check current session user
  // this.sessionUser = {
  //   username: req.session.currentUser.username,
  //   password: req.session.currentUser.password,
  //   name: req.session.currentUser.name,
  //   city: req.session.currentUser.city,
  //   favorites: req.session.currentUser.favorites
  // }
  //
  // this.testingSession = function(){
  //   console.log(req.session.currentUser);
  // }

  // Check Login username/password info
  this.loginCheck = function(){
    $http({
      method: 'POST',
      url: '/sessions',
      data: {
        username: controller.username,
        password: controller.password
      }
    }).then(function(response){
      console.log(response);
    });
  };

}]);
