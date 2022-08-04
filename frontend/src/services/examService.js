import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/exam'

const getNextQuestion = async (token, assessmentID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${assessmentID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const submitCurrentQuestion = async (token, assessmentID, body) => {
  try {
    const response = await axios.post(baseUrl + `/${assessmentID}/submit_single`, body, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const exports = {
  getNextQuestion,
  submitCurrentQuestion
}

export default exports