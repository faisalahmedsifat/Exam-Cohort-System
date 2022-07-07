const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const UserController = require('../controllers/user')
const User = require('../controllers/user')

/** 
 * Routes
 * 
 * prefix: /user
 */

// Read
router.post('/signin', async (request, response) => {
    const {
        code
    } = request.body
    response.send(middleware.generateApiOutput("OK", UserController.signIn));
})


module.exports = router