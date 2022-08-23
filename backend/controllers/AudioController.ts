// @ts-nocheck

// Intefaces
import { StorageStrategy } from "./interfaces/StorageStrategy";
import { FileDetails } from "./interfaces/StorageStrategy";

// Other Controllers
const DatabaseController = require('./DatabaseController')

// Strategy Design Pattern
export class AudioController{
  private storageStrategy: StorageStrategy;
  constructor(storageStrategy: StorageStrategy){
    this.setStorageStrategy(storageStrategy);
  }
  public async getDownloadUrlFromDetails(details: FileDetails){
    return await this.storageStrategy.getDownloadUrlFromDetails(details);
  }
  public setStorageStrategy(storageStrategy: StorageStrategy){
    this.storageStrategy = storageStrategy;
  }
  public async uploadAudioBlob(details: FileDetails, blob: any): Boolean{
    return await this.storageStrategy.uploadBlob(details, blob)
  }
  public async getAudioBlob(details: FileDetails){
    return await this.storageStrategy.getBlob(details)
  }
  public async deleteAudio(details: FileDetails){    
    await this.storageStrategy.deleteRef(details)
  }
}
