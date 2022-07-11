// @ts-nocheck

const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const Main = require('../controllers/main')

/** 
 * Routes
 * 
 * prefix: /
 */

// Read
router.get('/', async (request, response) => {
  const mainInstance = new Main("Welcome to exam cohort app!");
  response.send(middleware.generateApiOutput("OK", mainInstance.getMessage()));
})


module.exports = router