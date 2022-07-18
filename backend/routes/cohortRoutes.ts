// @ts-nocheck


const Sequelize = require('sequelize')
const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Controllers
const ExamCohortController = require('../controllers/examcohortcontroller')
// Models 
const { User, ExamCohort } = require('../models')


/** 
 * Routes
 * 
 * prefix: api/examcohort/
 */


// exam cohort related routes
router.get('/', middleware.authBarrier, async (request, response) => {
    const userID = request.userID
    try {
        cohorts =  await ExamCohortController.getAllExamCohort(userID)
        return response.status(200).json(middleware.generateApiOutput("OK", cohorts))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

router.get('/:cohortID', middleware.authBarrier, async (request, response) => {
    const userID = request.userID
    const cohortID = request.params.cohortID
    try {
        cohorts =  await ExamCohortController.getExamCohortDetails(userID, cohortID)
        return response.status(200).json(middleware.generateApiOutput("OK", cohorts))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
    }
})

router.post('/', middleware.authBarrier, async (request, response) => {
    const { name } = request.body
    const userID = request.userID
    try {
        const cohort = await ExamCohortController.createExamCohort(userID, name) 
        return response.status(201).json(middleware.generateApiOutput("OK", cohort))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})


// Candidates related routes
router.post('/:id/candidate', middleware.authBarrier, async (request, response) => {
    const { userID } = request.body
    const cohortID = request.params.id
    try {
        const user = await ExamCohortController.addCandidatesToExamCohort(userID, cohortID)
        return response.status(201).json(middleware.generateApiOutput("OK", user))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

router.get('/:id/candidate', middleware.authBarrier, async (request, response) => {
    const cohortID = request.params.id
    try {
        const candidates = await ExamCohortController.getAllCandidatesFromExamCohort(cohortID)
        return response.status(201).json(middleware.generateApiOutput("OK", candidates))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

// Assessment related routes
router.post('/:id/assessment', middleware.authBarrier, async (request, response) => {
    const { name, availableDateTime, dueDateTime } = request.body
    const cohortID = request.params.id
   
    try {
        const assessment = await ExamCohortController.addAssessmentToExamCohort(cohortID, name, availableDateTime, dueDateTime)
        return response.status(201).json(middleware.generateApiOutput("OK", assessment))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

router.get('/:id/assessment', middleware.authBarrier, async (request, response) => {
    const cohortID = request.params.id

    try {
        const assessments = await ExamCohortController.getAllAssessmentFromExamCohort(cohortID)
        return response.status(201).json(middleware.generateApiOutput("OK", assessments))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})
module.exports = router