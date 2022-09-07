// @ts-nocheck

// Controllers
const DatabaseController = require('./DatabaseController')
const ExamCohortController = require('./ExamCohortController')
const AssignedCohortController = require('./AssignedCohortController')

export class ReevaluateController {
  static async getResponsesOfAssessment(cohortID, assessmentID){
    // get candidates List ready
    const cohortInstance = await DatabaseController.getCohortFromCohortID(cohortID)
    let candidateListOfAssessment = await DatabaseController.getAllCandidatesFromCohort(cohortInstance)

    // remove candiates that has 0 resposnes
    candidateListOfAssessment = DatabaseController.getDataAttributesFromInstance(candidateListOfAssessment)
    let output = []
    for (const canididate of candidateListOfAssessment) {
      let obj = {
        responseID: canididate.Candidatelist.id,
        candidateName: canididate.firstName + " " + canididate.lastName,
        candidateEmail: canididate.emailID,
        noOfQuestionAnswered: 0
      }
      const noOfQuestionAnsweredOfCurCan = await DatabaseController.getNoOfQuestionResponsesOfAssessment(assessmentID, canididate.Candidatelist.id);
      obj["noOfQuestionAnswered"] = noOfQuestionAnsweredOfCurCan
      if(noOfQuestionAnsweredOfCurCan !== 0) output.push(obj);
    }
    return output
  }

  public static async getAllResponseList(cohortID, assessmentID){
    const responseList = await ReevaluateController.getResponsesOfAssessment(cohortID, assessmentID);
    return responseList
  }

  static async processOutputOfMCQ(mcqAnswer){
    const questionInstance = await DatabaseController.getQuestionFromQuestionID(mcqAnswer.questionID);
    const questionOutputWithAnswer = await AssignedCohortController.processSingleMCQQuestionWithCorAnsOutputPresentation(questionInstance)
    let mcqOptions = questionOutputWithAnswer.mcqQuestionDetails.mcqOptions
    for (let options of mcqOptions) {
      const isSelectedInAnswerTruely = await DatabaseController.FindisSelectedInAnswer(mcqAnswer.mcqanswerID,options.mcqOptionID)
      options["isSelectedInAnswer"] = isSelectedInAnswerTruely  
    }
    let output = {
      answerID: mcqAnswer.answerID,
      questionID: mcqAnswer.questionID,
      candidateID: mcqAnswer.candidateID,
      type: "MCQ",
      isCorrect: mcqAnswer.isCorrect,
      marks: questionOutputWithAnswer.marks,
      timeLimit: questionOutputWithAnswer.timeLimit,
      score: mcqAnswer.scoreRightNow,
      viewedAt: mcqAnswer.viewedAt,
      submittedAt: mcqAnswer.submittedAt,
      questionDetails: questionOutputWithAnswer.mcqQuestionDetails
    }
    return output
  }

  static async processOutputOfMicroViva(microvivaAnswer){
    const questionInstance = await DatabaseController.getQuestionFromQuestionID(microvivaAnswer.questionID);
    const questionOutputWithAnswer = await AssignedCohortController.processSingleMicroVivaQuestionWithCorAnsOutputPresentation(questionInstance)
    
    const givenAnsAudioID = await DatabaseController.findGivenAnsAudio(microvivaAnswer.microvivaanswerID);

    const questionDetailsNew = {...(questionOutputWithAnswer.microVivaQuestionDetails),givenAnsAudioID:givenAnsAudioID }

    let output = {
      answerID: microvivaAnswer.answerID,
      questionID: microvivaAnswer.questionID,
      candidateID: microvivaAnswer.candidateID,
      type: "MICROVIVA",
      isCorrect: microvivaAnswer.isCorrect,
      marks: questionOutputWithAnswer.marks,
      timeLimit: questionOutputWithAnswer.timeLimit,
      score: microvivaAnswer.scoreRightNow,
      viewedAt: microvivaAnswer.viewedAt,
      submittedAt: microvivaAnswer.submittedAt,
      questionDetails: questionDetailsNew
    }    
    return output
  }

  static async getCandidateResponses(assessmentID, candidateID){
    const candidateResponse = DatabaseController.getDataAttributesFromInstance(await DatabaseController.getAnswersOfAssessment(assessmentID, candidateID))
    let output = []
    for (const answer of candidateResponse) {
      if(answer.type === "MCQ" && answer.mcqanswerID != null) {
        // process MCQ
        let mcqOutput = await ReevaluateController.processOutputOfMCQ(answer);
        output.push(mcqOutput);
      }else if(answer.type === "MICROVIVA" && answer.microvivaanswerID != null ){
        // proccess MicroViva
        let microOutput = await ReevaluateController.processOutputOfMicroViva(answer);
        output.push(microOutput);
      }
    }

    return output;
  }

  static async markAsCorrect(answerID){
    await DatabaseController.markAnswerAs(answerID, true)
  }

  static async markAsIncorrect(answerID){
    await DatabaseController.markAnswerAs(answerID, false)
  }

  // For Exporting
  static async getDataSingleAssessment(cohortID, assessmentID) {
    const questionIDs = await DatabaseController.getQuestionIDListOfAssessment(assessmentID);
    const assessmentData = await DatabaseController.getAssessmentFromAssessmentID(assessmentID)
    const responseLists = await ReevaluateController.getResponsesOfAssessment(cohortID, assessmentID);

    let dataOutput = []
    for (const candidate of responseLists) {
      const responseOfCurCandidate = await ReevaluateController.getCandidateResponses(assessmentID, candidate.responseID)
      let curCandidateData = {}
      let candidateResponses = []

      for (const questionID of questionIDs) {
        for (const response of responseOfCurCandidate) {
          if (questionID === response.questionID) {
            candidateResponses.push({ questionID: questionID, score: response.score })
          }
        }
      }

      curCandidateData["CandidateName"] = candidate.candidateName
      curCandidateData["candidateResponses"] = candidateResponses
      dataOutput.push(curCandidateData)
    }
    dataOutput = {
      assessmentStats: {
        maxNumOfQuestion: questionIDs.length,
        assessmentName: assessmentData.name,
        questionIDs: questionIDs
      },
      assessmentResponses: dataOutput
    }
    // console.dir(dataOutput, { depth: null });
    return dataOutput;
  }

}
