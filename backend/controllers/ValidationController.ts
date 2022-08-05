// @ts-nocheck

// Controllers
const ValidationHelper = require('./ValidationHelper')
const DateTimeController = require('./DateTimeController')
const DatabaseController = require('./DatabaseController')

/*
 * Validation Settings
 */
// Exam Cohort
EXAM_COHORT_MAX_LEN = 10

// Candidate
CANDIDATE_EMAIL_MAX_LEN = 80

// Assessment
ASSESSMENT_NAME_MAX_LEN = 20

// Questions
MCQ_STATEMENT_MAX_LEN = 50
MCQ_MAX_NO_OF_OPTIONS = 10
MCQ_OPTION_MAX_LEN = 50
MAX_MARKS_OF_QUESTION = 100
RESTRICT_ADDING_QUESTION_AT_AVAILABLE_ASSESSMENT=true


class ValidationController {
  static validateCreateExamCohortInput(userInput) {
    ValidationHelper.validateStringLength(userInput.name, 'Cohort Name', 1, EXAM_COHORT_MAX_LEN)
  }

  static validateAddCandidateInput(userInput) {
    ValidationHelper.validateEmailAddress(userInput.candidateEmailID)
    ValidationHelper.validateVariableValueNotEq(userInput.candidateEmailID, userInput.evaluatorEmailID,
      "You cannot add yourself to the candidate list!")
  }

  static validateAddAssessmentInput({ cohortID, name, availableDateTime, dueDateTime }) {
    ValidationHelper.validateStringLength(name, 'Assessment Name', 1, ASSESSMENT_NAME_MAX_LEN)
    if (!DateTimeController.isAvailableAndDueDateTimeValid(availableDateTime, dueDateTime))
      throw Error('Invalid date and time!')
  }

  static validateMCQQuestionUserInput(mcqQuestion) {
    // Check Statement Length
    ValidationHelper.validateStringLength(mcqQuestion.details.mcqStatement, 'MCQ Question\'s Statement', 1, MCQ_STATEMENT_MAX_LEN)

    // Check Number of Options
    ValidationHelper.validateObjectLength(mcqQuestion.details.mcqOptions, 'MCQ Question\'s Options', 2, MCQ_MAX_NO_OF_OPTIONS,
      "MCQ Question\'s must have atleast 2 and at max 10 options!")

    // Check Options Length
    let hasAtleastOneCorAns = false
    for (const option of mcqQuestion.details.mcqOptions) {
      hasAtleastOneCorAns |= Boolean(option.isMcqOptionCor)
      ValidationHelper.validateStringLength(option.mcqOptionText, 'Option', 1, MCQ_OPTION_MAX_LEN)
    }

    // Check If atleast one option is marked as correct
    ValidationHelper.validateVariableValueEq(Boolean(hasAtleastOneCorAns), true, "There should be atleast one correct answer for mcq question!")
  }

  static validateMicroVivaQuestionUserInput(microVivaQuestion) {
    // console.log(microVivaQuestion);
  }

  static restrictAddingQuestionDuringAvailableTime(availableDateTime, dueDateTime){
    const availParsed = Date.parse(new Date(availableDateTime))
    const dueDateParsed = Date.parse(new Date(dueDateTime))
    const timeNowParsed = Date.parse(new Date())
    if(availParsed <= timeNowParsed && timeNowParsed <= dueDateParsed && RESTRICT_ADDING_QUESTION_AT_AVAILABLE_ASSESSMENT === true){
      throw new Error("This assessment is currently available to candidates, adding question right now is prohibited!");
    }
  }

  static validateAddQuestionInputs(questions, availableDatetime, dueDatetime, minutesUsed) {
    let maxMinuteRemainsOfThisAssessment = DateTimeController.getQuestionMinutesRemainToAddInAssessment(availableDatetime, dueDatetime, minutesUsed);
    let totalTimeLimit = 0
    for (const question of questions) {
      totalTimeLimit += Number(question.timeLimit)

      // Check Marks Value
      ValidationHelper.validateNumber(Number(question.marks), 'Marks', 0, MAX_MARKS_OF_QUESTION)

      if (question.type === "MCQ") {
        ValidationController.validateMCQQuestionUserInput(question)
      } else if (question.type === "MICROVIVA") {
        ValidationController.validateMicroVivaQuestionUserInput(question)
      }
    }

    if (totalTimeLimit == 0)
      throw new Error("The time limit cannot be zero!");

    if (totalTimeLimit > maxMinuteRemainsOfThisAssessment)
      throw new Error("The total sum of time limit exceeds the difference between assessment\'s due datetime and available datetime!");
  }

  static async validateQuestionIsAlreadyAnsweredByCandidate(candidateListID, questionID) {
    const alreadyAnswered = await DatabaseController.findAnswerFromCandidateID(candidateListID, questionID)
    if (alreadyAnswered != null) {
      throw new Error('Candidate has already answered this question')
    }
  }

  static async validateUserIsAssignedToCohort(candidateID, cohortID) {
    const candidate = await DatabaseController.findCandidateFromCandidateList(candidateID, cohortID)
    if (candidate == null)
      throw new Error('Candidate is not assigned to this cohort')
  }


}
module.exports = ValidationController