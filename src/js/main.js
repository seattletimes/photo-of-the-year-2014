//Use CommonJS style via browserify to load other modules

var app = require("./application");
require("./filters");

var isMobile = require("./isMobile");

app.controller("PhotoController", ["$scope", "$filter", function($scope, $filter) {
  
  var all = window.photoData;
  $scope.photos = [];

  $scope.uiState = {};
  $scope.tags = {
    default: true
  };
  $scope.showFilter = false;

  $scope.$watch("tags", function() {
    var tagFilter = $filter("tagFilter");
    var filteredPhotos = tagFilter(all, $scope.tags);
    if (!isMobile()) {
      $scope.uiState.hero = filteredPhotos[0];
    }
    $scope.photos = filteredPhotos;
  }, true);

  $scope.setHero = function(photo) {
    $scope.uiState.hero = photo;
  };

  $scope.clearHero = function() {
    $scope.uiState.hero = null;
  };

  $scope.previousHero = function(photo) {
    // var tagFilter = $filter("tagFilter");
    // var filteredPhotos = tagFilter($scope.photos, $scope.tags);
    // $scope.uiState.hero = photo;
  };

  $scope.changeHero = function(delta) {
    var index = $scope.photos.indexOf($scope.uiState.hero);
    var photo = $scope.photos[index + delta];
    if (!photo) {
      photo = $scope.photos[0];
    }
    $scope.uiState.hero = photo;
  };

  $scope.filterTitle = function() {
    if ($scope.tags.keys) {
      return "Editor's Choice"
    } else {
      return "Custom Filter"
    }
  };
}]);
