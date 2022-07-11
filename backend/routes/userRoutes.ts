// @ts-nocheck

const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const UserController = require('../controllers/user')

/** 
 * Routes
 * 
 * prefix: api/user
 */

// Read
router.post('/signin', async (request, response) => {
  try {
    const { code } = request.body
    const token = await new UserController().signIn(code);
    return response.status(200).send(middleware.generateApiOutput("OK", { token }))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", {error}))
  }
})


module.exports = router