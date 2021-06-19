const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  sex: {
    type: String,
  },
  location: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userid: {
    type: String,
    required: true,
    unique: true
  },
  verified: {
    type: Boolean,
    required: true,
  }
})

usersSchema.pre('validate', function(next) {
  if (this.username) {
    this.userid = slugify(this.username, { lower: true, strict: true })
  }
  next()
})

module.exports = mongoose.model('users', usersSchema)