(function() {
'use strict';

var app = angular.module('app', []);

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainCtrl', function($http,RandomUserFactory, UserFactory) {

  var vm = this;

  vm.getRandomUser = function() {
    RandomUserFactory.getUser().then(function success(response) {
      vm.randomUser = response.data;
    });
  };

  vm.login = function(username, password) {
    UserFactory.login(username, password).then(function success(response) {
      vm.user = response.data;
    },
    function errror() {
      alert('Error: ' + response.data);
    });
  };

});

app.factory('RandomUserFactory', ['$http', 'API_URL', function RandomUserFactory($http, API_URL) {
  return {
    getUser: getUser
  };

  function getUser() {
    return $http.get(API_URL + '/random-user');
  }

}]);

app.factory('UserFactory', function UserFactory($http, API_URL) {
  return {
    login: login
  };

  function login(username, password) {
    return $http.post(API_URL + '/login', {
      username: username,
      password: password
    });
  }
});


})();
