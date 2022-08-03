// @ts-nocheck

// Controllers
const DatabaseController = require('./DatabaseController')
const AssignedCohortController = require('./AssignedCohortController')

export class ExamServerSingleton {
  private question = [];
  private static instances = new Map();
  private async constructor(questions) {
    this.question = questions
  }
  private static async callContructorWithAsyncData(userID, assessmentID) {
    const questions = await AssignedCohortController.getQuestionsOfAssessmentWithoutCorAns(assessmentID)
    // TODO: unload questions that has been answered by this user
    return new ExamServerSingleton(questions);
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
}