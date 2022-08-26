// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

// Other Controller
const ExamCohortController = require('./ExamCohortController')
const DatabaseController = require('./DatabaseController')
const DateTimeController = require('./DateTimeController')

class UserController {
  static async getUserFromUserID(userID) {
    return await Models.User.findByPk(userID)
  }
  static async getUserAndCohortsFromUserID(userID) {
    return await Models.User.findByPk(userID, {
      include: [
        {
          model: Models.ExamCohort,
          as: 'evaluatorcohorts',
        }
      ]
    })
  }
  
  static async checkIfUserExists(emailID) {
    let searchUser = await DatabaseController.getUserFromEmailID(emailID);
    return (searchUser != null)
  }
  static async getUserProfileDetails(userID){
    let fullDetails = await UserController.getUserAndCohortsFromUserID(userID);
    fullDetails = fullDetails.dataValues
    const NoOfExamCohorts = fullDetails.evaluatorcohorts.length;
    const registeredAt = DateTimeController.getTimeAgo(fullDetails.createdAt)
    const userProfileDetails = {...fullDetails, NoOfExamCohorts, registeredAt }
    delete userProfileDetails.userID
    delete userProfileDetails.createdAt
    delete userProfileDetails.updatedAt
    delete userProfileDetails.evaluatorcohorts
    return userProfileDetails;
  }
}

module.exports = UserController