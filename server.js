const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const Users = require('./models/users')
const articleRouter = require('./routes/articles')
const usersRouter = require('./routes/users')
const methodOverride = require('method-override')
const dotenv = require('dotenv');
const app = express()
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

var db = mongoose.connection;

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(express.static('public'));

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)
app.use('/users', usersRouter)
app.listen(process.env.PORT)
