var csv = require("csv");

module.exports = function(grunt) {
  grunt.registerTask("photos", function() {

    grunt.task.requires("state");

    var file = grunt.file.read("data/photos.tsv");
    
    var parsed = [];
    var photographers = {};

    var parser = csv.parse({
      delimiter: "\t",
      quote: ""
    });

    parser.on("data", function(line) {
      var photo = {
        image:    line[0],
        tags:     line[1],
        caption:  line[2],
        credit:   line[3],
        portrait: (line[5]/line[6]) < 1
      }
      parsed.push(photo);

      var credit = line[3].toLowerCase().replace(/^\w|\s\w/g, function(match) {
        return match.toUpperCase();
      });
      photographers[credit] = true;
    });
    parser.on("finish", function() {
      grunt.data.photos = parsed;
      grunt.data.photographers = Object.keys(photographers).sort(function(a, b) {
        var lastA = a.split(" ").pop();
        var lastB = b.split(" ").pop();
        if (lastA < lastB) return -1;
        if (lastA > lastB) return 1;
        return 0;
      });
    });

    parser.write(file);
    parser.end();
  });
};
