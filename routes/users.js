var crypto = require('crypto');
var express = require('express');
const router = express.Router();
var bodyParser = require('body-parser');
var argon2i = require('argon2-ffi').argon2i;

var app = express();
var jsonParser = bodyParser.json();

var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 160;

var users = {};

router.post('/users', jsonParser, function (req, res) {
  if (!req.body) { return res.sendStatus(400); }

  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Missing username or password');
  }

  if (users[req.body.username] !== undefined) {
    return res.status(409).send('A user with the specified username already exists');
  }

  if (req.body.password.length < MIN_PASSWORD_LENGTH ||
      req.body.password > MAX_PASSWORD_LENGTH) {
    return res.status(400).send(
      'Password must be between ' + MIN_PASSWORD_LENGTH + ' and ' +
      MAX_PASSWORD_LENGTH + ' characters long');
  }

  crypto.randomBytes(16, function (err, salt) {
    if (err) throw err;
    argon2i.hash(req.body.password, salt, function (err, hash) {
      if (err) throw err;
      users[req.body.username] = hash;
      res.sendStatus(201);
    });
  });
});

module.exports = router