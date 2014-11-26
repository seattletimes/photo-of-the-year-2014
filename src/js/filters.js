//the stream filter takes an array and a filter object, and returns matching items
module.exports = function(photos, filter) {
  //merge playlist with tags
  var tags = filter.playlist ? [filter.playlist] : [];
  tags.push.apply(tags, Object.keys(filter.tags).filter(function(t) { return filter.tags[t] }));
  //filter the array, returning only cats that match
  var filtered = photos.filter(function(photo) {
    //for each photo, require all tags to exist
    return tags.every(function(tag) {
      //check for tag in the photo tags
      return photo.tags.indexOf(tag) > -1;
    });
  });
  return filtered;
};