//Use CommonJS style via browserify to load other modules

var app = require("./application");
var streamFilter = require("./filters");

var isMobile = require("./isMobile");

app.controller("PhotoController", ["$scope", function($scope) {

  var all = window.photoData;
  var playlists = {
    all: all
  };
  all.forEach(function(photo) {
    photo.curated.forEach(function(list) {
      if (!playlists[list]) playlists[list] = [];
      playlists[list].push(photo);
    });
  });

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

  var getPhotos = function() {
    var photos = playlists[$scope.filter.playlist];
    var stream = streamFilter(photos, $scope.filter.tags);
    $scope.photos = stream;
  };

  var getTags = function(o) {
    o = o || $scope.filter.tags;
    return Object.keys(o).filter(function(t) { return o[t] });
  };

  $scope.$watch("filter.tags", function(now, then) {
    var len = getTags(now).length;
    if (len && len != getTags(then).length) {
      $scope.filter.playlist = "all";
    }
    getPhotos();
  }, true);

  $scope.$watch("filter.playlist", function(now, then) {
    if (now !== then && now !== "all") {
      $scope.filter.tags = {};
    }
    getPhotos();
  });

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
