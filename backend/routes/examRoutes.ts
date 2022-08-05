// @ts-nocheck

const Sequelize = require('sequelize')
const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const RoleBarrier = require('../controllers/RoleBarrier')
const DatabaseController = require('../controllers/DatabaseController')
const ExamCohortController = require('../controllers/ExamCohortController')
import { ExamServerFactory } from "../controllers/ExamServerFactory"

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
    const questionServer = await ExamServerFactory.getServer(userID, assessmentID);
    const question = await questionServer.getNextQuestion()
    return response.status(200).send(middleware.generateApiOutput("OK", question))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

// Submit A Question's Answer
router.post('/:assessmentID/submit_single', middleware.authBarrier, async (request, response) => {
  const userID = request.userID
  const assessmentID = request.params.assessmentID
  const body = request.body   
  try {
    const questionServer = await ExamServerFactory.getServer(userID, assessmentID);
    await questionServer.answerQuestion(body);
    // await ExamCohortController.addMicroVivaAnswerToQuestion(body)
    return response.status(200).send(middleware.generateApiOutput("OK", "OK"))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router