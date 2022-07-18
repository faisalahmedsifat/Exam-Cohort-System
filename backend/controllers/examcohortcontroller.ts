// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Other Controllers
const ORMController = require('./ORMController')
const UserController = require('./UserController')

//Models
const { User, ExamCohort, Assessment } = require('../models')

// Helper Functions
let asyncMap = async (object, callback) => await Promise.all(object.map(async elem => await callback(elem)))

class ExamCohortController {
  static async getCohortFromCohortID(cohortID) {
    return await ExamCohort.findByPk(cohortID)
  }
  static async getCohortNumOfAssessment(cohortID) {
    const cohort = await ExamCohortController.getCohortFromCohortID(cohortID);
    const count = await cohort.countAssessment()
    return count;
  }
  static async getCohortNumOfCandidate(cohortID) {
    const cohort = await ExamCohortController.getCohortFromCohortID(cohortID);
    const count = await cohort.countCandidate()
    return count;
  }

  // Single Instance Stats Loader
  static async loadCohortStat(cohortInstance) {
    const cohortData = ORMController.getDataAttributesFromInstance(cohortInstance)
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
    const user = await UserController.getUserFromUserID(userID)
    let cohorts = await user.getEvaluatorcohorts();
    let cohortWithStats = await ExamCohortController.loadCohortStats(cohorts)
    return cohortWithStats
  }
  static async getExamCohortDetails(userID, cohortID) {
    try {
      const cohort = await ExamCohort.findOne({ where: { cohortID: cohortID, evaluatorID: userID } })
      if (cohort != null) {
        let cohortWithStats = await ExamCohortController.loadCohortStat(cohort)
        return cohortWithStats;
      } else throw Error('Cohort Not Found!')
    } catch (error) {
      throw Error('Cohort Not Found!')
    }
  }
  static async getUserFromEmailID(emailID){
    return await User.findOne({where:{emailID:emailID}})
  }
  static async createExamCohort(userID, name) {
    const user = await UserController.getUserFromUserID(userID)
    const cohort = await user.createEvaluatorcohort({ name: name });
    return await ExamCohortController.loadCohortStat(cohort)
  }
  static async addCandidatesToExamCohort(emailID, cohortID) {
    const user = await UserController.getUserFromEmailID(emailID)
    const cohort = await this.getCohortFromCohortID(cohortID)
    cohort.addCandidate(user)
    return user
  }
  static async getAllCandidatesFromExamCohort(cohortID) {
    const cohort = await this.getCohortFromCohortID(cohortID)
    const users = await cohort.getCandidate()
    return users
  }

  static async addAssessmentToExamCohort(cohortID, name, availableDateTime, dueDateTime) {
    const cohort = await this.getCohortFromCohortID(cohortID)
    const assessment = await cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime })
    return assessment
  }
  static async getAllAssessmentFromExamCohort(cohortID) {
    const cohort = await this.getCohortFromCohortID(cohortID)
    const assessments = await cohort.getAssessment()
    return assessments
  }

  static questionIsMCQ(type) {
    return type === 'MCQ'
  }
  static questionTypeIsValid(type) {
    return type === 'MCQ' || type === 'MICROVIVA'
  }

  static async getAssessmentFromAssessmentID(assessmentID) {
    return await Assessment.findByPk(assessmentID)
  }


}
module.exports = ExamCohortController