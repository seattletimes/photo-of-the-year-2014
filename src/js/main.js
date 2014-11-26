//Use CommonJS style via browserify to load other modules

var app = require("./application");
var streamFilter = require("./filters");

var isMobile = require("./isMobile");

app.controller("PhotoController", ["$scope", function($scope) {
  
  var all = window.photoData;
  $scope.photos = [];

  $scope.ui = {
    showFilter: false,
    hero: null,
    heroIndex: 0
  };
  $scope.filter = {
    playlist: "default",
    tags: {}
  };

  var setHero = $scope.setHero = function(photo) {
    $scope.ui.hero = photo;
    $scope.ui.heroIndex = $scope.photos.indexOf(photo);
  };

  $scope.$watch("tags", function() {
    var filteredPhotos = streamFilter(all, $scope.filter);
    $scope.photos = filteredPhotos;
    if (!isMobile()) {
      setHero($scope.photos[0]);
    }
  }, true);

  $scope.clearHero = function() {
    $scope.ui.hero = null;
  };

  $scope.changeHero = function(delta) {
    delta = delta || 1;
    var index = $scope.photos.indexOf($scope.ui.hero);
    index += delta;
    var nextPhoto = $scope.photos[index];
    setHero(nextPhoto);
  };

  var playlists = ["default", "special"];
  $scope.filterTitle = function() {
    var keys = Object.keys($scope.filter.tags).filter(function(key) { return $scope.filter.tags[key] });
    return [$scope.filter.playlist].concat(keys).join(", ");
  };
}]);
