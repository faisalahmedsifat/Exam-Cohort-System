// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Other Controllers
const DatabaseController = require('./DatabaseController')

class RoleBarrier {
  static async checkIfUserIsEvaluatorOfCohort(userID, cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID);
    return cohort.evaluatorID === userID
  }

  static async checkIfUserIsCandidateOfCohort(userID, cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID);
    const candidates = await DatabaseController.getAllCandidatesFromCohort(cohort);
    const isCandidate = candidates.some(candidate => candidate.userID === userID);
    return isCandidate
  }

  // Only allows to the cohort routes if user is an evaluator of that cohort
  static async cohortsEvaluatorRoleBarrier(request, response, next) {
    try {
      const userID = request.userID
      const cohortID = request.params.id
      const isEvaluator = await RoleBarrier.checkIfUserIsEvaluatorOfCohort(userID, cohortID);
      if (isEvaluator) next()
      else throw Error("User does not have evaluator rights!");
    } catch (error) {
      return response.status(400).json(middleware.generateApiOutput("FAILED", { error: error.message }))
    }
  }

  // Only allows to the cohort routes if user is a candidate of that cohort
  static async cohortsCandidateRoleBarrier(request, response, next) {
    try {
      const userID = request.userID
      const cohortID = request.params.id
      const isCandidate = await RoleBarrier.checkIfUserIsCandidateOfCohort(userID, cohortID);
      if (isCandidate) next()
      else throw Error("User does not have rights! Candidate rights are required!");
    } catch (error) {
      return response.status(400).json(middleware.generateApiOutput("FAILED", { error: error.message }))
    }
  }
}
module.exports = RoleBarrier