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

  var setHero = $scope.setHero = function(photo) {
    $scope.uiState.hero = photo;
    $scope.uiState.heroIndex = $scope.photos.indexOf(photo);
    $scope.gotoAnchor(photo.id);
  };

  $scope.$watch("tags", function() {
    var tagFilter = $filter("tagFilter");
    var filteredPhotos = tagFilter(all, $scope.tags);
    $scope.photos = filteredPhotos;
    if (!isMobile()) {
      setHero($scope.photos[0]);
    }
  }, true);

  $scope.clearHero = function() {
    $scope.uiState.hero = null;
  };

  $scope.changeHero = function(delta) {
    delta = delta || 1;
    var index = $scope.photos.indexOf($scope.uiState.hero);
    index += delta;
    var nextPhoto = $scope.photos[index];
    setHero(nextPhoto);
  };

  $scope.filterTitle = function() {
    if ($scope.tags.keys) {
      return "Editor's Choice"
    } else {
      return "Custom Filter"
    }
  };
}]);
