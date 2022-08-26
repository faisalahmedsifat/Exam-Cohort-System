// @ts-nocheck
// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Other Controllers
const DatabaseController = require('./DatabaseController')
const ExamCohortController = require('./ExamCohortController')
const ValidationController = require('./ValidationController')

class AssignedCohortController {
  static async getAllExamCohort(userID) {
    const userInstance = await DatabaseController.getUserFromUserID(userID)
    const cohorts = await DatabaseController.getAssignedCohortListFromUserInstance(userInstance)
    const cohortWithStats = ExamCohortController.loadCohortStats(cohorts)
    return cohortWithStats
  }
  static async getSingleAssignedCohortDetails(cohortID) {
    const cohortInstance = await DatabaseController.getCohortFromCohortID(cohortID)
    const cohortStats = await ExamCohortController.loadCohortStat(cohortInstance);
    return cohortStats
  }
  static async getAllAssignedAssessment(cohortID) {
    return ExamCohortController.getAllAssessmentFromExamCohort(cohortID)
  }

  static async processSingleMCQQuestionForNoCorAnsOutputPresentation(question, transactionRef = null) {
    let questionData = DatabaseController.getDataAttributesFromInstance(question, transactionRef)
    let mcqQuestionInstance = await DatabaseController.getMCQQuestionFromQuestionID(questionData.mcqquestionID, transactionRef)
    let mcqQuestionOptions = await DatabaseController.getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionInstance, transactionRef, true)
    mcqQuestionOptions = DatabaseController.getDataAttributesFromInstance(mcqQuestionOptions)
    
    mcqQuestionOptions = mcqQuestionOptions.map(option => {
      return {mcqOptionText: option.mcqOptionText, mcqOptionID: option.id, isSelectedInAnswer: false}
    })
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


  static async processSingleMCQQuestionWithCorAnsOutputPresentation(question, transactionRef = null) {
    let questionData = DatabaseController.getDataAttributesFromInstance(question, transactionRef)
    let mcqQuestionInstance = await DatabaseController.getMCQQuestionFromQuestionID(questionData.mcqquestionID, transactionRef)
    let mcqQuestionOptions = await DatabaseController.getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionInstance, transactionRef, true)
    mcqQuestionOptions = DatabaseController.getDataAttributesFromInstance(mcqQuestionOptions)
    mcqQuestionOptions = mcqQuestionOptions.map(option => {
      return {mcqOptionText: option.mcqOptionText, mcqOptionID: option.id, isSelectedInAnswer: false, isMcqOptionCor: option.isMcqOptionCor}
    })
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

  static async processSingleMicroVivaQuestionForNoCorAnsOutputPresentation(question, transactionRef = null) {
    let questionData = DatabaseController.getDataAttributesFromInstance(question)
    let microVivaQuestionInstance = await DatabaseController.getMicroVivaQuestionFromQuestionID(questionData.microvivaquestionID, transactionRef)
    let microVivaQuestionData = DatabaseController.getDataAttributesFromInstance(microVivaQuestionInstance)
    let final = {
      questionID: questionData.questionID,
      type: questionData.type,
      marks: questionData.marks,
      timeLimit: questionData.timeLimit,
      microVivaQuestionDetails: {
        micQuesAudioID: microVivaQuestionData.micQuesAudioID
      }
    }
    return final;
  }

  static async processSingleMicroVivaQuestionWithCorAnsOutputPresentation(question, transactionRef = null) {
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
        micCorAudioID: microVivaQuestionData.micCorAudioID
      }
    }
    return final;
  }

  static async getQuestionsOfAssessmentWithoutCorAns(assessmentID) {
    const assessment = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    const questions = await DatabaseController.getQuestionsFromAssessment(assessment)
    let output = []
    for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
      if (questions[questionIndex].type === "MCQ") {
        let mcqQuestion = await AssignedCohortController.processSingleMCQQuestionForNoCorAnsOutputPresentation(questions[questionIndex])
        output.push(mcqQuestion)
      } else if (questions[questionIndex].type === "MICROVIVA") {
        let microVivaQuestion = await AssignedCohortController.processSingleMicroVivaQuestionForNoCorAnsOutputPresentation(questions[questionIndex])
        output.push(microVivaQuestion)
      }
    }
    return output
  }
}

module.exports = AssignedCohortController