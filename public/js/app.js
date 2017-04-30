var app = angular.module('BiteFinder', []);

app.controller('MainController', ['$http', function($http){
  // freezing this
  var controller = this;

  // variables
  this.newUserData = {};

  // ajax request to create a new user
  this.createUser = function(){
    $http({
      method:'POST',
      url: '/users',
      data: controller.newUserData
    }).then(function(response){
      console.log(controller.newUserData);
      controller.newUserData = {}; // empties the array after the user is created
    }, function(error){
        console.log(error);
    });
  };

  // object to check current session user
  this.sessionUser = {
    username: req.session.currentUser.username,
    password: req.session.currentUser.password,
    name: req.session.currentUser.name,
    city: req.session.currentUser.city,
    favorites: req.session.currentUser.favorites
  }

  this.testingSession = function(){
    console.log(req.session.currentUser);
  }

  // Check Login username/password info
  this.loginCheck = function(){
    $http({
      method: 'POST',
      url: '/sessions',
      data: {
        this.username,
        this.password
      }
    }).then(function(response){
      console.log(response);
    });
  };

}]);
