// @ts-nocheck

// Controllers
const DatabaseController = require('./DatabaseController')
const AssignedCohortController = require('./AssignedCohortController')
const DateTimeController = require('./DateTimeController')
const ExamCohortController = require('./ExamCohortController')

// Setting
const ACCEPT_DELAY_OF_SECONDS = 5; // due to network delay or lag

export class ExamServerFactory {
  private question = [];
  private userID;
  private assessmentID;
  private cohortID;
  private candidateID;
  private static instances = new Map();
  private async constructor(userID, assessmentID, cohortID, candidateID, question) {
    this.userID = userID
    this.assessmentID = assessmentID
    this.cohortID = cohortID
    this.candidateID = candidateID
    this.question = question
  }
  private static async callContructorWithAsyncData(userID, assessmentID) {
    const cohortID = (await DatabaseController.getCohortFromAssessmentID(assessmentID)).cohortID
    const candidateID = (await DatabaseController.findCandidateFromCandidateList(userID, cohortID)).id
    const questions = await AssignedCohortController.getQuestionsOfAssessmentWithoutCorAns(assessmentID)    
    return new ExamServerFactory(userID, assessmentID, cohortID, candidateID, questions);
  }
  public static async getServer(userID, assessmentID) {
    if (!(ExamServerFactory.instances?.has(userID) && ExamServerFactory.instances?.get(userID)?.has(assessmentID))) {
      let level2 = new Map();
      level2.set(assessmentID, (await ExamServerFactory.callContructorWithAsyncData(userID, assessmentID)));
      ExamServerFactory.instances.set(userID, level2);
    }
    return ExamServerFactory.instances.get(userID).get(assessmentID)
  }

  /**
   * questionTimeLimit in term of minutes
   * assessmentDueDateTime in term of Datetime
   * viewedAt in term of Datetime 
   * referenceTime in term of Datetime
   */
  private async getRemSecOfQues(questionTimeLimit, assessmentDueDateTime, viewedAt, referenceTime) {
    const originalLimitInSec = questionTimeLimit * 60
    const dueDateTime = Date.parse(assessmentDueDateTime) / 1000
    const timeNow = Date.parse(referenceTime) / 1000
    const passedTime = timeNow - (Date.parse(viewedAt) / 1000)
    const newTimeLimitSeconds = DateTimeController.calculateRemainingTimeInSecondsOfAQuestion(dueDateTime, timeNow, originalLimitInSec, passedTime)
    return newTimeLimitSeconds
  }

  public async getNextQuestion() {
    // check if time now is >= than available datetime
    const assessmentInstance = await DatabaseController.getAssessmentFromAssessmentID(this.assessmentID)
    if(!DateTimeController.checkIsGreaterEq(new Date(), assessmentInstance.availableDateTime)){
      return {
        started: false
      }
    }

    const indexSending = 0; // TODO: make this random between the lenngth of question array len
    if (this.question.length !== 0) {
      let servingQuestion = { ...this.question[indexSending], all_answered: false, started: true }

      // check if user was already served this question once from viewedAt at database, if not then create one
      let answerBase = await DatabaseController.getAnswerBase(this.candidateID, servingQuestion.questionID)
      if (!answerBase) {
        // create answer base in database 
        answerBase = await DatabaseController.createAnswerBase({
          viewedAt: new Date(),
          type: servingQuestion.type,
          candidateID: this.candidateID,
          questionID: servingQuestion.questionID
        })
      }

      // calculating updated Time limit
      const newTimeLimitSeconds = await this.getRemSecOfQues(servingQuestion.timeLimit, assessmentInstance.dueDateTime, answerBase.viewedAt, new Date())

      // There is no point serving this question, time limit exceeded
      if (newTimeLimitSeconds === 0) {
        // remove this question from the list of question 
        this.question = this.question.filter((ques, idx) => ques.questionID !== servingQuestion.questionID)
        // send a new one
        return this.getNextQuestion()
      }

      servingQuestion = { ...servingQuestion, timeLimitSec: newTimeLimitSeconds }
      return servingQuestion
    } else return { all_answered: true }
  }
  private removeQuestionFromList(targetQuestionID) {
    this.question = this.question.filter(ques => ques.questionID !== targetQuestionID)
  }
  public async answerQuestion(answer) {
    let answerBase = await DatabaseController.getAnswerBase(this.candidateID, answer.questionID)
    if (answerBase.submittedAt != null) { // check if already submitted
      this.removeQuestionFromList(answer.questionID) // remove the question
    } else {
      // check if submitted within time limit, consider even due time as long as current question
      let assessmentInstance = await DatabaseController.getAssessmentFromAssessmentID(this.assessmentID)
      const questionInstance = await DatabaseController.getQuestionFromQuestionID(answer.questionID)
      const newTimeLimitSeconds = await this.getRemSecOfQues(questionInstance.timeLimit, assessmentInstance.dueDateTime, answerBase.viewedAt, new Date(new Date().getTime()-1000*ACCEPT_DELAY_OF_SECONDS))
      if (newTimeLimitSeconds === 0) {
        throw new Error("Time Limit Exceeded!"); // Don't Accept The Answer, as there is a time limit exceeded case 
      }

      // log the database submittedAt
      answerBase = await DatabaseController.getAnswerBase(this.candidateID, answer.questionID)
      answerBase.submittedAt = new Date();
      await answerBase.save()

      // log the answer into database
      if (answer.type === "MCQ") {
        const result = await ExamCohortController.addMcqAnswerToQuestion(answer)
        answerBase.isCorrect = Boolean(result.correctAnswer)
        answerBase.mcqanswerID  = result.mcqanswerID
        await answerBase.save()
      } else if (answer.type === "MICROVIVA") {
        // await ExamCohort.addMCQQuestionsAnswer(answer)
      }

      // remove the answer from questionlist
      this.removeQuestionFromList(answer.questionID)
    }
  }
}