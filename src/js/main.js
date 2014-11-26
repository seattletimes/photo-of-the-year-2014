//Use CommonJS style via browserify to load other modules

var app = require("./application");
var streamFilter = require("./filters");

var isMobile = require("./isMobile");

app.controller("PhotoController", ["$scope", function($scope) {

  var all = window.photoData;
  var playlists = {
    default: all.slice(0, 3),
    special: all.slice(3, 6),
    all: all
  };

  $scope.ui = {
    showFilter: false,
    hero: isMobile() ? null : all[0],
    heroIndex: 0
  };
  $scope.filter = {
    playlist: "all",
    tags: {}
  };

  var setHero = $scope.setHero = function(photo) {
    $scope.ui.hero = photo;
    $scope.ui.heroIndex = $scope.photos.indexOf(photo);
  };

  var setPhotos = function(stream) {
    $scope.photos = stream;
    if (!isMobile()) {
      setHero(stream[0]);
    }
  };

  $scope.$watch("filter", function(now, then) {
    if (now.playlist == then.playlist) {
      //must be a tag change
      //set to the "all" playlist, this will trigger a second $watch
      $scope.filter.playlist = "all";
    }
    var photos = playlists[now.playlist];
    var filtered = streamFilter(photos, now.tags);
    setPhotos(filtered);
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

  $scope.filterTitle = function() {
    var keys = Object.keys($scope.filter.tags).filter(function(key) { return $scope.filter.tags[key] });
    return [$scope.filter.playlist].concat(keys).join(", ");
  };

}]);
