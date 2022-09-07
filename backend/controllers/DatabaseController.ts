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
  static async addMicroVivaAnswerFromQuestion(micAnsAudioID) {
    return await Models.Microvivaanswer.create({ micAnsAudioID: micAnsAudioID })
  }

  static async createSingleOptionFromDetails(mcqquestion, mcqOption, transactionRef = null) {
    if (transactionRef == null) return await mcqquestion.createMcqoption(mcqOption)
    else return await mcqquestion.createMcqoption(mcqOption, { transaction: transactionRef })
  }

  static async getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionDetails, transactionRef = null, idIsRequired = false) {
    if (transactionRef == null) {
      if (idIsRequired) {
        return await mcqQuestionDetails.getMcqoptions({
          attributes: { exclude: ['createdAt', "updatedAt", 'mcqquestionID'] },
        });
      } else {
        return await mcqQuestionDetails.getMcqoptions({
          attributes: { exclude: ['id', 'createdAt', "updatedAt", 'mcqquestionID'] },
        });
      }

    } else {
      if (idIsRequired) {
        return await mcqQuestionDetails.getMcqoptions({
          attributes: { exclude: ['createdAt', "updatedAt", 'mcqquestionID'] },
        }, { transaction: transactionRef });
      } else {
        return await mcqQuestionDetails.getMcqoptions({
          attributes: { exclude: ['id', 'createdAt', "updatedAt", 'mcqquestionID'] },
        }, { transaction: transactionRef });
      }
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
    if (transactionRef == null) {
      return await Models.Candidatelist.destroy({ where: { cohortID, id: candidateID } })
    } else {
      return await Models.Candidatelist.destroy({ where: { cohortID, id: candidateID } }, { transaction: transactionRef })
    }
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

  static async findCandidateFromCandidateList(userID, cohortID) {
    return await Models.Candidatelist.findOne({ where: { cohortID: cohortID, candidateID: userID } })
  }

  /**
   * 
   * 
   */
  static async createMcqAnswer() {
    return await Models.Mcqanswer.create()
  }
  static async addMcqOptionSelectedFromArray(selectedOptions) {
    return await Models.Mcqoptionselected.bulkCreate(selectedOptions)
  }

  static async createAnswerFromMcqAnswerAndResponse(candidateResponseAnswer) {
    return await Models.Answer.create(candidateResponseAnswer)
  }
  static async findAnswerFromCandidateID(candidateID, questionID) {
    return await Models.Answer.findOne({ where: { candidateID: candidateID, questionID: questionID } })
  }
  /**
   * 
   * 
   */

  static async getAssignedCohortListFromUserInstance(userInstance) {
    return await userInstance.getAssignedcohort({
      joinTableAttributes: ['id']
    });
  }

  static async createAnswerBase(details) {
    return await Models.Answer.create(details)
  }

  static async getAnswerBase(candidateID, questionID) {
    return await Models.Answer.findOne({ where: { candidateID, questionID } })
  }

  static async getCohortFromAssessmentID(assessmentID) {
    return await DatabaseController.getCohortFromCohortID((await Models.Assessment.findByPk(assessmentID)).cohortID)
  }

  static async getMicroVivaAnswerFromID(microvivaanswerID) {
    return await Models.Microvivaanswer.findByPk(microvivaanswerID)
  }

  static async getMcqAnswerFromID(mcqanswerID) {
    return await Models.Mcqanswer.findByPk(mcqanswerID)
  }

  static async getSelectedOptionsFromMcqAnswerID(mcqanswerID){
    return await Models.Mcqoptionselected.findAll({where: {mcqanswerID}})
  }

  static async getQuestionIDListOfAssessment(assessmentID) {
    const questionsList = DatabaseController.getDataAttributesFromInstance(await Models.Question.findAll({
      where: {
        assessmentID: assessmentID
      }
    }))
    const questionListOutput = []
    for (const ques of questionsList) questionListOutput.push(ques.questionID)
    return questionListOutput
  }

  static async getNoOfQuestionResponsesOfAssessment(assessmentID, candidateID) {
    const questionIDListOfAssessment = await DatabaseController.getQuestionIDListOfAssessment(assessmentID);
    const { count, rows } = await Models.Answer.findAndCountAll({
      where: {
        candidateID: candidateID,
        questionID: {
          [Sequelize.Op.in]: questionIDListOfAssessment
        }
      }
    })
    return count;
  }

  static async getUserIDFromCandidateID(candidateID) {
    const row = await Models.Candidatelist.findByPk(candidateID)
    return row.candidateID
  }

  static async getAnswersOfAssessment(assessmentID, candidateID) {
    const questionIDListOfAssessment = await DatabaseController.getQuestionIDListOfAssessment(assessmentID);
    return await Models.Answer.findAll({
      where: {
        candidateID: candidateID,
        questionID: {
          [Sequelize.Op.in]: questionIDListOfAssessment
        }
      }
    })
  }

  static async FindisSelectedInAnswer(mcqanswerID, mcqOptionID) {
    return (await Models.Mcqoptionselected.findOne({
      where: {
        mcqanswerID: mcqanswerID,
        mcqoptionID: mcqOptionID
      }
    })).isSelectedInAnswer
  }

  static async markAnswerAs(answerID, value) {
    const questionID = (await Models.Answer.findByPk(answerID)).questionID;
    const fullMarks = (await DatabaseController.getQuestionFromQuestionID(questionID)).marks
    let getNextScoreState;
    if(value === true){
      getNextScoreState = fullMarks;
    }else{
      getNextScoreState = 0;
    }
    await Models.Answer.update({
      isCorrect: value,
      hasAdjustedManually: true,
      scoreRightNow: getNextScoreState
    }, {
      where: {
        answerID: answerID
      }
    })
  }

  static async resetCandidateResponse(assessmentID, candidateID) {
      const questionIDListOfAssessment = await DatabaseController.getQuestionIDListOfAssessment(assessmentID);
      
      let responseIDs = []
      const responses = await Models.Answer.findAll({
        where: {
          candidateID: candidateID,
          questionID: {
            [Sequelize.Op.in]: questionIDListOfAssessment
          }
        }
      }) 

      for (const response of responses) {
        responseIDs.push(response.answerID)
        if (response.mcqanswerID != null) {
          await Models.Mcqanswer.destroy({ where: { id: response.mcqanswerID } })
        } else if (response.microvivaanswerID != null) {
          await Models.Microvivaanswer.destroy({ where: { id: response.microvivaanswerID } })
        }
      }

      await Models.Answer.destroy({
        where: {
          answerID: {
            [Sequelize.Op.in]: responseIDs
          }
        }
      })

  }

  static async findGivenAnsAudio(microvivaanswerID) {
    const row = await Models.Microvivaanswer.findByPk(microvivaanswerID)
    return row.micAnsAudioID
  }

  static async getNumberOfQuestionsOfAnAssessment(assessmentID) {
    const questionsCount = await Models.Question.count({
      where: { assessmentID }
    })
    return questionsCount;
  }

  static async deleteResponsesOfQuestion(questionID) { // deletes all response
    // the response side needs to be deleted as well
    const responses = await Models.Answer.findAll({ where: { questionID: questionID } })
    for (const response of responses) {
      if (response.mcqanswerID != null) {
        await Models.Mcqanswer.destroy({ where: { id: response.mcqanswerID } })
      } else if (response.microvivaanswerID != null) {
        await Models.Microvivaanswer.destroy({ where: { id: response.microvivaanswerID } })
      }
    }
  }

  static async deleteChildOfQuestion(questionID) {
    const ques = await DatabaseController.getQuestionFromQuestionID(questionID);
    if (ques.mcqquestionID != null) {
      await Models.Mcqquestion.destroy({ where: { id: ques.mcqquestionID } })
    } else if (ques.microvivaquestionID != null) {
      await Models.Microvivaquestion.destroy({ where: { id: ques.microvivaquestionID } })
    }
    await DatabaseController.deleteResponsesOfQuestion(questionID)
  }

  static async setAnsAudioText(micAnsAudioID, micAnsAudioText){
    let x = await Models.Microvivaanswer.findOne({where:{micAnsAudioID}});
    x.micAnsAudioText = micAnsAudioText;
    await x.save();
  }
}

module.exports = DatabaseController