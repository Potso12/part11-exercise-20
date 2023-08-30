const config = require('./utils/config')
const express = require('express')
const cors = require('cors')
const path = require('path');
const app = express()
const notesRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = config.MONGODB_URI

logger.info('connecting to', url)

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })





app.use(cors())
app.use(express.static(path.join(__dirname, 'blog-frontend/build')));
app.use(express.json())

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'bloglist-frontend/build/static', 'index.html'));
});

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
