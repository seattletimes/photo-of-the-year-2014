//Use CommonJS style via browserify to load other modules

var app = require("./application");
var streamFilter = require("./filters");

app.controller("PhotoController", ["$scope", function($scope) {

  var isMobile = $scope.isMobile = require("./isMobile");

  var all = window.photoData;
  var playlists = {
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

  var elementProto = HTMLElement.prototype;
  elementProto.requestFullscreen = elementProto.requestFullscreen || elementProto.webkitRequestFullscreen || elementProto.mozRequestFullScreen || elementProto.msRequestFullscreen;
  document.exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullscreen || document.msExitFullscreen;

  $scope.launchIntoFullscreen = function(id) {
    var element = document.querySelector(id);
    element.requestFullscreen();
  };

  $scope.exitFullscreen = function() {
    document.exitFullscreen();
  };

  window.addEventListener("keydown", function(e) {
    var keyDeltas = {
      37: -1,
      39: 1
    };
    if (e.keyCode in keyDeltas) {
      $scope.changeHero(keyDeltas[e.keyCode]);
      e.preventDefault();
      $scope.$apply();
    }
  });
}]);
