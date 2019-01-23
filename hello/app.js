var express = require('express')
var os = require("os");
var hostname = os.hostname();
var app = express()
const util = require('util')

app.get('/api/', function(req, res) {
  var outstr = 'This is the Hello World backend from ' + hostname + '! Your app is up and running in a cluster!\n';
  res.send(outstr);
  console.log(outstr);
})

app.use('/api/user/', (req, res, next) => {
  const auth = req.header('authorization');
  if (!auth) {
    res.status(403).send();
  } else {
    // authorization should be "Bearer <access_token> <identity_token>"
    const parts = auth.split(' ');
    if (parts.length !== 3) {
      res.status(403).send({ message: 'Invalid Authorization header. Expecting "Bearer access_token identity_token".' })
      return;
    }
    if (parts[0].toLowerCase() !== 'bearer') {
      res.status(403).send({ message: 'Invalid Authorization header. Bearer not found.' });
      return;
    }
    const jwt = require('jsonwebtoken');
    const access_token = jwt.decode(parts[1]);
    if (!access_token) {
      res.status(403).send({ message: 'Invalid access token' });
      return;
    }
    const identity_token = jwt.decode(parts[2]);
    if (!identity_token) {
      res.status(403).send({ message: 'Invalid identity token' });
      return;
    }

    req.appIdAuthorizationContext = {
      header: auth,
      access_token,
      identity_token,
    };
    
//    res.send(util.inspect(identity_token, false, null, true));
//    res.send('User: ' + identity_token.name + '\nE-Mail: ' + identity_token.email);
    res.send(identity_token);

//    next();
  }
});


// Called by App ID when the authorization flow completes
app.get('/api/user/appid_callback', function (req, res) {
  res.send('OK API');
});

// Frontend wants to force login explicitly
// Note: login should be done behind the scenes by the k8s ingress an AppID, 
// when trying to load any protected resource, no matter whether the call shall 
// load the frontend or is issued directly to the backend (API)

app.get('/api/login', function (req, res) {
  res.send('Explicit login not yet implemented!');
});

// Frontend wants to force logout explicitly
app.post('/api/logout', function (req, res) {
  res.send('Explicit logout not yet implemented!');
});

app.listen(8080, function() {
  console.log('Sample hello backend is listening on port 8080.')
})
