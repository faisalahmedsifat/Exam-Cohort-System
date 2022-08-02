// @ts-nocheck

// Config
const config = require('../utils/config')

// Core Packages
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
const fetch = require('cross-fetch');

// Interfaces
import { StorageStrategy } from "./interfaces/StorageStrategy";
import { FileDetails } from "./interfaces/StorageStrategy";


export class FirebaseStorageSingleton implements StorageStrategy {
  private static instance: FirebaseStorageSingleton
  private firebaseApp;
  private firebaseStorage;
  private constructor() {
    this.firebaseApp = initializeApp(config.firebaseConfig);
    this.firebaseStorage = getStorage(this.firebaseApp)
  }
  public static getInstance(): FirebaseStorageSingleton {
    if (!FirebaseStorageSingleton.instance) FirebaseStorageSingleton.instance = new FirebaseStorageSingleton();
    return FirebaseStorageSingleton.instance;
  }
  public async uploadBlob(details: FileDetails, blob:any): Boolean{
    try {      
      const fileRef = ref(this.firebaseStorage, `${details.ref_dir}/${details.fileName}.${details.ref_ext}`)
      await uploadBytes(fileRef, blob, details.metadata)
      return true;
    } catch (error) {
      return false;
    }
  }
  public async getBlob(details: FileDetails){
    const url = await getDownloadURL(ref(this.firebaseStorage, `${details.ref_dir}/${details.fileName}.${details.ref_ext}`))    
    return await fetch(url).then(r => r.blob())
  }
  public async deleteRef(details: FileDetails){
    return await deleteObject(ref(this.firebaseStorage, `${details.ref_dir}/${details.fileName}.${details.ref_ext}`))
  }
}

