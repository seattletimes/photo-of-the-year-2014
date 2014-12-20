var async = require("async");
var htmlparser = require("htmlparser2");
var request = require("request");
var query = htmlparser.DomUtils.findAll;

var url = "http://seattletimes.mycapture.com/mycapture/folder.asp?event=1883401&CategoryID=72513&ListSubAlbums=0&view=1&thisPage=";

module.exports = function(grunt) {

  grunt.registerTask("buylinks", function() {

    grunt.task.requires("photos");

    var links = [];
    var rows = new Array(grunt.data.photos.length);

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
        var title = link.title.replace(/[^a-z]/gi, "").slice(0, 20);
        for (var i = 0; i < grunt.data.photos.length; i++) {
          var photo = grunt.data.photos[i];
          var caption = photo.caption.replace(/[^a-z]/gi, "").slice(0, 20);
          // console.log(caption);
          if (caption == title) {
            rows[i] = [photo.image, link.id, link.title];
            return;
          }
        }
        console.log("NOT FOUND", link, title);
      });

      grunt.file.write("temp/buy.csv", rows.map(function(r) { return r.join(",") }).join("\n"));

      done();
    });
  });

};