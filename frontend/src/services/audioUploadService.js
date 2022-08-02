import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/audio'

const uploadAudioFile = async (token, fileDetails, blob) => {
  try {
    let body = new FormData();
    body.append('audioFile', blob);
    body.append('fileName', fileDetails.fileName);
    body.append('fileDir', fileDetails.fileDir);
    body.append('fileExt', fileDetails.fileExt);
    const response = await axios.post(baseUrl + `/upload`, body, { headers: { Authorization: `bearer ${token}`, "Content-Type": "multipart/form-data" } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getAudioFile = async (token, fileDetails) => {
  try {
    const response = await fetch(baseUrl+`/get`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`, // notice the Bearer before your token
      },
      body: JSON.stringify(fileDetails)
    }).then(r => r.blob())
    return response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const deleteAudioFile = async (token, fileDetails) => {
  try {
    const response = await axios.post(baseUrl + `/delete`, fileDetails, { headers: { Authorization: `bearer ${token}`, "Content-Type": "multipart/form-data" } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}


const exports = {
  uploadAudioFile,
  deleteAudioFile,
  getAudioFile
}

export default exports