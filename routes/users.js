const express = require('express')
const Users = require('../models/users')
const argon2 = require('argon2')
const router = express.Router()


router.get('/signup', (req, res) => {
  res.render('users/signup', { user: new Users() })
})

router.post('/', async (req, res, next) => {
  req.user = new Users()
  next()
}, saveUserAndRedirect('success'))



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