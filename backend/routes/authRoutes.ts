// @ts-nocheck

const Sequelize = require('sequelize')
const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
import { GoogleOAuth } from "../controllers/GoogleOAuth"
import { AuthController } from "../controllers/AuthController"

// Models 
const { User, ExamCohort } = require('../models')

/** 
 * Routes
 * 
 * prefix: api/auth/
 */

// Google OAuth
router.post('/oauth/google', async (request, response) => {
  const googleOAuthLogin = new AuthController(new GoogleOAuth());
  try {
    const { code } = request.body
    const token = await googleOAuthLogin.signIn({ code });
    return response.status(200).send(middleware.generateApiOutput("OK", { token }))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router