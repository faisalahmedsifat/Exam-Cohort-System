// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

// Helper Functions
let asyncMap = async (object, callback) => await Promise.all(object.map(async elem => await callback(elem)))


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

  static async createSingleOptionFromDetails(mcqquestion, mcqOption){
    return await mcqquestion.createMcqoption(mcqOption)
  }

  static async getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionDetails){
    return await mcqQuestionDetails.getMcqoptions({
      attributes: { exclude: ['id','createdAt', "updatedAt",'mcqquestionID'] },
    });
  }

  static async createMcqOptionsFromQuestionDetails(mcqquestion, mcqOptions){
    return await asyncMap(mcqOptions, async mcqOption => await DatabaseController.createSingleOptionFromDetails(mcqquestion, mcqOption))
  }

  static async getQuestionsFromAssessment(assessment) {
    return await assessment.getQuestion({
      attributes: { exclude: ['id','createdAt', 'updatedAt'] },
    })
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

  static async getAssessmentAvailableDatetime(assessmentID){
    return (await Models.Assessment.findByPk(assessmentID)).availableDateTime
  }

  static async getAssessmentDueDatetime(assessmentID){
    return (await Models.Assessment.findByPk(assessmentID)).dueDateTime
  }

  static async getAssessmentAllocatedMinutes(assessmentID){
    const questionOfAssessment = await Models.Question.findAll({where:{assessmentID}})
    if(questionOfAssessment.length === 0){
      return 0;
    }
    let allocatedMinutes = (await Models.Question.findAll({
      where: {
        assessmentID: assessmentID
      },
      attributes: [
        [Models.Sequelize.fn('sum', Models.Sequelize.col('timeLimit')), 'usedTimeLimit'],
      ],
      group: ['assessmentID']
    }))[0]    
    return allocatedMinutes.dataValues.usedTimeLimit
  }
}

module.exports = DatabaseController