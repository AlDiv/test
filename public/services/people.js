angular.module('MyApp')
    .factory('People', ['$http', '$location', '$rootScope', '$cookieStore', '$alert', '$resource',
        function($http, $location, $rootScope, $cookieStore, $alert, $resource) {
            $rootScope.currentUser = $cookieStore.get('user');
            $cookieStore.remove('user');

            return {
                remove: function(uid) {
                    return $http.post('/api/user/remove', {id: uid}).success(function(data) {

                        document.getElementById(uid).style.display = "none";

                        $alert({
                            content: data.firstName + ' ' + data.lastName + " has been removed from database",
                            placement: 'top-right',
                            type: 'info',
                            duration: 10
                        });
                    });
                },
                edit: function(user) {

                    return $http.post('/api/user/edit', user)
                        .success(function() {

                            $location.path('/list');

                            $alert({
                                content: user.firstName + ' ' + user.lastName + " has been updated",
                                placement: 'top-right',
                                type: 'success',
                                duration: 3
                            });
                        })
                        .error(function(response) {
                            $alert({
                                title: 'Error!',
                                content: response.message,
                                placement: 'top-right',
                                type: 'danger',
                                duration: 3
                            });
                        });
                },
                getById: function(uid, options) {
                    return $http.post('/api/user/get', uid)
                        .success(function(data) {
                            $rootScope.username = data.username;
                            $rootScope.email = data.email;
                            $rootScope.firstName = data.firstName;
                            $rootScope.lastName = data.lastName;
                            $rootScope._id = data._id;

                            $rootScope.type = options[data.type?1:0];
                        })
                        .error(function(response) {
                        });
                },
                users: function() {
                    return $resource('/api/users');
                }
            };
        }]);