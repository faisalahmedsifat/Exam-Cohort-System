// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

class DatabaseController {
  static getDataAttributesFromInstance(instance) {
    return instance.dataValues;
  }

  // TODO: Refactor every Sequelize Code into this Controller
  static async getCohortFromCohortID(cohortID) {
    return await Models.ExamCohort.findByPk(cohortID)
  }

  static async getAssessmentCountFromCohort(cohort){
    return await cohort.countCandidate()
  }

  static async getExamCohortsFromUser(user){
    return await user.getEvaluatorcohorts()
  }

  static async getExamCohortFromCohortIDAndUserID(userID, cohortID){
    return await Models.ExamCohort.findOne({ where: { cohortID: cohortID, evaluatorID: userID } })
  }

  static async createExamCohortFromUser(user, name){
    return await user.createEvaluatorcohort({ name: name })
  }

  static async addCandidateToCohort(cohort, user){
    await cohort.addCandidate(user)
  }

  static async getAllCandidatesFromCohort(cohort){
    return await cohort.getCandidate()
  }

  static async createAssessmentFromCohort(cohort, name, availableDateTime, dueDateTime){
    return await cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime })
  }

  static async getAllAssessmentFromCohort(cohort){
    return await cohort.getAssessment()
  }

  static async getAssessmentFromAssessmentID(assessmentID){
    return await Models.Assessment.findByPk(assessmentID)
  }

  static async addQuestionToAssessment(assessment, selectedQuestion){
    return await assessment.createQuestion(selectedQuestion)
  }

  static async addMcqQuestionFromQuestionDetails(question, mcqDetails){
    return await question.createMcqquestion(mcqDetails)
  }
  static async getQuestionsFromAssessment(assessment){
    return await assessment.getQuestion()
  }
}

module.exports = DatabaseController