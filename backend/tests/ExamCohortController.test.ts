// @ts-nocheck

const {uuid} = require("uuidv4")

//Models
const Models = require('../models')

//Controllers
const ExamCohortController = require('../controllers/ExamCohortController')


const dummyUsers = [
    {
        userID: uuid(),
        emailID: "faisalahmed531@gmail.com",
        firstName: "Faisal",
        lastName: "Ahmed",
    },
    {
        userID: uuid(),
        emailID: "faisalahmed111@gmail.com",
        firstName: "sal",
        lastName: "Aed",
    },
    {
        userID: uuid(),
        emailID: "arian@gmail.com",
        firstName: "arian",
        lastName: "",
    },
];

const dummyExamCohorts = [
    {
        cohortID: uuid(),
        evaluatorID: dummyUsers[0].userID,
        name: "sifat ec 2"
    },
    {
        cohortID: uuid(),
        evaluatorID: dummyUsers[0].userID,
        name: "sifat ec 3"
    },
    {
        cohortID: uuid(),
        evaluatorID: dummyUsers[0].userID,
        name: "sifat ec 4"
    },
]

const dummyCandidates = [
    {
        cohortID: dummyExamCohorts[0].id,
        emailID: "faisalahmed531@gmail.com",
    },
    {
        cohortID: dummyExamCohorts[0].id,
        emailID: "arian@gmail.com",
    },
    {
        cohortID: dummyExamCohorts[0].id,
        emailID: "faisalahmed111@gmail.com",
    },
]

const dummyAssessments = [
    {
        cohortID: dummyExamCohorts[0].id,
        AssessmentID: uuid(),
        name: "quiz 1",
        availableDateTime: "2023-01-01T00:00:00.000Z",
        dueDateTime: "2023-01-02T00:00:00.000Z",
    },
    {
        cohortID: dummyExamCohorts[0].id,
        AssessmentID: uuid(),
        name: "quiz 2",
        availableDateTime: '2022-12-12T00:00:00.000Z',
        dueDateTime: '2023-02-02T00:00:00.000Z',
    },
    {
        cohortID: dummyExamCohorts[0].id,
        AssessmentID: uuid(),
        name: "midterm",
        availableDateTime: '2023-04-01T00:00:00.000Z',
        dueDateTime: '2023-08-02T00:00:00.000Z',
    },
]

const mcqquestionsIDs = [uuid(), uuid(), uuid()]
const dummyQuestions = [

    {
        questionID: uuid(),
        assessmentID: dummyAssessments[0].AssessmentID,
        type: "MCQ",
        marks: 10,
        timeLimit: 100,
        mcqquestionID: mcqquestionsIDs[0],
        details: {
            id: mcqquestionsIDs[0],
            mcqStatement: "teesjskdjkasjdfk",
            mcqOp1: "op 1",
            mcqOp2: "op 2",
            mcqOp3: "op 3",
            mcqOp4: "op 4",
            mcqOp1IsCor: 0,
            mcqOp2IsCor: 0,
            mcqOp3IsCor: 1,
            mcqOp4IsCor: 0

        }
    },
    {
        questionID: uuid(),
        assessmentID: dummyAssessments[0].AssessmentID,
        type: "MCQ",
        marks: 10,
        timeLimit: 100,
        mcqquestionsID: mcqquestionsIDs[1],
        details: {
            id: mcqquestionsIDs[1],
            mcqStatement: "teesjskdjkasjdfk",
            mcqOp1: "op 1",
            mcqOp2: "op 2",
            mcqOp3: "op 3",
            mcqOp4: "op 4",
            mcqOp1IsCor: 1,
            mcqOp2IsCor: 0,
            mcqOp3IsCor: 0,
            mcqOp4IsCor: 0

        }
    },
    {
        questionID: uuid(),
        assessmentID: dummyAssessments[0].AssessmentID,
        type: "MCQ",
        marks: 10,
        timeLimit: 100,
        mcqquestionsIDs: mcqquestionsIDs[2],
        details: {
            id: mcqquestionsIDs[2],
            mcqStatement: "teesjskdjkasjdfk",
            mcqOp1: "op 1",
            mcqOp2: "op 2",
            mcqOp3: "op 3",
            mcqOp4: "op 4",
            mcqOp1IsCor: 0,
            mcqOp2IsCor: 0,
            mcqOp3IsCor: 0,
            mcqOp4IsCor: 1

        }
    },
]

describe('Exam Cohort', () => {
    test('testing create Exam Cohort', async () => {
        //describe the test suite 
    })
    test('testing get Exam Cohort', async () => {
        //describe the test suite 
    })
    test('testing add candidates', async () => {
        //describe the test suite 
    })
    test('testing get candidates', async () => {
        //describe the test suite 
    })
    test('testing add assessments', async () => {
        //describe the test suite 
    })
    test('testing get assessments', async () => {
        //describe the test suite 
    })
    test('testing add questions', async () => {
        //describe the test suite 
    })
    test('testing get questions', async () => {
        //describe the test suite 
    })
})

beforeAll(async () => {
    await Models.User.bulkCreate(dummyUsers)
    // await Models.ExamCohort.bulkCreate(dummyExamCohorts)
    // await Models.Candidate.bulkCreate(dummyCandidates)
    // await Models.Assessment.bulkCreate(dummyAssessments)
    // await Models.Question.bulkCreate(dummyQuestions)
})

afterAll(async () => {
    for (let dummyUserLength = 0; dummyUserLength < dummyUsers.length; dummyUserLength++) {
        await Models.User.destroy({ where: { emailID: dummyUsers[dummyUserLength].emailID } })
    }

    // await Models.ExamCohort.destroy({ where: {} })
    // await Models.Candidate.destroy({ where: {} })
    // await Models.Assessment.destroy({ where: {} })
    // await Models.Question.destroy({ where: {} })
})
