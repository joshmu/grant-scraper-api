var Xray = require('x-ray');
var x = new Xray();

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
      next(data);
    });

function next(DATA) {

  // REGIONAL ARTS NSW
    x('http://regionalartsnsw.com.au/grants/?grant_category=dance', 'div.grant', [{
      grant: '.grant_title',
      info: ['p'],
      link: 'a.external@href'
    }])(function(err, data) {
            data.forEach(function(entry) {
                entry.info = entry.info.join(' ');
            });
        console.log(DATA.concat(data));
    });

}
