// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Other Controllers
const DatabaseController = require('./DatabaseController')
const ValidationController = require('./ValidationController')

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
    ValidationController.validateCreateExamCohortInput({ userID, name })
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
    ValidationController.validateAddAssessmentInput({ cohortID, name, availableDateTime, dueDateTime })
    const cohort = await DatabaseController.getCohortFromCohortID(cohortID)
    const assessment = await DatabaseController.createAssessmentFromCohort(cohort, name, availableDateTime, dueDateTime)
    return assessment
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

  static async addMcqQuestionToAssessment(selectedQuestion, assessment, transactionRef = null) {
    const question = await DatabaseController.addQuestionToAssessment(assessment, selectedQuestion, transactionRef)
    const mcqquestion = await DatabaseController.addMcqQuestionFromQuestionDetails(question, selectedQuestion.details, transactionRef)
    await DatabaseController.createMcqOptionsFromQuestionDetails(mcqquestion, selectedQuestion.details.mcqOptions, transactionRef)
    const questionInstance = await DatabaseController.getQuestionFromQuestionID(question.questionID, transactionRef)
    let presentableData = await ExamCohortController.processSingleMCQQuestionForOutputPresentation(questionInstance, transactionRef)
    return presentableData
  }

  static async addMicroVivaQuestionToAssessment(selectedQuestion, assessment, transactionRef = null) {
    const question = await DatabaseController.addQuestionToAssessment(assessment, selectedQuestion, transactionRef)
    await DatabaseController.addMicroVivaQuestionFromQuestionDetails(question, selectedQuestion.details, transactionRef)
    let presentableData = await ExamCohortController.processSingleMicroVivaQuestionForOutputPresentation(question, transactionRef)
    return presentableData
  }

  static async addQuestionsToAssessment(questions, assessmentID, transactionRef = null) {
    let maxMinuteRemainsOfThisAssessment = await DatabaseController.getAssessmentAllocatedMinutes(assessmentID)
    let availableDatetime = await DatabaseController.getAssessmentAvailableDatetime(assessmentID)
    let dueDatetime = await DatabaseController.getAssessmentDueDatetime(assessmentID)
    ValidationController.validateAddQuestionInputs(questions, availableDatetime, dueDatetime, maxMinuteRemainsOfThisAssessment)

    let output = []
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      const selectedQuestion = questions[questionIndex]
      const { type } = selectedQuestion
      if (type === 'MCQ') {
        const mcqQuesData = await ExamCohortController.addMcqQuestionToAssessment(selectedQuestion, assessment, transactionRef)
        output.push(DatabaseController.getDataAttributesFromInstance(mcqQuesData))
      } else if (type === "MICROVIVA") {
        const microQuesData = await ExamCohortController.addMicroVivaQuestionToAssessment(selectedQuestion, assessment, transactionRef)
        output.push(DatabaseController.getDataAttributesFromInstance(microQuesData))
      }
    }
    return output
  }

  static deleteCreatedAndUpdatedAtFromJsonDataValues(data) {
    delete data?.createdAt
    delete data?.updatedAt
    return data
  }

  static async processSingleMCQQuestionForOutputPresentation(question, transactionRef = null) {
    let questionData = DatabaseController.getDataAttributesFromInstance(question, transactionRef)
    let mcqQuestionInstance = await DatabaseController.getMCQQuestionFromQuestionID(questionData.mcqquestionID, transactionRef)
    let mcqQuestionOptions = await DatabaseController.getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionInstance, transactionRef)
    mcqQuestionOptions = DatabaseController.getDataAttributesFromInstance(mcqQuestionOptions)
    let final = {
      questionID: questionData.questionID,
      type: questionData.type,
      marks: questionData.marks,
      timeLimit: questionData.timeLimit,
      mcqQuestionDetails: {
        mcqStatement: mcqQuestionInstance.mcqStatement,
        mcqOptions: [...mcqQuestionOptions]
      }
    }
    return final;
  }

  static async processSingleMicroVivaQuestionForOutputPresentation(question, transactionRef = null) {
    let questionData = DatabaseController.getDataAttributesFromInstance(question)
    let microVivaQuestionInstance = await DatabaseController.getMicroVivaQuestionFromQuestionID(questionData.microvivaquestionID, transactionRef)
    let microVivaQuestionData = DatabaseController.getDataAttributesFromInstance(microVivaQuestionInstance)
    let final = {
      questionID: questionData.questionID,
      type: questionData.type,
      marks: questionData.marks,
      timeLimit: questionData.timeLimit,
      microVivaQuestionDetails: {
        micQuesAudioID: microVivaQuestionData.micQuesAudioID,
        micCorAudioID: microVivaQuestionData.micCorAudioID,
        micCorAnsText: microVivaQuestionData.micCorAnsText,
      }
    }
    return final;
  }

  static deleteIsMcqCorFieldFromQuestionDetails(mcqOptions) {
    for (let mcqOption of mcqOptions) {
      delete mcqOption.isMcqOptionCor
    }
  }
  static async getQuestionsFromAssessment(assessmentID, toDeleteCorrectAnswer = false) {
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    const questions = await DatabaseController.getQuestionsFromAssessment(assessment)
    let output = []
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      if (questions[questionIndex].type === "MCQ") {
        let mcqQuestion = await ExamCohortController.processSingleMCQQuestionForOutputPresentation(questions[questionIndex])
        if (toDeleteCorrectAnswer) ExamCohortController.deleteIsMcqCorFieldFromQuestionDetails(mcqQuestion.mcqQuestionDetails.mcqOptions)
        output.push(mcqQuestion)
      } else if (questions[questionIndex].type === "MICROVIVA") {
        let microVivaQuestion = await ExamCohortController.processSingleMicroVivaQuestionForOutputPresentation(questions[questionIndex])
        output.push(microVivaQuestion)
      }
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

  static async addMicroVivaAnswerToQuestion(cohortID, assessmentID, questionID, answer, candidateID) {

    //TODO: add microviva answer to question

  }


  static async addMcqAnswerToQuestion(cohortID, assessmentID, questionID, answer, candidateID) {
    let selectedOptionDetails = answer.details.mcqOptionsSelected
    let selectedOptions = []
    let candidateResponseAnswer = {};

    let correctAnswer = true
    let output = {}
    //CHECK IS CORRECT

    // const mcqOptions = await 
    let question = await DatabaseController.getQuestionFromQuestionID(questionID)
    let mcqQuestionInstance = await DatabaseController.getMCQQuestionFromQuestionID(question.mcqquestionID)
    let mcqQuestionOptions = await DatabaseController.getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionInstance, false, true)

    let mcqQuestionOptionData = DatabaseController.getDataAttributesFromInstance(mcqQuestionOptions)
    for (let optionIndex = 0; optionIndex < mcqQuestionOptionData.length; optionIndex++) {
      if (
        (mcqQuestionOptionData[optionIndex].id === selectedOptionDetails[optionIndex].mcqoptionID)
        && ((mcqQuestionOptionData[optionIndex].isMcqOptionCor === true && selectedOptionDetails[optionIndex].isSelectedInAnswer === 1) ||
          (mcqQuestionOptionData[optionIndex].isMcqOptionCor === false && selectedOptionDetails[optionIndex].isSelectedInAnswer === 0))
      ) {
        correctAnswer = true;
      }
      else {
        correctAnswer = false
        break;
      }

    }


    //CHECK IS CORRECT

    const candidateListID = (await DatabaseController.findCandidateFromCandidateList(candidateID, cohortID))?.id;
    // await ValidationController.validateQuestionIsAlreadyAnsweredByCandidate(candidateListID, questionID)

    let mcqanswerID = (await DatabaseController.createMcqAnswer()).id
    for (let selectedOptionIndex = 0; selectedOptionIndex < selectedOptionDetails.length; selectedOptionIndex++) {
      selectedOptions.push({ ...selectedOptionDetails[selectedOptionIndex], mcqanswerID })
    }
    await DatabaseController.addMcqOptionSelectedFromArray(selectedOptions)


    // candidateResponseAnswer = {
    //   viewedAt: answer.viewedAt,
    //   submittedAt: answer.submittedAt,
    //   type: answer.type,
    //   mcqanswerID: mcqanswerID,
    //   candidateID: candidateListID,
    //   questionID: questionID,
    //   isCorrect: correctAnswer
    // }
    // const candidateResponse = await DatabaseController.createAnswerFromMcqAnswerAndResponse(candidateResponseAnswer)
    // return candidateResponse
    output = {
      correctAnswer, mcqanswerID
    }
    return output
  }

  static async addAnswerToQuestion(cohortID, assessmentID, questionID, answer, candidateID) {
    let type = answer.type

    if (type === "MCQ") {
      return await ExamCohortController.addMcqAnswerToQuestion(cohortID, assessmentID, questionID, answer, candidateID)
    }
    else if (type === "MICROVIVA") {
      return await ExamCohortController.addMicroVivaAnswerToQuestion(cohortID, assessmentID, questionID, answer, candidateID)
    }
  }

}
module.exports = ExamCohortController