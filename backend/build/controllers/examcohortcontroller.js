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
// Other Controllers
const ORMController = require('./ORMController');
const UserController = require('./UserController');
//Models
const { User, ExamCohort, Assessment } = require('../models');
// Helper Functions
let asyncMap = (object, callback) => __awaiter(this, void 0, void 0, function* () { return yield Promise.all(object.map((elem) => __awaiter(this, void 0, void 0, function* () { return yield callback(elem); }))); });
class ExamCohortController {
    static getCohortFromCohortID(cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ExamCohort.findByPk(cohortID);
        });
    }
    static getCohortNumOfAssessment(cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohort = yield ExamCohortController.getCohortFromCohortID(cohortID);
            const count = yield cohort.countAssessment();
            return count;
        });
    }
    static getCohortNumOfCandidate(cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohort = yield ExamCohortController.getCohortFromCohortID(cohortID);
            const count = yield cohort.countCandidate();
            return count;
        });
    }
    // Single Instance Stats Loader
    static loadCohortStat(cohortInstance) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohortData = ORMController.getDataAttributesFromInstance(cohortInstance);
            cohortData.numOfAssessments = yield ExamCohortController.getCohortNumOfAssessment(cohortData.cohortID);
            cohortData.numOfCandidates = yield ExamCohortController.getCohortNumOfCandidate(cohortData.cohortID);
            return cohortData;
        });
    }
    // Multiple Instance Stats Loader
    static loadCohortStats(cohortInstances) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohortDataListExtra = yield asyncMap(cohortInstances, (cohortInstance) => __awaiter(this, void 0, void 0, function* () { return yield ExamCohortController.loadCohortStat(cohortInstance); }));
            return cohortDataListExtra;
        });
    }
    static getAllExamCohort(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.getUserFromUserID(userID);
            let cohorts = yield user.getEvaluatorcohorts();
            let cohortWithStats = yield ExamCohortController.loadCohortStats(cohorts);
            return cohortWithStats;
        });
    }
    static getExamCohortDetails(userID, cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cohort = yield ExamCohort.findOne({ where: { cohortID: cohortID, evaluatorID: userID } });
                if (cohort != null) {
                    let cohortWithStats = yield ExamCohortController.loadCohortStat(cohort);
                    return cohortWithStats;
                }
                else
                    throw Error('Cohort Not Found!');
            }
            catch (error) {
                throw Error('Cohort Not Found!');
            }
        });
    }
    static createExamCohort(userID, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.getUserFromUserID(userID);
            const cohort = yield user.createEvaluatorcohort({ name: name });
            return yield ExamCohortController.loadCohortStat(cohort);
        });
    }
    static addCandidatesToExamCohort(userID, cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.getUserFromUserID(userID);
            const cohort = yield this.getCohortFromCohortID(cohortID);
            cohort.addCandidate(user);
            return user;
        });
    }
    static getAllCandidatesFromExamCohort(cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohort = yield this.getCohortFromCohortID(cohortID);
            const users = yield cohort.getCandidate();
            return users;
        });
    }
    static addAssessmentToExamCohort(cohortID, name, availableDateTime, dueDateTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohort = yield this.getCohortFromCohortID(cohortID);
            const assessment = yield cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime });
            return assessment;
        });
    }
    static getAllAssessmentFromExamCohort(cohortID) {
        return __awaiter(this, void 0, void 0, function* () {
            const cohort = yield this.getCohortFromCohortID(cohortID);
            const assessments = yield cohort.getAssessment();
            return assessments;
        });
    }
    static questionIsMCQ(type) {
        return type === 'MCQ';
    }
    static questionTypeIsValid(type) {
        return type === 'MCQ' || type === 'MICROVIVA';
    }
    static getAssessmentFromAssessmentID(assessmentID) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Assessment.findByPk(assessmentID);
        });
    }
}
module.exports = ExamCohortController;
