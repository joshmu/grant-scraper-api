var Xray = require('x-ray');
var x = new Xray();
var Q = require('q');

// SCRAPE ALL SITES AVAILABLE
Q.all([
  australiaCouncil(),
  regionalArtsNsw()
]).done(function(data) {
  console.log(data);
}, console.error);

// AUSTRALIA COUNCIL
function australiaCouncil() {
  var url = 'http://www.australiacouncil.gov.au/funding/new-grants-model/';
  var deferred = Q.defer();
  x(url, 'div.faqs li', [{
    grant: 'a',
    dates: x('ul', ['li']),
    info: x('div', ['p']),
    link: 'a.btn@href'
  }])(function(error, data) {
    if (error) deferred.reject(error);
    // if there is no info present it most likely won't be a valid entry
    var data = data.filter(function(item) {
      return item.info.length > 0;
    });
    // join all the p tags together
    data.forEach(function(grant) {
      grant.info = grant.info.join('  ');
    });
    var output = {
      title: url,
      data: data
    };
    deferred.resolve(output);
  });
  return deferred.promise;
}


// REGIONAL ARTS NSW
function regionalArtsNsw() {
  var url = 'http://regionalartsnsw.com.au/grants/?grant_category=dance';
  var deferred = Q.defer();
  x(url, 'div.grant', [{
    grant: '.grant_title',
    info: ['p'],
    link: 'a.external@href'
  }])(function(err, data) {
    if (err) deferred.reject(err);
    data.forEach(function(grant) {
      grant.info = grant.info.join(' ');
    });
    var output = {
      title: url,
      data: data
    };
    deferred.resolve(output);
  });
  return deferred.promise;
}
