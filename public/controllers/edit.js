angular.module('MyApp')
    .controller('EditCtrl', ['$scope', '$routeParams', 'User', 'People', function($scope, $routeParams, User, People) {

        $scope.headingTitle = 'User edit';

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

        var uId = $routeParams.id;
        People.getById({id: uId}, $scope.options);

        $scope.edit = function() {

            People.edit({
                id: $scope._id,
                type: $scope.type.value,
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                firstName: $scope.firstName,
                lastName: $scope.lastName
            });
        };
    }]);