import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/spreadsheet'

const downloadSpreadsheetForAssessment = async (token, cohortID, assessmentID) => {
  try {
    const response = await fetch(baseUrl+`/download/${cohortID}/${assessmentID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // notice the Bearer before your token
      }
    }).then(r => r.blob())
    return response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const exports = {
  downloadSpreadsheetForAssessment
}

export default exports