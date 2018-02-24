// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var db = require('./model/db');
var Site = require('./model/sites');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/:short", function (request, response) {
  var short = request.params.short;
  Site.find({
    short: short
  }).exec(function(err, sites) {
      if (err) throw err;
      if (sites.length > 0) {
        response.redirect(sites[0].original);
      } else {
        response.send("Data not found");
      }
  });
});

app.get("/new", function (request, response) {
  response.json({
    err: "Unused endpoint"
  });
});

app.get("/new/:uri*", function (request, response) {
  var params = request.params; 
  var uri = params["uri"] + params["0"];
  var now = Date.now().toString();
  var short = now.substring(now.length - 4);
  
  function validate(url) {
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }
  
  if (validate(uri)) {
    
    Site.find({
      short: short
    }).exec(function(err, sites) {
        if (err) throw err;
        if (sites.length > 0) {
          response.send("Short link duplicate, please refresh");
        } else {
            var sites = new Site({
                original: uri,
                short: short
            });

            sites.save(function(err) {
              if (err) throw err;
                response.json({
                  original: uri,
                  short: "https://shorthis.glitch.me/"+short
                });
            });
        }
    });
    
  } else {
    response.send("Wrong url format, make sure you have a valid protocol and real site.");
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
