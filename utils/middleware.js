const logger = require('./logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      request.token = authorization.replace('Bearer ', '')
    }
    next()
  }

  const userExtractor = async (request, response, next) => {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)  
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
      }
      const user = await User.findById(decodedToken.id)
      
      request.user = user
      
      next()
    } catch (error) {
      next(error)
    }
  }

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    logger.error('malformatted id')
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    logger.error('ValidationError')
    return response.status(400).json({ error: error.message })
  }   else if (error.name ===  'JsonWebTokenError') {
    logger.error('JsonWebTokenError')
    return response.status(400).json({ error: error.message })
  }   else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }


  next(error)
}


module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}