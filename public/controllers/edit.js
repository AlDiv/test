angular.module('MyApp')
    .controller('EditCtrl', ['$scope', '$routeParams', 'User', 'People', function($scope, $routeParams, User, People) {

        $scope.headingTitle = 'User edit';
        $scope.users = User.query();

        var uId = $routeParams.id;
        var usr = People.getById({id: uId});

        $scope.options = [
            {
                name: 'Regular User',
                value: 0
            },
            {
                name: 'Admin',
                value: 1
            }
        ];

        $scope.edit = function() {
            Auth.signup({
                id: $scope.id,
                type: $scope.type,
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                firstName: $scope.firstName,
                lastName: $scope.lastName
            });
        };
    }]);