var async = require("async");
var htmlparser = require("htmlparser2");
var request = require("request");
var query = htmlparser.DomUtils.findAll;

var url = "http://seattletimes.mycapture.com/mycapture/folder.asp?event=1883401&CategoryID=72513&ListSubAlbums=0&view=1&thisPage="

module.exports = function(grunt) {

  var links = [];

  grunt.registerTask("buylinks", function() {

    grunt.task.requires("photos");

    var done = this.async();

    async.each([1, 2, 3, 4, 5], function(pageNumber, c) {

      request(url + pageNumber, function(err, req, body) {
        if (err) return c(err);
        htmlparser.parseDOM(body, function(err, document) {
          if (err) return c(err);
          var html = document.filter(function(node) { return node.type == "tag" && node.name == "html" }).pop();
          if (!html) return c();
          query(function(element) {
            return element.name == "img" && element.parent.attribs.class == "MYCSmallPhotoBorder";
          }, document).forEach(function(img) {
            links.push({
              title: img.attribs.title || img.attribs.alt,
              id: img.attribs.src.match(/(\d+)T.jpg$/)[1]
            });
          });

          c();
        });
      });

    }, function(err) {
      if (err) return grunt.fatal(err);

      links.forEach(function(link) {
        for (var i = 0; i < grunt.data.photos.length; i++) {
          var photo = grunt.data.photos[i];
          var caption = photo.caption.trim().slice(0, 20).replace(/[\s\W]/g, "");
          //console.log(caption);
          var title = link.title.trim().slice(0, 20).replace(/[\s\W]/g, "");
          if (caption == title) {
            photo.buyID = link.id;
            return;
          }
        }
        console.log("NOT FOUND", link);
      });

      //console.log(grunt.data.photos);

      done();
    });
  });

};