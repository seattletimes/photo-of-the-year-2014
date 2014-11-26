var app = require("./application");

//defines a filter
app.filter("tagFilter", function() {
  //actual function used from HTML
  //is passed the array, and the argument from the expression
  return function(photos, tags) {
    //filter the array, returning only cats that match
    return photos.filter(function(photo) {
      //for each cat, check all tags that are true
      for (var tag in tags) {
        if (tags[tag]) {
          //if cat fails to possess a checked tag, reject it
          if (photo.tags.indexOf(tag) == -1) return false;
        }
      }
      //if cat survived, return true
      return true;
    });
  }
});