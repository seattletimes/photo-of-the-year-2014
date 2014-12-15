var app = require("./application");

app.directive("scrollTo", function() {

  return {
    restrict: "A",
    scope: {
      scrollTo: "="
    },
    link: function(scope, element, attrs) {
      var el = element[0];
      el.style.position = "relative";
      scope.$watch("scrollTo", function(value) {
        var selector = "[ng-src*=\"" + value + "\"]";
        var match = el.querySelector(selector);
        if (!match) return;
        var frameBounds = el.getBoundingClientRect();
        var matchBounds = match.getBoundingClientRect();
        if (matchBounds.top < frameBounds.top || matchBounds.top > frameBounds.bottom) {
          //below the scroll
          el.scrollTop = match.offsetTop;
        }
      });
    }
  };

});