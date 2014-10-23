angular.module('MyApp')
    .controller('UserCtrl', ['$scope', 'People', function($scope, People) {

        $scope.headingTitle = 'User list';

        var tmp = People.users();

        $scope.users = tmp.query();



        $scope.remove = function(uid) {
            People.remove(uid);
        };
    }]);