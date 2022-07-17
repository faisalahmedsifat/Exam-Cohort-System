// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

class ORMController {
  static getDataAttributesFromInstance(instance){
    return instance.dataValues;
  }

  // TODO: Refactor every Sequelize Code into this Controller
}

module.exports = ORMController