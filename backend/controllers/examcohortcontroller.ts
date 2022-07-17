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
let asyncMap = async (object,callback) => await Promise.all(object.map(async elem => await callback(elem)))

class ExamCohortController {

    static async getCohortFromCohortID(cohortID) {
        return await ExamCohort.findByPk(cohortID) 
    }

    static async getCohortNumOfAssessment(cohortID){
        const cohort = await ExamCohortController.getCohortFromCohortID(cohortID);
        const count = await cohort.countAssessment()
        return count;
    }
    
    static async getCohortNumOfCandidate(cohortID){
      const cohort = await ExamCohortController.getCohortFromCohortID(cohortID);
      const count = await cohort.countCandidate()
      return count;
    }

    static async loadCohortStats(cohortInstances){
      const cohortData = ORMController.getDataAttributesFromInstances(cohortInstances)
      const cohortListExtra = await asyncMap(cohortData, async cohort => {
        cohort.numOfAssessments = await ExamCohortController.getCohortNumOfAssessment(cohort.cohortID)
        cohort.numOfCandidates = await ExamCohortController.getCohortNumOfCandidate(cohort.cohortID)          
        return cohort          
      })
      return cohortListExtra
    }


    static async getAllExamCohort(userID){
        const user = await UserController.getUserFromUserID(userID)
        let cohorts = await user.getEvaluatorcohorts();
        let cohortWithStats = await ExamCohortController.loadCohortStats(cohorts) 
        return cohortWithStats
    }
    static async createExamCohort(userID, name){
        const user = await UserController.getUserFromUserID(userID)
        const cohort = await user.createEvaluatorcohort({ name: name });
        return cohort
    }
    static async addCandidatesToExamCohort(userID, cohortID){
        const user = await UserController.getUserFromUserID(userID)
        const cohort = await this.getCohortFromCohortID(cohortID) 
        cohort.addCandidate(user)
        return user
    }
    static async getAllCandidatesFromExamCohort(cohortID){
        const cohort = await this.getCohortFromCohortID(cohortID) 
        const users = await cohort.getCandidate()
        return users
    }

}
module.exports = ExamCohortController