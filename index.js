//TODO: index page warns this will take a bit of time to propogate results
//TODO: how to make most of 'http://ausdance.org.au/articles/details/funding-sources-for-dance-artists'

var express = require('express');
var app = express();

var xray = require('x-ray');
var x = new xray();

var Q = require('q');

app.set('port', (process.env.PORT || 5000));

// allow access from other domains
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://contemporarydance.info");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(request, response) {
  scrape(response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

// SCRAPE ALL SITES AVAILABLE
function scrape(response) {
  Q.all([
    ausdanceList()
    // australiaCouncil(),
    // regionalArtsNsw()
  ]).done(function(data) {
    response.send(data);
  }, console.error);
}

////////////////////////////////////////////////////////////////
//      WEBSITES
///////////////////////////////////////////////////////////////
function ausdanceList() {
  var deferred = Q.defer();

  x('http://ausdance.org.au/articles/details/funding-sources-for-dance-artists', 'div#section-1920 a', [{
    grant: '',
    link: '@href'
  }])(function(err, data) {
    if(err) deferred.reject(err);
    deferred.resolve(parse(data));
  });

  function parse(data) {
    data.shift();
    data.shift();
    data.shift();
    data.pop();
    data.pop();
    data.pop();
    return data;
  }

  return deferred.promise;
}

// AUSTRALIA COUNCIL
// function australiaCouncil() {
//   var url = 'http://www.australiacouncil.gov.au/funding/new-grants-model/';
//   var deferred = Q.defer();
//   x(url, 'div.faqs li', [{
//     grant: 'a',
//     dates: x('ul', ['li']),
//     info: x('div', ['p']),
//     link: 'a.btn@href'
//   }])(function(error, data) {
//     if (error) deferred.reject(error);
//     // if there is no info present it most likely won't be a valid entry
//     var data = data.filter(function(item) {
//       return item.info.length > 0;
//     });
//     // join all the p tags together
//     data.forEach(function(grant) {
//       grant.info = grant.info.join('  ');
//     });
//     var output = {
//       title: url,
//       data: data
//     };
//     deferred.resolve(output);
//   });
//   return deferred.promise;
// }


// REGIONAL ARTS NSW
// function regionalArtsNsw() {
//   var url = 'http://regionalartsnsw.com.au/grants/?grant_category=dance';
//   var deferred = Q.defer();
//   x(url, 'div.grant', [{
//     grant: '.grant_title',
//     info: ['p'],
//     link: 'a.external@href'
//   }])(function(err, data) {
//     if (err) deferred.reject(err);
//     data.forEach(function(grant) {
//       grant.info = grant.info.join(' ');
//     });
//     var output = {
//       title: url,
//       data: data
//     };
//     deferred.resolve(output);
//   });
//   return deferred.promise;
// }
