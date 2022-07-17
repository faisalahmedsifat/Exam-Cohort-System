// @ts-nocheck

const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const UserController = require('../controllers/UserController')

/** 
 * Routes
 * 
 * prefix: /api/profile/
 */

// Read
router.get('/', middleware.authBarrier, async (request, response) => {
  const userProfile = await UserController.getUserProfileDetails(request.userID)
  response.send(middleware.generateApiOutput("OK", userProfile));
})


module.exports = router