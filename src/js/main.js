//Use CommonJS style via browserify to load other modules

var app = require("./application");
var streamFilter = require("./filters");
require("./fullscreen");
require("./scrollTo");
var query = require("querystring");

var isMobile = require("./isMobile");

var cacheIndex = 0;
var precache = function() {
  if (cacheIndex == window.photoData.length) return;
  var img = new Image();
  img.onload = precache;
  img.src = "./assets/" + window.photoData[cacheIndex++].image;
};
if (!isMobile()) precache();

app.controller("PhotoController", ["$scope", "$location", function($scope, $location) {

  $scope.isMobile = isMobile;

  var all = window.photoData;

  $scope.ui = {
    loading: false,
    showFilter: false,
    hero: all[0],
    heroIndex: 0,
    showGallery: false,
    fullscreen: false,
    meta: {
      news: {
        tags: ["oso", "wildfire", "marysville", "spu", "other-news"],
        enabled: false
      },
      sports: {
        tags: ["seahawks", "sounders", "mariners", "uw", "storm", "reign", "prep", "other-sports"],
        enabled: false
      }
    }
  };
  $scope.filter = {};
  $scope.restrict = {};

  //load query string data
  var qs = query.parse(window.location.hash.replace(/^##/, ""));
  if (qs.filters) {
    if (typeof qs.filters == "string") qs.filters = [qs.filters];
    qs.filters.forEach(function(f) {
      $scope.filter[f] = true;
    });
  }
  if (qs.photographers) {
    if (typeof qs.photographers == "string") qs.photographers = [qs.photographers];
    qs.photographers.forEach(function(p) {
      $scope.restrict[p] = true;
    });
  }

  var setHero = $scope.setHero = function(photo) {
    var img = new Image();
    img.onload = function() {
      $scope.ui.loading = false;
      $scope.ui.hero = photo;
      $scope.ui.heroIndex = $scope.photos.indexOf(photo);
      $scope.ui.showGallery = isMobile();
      $scope.$apply();
    };
    img.src = "./assets/" + photo.image;
    $scope.ui.loading = true;
  };

  $scope.clearHero = function() {
    $scope.ui.showGallery = false;
  };

  var truthyKeys = function(o) {
    return Object.keys(o).filter(function(k) { return o[k] });
  };

  $scope.changeHero = function(delta) {
    delta = delta || 1;
    var index = $scope.photos.indexOf($scope.ui.hero);
    index += delta;
    if (index < 0 || index >= $scope.photos.length) {
      return;
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
    $scope.restrict = {};
    for (var key in $scope.ui.meta) {
      $scope.ui.meta[key].enabled = false;
    }
  };

  $scope.filterTitle = function() {
    var title = "All photos";
    var keys = truthyKeys($scope.filter);
    if (keys.length) {
      title = keys.map(function(k) {
        return streamFilter.names[k] || k;
      }).join(", ");
    }
    var photographers = truthyKeys($scope.restrict);
    if (photographers.length) {
      title += " by " + photographers.join(", ");
    }
    $location.hash(query.stringify({filters: keys, photographers: photographers}));
    return title;
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
