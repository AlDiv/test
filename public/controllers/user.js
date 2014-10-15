angular.module('MyApp')
    .controller('UserCtrl', ['$scope', 'User', 'People', function($scope, User, People) {

        $scope.headingTitle = 'User list';
        $scope.users = User.query();

        $scope.remove = function(uid) {
            People.remove(uid);
        };
    }]);