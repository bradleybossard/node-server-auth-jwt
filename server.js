var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'thisisthesecrect';

var user = {
  username: 'bradleybossard',
  password: 'boss'
};

var app = express();

// middeware
app.use(cors());
app.use(bodyParser.json());
app.use(expressJwt({ secret: jwtSecret }).unless ({path: ['/login']}));

// returns json of random user
app.get('/random-user', function(req, res) {
  console.log(faker);
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

// checks if username/password match, if so, send JWT.
app.post('/login', authenticate, function(req, res) {
  var token = jwt.sign({
    username: user.username
  }, jwtSecret);
  res.send({
    token: token,
    user: user
  });
});

// Gets the user name and data.  Used when user returns to
// app, and already has the JWT.
app.get('/me', function(req, res) {
  res.send(req.user);
});

app.listen(3000, function() {
  console.log('App listening on localhost:3000');
});

// Helper function to validate user  against local database.
function authenticate(req, res, next) {
  var body = req.body;
  if (!body.username || !body.password) {
    res.status(400).end('Must provide username or password');
  }

  if (body.username !== user.username || body.password !== user.password) {
    res.status(401).end('Username or password incorrect');
  }

  next();
}
