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

  static async getCohortFromCohortID(cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID);
    return cohort
  }

  static async getAssessmentNumOfQuestion(assessmentID) {
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    const count = await assessment.countQuestion()
    return count
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
  static async loadAssessmentStat(assessmentInstance) {
    const assessmentData = DatabaseController.getDataAttributesFromInstance(assessmentInstance);
    assessmentData.numOfQuestions = await ExamCohortController.getAssessmentNumOfQuestion(assessmentData.assessmentID)
    return assessmentData
  }

  static async loadAssessmentStats(assessmentInstances) {
    return await asyncMap(assessmentInstances, async assessmentInstance => await ExamCohortController.loadAssessmentStat(assessmentInstance))
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
    if (!user) throw Error("No Such User Exists!")
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
    if (!name) throw Error('You must provide a name for the assessment!')
    if (DateTimeController.isAvailableAndDueDateTimeValid(availableDateTime, dueDateTime)) {
      const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
      const assessment = await DatabaseController.createAssessmentFromCohort(cohort, name, availableDateTime, dueDateTime)
      return assessment
    } throw Error('Invalid date and time!')

  }
  static async getAllAssessmentFromExamCohort(cohortID) {
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
    const assessments = await DatabaseController.getAllAssessmentFromCohort(cohort)
    let assessmentsWithStats = await ExamCohortController.loadAssessmentStats(assessments)
    return assessmentsWithStats
  }

  static questionIsMCQ(type) {
    return type === 'MCQ'
  }
  static questionTypeIsValid(type) {
    return type === 'MCQ' || type === 'MICROVIVA'
  }

  static async addMcqQuestionToAssessment(selectedQuestion, assessment) {
    const question = await DatabaseController.addQuestionToAssessment(assessment, selectedQuestion)
    await DatabaseController.addMcqQuestionFromQuestionDetails(question, selectedQuestion.details)
    const questionInstance = await DatabaseController.getQuestionFromQuestionID(question.questionID)
    console.log(selectedQuestion);
    console.log(question);
    console.log(questionInstance);
    let presentableData = await ExamCohortController.processSingleMCQQuestionForOutputPresentation(questionInstance)
    return presentableData
  }

  static async addQuestionsToAssessment(questions, assessmentID) {
    let output = []
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const selectedQuestion = questions[questionIndex]
      const { type } = selectedQuestion
      if (type === 'MCQ') {
        const mcqQuesData = await ExamCohortController.addMcqQuestionToAssessment(selectedQuestion, assessment)
        output.push(DatabaseController.getDataAttributesFromInstance(mcqQuesData))
      }
    }
    return output
  }

  static deleteCreatedAndUpdatedAtFromJsonDataValues(data) {
    delete data?.createdAt
    delete data?.updatedAt
    return data
  }

  static async processSingleMCQQuestionForOutputPresentation(question) {
    let questionData = DatabaseController.getDataAttributesFromInstance(question)
    questionData = ExamCohortController.deleteCreatedAndUpdatedAtFromJsonDataValues(question)
    delete questionData.assessmentID
    delete questionData.microvivaquestionID

    let mcqQuestionDetails = await DatabaseController.getMCQQuestionFromQuestionID(questionData.mcqquestionID)
    mcqQuestionDetails = DatabaseController.getDataAttributesFromInstance(mcqQuestionDetails)
    mcqQuestionDetails = ExamCohortController.deleteCreatedAndUpdatedAtFromJsonDataValues(mcqQuestionDetails)
    let mcqQuestion = { ...questionData, mcqQuestionDetails }
    delete question.mcqquestionID
    let finalData = {...mcqQuestion.dataValues, mcqQuestionDetails }
    return finalData
  }

  static async getQuestionsFromAssessment(assessmentID) {
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    const questions = await DatabaseController.getQuestionsFromAssessment(assessment)
    let output = []
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      let mcqQuestion = await ExamCohortController.processSingleMCQQuestionForOutputPresentation(questions[questionIndex])
      output.push(DatabaseController.getDataAttributesFromInstance(mcqQuestion))
    }
    return output
  }

  static async deleteCandidateFromCohort(cohortID, candidateID) {
    await DatabaseController.deleteCandidateFromCohort(cohortID, candidateID)
  }

  static async deleteAssessmentFromCohort(cohortID, assessmentID) {
    await DatabaseController.deleteAssessmentFromCohort(cohortID, assessmentID)
  }

  static async getSingleAssessmentDetails(assessmentID) {
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID);
    return await ExamCohortController.loadAssessmentStat(assessment)
  }

  static async deleteQuestionFromAssessment(assessmentID, questionID) {
    await DatabaseController.deleteQuestionFromAssessment(assessmentID, questionID)
  }
}
module.exports = ExamCohortController