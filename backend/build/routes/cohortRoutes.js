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
const router = require('express').Router();
const logger = require('../utils/logger');
const middleware = require('../utils/middleware');
// Controllers
const ExamCohortController = require('../controllers/examcohortcontroller');
// Models 
const { User, ExamCohort, Assessment } = require('../models');
/**
 * Routes
 *
 * prefix: api/examcohort/
 */
// exam cohort related routes
router.get('/', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const userID = request.userID;
    try {
        cohorts = yield ExamCohortController.getAllExamCohort(userID);
        return response.status(200).json(middleware.generateApiOutput("OK", cohorts));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
router.get('/:cohortID', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const userID = request.userID;
    const cohortID = request.params.cohortID;
    try {
        cohorts = yield ExamCohortController.getExamCohortDetails(userID, cohortID);
        return response.status(200).json(middleware.generateApiOutput("OK", cohorts));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }));
    }
}));
router.post('/', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const { name } = request.body;
    const userID = request.userID;
    try {
        const cohort = yield ExamCohortController.createExamCohort(userID, name);
        return response.status(201).json(middleware.generateApiOutput("OK", cohort));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
// Candidates related routes
router.post('/:id/candidate', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const { userID } = request.body;
    const cohortID = request.params.id;
    try {
        const user = yield ExamCohortController.addCandidatesToExamCohort(userID, cohortID);
        return response.status(201).json(middleware.generateApiOutput("OK", user));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
router.get('/:id/candidate', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const cohortID = request.params.id;
    try {
        const candidates = yield ExamCohortController.getAllCandidatesFromExamCohort(cohortID);
        return response.status(201).json(middleware.generateApiOutput("OK", candidates));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
// Assessment related routes
router.post('/:id/assessment', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const { name, availableDateTime, dueDateTime } = request.body;
    const cohortID = request.params.id;
    try {
        const assessment = yield ExamCohortController.addAssessmentToExamCohort(cohortID, name, availableDateTime, dueDateTime);
        return response.status(201).json(middleware.generateApiOutput("OK", assessment));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
router.get('/:id/assessment', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const cohortID = request.params.id;
    try {
        const assessments = yield ExamCohortController.getAllAssessmentFromExamCohort(cohortID);
        return response.status(201).json(middleware.generateApiOutput("OK", assessments));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
// Question related routes
router.post('/assessment/:id/questions', middleware.authBarrier, (request, response) => __awaiter(this, void 0, void 0, function* () {
    const questions = request.body;
    // console.log(questions)
    const assessmentID = request.params.id;
    try {
        const assessment = yield ExamCohortController.getAssessmentFromAssessmentID(assessmentID);
        console.log(assessment);
        for (let questionIndex = 0; questionIndex < questions.length; questionIndex++) {
            const { type, marks, timeLimit } = questions[questionIndex];
            console.log(type, marks, timeLimit);
            if (ExamCohortController.questionTypeIsValid(type)) {
                if (ExamCohortController.questionIsMCQ(type)) {
                    console.log('checkpoint 1');
                    const question = yield assessment.createQuestion({ type: type, marks: marks, timeLimit: timeLimit });
                    console.log('checkpoint 2');
                }
            }
        }
        return response.status(201).json(middleware.generateApiOutput("OK", questions));
    }
    catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }));
    }
}));
module.exports = router;
