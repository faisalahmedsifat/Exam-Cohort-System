// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

class DatabaseController {

  static async createUser(userDetails) {
    return await Models.User.create({ firstName: userDetails.firstName, lastName: userDetails.lastName, emailID: userDetails.emailID })
  }

  static getDataAttributesFromInstance(instance) {
    const jsonString = JSON.stringify(instance);
    return JSON.parse(jsonString);
  }

  static async getUserFromUserID(userID) {
    return await Models.User.findByPk(userID);
  }

  static async getUserFromEmailID(emailID) {
    return await Models.User.findOne({ where: { emailID: emailID } });
  }

  // TODO: Refactor every Sequelize Code into this Controller
  static async getCohortFromCohortID(cohortID) {
    return await Models.ExamCohort.findByPk(cohortID)
  }

  static async getAssessmentCountFromCohort(cohort) {
    return await cohort.countCandidate()
  }

  static async getExamCohortsFromUser(user) {
    return await user.getEvaluatorcohorts()
  }

  static async getExamCohortFromCohortIDAndUserID(userID, cohortID) {
    return await Models.ExamCohort.findOne({ where: { cohortID: cohortID, evaluatorID: userID } })
  }

  static async createExamCohortFromUser(user, name) {
    return await user.createEvaluatorcohort({ name: name })
  }

  static async addCandidateToCohort(cohort, user) {
    await cohort.addCandidate(user)
  }

  static async getAllCandidatesFromCohort(cohort) {
    return await cohort.getCandidate({
      attributes: { exclude: ['createdAt', "updatedAt"] },
      joinTableAttributes: ['id']
    })
  }

  static async createAssessmentFromCohort(cohort, name, availableDateTime, dueDateTime) {
    return await cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime })
  }

  static async getAllAssessmentFromCohort(cohort) {
    return await cohort.getAssessment()
  }

  static async getAssessmentFromAssessmentID(assessmentID) {
    return await Models.Assessment.findByPk(assessmentID)
  }

  static async addQuestionToAssessment(assessment, selectedQuestion) {
    return await assessment.createQuestion(selectedQuestion)
  }

  static async addMcqQuestionFromQuestionDetails(question, mcqDetails) {
    return await question.createMcqquestion(mcqDetails)
  }
  static async getQuestionsFromAssessment(assessment) {
    return await assessment.getQuestion()
  }

  static async deleteCandidateFromCohort(cohortID, candidateID) {
    return await Models.Candidatelist.destroy({ where: { cohortID, id: candidateID } })
  }

  static async getQuestionFromQuestionID(questionID) {
    return await Models.Question.findByPk(questionID)
  }

  static async getMCQQuestionFromQuestionID(questionID) {
    return await Models.Mcqquestion.findByPk(questionID)
  }

  static async getCohortsSingleCandidateInfoFromEmail(cohortInstance, candidateEmailID) {
    return await cohortInstance.getCandidate({
      limit: 1,
      where: { emailID: candidateEmailID },
      attributes: { exclude: ['createdAt', "updatedAt"] },
      joinTableAttributes: ['id'],
    })
  }

  static async deleteAssessmentFromCohort(cohortID, assessmentID) {
    return await Models.Assessment.destroy({ where: { cohortID, assessmentID } })
  }

  static async getAssessmentFromAssessmentID(assessmentID) {
    return await Models.Assessment.findByPk(assessmentID)
  }

  static async deleteQuestionFromAssessment(assessmentID, questionID) {
    return await Models.Question.destroy({ where: { assessmentID, questionID } })
  }
}

module.exports = DatabaseController