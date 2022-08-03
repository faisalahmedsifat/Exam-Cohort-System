// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

// Helper Functions
let asyncMap = async (object, callback) => await Promise.all(object.map(async elem => await callback(elem)))


class DatabaseController {

  static async createUser(userDetails, transactionRef = null) {
    if (transactionRef == null) return await Models.User.create({ firstName: userDetails.firstName, lastName: userDetails.lastName, emailID: userDetails.emailID })
    else return await Models.User.create({ firstName: userDetails.firstName, lastName: userDetails.lastName, emailID: userDetails.emailID }, { transaction: transactionRef })
  }

  static async createTransaction() {
    return await Models.sequelize.transaction();
  }

  static async transactionRollback(transactionRef) {
    return await transactionRef.rollback()
  }

  static getDataAttributesFromInstance(instance) {
    const jsonString = JSON.stringify(instance);
    return JSON.parse(jsonString);
  }

  static async getUserFromUserID(userID, transactionRef = null) {
    if (transactionRef == null) return await Models.User.findByPk(userID);
    else return await Models.User.findByPk(userID, { transaction: transactionRef });
  }

  static async getUserFromEmailID(emailID, transactionRef = null) {
    if (transactionRef == null) return await Models.User.findOne({ where: { emailID: emailID } });
    else return await Models.User.findOne({ where: { emailID: emailID } }, { transaction: transactionRef });
  }

  // TODO: Refactor every Sequelize Code into this Controller
  static async getCohortFromCohortID(cohortID, transactionRef = null) {
    if (transactionRef == null)
      return await Models.ExamCohort.findByPk(cohortID)
    else
      return await Models.ExamCohort.findByPk(cohortID, { transaction: transactionRef })

  }

  static async getAssessmentCountFromCohort(cohort, transactionRef = null) {
    if (transactionRef == null) return await cohort.countCandidate()
    else return await cohort.countCandidate({ transaction: transactionRef })
  }

  static async getExamCohortsFromUser(user, transactionRef = null) {
    if (transactionRef == null) return await user.getEvaluatorcohorts()
    else return await user.getEvaluatorcohorts({ transaction: transactionRef })
  }

  static async getExamCohortFromCohortIDAndUserID(userID, cohortID, transactionRef = null) {
    if (transactionRef == null) return await Models.ExamCohort.findOne({ where: { cohortID: cohortID, evaluatorID: userID } })
    else return await Models.ExamCohort.findOne({ where: { cohortID: cohortID, evaluatorID: userID } }, { transaction: transactionRef })
  }

  static async createExamCohortFromUser(user, name, transactionRef = null) {
    if (transactionRef == null) return await user.createEvaluatorcohort({ name: name })
    else return await user.createEvaluatorcohort({ name: name }, { transaction: transactionRef })
  }

  static async addCandidateToCohort(cohort, user, transactionRef = null) {
    if (transactionRef == null) await cohort.addCandidate(user)
    else await cohort.addCandidate(user, { transaction: transactionRef })
  }

  static async getAllCandidatesFromCohort(cohort, transactionRef = null) {
    if (transactionRef == null) {
      return await cohort.getCandidate({
        attributes: { exclude: ['createdAt', "updatedAt"] },
        joinTableAttributes: ['id']
      })
    } else {
      return await cohort.getCandidate({
        attributes: { exclude: ['createdAt', "updatedAt"] },
        joinTableAttributes: ['id']
      }, { transaction: transactionRef })
    }
  }

  static async createAssessmentFromCohort(cohort, name, availableDateTime, dueDateTime, transactionRef = null) {
    if (transactionRef == null) return await cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime })
    else return await cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime }, { transaction: transactionRef })
  }

  static async getAllAssessmentFromCohort(cohort, transactionRef = null) {
    if (transactionRef == null) return await cohort.getAssessment()
    else return await cohort.getAssessment({ transaction: transactionRef })
  }

  static async getAssessmentFromAssessmentID(assessmentID, transactionRef = null) {
    if (transactionRef == null) return await Models.Assessment.findByPk(assessmentID)
    else return await Models.Assessment.findByPk(assessmentID, { transaction: transactionRef })
  }

  static async addQuestionToAssessment(assessment, selectedQuestion, transactionRef = null) {
    if (transactionRef == null) return await assessment.createQuestion(selectedQuestion)
    else return await assessment.createQuestion(selectedQuestion, { transaction: transactionRef })
  }

  static async addMcqQuestionFromQuestionDetails(question, mcqDetails, transactionRef = null) {
    if (transactionRef == null) return await question.createMcqquestion(mcqDetails)
    else return await question.createMcqquestion(mcqDetails, { transaction: transactionRef })
  }

  static async addMicroVivaQuestionFromQuestionDetails(question, microvivaDetails, transactionRef = null) {
    if (transactionRef == null) return await question.createMicrovivaquestion(microvivaDetails);
    else return await question.createMicrovivaquestion(microvivaDetails, { transaction: transactionRef });
  }

  static async createSingleOptionFromDetails(mcqquestion, mcqOption, transactionRef = null) {
    if (transactionRef == null) return await mcqquestion.createMcqoption(mcqOption)
    else return await mcqquestion.createMcqoption(mcqOption, { transaction: transactionRef })
  }

  static async getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionDetails, transactionRef = null) {
    if (transactionRef == null) {
      return await mcqQuestionDetails.getMcqoptions({
        attributes: { exclude: ['id', 'createdAt', "updatedAt", 'mcqquestionID'] },
      });
    } else {
      return await mcqQuestionDetails.getMcqoptions({
        attributes: { exclude: ['id', 'createdAt', "updatedAt", 'mcqquestionID'] },
      }, { transaction: transactionRef });
    }
  }

  static async createMcqOptionsFromQuestionDetails(mcqquestion, mcqOptions, transactionRef = null) {
    return await asyncMap(mcqOptions, async mcqOption => await DatabaseController.createSingleOptionFromDetails(mcqquestion, mcqOption, transactionRef))
  }

  static async getQuestionsFromAssessment(assessment, transactionRef = null) {
    if (transactionRef == null) {
      return await assessment.getQuestion({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
      })
    } else {
      return await assessment.getQuestion({
        attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
      }, { transaction: transactionRef })
    }
  }

  static async deleteCandidateFromCohort(cohortID, candidateID, transactionRef = null) {
    if (transactionRef == null) return await Models.Candidatelist.destroy({ where: { cohortID, id: candidateID } })
    else return await Models.Candidatelist.destroy({ where: { cohortID, id: candidateID } }, { transaction: transactionRef })
  }

  static async getQuestionFromQuestionID(questionID, transactionRef = null) {
    if (transactionRef == null) return await Models.Question.findByPk(questionID)
    else return await Models.Question.findByPk(questionID, { transaction: transactionRef })
  }

  static async getMCQQuestionFromQuestionID(questionID, transactionRef = null) {
    if (transactionRef == null) return await Models.Mcqquestion.findByPk(questionID)
    else return await Models.Mcqquestion.findByPk(questionID, { transaction: transactionRef })
  }

  static async getMicroVivaQuestionFromQuestionID(questionID, transactionRef = null) {
    if (transactionRef == null) return await Models.Microvivaquestion.findByPk(questionID)
    else return await Models.Microvivaquestion.findByPk(questionID, { transaction: transactionRef })
  }

  static async getCohortsSingleCandidateInfoFromEmail(cohortInstance, candidateEmailID, transactionRef = null) {
    if (transactionRef == null) {
      return await cohortInstance.getCandidate({
        limit: 1,
        where: { emailID: candidateEmailID },
        attributes: { exclude: ['createdAt', "updatedAt"] },
        joinTableAttributes: ['id'],
      })
    } else {
      return await cohortInstance.getCandidate({
        limit: 1,
        where: { emailID: candidateEmailID },
        attributes: { exclude: ['createdAt', "updatedAt"] },
        joinTableAttributes: ['id'],
      }, { transaction: transactionRef })
    }
  }

  static async deleteAssessmentFromCohort(cohortID, assessmentID, transactionRef = null) {
    if (transactionRef == null) return await Models.Assessment.destroy({ where: { cohortID, assessmentID } })
    else return await Models.Assessment.destroy({ where: { cohortID, assessmentID } }, { transaction: transactionRef })
  }

  static async getAssessmentFromAssessmentID(assessmentID, transactionRef = null) {
    if (transactionRef == null) return await Models.Assessment.findByPk(assessmentID)
    else return await Models.Assessment.findByPk(assessmentID, { transaction: transactionRef })
  }

  static async deleteQuestionFromAssessment(assessmentID, questionID, transactionRef = null) {
    if (transactionRef == null) return await Models.Question.destroy({ where: { assessmentID, questionID } })
    else return await Models.Question.destroy({ where: { assessmentID, questionID } }, { transaction: transactionRef })
  }

  static async getAssessmentAvailableDatetime(assessmentID, transactionRef = null) {
    if (transactionRef == null) return (await Models.Assessment.findByPk(assessmentID)).availableDateTime
    else return (await Models.Assessment.findByPk(assessmentID, { transaction: transactionRef })).availableDateTime
  }

  static async getAssessmentDueDatetime(assessmentID, transactionRef = null) {
    if (transactionRef == null) return (await Models.Assessment.findByPk(assessmentID)).dueDateTime
    else return (await Models.Assessment.findByPk(assessmentID, { transaction: transactionRef })).dueDateTime
  }

  static async getAssessmentAllocatedMinutes(assessmentID, transactionRef = null) {
    let questionOfAssessment
    if (transactionRef == null) questionOfAssessment = await Models.Question.findAll({ where: { assessmentID } })
    else questionOfAssessment = await Models.Question.findAll({ where: { assessmentID } }, { transaction: transactionRef })
    if (questionOfAssessment.length === 0) return 0
    let allocatedMinutes
    if (transactionRef == null) allocatedMinutes = (await Models.Question.findAll({ where: { assessmentID: assessmentID }, attributes: [[Models.Sequelize.fn('sum', Models.Sequelize.col('timeLimit')), 'usedTimeLimit'],], group: ['assessmentID'] }))[0]
    else allocatedMinutes = (await Models.Question.findAll({ where: { assessmentID: assessmentID }, attributes: [[Models.Sequelize.fn('sum', Models.Sequelize.col('timeLimit')), 'usedTimeLimit'],], group: ['assessmentID'] }, { transaction: transactionRef }))[0]
    return allocatedMinutes.dataValues.usedTimeLimit
  }

  static async createMcqAnswer() {
    return await Models.Mcqanswer.create()
  }
  static async addMcqOptionSelectedFromArray(selectedOptions) {
    return await Models.Mcqoptionselected.bulkCreate(selectedOptions)
  }
  static async findCandidateFromCandidateList(candidateID, cohortID) {
    return await Models.Candidatelist.findOne({ where: { cohortID: cohortID, candidateID: candidateID } })
  }
  static async createAnswerFromMcqAnswerAndResponse(candidateResponseAnswer) {
    return await Models.Answer.create(candidateResponseAnswer)
  }

  static async findAnswerFromCandidateID(candidateID, questionID) {
    return await Models.Answer.findOne({ where: { candidateID: candidateID, questionID : questionID} })
  }
}

module.exports = DatabaseController