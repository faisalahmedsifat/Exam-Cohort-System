// @ts-nocheck
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Sequelize = require('sequelize');
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
//Models
const Models = require('../models');
// Other Controller
const DateTimeController = require('./DateTimeController');
class UserController {
    static getUserFromUserID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Models.User.findByPk(userID);
        });
    }
    static getUserAndCohortsFromUserID(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Models.User.findByPk(userID, {
                include: [
                    {
                        model: Models.ExamCohort,
                        as: 'evaluatorcohorts',
                    }
                ]
            });
        });
    }
    static getUserFromEmailID(emailID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Models.User.findOne({ where: { emailID: emailID } });
        });
    }
    static checkIfUserExists(emailID) {
        return __awaiter(this, void 0, void 0, function* () {
            let searchUser = yield UserController.getUserFromEmailID(emailID);
            return (searchUser != null);
        });
    }
    static getUserProfileDetails(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            let fullDetails = yield UserController.getUserAndCohortsFromUserID(userID);
            fullDetails = fullDetails.dataValues;
            const NoOfExamCohorts = fullDetails.evaluatorcohorts.length;
            const registeredAt = DateTimeController.getTimeAgo(fullDetails.createdAt);
            const userProfileDetails = Object.assign(Object.assign({}, fullDetails), { NoOfExamCohorts, registeredAt });
            delete userProfileDetails.userID;
            delete userProfileDetails.createdAt;
            delete userProfileDetails.updatedAt;
            delete userProfileDetails.evaluatorcohorts;
            return userProfileDetails;
        });
    }
}
module.exports = UserController;
