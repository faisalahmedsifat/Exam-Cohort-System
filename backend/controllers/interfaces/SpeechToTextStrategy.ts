export interface SpeechToTextStrategy{
  getTextFromAudioUrl(audioUrl): Promise<string>;
}

