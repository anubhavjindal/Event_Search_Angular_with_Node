const http = require('http');
const express = require('express');
const app = express();

var Request = require("request");
var SpotifyWebApi = require('spotify-web-api-node');
var geohash = require('ngeohash');

var spotifyApi = new SpotifyWebApi({
  clientId: '0c6a495c28184a3f9c13abe8ebca29cd',
  clientSecret: 'f32d66bd490a4c24bd0f3910f2ffd9b6'
});

app.use(express.static('HW8'));
app.get('/artist/:name', (req,res) => {
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      spotifyApi.setAccessToken(data.body['access_token']);
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  ).then(function(data){
    spotifyApi.searchArtists(req.params.name)
    .then(function(data) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.send(data.body);
    }, function(err) {
      console.error(err);
    });  
  });
});

app.get('/location/:keyword', (req,res) => {
  Request.get("https://maps.googleapis.com/maps/api/geocode/json?address="+req.params.keyword+"&key=AIzaSyByKVdDMj68rGt73isluIxpNu82gX0-UJo", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
    });
  });

app.get('/upcoming/:keywords', (req,res) => {
  Request.get("https://api.songkick.com/api/3.0/search/venues.json?query="+req.params.keywords+"&apikey=NdRv2DnqYea2OEyw", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    Request.get("https://api.songkick.com/api/3.0/venues/"+JSON.parse(body).resultsPage.results.venue[0].id+"/calendar.json?apikey=NdRv2DnqYea2OEyw", (error2, response2, body2)  => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body2);
    });
  });
});

app.get('/', (req,res) => {
    res.send("Node server is up and running, listening to all your requests...");
  });

app.get('/search/:keywords/:distance/:unit/:lat/:lon', (req,res) => {
  Request.get("https://app.ticketmaster.com/discovery/v2/events.json?apikey=h7qBbTvXHC4xKc7pcXrFAjzTwLVT0DD5&keyword="+req.params.keywords+"&segmentId="+req.query.segmentId+"&radius="+req.params.distance+"&unit="+req.params.unit+"&sort=date,asc&geoPoint="+geohash.encode(req.params.lat,req.params.lon), (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
  });
});

app.get('/images/:keywords', (req,res) => {
  Request.get(" https://www.googleapis.com/customsearch/v1?q="+req.params.keywords+"&cx=005012667721830617865:ahca9ztj7ga&imgSize =huge&imgType=news&num=8&searchType=image&key=AIzaSyBNr3N-wZ8OBgv-FpUGob5h08aPJJfceT0", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
  });
});

app.get('/autocom/:term', (req,res) => {
  Request.get(" https://app.ticketmaster.com/discovery/v2/suggest?apikey=h7qBbTvXHC4xKc7pcXrFAjzTwLVT0DD5&keyword="+req.params.term, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
  });
});

app.get('/venue/:keyword', (req,res) => {
  Request.get("https://app.ticketmaster.com/discovery/v2/venues/?apikey=h7qBbTvXHC4xKc7pcXrFAjzTwLVT0DD5&keyword="+req.params.keyword, (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
  });
});

app.get('/details/:id', (req,res) => {
  Request.get("https://app.ticketmaster.com/discovery/v2/events/"+req.params.id+"?apikey=h7qBbTvXHC4xKc7pcXrFAjzTwLVT0DD5", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(body);
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
