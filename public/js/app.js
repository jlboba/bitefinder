var app = angular.module('BiteFinder', []);

app.controller('MainController', ['$http', '$scope', function($http, $scope){
  // freezing this
  var controller = this;

  // toggle navigation tabs
  this.tab = 1;

  // variables
  this.newUserData = {};
  this.currentUserData = {}; // ng-model data from login form (just UN & PW)
  this.sessionUser = {}; // full user object of the user logged in
  this.sessionActive = false; // boolean variable for toggling session views
  this.userLoginFailed = false;
  this.editingUser = false;
  this.editUserData = {};
  this.newPassword = '';


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
    var tempPassword = controller.newUserData.password
    $http({
      method:'POST',
      url: '/users',
      data: controller.newUserData
    }).then(function(response){
      controller.newUserData = {}; // empties the array after the user is created
      controller.currentUserData.username = response.data.username;
      controller.currentUserData.password = tempPassword;
      controller.tab = 2;
      controller.loginCheck();
    }, function(error){
        console.log(error);
    });
  };

  // Check Login username/password info
  this.loginCheck = function(){
    $http({
      method: 'POST',
      url: '/sessions',
      data: {
        username: controller.currentUserData.username,
        password: controller.currentUserData.password
      }
    }).then(function(response){
      if (response.data === 'failed'){
        controller.userLoginFailed = true;
        console.log('Username/Password not match');
      } else {
        controller.sessionUser = response.data;
        controller.userLoginFailed = false;
        controller.sessionActive = true;
        console.log(controller.sessionUser);
        // send to landing page
      }
    }, function(){
      console.log('Failed in login check');
    });
  };
  // Logout
  this.logOut = function(){
    $http({
      method: 'DELETE',
      url: '/sessions'
    }).then(function(response){
      controller.sessionUser = {};
      controller.currentUserData = {};
      controller.sessionActive = false;
      console.log(controller.sessionUser);
      // send to landing page
    }, function(){
      console.log('Failed in log out');
    });
  };

  // Edit User HTTP PUT request
  this.editUser = function(){
    this.editingUser = true;
    this.editUserData = {
      username: controller.sessionUser.username,
      password: controller.sessionUser.password,
      name: controller.sessionUser.name,
      city: controller.sessionUser.city
    }
  };
  // Cancel Edit User
  this.cancelEditUser = function(){
    //console.log('Cancel Edit Session:', controller.sessionUser);
    //console.log('Cancel Edit Edit:', controller.editUserData);
    this.editingUser = false;
    this.editUserData = {};
  };
  //
  this.updateUser = function(){
    //console.log('Update User ', controller.editUserData);
    if (controller.newPassword !== '') {
      controller.submitUserData = {
        username: controller.editUserData.username,
        password: controller.newPassword,
        name: controller.editUserData.name,
        city: controller.editUserData.city
      }
    } else {
      controller.submitUserData = {
        username: controller.editUserData.username,
        name: controller.editUserData.name,
        city: controller.editUserData.city
      }
    }
    $http({
      method: 'PUT',
      url: '/users/' + controller.sessionUser._id,
     data: controller.submitUserData
   }).then(function(response){
      //console.log(response.data);
      controller.editingUser = false;
      controller.sessionUser = {
        username: response.data.username,
        password: response.data.password,
        name: response.data.name,
        city: response.data.city };
   }, function(){
     console.log('Failed in update user');
   })
  };

  // Delete User HTTP DELETE request
  this.deleteUser = function(){
    $http({
      method: 'DELETE',
      url: '/users/' + controller.sessionUser._id
    }).then(function(response){
      controller.logOut(); // When profile is deleted, Log Out of the current session
      controller.sessionUser = {}; // and clear the controller var of the session user's info
    }, function(){
      console.log('failed to delete user');
    });
  }
}]);

app.controller('ZomatoController', ['$http', '$scope', function($http, $scope){
  // freezing this
  var controller = this;

  // variables
  this.locationSuggestions = [];
  this.foundRestaurants = [];
  this.isViewRestaurantActive = false;

  // searches for restauruants within a location via long/lat
  this.longLat = function(){
    $http({
      method: 'GET',
      url: '/zomato/' + $scope.$parent.main.sessionUser.latitude + '/' + $scope.$parent.main.sessionUser.longitude
    }).then(function(response){
        console.log(response);
    }, function(){
        console.log('error');
    })
  };

  // searches for a list of cities via a string query
  this.searchCities = function(){
    $http({
      method: 'GET',
      url: '/zomato/' + controller.cityInput
    }).then(function(response){
        controller.locationSuggestions = response.data.location_suggestions;
        console.log(response.data);
    }, function(){
        console.log('error');
    })
  };

  // searches for a list of restaurants within a city by city ID
  this.findRestaurants = function(id){
    $http({
      method: "GET",
      url: "/zomato/restaurants/" + id
    }).then(function(response){
      controller.foundRestaurants = response.data.restaurants;
      console.log(controller.foundRestaurants);
    }, function(error){
      console.log(error);
    })
  };

  // saves a restaurant to a user's favorites
  this.saveRestaurant = function(){
    if($scope.$parent.main.sessionActive){
      $http({
        method:'PUT',
        url:'/users/favorites/' + $scope.$parent.main.sessionUser._id + '/' + controller.restaurantDetail.id
      }).then(function(response){
        console.log(controller.restaurantDetail);
      }, function(error){
          console.log(error);
      })
    } else {
        console.log('not logged in');
    }
  };

  // shows restaurant detail modal
  this.showRestaurantDetail = function(ind){
    this.isViewRestaurantActive = true;
    this.restaurantDetail = controller.foundRestaurants[ind].restaurant;
  };

  // hides the restaurant detail modal
  this.closeRestaurantDetail = function(){
    this.isViewRestaurantActive = false;
  };

}]);
