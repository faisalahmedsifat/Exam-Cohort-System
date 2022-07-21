// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Other Controllers
const DatabaseController = require('./DatabaseController')
const DateTimeController = require('./DateTimeController')

//Models
const { User, ExamCohort, Assessment, Mcqquestion } = require('../models')

// Helper Functions
let asyncMap = async (object, callback) => await Promise.all(object.map(async elem => await callback(elem)))

class ExamCohortController {

  static async getCohortFromCohortID(cohortID){
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID);
    return cohort
  }

  static async getCohortNumOfAssessment(cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID);
    const count = await cohort.countAssessment()
    return count;
  }
  static async getCohortNumOfCandidate(cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID);
    const count = await DatabaseController.getAssessmentCountFromCohort(cohort)
    return count;
  }

  // Single Instance Stats Loader
  static async loadCohortStat(cohortInstance) {
    const cohortData = DatabaseController.getDataAttributesFromInstance(cohortInstance)
    cohortData.numOfAssessments = await ExamCohortController.getCohortNumOfAssessment(cohortData.cohortID)
    cohortData.numOfCandidates = await ExamCohortController.getCohortNumOfCandidate(cohortData.cohortID)
    return cohortData
  }
  // Multiple Instance Stats Loader
  static async loadCohortStats(cohortInstances) {
    const cohortDataListExtra = await asyncMap(cohortInstances, async cohortInstance => await ExamCohortController.loadCohortStat(cohortInstance))
    return cohortDataListExtra
  }
  static async getAllExamCohort(userID) {
    const user = await DatabaseController.getUserFromUserID(userID)
    let cohorts = await DatabaseController.getExamCohortsFromUser(user)
    let cohortWithStats = await ExamCohortController.loadCohortStats(cohorts)
    return cohortWithStats
  }

  static async getExamCohortDetails(userID, cohortID) {
    try {
      const cohort = await DatabaseController.getExamCohortFromCohortIDAndUserID(userID, cohortID)
      if (cohort != null) {
        let cohortWithStats = await ExamCohortController.loadCohortStat(cohort)
        return cohortWithStats;
      } else throw Error('Cohort Not Found!')
    } catch (error) {
      throw Error('Cohort Not Found!')
    }
  }

  static async createExamCohort(userID, name) {
    const user = await DatabaseController.getUserFromUserID(userID)
    const cohort = await DatabaseController.createExamCohortFromUser(user, name)
    return await ExamCohortController.loadCohortStat(cohort)
  }
  static async addCandidatesToExamCohort(emailID, cohortID) {
    let user = await DatabaseController.getUserFromEmailID(emailID)
    if(!user) throw Error("No Such User Exists!")
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
    await DatabaseController.addCandidateToCohort(cohort, user)
    user = await DatabaseController.getCohortsSingleCandidateInfoFromEmail(cohort, emailID) 
    user = DatabaseController.getDataAttributesFromInstance(user)[0]
    user.id = user.Candidatelist.id 
    delete user.Candidatelist 
    return user
  }
  static async getAllCandidatesFromExamCohort(cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
    let candidates = await DatabaseController.getAllCandidatesFromCohort(cohort)
    candidates = DatabaseController.getDataAttributesFromInstance(candidates);
    for (let candidate of candidates) {
      candidate.id = candidate.Candidatelist.id 
      delete candidate.Candidatelist 
    }
    return candidates
  }

  static async addAssessmentToExamCohort(cohortID, name, availableDateTime, dueDateTime) {
    if(DateTimeController.isDateTimeValid(availableDateTime, dueDateTime)) {
      const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
      const assessment = await DatabaseController.createAssessmentFromCohort(cohort, name, availableDateTime, dueDateTime)
      return assessment
    } throw {error: ('Invalid date and time!')}
    
  }
  static async getAllAssessmentFromExamCohort(cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
    const assessments = await DatabaseController.getAllAssessmentFromCohort(cohort)
    return assessments
  }

  static questionIsMCQ(type) {
    return type === 'MCQ'
  }
  static questionTypeIsValid(type) {
    return type === 'MCQ' || type === 'MICROVIVA'
  }

  static async addMcqQuestionToAssessment(selectedQuestion, assessment) {
    const question = await DatabaseController.addQuestionToAssessment(assessment, selectedQuestion)
    const mcqquestion = await DatabaseController.addMcqQuestionFromQuestionDetails(question, selectedQuestion.details)
  }

  static async addQuestionsToAssessment(questions, assessmentID) {
    let output = []
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const selectedQuestion = questions[questionIndex]
      const { type } = selectedQuestion
      if (type === 'MCQ') {
        await ExamCohortController.addMcqQuestionToAssessment(selectedQuestion, assessment)
        output.push(selectedQuestion)
      }
    }
    return output
  }

  static deleteCreatedAndUpdatedAtFromJsonDataValues(data) {
    if (data.createdAt !== null && data.updatedAt !== null) {
      delete data.createdAt
      delete data.updatedAt
    }
    return data
  }

  static async getQuestionsFromAssessment(assessmentID) {
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    const questions = await DatabaseController.getQuestionsFromAssessment(assessment)
    let output = []
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {

      let question = questions[questionIndex]
      question = question.dataValues
      question = ExamCohortController.deleteCreatedAndUpdatedAtFromJsonDataValues(question)
      delete question.questionID
      delete question.assessmentID
      delete question.microvivaquestionID

      let mcqQuestionDetails = await Mcqquestion.findByPk(question.mcqquestionID)
      mcqQuestionDetails = mcqQuestionDetails.dataValues
      mcqQuestionDetails = ExamCohortController.deleteCreatedAndUpdatedAtFromJsonDataValues(mcqQuestionDetails)
      const mcqQuestion = { ...question, mcqQuestionDetails }
      output.push(mcqQuestion)
    }
    return output
  }

  static async deleteCandidateFromCohort(cohortID, candidateID){
    await DatabaseController.deleteCandidateFromCohort(cohortID, candidateID)
  }
}
module.exports = ExamCohortController