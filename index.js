var express = require('express');
var app = express();
var fs = require('fs');

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  fs.readFile('results.json', function(err, data) {
      response.send(JSON.parse(data));
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
