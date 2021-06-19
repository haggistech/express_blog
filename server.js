const express = require('express')
const mongoose = require('mongoose')
const Article = require('./models/article')
const Users = require('./models/users')
const articleRouter = require('./routes/articles')
const usersRouter = require('./routes/users')
const methodOverride = require('method-override')
const dotenv = require('dotenv');
const app = express()

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))

app.get('/', async (req, res) => {
  const articles = await Article.find().sort({ createdAt: 'desc' })
  res.render('articles/index', { articles: articles })
})

app.use('/articles', articleRouter)
app.use('/users', usersRouter)
app.listen(5000)