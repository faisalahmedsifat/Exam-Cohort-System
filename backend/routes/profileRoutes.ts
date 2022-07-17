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
  try {
    const userProfile = await UserController.getUserProfileDetails(request.userID)
    return response.send(middleware.generateApiOutput("OK", userProfile));
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
  }
})


module.exports = router