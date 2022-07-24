// @ts-nocheck

EXAM_COHORT_MAX_LEN = 40
CANDIDATE_EMAIL_MAX_LEN = 80
ASSESSMENT_NAME_MAX_LEN = 40
QUESTION_STATEMENT_MAX_LEN = 1000
QUESTION_OPTION_MAX_LEN = 200

class ValidationController {
    static isValidExamCohortName(examCohortName) {
        return examCohortName.length > 0 && examCohortName.length < EXAM_COHORT_MAX_LEN;
    }
    static isValidCandidateEmailID(candidateEmailID) {
        return candidateEmailID.length > 0 && candidateEmailID.length < CANDIDATE_EMAIL_MAX_LEN;
    }
    static isValidAssessmentName(assessmentName) {
        return assessmentName.length > 0 && assessmentName.length < ASSESSMENT_NAME_MAX_LEN;
    }
    static isValidQuestionStatement(questionStatement) {
        return questionStatement.length > 0 && questionStatement.length < QUESTION_STATEMENT_MAX_LEN;
    }
    static isValidQuestionOptions(options) {
        let isValidQuestionOptionStatement = true;
        options.forEach(option => {
            if (!(option.length > 0 && option.length < QUESTION_OPTION_MAX_LEN)) isValidQuestionOptionStatement = false;
        });
        return isValidQuestionOptionStatement;
    }

    static isAtleastOneCorrectAnswerIsSelected(options) {
        let isAtleastOneCorrectAnswerIsSelected = false;
        options.forEach(option => {
            if (option === 1) {
                isAtleastOneCorrectAnswerIsSelected = true;
            }
        });
        return isAtleastOneCorrectAnswerIsSelected;
    }

}
module.exports = ValidationController