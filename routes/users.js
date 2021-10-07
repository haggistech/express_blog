const express = require('express')
const Users = require('../models/users')
const argon2 = require('argon2')
const router = express.Router()


router.get('/signup', (req, res) => {
  res.render('users/signup', { user: new Users() })
})

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      verified: false,
    }

    Users.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/success');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    Users.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})




function saveUserAndRedirect(path) {
  return async (req, res) => {
    let user = req.user
    req.body.password = await argon2.hash(req.body.password);
    user.username = req.body.username
    user.password = req.body.password
    user.email = req.body.email
    user.sex = req.body.sex
    user.location = req.body.location
    user.verified = false
    try {
      user = await user.save()
      res.render(`users/${path}`)
    } catch (e) {
      res.render(`users/${path}`, { user: user })
    }
  }
}

module.exports = router