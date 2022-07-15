// @ts-nocheck

const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const UserController = require('../controllers/user')

// Models 
const {User, ExamCohort} = require('../models')

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
    return response.status(500).json(middleware.generateApiOutput("FAILED", {error}))
  }
})

// exam cohort related routes
router.get('/examcohort', middleware.authBarrier, async (request, response) => {
  const {name} = request.body
  const userID = request.userID 
  try {
    const evalutor = await User.findByPk(userID);
    const cohorts = await evalutor.getEvaluatorcohorts();
    return response.status(200).json(middleware.generateApiOutput("OK", cohorts))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", {error}))
  }
})

router.post('/examcohort', middleware.authBarrier, async (request, response) => {
  const {name} = request.body
  const userID = request.userID 
  try {
    const evalutor = await User.findByPk(userID);
    const cohort = await evalutor.createEvaluatorcohort({name: name});
    return response.status(201).json(middleware.generateApiOutput("OK", cohort))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", {error}))
  }
})


router.post('/examcohort/:id/candidate', middleware.authBarrier, async (request, response) => {
  const {userId} = request.body
  const examcohortId = request.params.id
  try {
    const user = await User.findByPk(userId);
    const cohort = await ExamCohort.findByPk(examcohortId)
    cohort.addCandidate(user)
    return response.status(201).json(middleware.generateApiOutput("OK", user))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", {error}))
  }
})
router.get('/examcohort/:id/candidate', middleware.authBarrier, async (request, response) => {
  const examcohortId = request.params.id
  try {
    const cohort = await ExamCohort.findByPk(examcohortId)
    const candidates = await cohort.getCandidate()
    return response.status(201).json(middleware.generateApiOutput("OK", candidates))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", {error}))
  }
})


module.exports = router