var express = require('express')
var os = require("os");
var app = express()

app.use('/hello', express.static(__dirname + '/public'));

// Called by App ID when the authorization flow completes
app.get('/hello/appid_callback', function (req, res) {
  res.send('OK hello-front');
});


app.listen(8080, function() {
  console.log('Sample hello frontend is listening on port 8080.')
})
