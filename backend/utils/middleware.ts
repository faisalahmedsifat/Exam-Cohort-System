// @ts-nocheck

const logger = require('./logger')
const config = require('./config')

const requestLogger = (request, response, next) => {
  logger.info('---')
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ message: 'Unknown Endpoint!' })
}

const generateApiOutput = (type, message) => {
  return {
    status: type,
    response: message
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  generateApiOutput
}