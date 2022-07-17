// @ts-nocheck

const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

//Models
const Models = require('../models')

class ORMController {
  static getDataAttributesFromInstances(instances){
    let data = [];
    instances.forEach(instance => data.push(instance.dataValues));
    return data;
  }

  // TODO: Refactor every Sequelize Code into this Controller
}

module.exports = ORMController