// @ts-nocheck

// Interfaces and Classess
import {SpeechToTextStrategy} from './interfaces/SpeechToTextStrategy'

// Strategy Design Pattern
export class SpeechToTextController{
  private sttStrategy: SpeechToTextStrategy;
  constructor(sttStrategy: SpeechToTextStrategy){
    this.setSttStrategy(sttStrategy);
  }
  public setSttStrategy(sttStrategy: SpeechToTextStrategy){
    this.sttStrategy = sttStrategy;
  }
  public async getTextFromAudioUrl(audioUrl){
    return await this.sttStrategy.getTextFromAudioUrl(audioUrl)
  }
}
