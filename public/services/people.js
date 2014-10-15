angular.module('MyApp')
    .factory('People', ['$http', '$location', '$rootScope', '$cookieStore', '$alert',
        function($http, $location, $rootScope, $cookieStore, $alert) {
            $rootScope.currentUser = $cookieStore.get('user');
            $cookieStore.remove('user');

            return {
                remove: function(uid) {
                    return $http.post('/api/user/remove', {id: uid}).success(function() {


                        document.getElementById(uid).style.display = "none";

                        $alert({
                            content: 'Removed user with id = ' + uid,
                            placement: 'top-right',
                            type: 'info',
                            duration: 10
                        });
                    });
                }
            };
        }]);