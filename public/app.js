(function() {
'use strict';

var app = angular.module('app', [], function config($httpProvider) {
  // Added the JWT tokens to any requests made by $http.
  $httpProvider.interceptors.push('AuthInterceptor');
});

app.constant('API_URL', 'http://localhost:3000');

app.controller('MainCtrl', function($http, RandomUserFactory, UserFactory) {

  var vm = this;

  UserFactory.getUser().then(function success(response) {
    vm.user = response.data;
  });

  vm.getRandomUser = function() {
    RandomUserFactory.getUser().then(function success(response) {
      vm.randomUser = response.data;
    });
  };

  vm.login = function(username, password) {
    UserFactory.login(username, password).then(function success(response) {
      vm.user = response.data.user;
    },
    function errror(response) {
      alert('Error: ' + response.data);
    });
  };

  vm.logout = function() {
    UserFactory.logout();
    vm.user = null;
  };


});

// Gets random user data.
app.factory('RandomUserFactory', ['$http', 'API_URL', function RandomUserFactory($http, API_URL) {
  return {
    getUser: getUser
  };

  function getUser() {
    return $http.get(API_URL + '/random-user');
  }
}]);

// Handles logging user in/out and storing their token.
app.factory('UserFactory', function UserFactory($http, API_URL, AuthTokenFactory, $q) {
  return {
    login: login,
    logout: logout,
    getUser: getUser
  };

  function login(username, password) {
    return $http.post(API_URL + '/login', {
      username: username,
      password: password
    }).then(function success(response) {
      AuthTokenFactory.setToken(response.data.token);
      return response;
    });
  }

  function logout() {
      AuthTokenFactory.setToken();
  }

  function getUser() {
    if (AuthTokenFactory.getToken()) {
      return $http.get(API_URL + '/me');
    } else {
      return $q.reject({ data: 'client has no auth token'});
    }
  }
});

// Stores and gets the token.
app.factory('AuthTokenFactory', function AuthTokenFactory($window) {
  'use strict';
  var store = $window.localStorage;
  var key = 'auth-token';

  return {
    getToken: getToken,
    setToken: setToken
  }

  function getToken() {
    return store.getItem(key);
  }

  function setToken(token) {
    if (token) {
      store.setItem(key, token);
    } else {
      store.removeItem(key);
    }
  }
});

// Incercepts http requests and adds the JWT to the header.
app.factory('AuthInterceptor', function AuthInterceptor(AuthTokenFactory) {
  'use strict';
  return {
    request: addToken
  };

  function addToken(config) {
    var token = AuthTokenFactory.getToken(); 
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  }
});

})();
