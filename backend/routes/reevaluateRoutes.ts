// @ts-nocheck

import { ExamServerFactory } from "../controllers/ExamServerFactory"
import { ReevaluateController } from "../controllers/ReevaluateController"

const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const RoleBarrier = require('../controllers/RoleBarrier')
const DatabaseController = require('../controllers/DatabaseController')

/** 
 * Routes
 * 
 * prefix: /api/examcohort/
 */

// Read
router.get('/:id/assessment/:assessmentID/responses', middleware.authBarrier, RoleBarrier.cohortsEvaluatorRoleBarrier, async (request, response) => {
  const userID = request.userID
  const cohortID = request.params.id
  const assessmentID = request.params.assessmentID
  try {
    const responseLists = await ReevaluateController.getAllResponseList(cohortID, assessmentID)
    return response.send(middleware.generateApiOutput("OK", responseLists));
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

router.get('/:id/assessment/:assessmentID/responses/:candidateID', middleware.authBarrier, RoleBarrier.cohortsEvaluatorRoleBarrier, async (request, response) => {
  const userID = request.userID
  const cohortID = request.params.id
  const assessmentID = request.params.assessmentID
  const candidateID = request.params.candidateID
  try {
    const responses = await ReevaluateController.getCandidateResponses(assessmentID,candidateID)
    return response.send(middleware.generateApiOutput("OK", responses));
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

router.get('/:id/assessment/:assessmentID/responses/:candidateID/answer_mark_correct/:answerID', middleware.authBarrier, RoleBarrier.cohortsEvaluatorRoleBarrier, async (request, response) => {
  const userID = request.userID
  const cohortID = request.params.id
  const assessmentID = request.params.assessmentID
  const candidateID = request.params.candidateID
  const answerID = request.params.answerID

  try {
    await ReevaluateController.markAsCorrect(answerID)
    return response.send(middleware.generateApiOutput("OK", {success: "Successfully Marked as Correct!"}));
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

router.get('/:id/assessment/:assessmentID/responses/:candidateID/answer_mark_incorrect/:answerID', middleware.authBarrier, RoleBarrier.cohortsEvaluatorRoleBarrier, async (request, response) => {
  const userID = request.userID
  const cohortID = request.params.id
  const assessmentID = request.params.assessmentID
  const candidateID = request.params.candidateID
  const answerID = request.params.answerID

  try {    
    await ReevaluateController.markAsIncorrect(answerID)
    return response.send(middleware.generateApiOutput("OK", {success: "Successfully Marked as Incorrect!"}));
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

router.get('/:id/assessment/:assessmentID/responses/:candidateID/reset', middleware.authBarrier, RoleBarrier.cohortsEvaluatorRoleBarrier, async (request, response) => {
  const userID = request.userID
  const cohortID = request.params.id
  const assessmentID = request.params.assessmentID
  const candidateID = request.params.candidateID

  try {    
    await DatabaseController.resetCandidateResponse(assessmentID, candidateID)
    const userIDx = await DatabaseController.getUserIDFromCandidateID(candidateID);
    await ExamServerFactory.resetCandidatesServer(userIDx,assessmentID);
    return response.send(middleware.generateApiOutput("OK", {success: "Reset was successfull!"}));
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})


module.exports = router