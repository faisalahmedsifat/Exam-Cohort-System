// @ts-nocheck

const router = require('express').Router()
const logger = require('../utils/logger')
const middleware = require('../utils/middleware')

// Interfaces
import { FileDetails } from "../controllers/interfaces/StorageStrategy"

// Controllers
const { AudioController } = require('../controllers/AudioController')
const { FirebaseStorageSingleton } = require('../controllers/FirebaseStorageSingleton')

// Multer 
const multer = require('multer');
const upload = multer();

/** 
 * Routes
 * 
 * prefix: /api/audio/
 */

function handleFileCatching(req, res, next) {
  const handle = multer().single('audioFile');
  handle(req, res, function (error) {
    if (error) {
      return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
    }
    next()
  })
}

// upload
router.post('/upload', handleFileCatching, middleware.authBarrier, async (request, response) => {
  // Accepts:
  // File in key: "audioFile"
  // fileName: body.fileName
  // fileDir: body.fileDir
  try {
    const { fileDir, fileName, fileExt } = request.body
    const audioController = new AudioController(FirebaseStorageSingleton.getInstance());
    const audioFileDetails = request.file
    const byteArray = Uint8Array.from(audioFileDetails.buffer)
    const fileDetails: FileDetails = {
      ref_dir: fileDir,
      fileName: fileName,
      ref_ext: fileExt,
      metadata: {
        contentType: "audio/wav",
      }
    }
    audioController.uploadAudioBlob(fileDetails, byteArray)
    return response.status(201).json(middleware.generateApiOutput("OK", "Files Saved!"))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

// Get Audio File
router.post('/get', async (request, response) => {
  try {    
    const { fileDir, fileName, fileExt } = request.body
    const audioController = new AudioController(FirebaseStorageSingleton.getInstance());
    const fileDetails: FileDetails = {
      ref_dir: fileDir,
      fileName: fileName,
      ref_ext: fileExt
    }   
    let blob = await audioController.getAudioBlob(fileDetails);
    response.type(blob.type);
    blob.arrayBuffer().then((buf) => {
      response.send(Buffer.from(buf))
    })
    return response
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

// Delete
router.post('/delete', middleware.authBarrier, async (request, response) => {
  try {
    const { fileDir, fileName, fileExt } = request.body
    const audioController = new AudioController(FirebaseStorageSingleton.getInstance());
    const fileDetails: FileDetails = {
      ref_dir: fileDir,
      fileName: fileName,
      ref_ext: fileExt
    }
    if (!fileName) throw new Error("File name not provided!");
    audioController.deleteAudio(fileDetails)
    return response.status(200).json(middleware.generateApiOutput("OK", "Files Deleted!"))
  } catch (error) {
    return response.status(500).json(middleware.generateApiOutput("FAILED", { error: error.message }))
  }
})

module.exports = router