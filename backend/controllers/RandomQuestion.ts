// @ts-nocheck

import { McqQuestion } from "./McqQuestion";
import { ExamCohortController } from "./ExamCohortController";



export class RandomQuestionSingleton{

    private static instance: RandomQuestionSingleton
    private randomNumbers;
    private randomNumberResponses;
    private randomNumbersLength;
    private mcqQuestions
    private currentIndex = 0;

    private constructor(randomNumbers, randomNumbersLength, randomNumberResponses, mcqQuestions, currentIndex){
        this.randomNumbers = randomNumbers;
        this.randomNumbersLength = randomNumbersLength;
        this.randomNumberResponses = randomNumberResponses;
        this.mcqQuestions = mcqQuestions;
    }

    public static getInstance(randomNumbers, randomNumbersLength, randomNumberResponses, mcqQuestions, currentIndex): RandomQuestionSingleton {
        if (!RandomQuestionSingleton.instance) RandomQuestionSingleton.instance = new RandomQuestionSingleton(randomNumbers, randomNumbersLength, randomNumberResponses, mcqQuestions, currentIndex);
        return RandomQuestionSingleton.instance;
    }

    public async generateRandomQuestions(assessmentID){
        

    }
    
}
