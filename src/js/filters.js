//the stream filter takes an array and a filter object, and returns matching items
var getTags = function(hash) {
  return Object.keys(hash).filter(function(t) { return hash[t] });
};

module.exports = function(photos, tagHash) {
  var tags = getTags(tagHash);
  if (!tags.length) return photos;
  var filtered = photos.filter(function(photo) {
    for (var i = 0; i < tags.length; i++) {
      if (photo.tags.indexOf(tags[i]) > -1) return true;
    }
    return false;
  });
  return filtered;
};