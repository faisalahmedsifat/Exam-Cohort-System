// @ts-nocheck


const Sequelize = require('sequelize')
const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const AssignedCohortController = require('../controllers/AssignedCohortController')
const DatabaseController = require('../controllers/DatabaseController')
const RoleBarrier = require('../controllers/RoleBarrier')
const ValidationController = require('../controllers/ValidationController')

// Models 
const Models = require('../models')

/** 
 * Routes
 * 
 * prefix: api/assignedcohort/
 */

router.get('/', middleware.authBarrier, async (request, response) => {
  const userID = request.userID
  try {
      const cohorts = await AssignedCohortController.getAllExamCohort(userID)
      return response.status(200).json(middleware.generateApiOutput("OK", cohorts))
  } catch (error) {
      return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

router.get('/:id', middleware.authBarrier, RoleBarrier.cohortsCandidateRoleBarrier, async (request, response) => {
  const userID = request.userID
  const cohortID = request.params.id
  try {
      const cohorts = await AssignedCohortController.getSingleAssignedCohortDetails(cohortID)
      return response.status(200).json(middleware.generateApiOutput("OK", cohorts))
  } catch (error) {
      return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

router.get('/:id/assessment', middleware.authBarrier, RoleBarrier.cohortsCandidateRoleBarrier, async (request, response) => {
  const cohortID = request.params.id
  try {
      const assessments = await AssignedCohortController.getAllAssignedAssessment(cohortID)
      return response.status(201).json(middleware.generateApiOutput("OK", assessments))
  } catch (error) {
      return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router