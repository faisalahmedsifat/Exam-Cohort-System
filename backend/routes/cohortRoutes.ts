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
 * prefix: api/
 */


// exam cohort related routes
router.get('/examcohort', middleware.authBarrier, async (request, response) => {
    const userID = request.userID
    try {
        cohorts =  await ExamCohortController.getAllExamCohort(userID)
        return response.status(200).json(middleware.generateApiOutput("OK", cohorts))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

router.post('/examcohort', middleware.authBarrier, async (request, response) => {
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
router.post('/examcohort/:id/candidate', middleware.authBarrier, async (request, response) => {
    const { userID } = request.body
    const cohortID = request.params.id
    try {
        const user = await ExamCohortController.addCandidatesToExamCohort(userID, cohortID)
        return response.status(201).json(middleware.generateApiOutput("OK", user))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

router.get('/examcohort/:id/candidate', middleware.authBarrier, async (request, response) => {
    const cohortID = request.params.id
    try {
        const candidates = await ExamCohortController.getAllCandidatesFromExamCohort(cohortID)
        return response.status(201).json(middleware.generateApiOutput("OK", candidates))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

// Assessment related routes
router.post('/examcohort/:id/assessment', middleware.authBarrier, async (request, response) => {
    const { name, availableDateTime, dueDateTime } = request.body
    const examcohortID = request.params.id
   
    try {
        const cohort = await ExamCohort.findByPk(examcohortID)
        const assessment = await cohort.createAssessment({ name: name, availableDateTime: availableDateTime, dueDateTime: dueDateTime })
        return response.status(201).json(middleware.generateApiOutput("OK", assessment))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})

router.get('/examcohort/:id/assessment', middleware.authBarrier, async (request, response) => {
    const examcohortID = request.params.id

    try {
        const cohort = await ExamCohort.findByPk(examcohortID)
        const assessment = await cohort.getAssessment()
        return response.status(201).json(middleware.generateApiOutput("OK", assessment))
    } catch (error) {
        return response.status(500).json(middleware.generateApiOutput("FAILED", { error }))
    }
})
module.exports = router