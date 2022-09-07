// Controllers
const DatabaseController = require('./DatabaseController')
const { AudioController } = require('./AudioController')
const { FirebaseStorageSingleton } = require('./FirebaseStorageSingleton')
const { SpeechToTextController } = require('./SpeechToTextController')
const { AsseblyAISTTStrategy } = require('./AsseblyAISTTStrategy')
const { StringMatchingController } = require('../controllers/StringMatchingController')
const { EditDistanceStrategy } = require("./EditDistanceStrategy")

// SETTINGS
const MICRO_VIVA_CORRECTNESS_THRESHOLD = 60; // 60% similarities is a correct answer;

export class EvaluateAnswer {
  static async evaluateMCQAnswer(answerBody) {

  }
  static async evaluateAnswer(questionID, candidateID) {
    let answerBase = await DatabaseController.getAnswerBase(candidateID, questionID)
    if (answerBase.type === "MICROVIVA") {
      const questionData = await DatabaseController.getDataAttributesFromInstance(await DatabaseController.getQuestionFromQuestionID(questionID))
      const microQuestionData = await DatabaseController.getDataAttributesFromInstance(await DatabaseController.getMicroVivaQuestionFromQuestionID(questionData.microvivaquestionID))
      let corAnsAudioID = microQuestionData.micCorAudioID
      let answerAudioID = (await DatabaseController.getMicroVivaAnswerFromID(answerBase.microvivaanswerID)).micAnsAudioID
      let isCorrect = await EvaluateAnswer.evaluateMicroVivaAnswer(corAnsAudioID, answerAudioID)
      answerBase.isCorrect = isCorrect
      if (isCorrect === true) answerBase.scoreRightNow = questionData.marks;
      else answerBase.scoreRightNow = 0;
    } else if (answerBase.type === "MCQ") {
      let correctAnswer = true;

      let question = await DatabaseController.getQuestionFromQuestionID(questionID)
      let mcqQuestionInstance = await DatabaseController.getMCQQuestionFromQuestionID(question.mcqquestionID)
      let mcqQuestionOptions = await DatabaseController.getOptionsOfMCQQuestionFromQuestionInstance(mcqQuestionInstance, null, true)
      let mcqQuestionOptionData = DatabaseController.getDataAttributesFromInstance(mcqQuestionOptions)

      let userResponseID = (await DatabaseController.getMcqAnswerFromID(answerBase.mcqanswerID)).id
      let userSelectedOptions = DatabaseController.getDataAttributesFromInstance(await DatabaseController.getSelectedOptionsFromMcqAnswerID(userResponseID))

      for (const original of mcqQuestionOptionData) {
        for (const givenOption of userSelectedOptions) {
          if(original.id === givenOption.mcqoptionID){
            correctAnswer &&= (original.isMcqOptionCor === givenOption.isSelectedInAnswer)
          }
        }
      }      
      answerBase.isCorrect = correctAnswer;
      if (correctAnswer === true) answerBase.scoreRightNow = question.marks;
      else answerBase.scoreRightNow = 0;
    }
    answerBase.hasAutoEvaluated = true;
    answerBase.hasAdjustedManually = false;
    await answerBase.save()
  }
  static async evaluateMicroVivaAnswer(corAnsAudioID, answerAudioID) {
    const audioController = new AudioController(FirebaseStorageSingleton.getInstance());

    const corAnsAudioUrl = await audioController.getDownloadUrlFromDetails({
      ref_dir: "questions/correct_answer",
      fileName: corAnsAudioID,
      ref_ext: "wav",
      metadata: {
        contentType: "audio/wav",
      }
    })

    const answerAudioUrl = await audioController.getDownloadUrlFromDetails({
      ref_dir: "answers",
      fileName: answerAudioID,
      ref_ext: "wav",
      metadata: {
        contentType: "audio/wav",
      }
    })

    const sttHandler = new SpeechToTextController(new AsseblyAISTTStrategy())
    const smHandler = new StringMatchingController(new EditDistanceStrategy())

    const textOfCorAns = await sttHandler.getTextFromAudioUrl(corAnsAudioUrl);
    const textOfGivAns = await sttHandler.getTextFromAudioUrl(answerAudioUrl);
    const similarities = smHandler.getPercentageSimilarities(textOfCorAns, textOfGivAns);

    await DatabaseController.setAnsAudioText(answerAudioID, textOfGivAns)
    console.log("Correct Answer Text: ", textOfCorAns);
    console.log("Given Answer Text: ", textOfGivAns);
    // console.log("Similarities between texts: ", similarities);
    return similarities * 100 >= MICRO_VIVA_CORRECTNESS_THRESHOLD;
  }
}