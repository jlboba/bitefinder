var app = angular.module('BiteFinder', []);

app.controller('MainController', ['$http', function($http){
  // freezing this
  var controller = this;

  // toggle navigation tabs
  this.tab = 1;

  // variables
  this.newUserData = {};
  this.currentUserData = {}; // ng-model data from login form (just UN & PW)
  this.sessionUser = {}; // full user object of the user logged in
  this.userLoginFailed = false;
  this.editingUser = false;
  this.editUserData = {};


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

  this.testingSession = function(){
    console.log(req.session.currentUser);
  }

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
    $http({
      method: 'PUT',
      url: '/users/' + controller.sessionUser._id,
     data: controller.editUserData
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
    })
  }

}])
