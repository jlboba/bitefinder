var app = angular.module('BiteFinder', []);

app.controller('MainController', ['$http', function($http){
  this.foo = "bar";

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
