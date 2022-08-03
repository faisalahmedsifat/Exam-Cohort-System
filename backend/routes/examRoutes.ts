// @ts-nocheck

const Sequelize = require('sequelize')
const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const RoleBarrier = require('../controllers/RoleBarrier')
import { ExamServerSingleton } from "../controllers/ExamServerSingleton"

/** 
 * Routes
 * 
 * prefix: api/exam/
 */

// Get A Question
router.get('/:assessmentID', middleware.authBarrier, async (request, response) => {
  const userID = request.userID
  const assessmentID = request.params.assessmentID
  try {
    const questionServer = await ExamServerSingleton.getInstance(userID, assessmentID);
    return response.status(200).send(middleware.generateApiOutput("OK", questionServer.getRemainingQuestions()))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router