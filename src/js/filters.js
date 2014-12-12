//the stream filter takes an array and a filter object, and returns matching items
var getTags = function(hash) {
  return Object.keys(hash).filter(function(t) { return hash[t] });
};

var filter = function(photos, tagHash) {
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

filter.names = {
  selects: "Editor's Picks",
  nature: "Nature",
  people: "People",
  landmarks: "CityScapes",

  //news
  oso: "Oso",
  wildfire: "Wildfire",
  marysville: "Marysville",
  spu: "SPU",
  "other-news": "Other news",

  //sports
  seahawks: "Seahawks",
  sounders: "Sounders",
  mariners: "Mariners",
  uw: "Huskies",
  storm: "Storm",
  reign: "Reign",
  prep: "High school",
  "other-sports": "Other sports"
};

module.exports = filter;