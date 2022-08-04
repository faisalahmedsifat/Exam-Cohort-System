// @ts-nocheck

// Controllers
const DatabaseController = require('./DatabaseController')
const AssignedCohortController = require('./AssignedCohortController')

export class ExamServerSingleton {
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
    // TODO: unload questions that has been answered by this user
    return new ExamServerSingleton(userID, assessmentID, cohortID, candidateID, questions);
  }
  public static async getInstance(userID, assessmentID) {
    if (!(ExamServerSingleton.instances?.has(userID) && ExamServerSingleton.instances?.get(userID)?.has(assessmentID))) {
      let level2 = new Map();
      level2.set(assessmentID, (await ExamServerSingleton.callContructorWithAsyncData(userID, assessmentID)));
      ExamServerSingleton.instances.set(userID, level2);
    }
    return ExamServerSingleton.instances.get(userID).get(assessmentID)
  }
  public getRemainingQuestions() {
    return this.question;
  }
  public async getNextQuestion() {
    const indexSending = 0; // TODO: make this random between the lenngth of question array len
    if (this.question.length !== 0) {
      let servingQuestion = { ...this.question[indexSending], all_answered: false }

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

      // calculate updated Time limit
      const assessmentInstance = await DatabaseController.getAssessmentFromAssessmentID(this.assessmentID)
      const originalLimitInSec = servingQuestion.timeLimit*60
      const dueDateTime = Date.parse(assessmentInstance.dueDateTime)/1000   
      const timeNow = Date.parse(new Date())/1000
      const passedTime = timeNow-(Date.parse(answerBase.viewedAt)/1000)      
      const newTimeLimitSeconds = Math.min(
        Math.max((dueDateTime-timeNow), 0),
        Math.max((originalLimitInSec-passedTime), 0)
      )

      if(newTimeLimitSeconds === 0){
        return this.getNextQuestion()
      }

      servingQuestion = {...servingQuestion, timeLimitSec: newTimeLimitSeconds}
      return servingQuestion
    } else return { all_answered: true }
  }
  public async answerQuestion(answer) {
    console.log("answering with : ", answer);
    if (answer.type === "MCQ") {
      // check if already submitted
      // check if submitted within time limit
      // log the database submittedAt
      // log the answer into database if it is within time limit
      // accept 5 second delay

      // remove the answer from questionlist of this singleton
      this.question = this.question.filter((ques, idx) => ques.questionID != answer.questionID)
      console.log(this.question);

    } else if (answer.type === "MICROVIVA") {

    }
  }
}