//TODO: use q library to fulfill all promises before sending
//TODO: index page warns this will take a bit of time to propogate results

var express = require('express');
var app = express();
var xray = require('x-ray');
var x = new xray();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  scrape(response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function scrape(response) {
  // AUSTRALIA COUNCIL
  x('http://www.australiacouncil.gov.au/funding/new-grants-model/', 'div.faqs li', [{
    grant: 'a',
    dates: x('ul', ['li']),
    info: x('div', ['p']),
    link: 'a.btn@href'
  }])(function(error, data) {
    // if there is no info present it most likely won't be a valid entry
    var data = data.filter(function(item) {
      return item.info.length > 0;
    });
    // join all the p tags together
    data.forEach(function(item) {
      item.info = item.info.join('  ');
    });
    next(response, data);
  });

}

function next(response, DATA) {
  x('http://regionalartsnsw.com.au/grants/?grant_category=dance', 'div.grant', [{
    grant: '.grant_title',
    info: ['p'],
    link: 'a.external@href'
  }])(function(err, data) {
          data.forEach(function(entry) {
              entry.info = entry.info.join(' ');
          });
        response.send(DATA.concat(data));
  });
}
