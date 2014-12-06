//Use CommonJS style via browserify to load other modules

var app = require("./application");
var streamFilter = require("./filters");
require("./fullscreen");

app.controller("PhotoController", ["$scope", function($scope) {

  var isMobile = $scope.isMobile = require("./isMobile");

  var all = window.photoData;

  $scope.ui = {
    showFilter: false,
    hero: isMobile() ? null : all[0],
    heroIndex: 0,
    fullscreen: false,
    meta: {
      news: {
        tags: ["other-news", "oso", "wildfire", "marysville", "spu"],
        enabled: false
      },
      sports: {
        tags: ["other-sports", "seahawks", "sounders", "mariners", "uw", "storm", "reign", "prep"],
        enabled: false
      }
    }
  };
  $scope.filter = {};
  $scope.restrict = {};

  var setHero = $scope.setHero = function(photo) {
    $scope.ui.hero = photo;
    $scope.ui.heroIndex = $scope.photos.indexOf(photo);
  };

  $scope.clearHero = function() {
    $scope.ui.hero = null;
  };

  $scope.changeHero = function(delta) {
    delta = delta || 1;
    var index = $scope.photos.indexOf($scope.ui.hero);
    index += delta;
    if (index < 0 || index >= $scope.photos.length) {
      return
    }
    var nextPhoto = $scope.photos[index];
    setHero(nextPhoto);
  };
  
  var getPhotos = function() {
    var stream = streamFilter(all, $scope.filter);
    //Photographers are exclusive
    var restricted = streamFilter(stream, $scope.restrict);
    $scope.photos = restricted;
  };

  $scope.$watch("filter", getPhotos, true);
  $scope.$watch("restrict", getPhotos, true);

  $scope.changeMeta = function(key) {
    var meta = $scope.ui.meta[key];
    meta.tags.forEach(function(tag) {
      $scope.filter[tag] = meta.enabled;
    });
  };

  $scope.clearFilters = function() {
    $scope.filter = {};
    for (var key in $scope.ui.meta) {
      $scope.ui.meta[key].enabled = false;
    }
  };

  $scope.launchIntoFullscreen = function(id) {
    $scope.ui.fullscreen = true;
    var element = document.querySelector(id);
    element.requestFullscreen();
  };

  $scope.exitFullscreen = function() {
    $scope.ui.fullscreen = false;
    document.exitFullscreen();
  };

  window.addEventListener("keydown", function(e) {
    var keyDeltas = {
      37: -1,
      38: -1,
      39: 1,
      40: 1
    };
    if (e.keyCode in keyDeltas) {
      $scope.changeHero(keyDeltas[e.keyCode]);
      e.preventDefault();
      $scope.$apply();
    }
  });

}]);
