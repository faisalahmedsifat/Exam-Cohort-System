// @ts-nocheck

// Core Packages 
const fetch = require('cross-fetch');

// Config
const {ASSEMBLYAI_API_KEY} = require('../utils/config')
const ASSEMBLYAI_API_URL = 'https://api.assemblyai.com/v2/transcript';

// Interfaces
import { SpeechToTextStrategy } from "./interfaces/SpeechToTextStrategy";

export class AsseblyAISTTStrategy implements SpeechToTextStrategy {
  constructor() { }
  async runSTTOnUrl(audioUrl) : string{
    const data = {
      "audio_url": audioUrl
    };
    const params = {
      headers: {
        "authorization": ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
      method: "POST"
    };
    let response = await (await fetch(ASSEMBLYAI_API_URL, params)).json();
    return response['id'];
  }

  async delay(milisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, milisec);
    })
  }

  async getSTTReport(queueID) : any {
    // console.log(queueID);
    
    const url = ASSEMBLYAI_API_URL + `/${queueID}`;
    const params = {
      headers: {
        "authorization": ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
      },
      method: 'GET'
    };
    // await this.delay(15*1000);
    let response = await (await fetch(url, params)).json()
    while (true) {
      // console.log("waiting", " ", response.status);
      if(response.status === "completed") break;
      if(response.status === "error") break;
      await this.delay(1*1000);
      response = await (await fetch(url, params)).json()
    }
    return response
  }

  async getTextFromAudioUrl(audioUrl: string): Promise<string> {
    const queueID = await this.runSTTOnUrl(audioUrl);
    const STTReport = await this.getSTTReport(queueID);  
    // console.log(STTReport);
    return STTReport.text;
  };
}