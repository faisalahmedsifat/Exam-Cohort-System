// @ts-nocheck

const Sequelize = require('sequelize')
const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const UserController = require('../controllers/user')

// Models 
const { User, ExamCohort } = require('../models')

/** 
 * Routes
 * 
 * prefix: api/user
 */

// signin
router.post('/signin', async (request, response) => {
  try {
    const { code } = request.body
    const token = await new UserController().signIn(code);
    return response.status(200).send(middleware.generateApiOutput("OK", { token }))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
  }
})

module.exports = router