var express = require('express');
var faker = require('faker');
var cors = require('cors');
var bodyParser = require('body-parser');

var user = {
  username: 'bradleybossard',
  password: 'boss'
};

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/random-user', function(req, res) {
  console.log(faker);
  var user = faker.helpers.userCard();
  user.avatar = faker.image.avatar();
  res.json(user);
});

app.post('/login', authenticate, function(req, res) {
  res.send(user);
});


app.listen(3000, function() {
  console.log('App listening on localhost:3000');
});


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
