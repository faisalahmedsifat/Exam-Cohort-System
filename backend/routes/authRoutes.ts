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
  console.log(googleOAuthLogin)
  try {
    const { code } = request.body
    console.log(2)
    const token = await googleOAuthLogin.signIn({ code });
    console.log("3")
    return response.status(200).send(middleware.generateApiOutput("OK", { token }))
    console.log(googleOAuthLogin)
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router