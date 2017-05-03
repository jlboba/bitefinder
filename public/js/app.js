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
  this.isViewLocationResultsActive = false;
  this.isViewGalleryActive = false;
  this.isViewRestaurantActive = false;
  this.viewRestaurantInd = null;
  this.userReview = {};
  this.cuisineSearch = "all";
  this.activeLocationId = '';

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
        controller.isViewLocationResultsActive = true;
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
      controller.isViewGalleryActive = true;
      controller.activeLocationId = id;
      console.log(controller.foundRestaurants);
      console.log(controller.activeLocationId);
    }, function(error){
      console.log(error);
    })
  };

  // searches for a list of restaurants in a pre-defined area by their cuisine type
  this.findRestaurantsByCuisine = function(){
    if (this.cuisineSearch === 'all') {
      this.findRestaurants(controller.activeLocationId);
    } else {
      $http({
        method: "GET",
        url: "/zomato/restaurants/" + controller.activeLocationId + "/cuisine/" + controller.cuisineSearch
      }).then(function(response){
        controller.foundRestaurants = response.data.restaurants;
        console.log(response);
        console.log(controller.foundRestaurants);
      }, function(error){
        console.log(error);
      });
    }
  }

  // saves a restaurant to a user's favorites
  this.saveRestaurant = function(){
    if($scope.$parent.main.sessionActive){
      // add to session list to display in real time
      $scope.$parent.main.sessionUser.favorites.push(controller.restaurantDetail);
      // make http request to add to database favorites
      $http({
        method:'PUT',
        url:'/users/favorites/' + $scope.$parent.main.sessionUser._id,
        data: controller.restaurantDetail
      }).then(function(response){
        console.log(response);
      }, function(error){
          console.log(error);
      })
    } else {
        console.log('not logged in');
    }
  };
  // remove a restaurant from a user's favorites
  this.deleteRestaurant = function(){
    if ($scope.$parent.main.sessionActive){
      // remove reviews associated with this restaurant
      $http({
        method: 'DELETE',
        url: '/review/' + $scope.$parent.main.sessionUser._id + '/' + controller.restaurantDetail.id
      }).then(function(response){
        //console.log(response);
      }, function(){
          console.log('Failed in removing favorite restaurant');
      });

      // remove from session list
      $scope.$parent.main.sessionUser.favorites.splice(controller.viewRestaurantInd,1);
      $http({
        method: 'DELETE',
        url: '/users/favorites/' + $scope.$parent.main.sessionUser._id + '/' + controller.restaurantDetail.id
      }).then(function(response){
        //console.log(response);
        controller.isViewRestaurantActive = false;
      }, function(){
          console.log('Failed in removing favorite restaurant');
      });

    } else {
      console.log('not logged in');
    }
  };

  // shows restaurant detail modal
  this.showRestaurantDetail = function(ind){
    this.isViewRestaurantActive = true;
    this.restaurantDetail = controller.foundRestaurants[ind].restaurant;
    if (this.restaurantDetail.featured_image === ''){
      this.restaurantDetail.featured_image = "/img/yum.png";
    }
  };

  // hides the restaurant detail modal
  this.closeRestaurantDetail = function(){
    this.isViewRestaurantActive = false;
  };

  // shows restaurant detail modal of favorite restaurants
  this.showFavoriteRestaurantDetail = function(ind){
    this.isViewRestaurantActive = true;
    this.isFavoriteRestaurant = true;
    this.viewRestaurantInd = ind;
    this.restaurantDetail = $scope.$parent.main.sessionUser.favorites[ind];
    console.log('user id ', $scope.$parent.main.sessionUser._id);
    console.log('restaurant id ', this.restaurantDetail.id);
    $http({
      method: "GET",
      url: "/review/"+ $scope.$parent.main.sessionUser._id +"/" + this.restaurantDetail.id
    }).then(function(response){
      console.log('Review ', response.data);
      controller.userReview = response.data;
      //console.log(controller.foundReview);
    }, function(error){
      console.log(error);
    })
  }
  // save or update user review
  this.saveReview = function(id){
    if (id === undefined){
      // create the user review
      //console.log(controller.userReview.comments);
      $http({
        method: 'POST',
        url: '/review',
        data: {
          userId: $scope.$parent.main.sessionUser._id,
          restaurantId: controller.restaurantDetail.id,
          comments: controller.userReview.comments
        }
      }).then(function(response){
        console.log('New Review ' ,response.data);
        controller.userReview._id = response.data._id;
      }, function(err){
        console.log('Failed in creating new user review');
      });

    } else {
      console.log('Update Review ' + id);
      // textarea is null
      if ( this.userReview.comments === '') {
        //console.log('Update review null ');
        // delete from db
        $http({
          method: 'DELETE',
          url: '/review/id/' + id
        }).then(function(response){
          console.log('Delete Review ' ,response.data);
        }, function(err){
          console.log('Failed in deleting a user review');
        });
      } else {
        // update db
        $http({
          method: 'PUT',
          url: '/review/' + id,
          data: {
            comments: controller.userReview.comments
          }
        }).then(function(response){
          console.log('Updated Review ' ,response.data);
        }, function(err){
          console.log('Failed in updating a user review');
        });
      }
    }
  };




}]);
