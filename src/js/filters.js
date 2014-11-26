//the stream filter takes an array and a filter object, and returns matching items
module.exports = function(photos, tagHash) {
  var tags = Object.keys(tagHash).filter(function(t) { return tagHash[t] });
  if (!tags.length) return photos;
  var filtered = photos.filter(function(photo) {
    return tags.every(function(t) {
      return photo.tags.indexOf(t) > -1;
    });
  });
  return filtered;
};