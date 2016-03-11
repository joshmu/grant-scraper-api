var Xray = require('x-ray');
var x = new Xray();

x('http://ausdance.org.au/articles/details/funding-sources-for-dance-artists', 'div#section-1920 a', [{
  grant: '',
  link: '@href'
}])(function(err, data) {
  console.log(parse(data));
});

function parse(data) {
  data.shift();
  data.shift();
  data.shift();
  data.pop();
  data.pop();
  data.pop();
}
