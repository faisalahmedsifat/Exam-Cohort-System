// @ts-nocheck
const Sequelize = require('sequelize');
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
//Models
const Models = require('../models');
class ORMController {
    static getDataAttributesFromInstance(instance) {
        return instance.dataValues;
    }
}
module.exports = ORMController;
