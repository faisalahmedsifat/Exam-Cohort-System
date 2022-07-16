// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')


//Models
const { User, ExamCohort } = require('../models')

class ExamCohortController {

    static async getUserFromUserID(userID) {
        return await User.findByPk(userID) 
    }

    static async getCohortFromCohortID(cohortID) {
        return await ExamCohort.findByPk(cohortID) 
    }



    static async getAllExamCohort(userID){
        const user = await this.getUserFromUserID(userID)
        const cohorts = await user.getEvaluatorcohorts(); 
        return cohorts
    }
    static async createExamCohort(userID, name){
        const user = await this.getUserFromUserID(userID)
        const cohort = await user.createEvaluatorcohort({ name: name });
        return cohort
    }
    static async addCandidatesToExamCohort(userID, cohortID){
        const user = await this.getUserFromUserID(userID)
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