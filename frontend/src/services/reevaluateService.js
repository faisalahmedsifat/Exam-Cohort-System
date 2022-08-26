import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/examcohort/'

const getAllResponsesOfAssessment = async (token, cohortID, assessmentID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${cohortID}/assessment/${assessmentID}/responses`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getCandidateResponsesForReEvaluation = async (token, cohortID, assessmentID, candidateID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${cohortID}/assessment/${assessmentID}/responses/${candidateID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const markAsCorrect = async (token, cohortID, assessmentID, candidateID, answerID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${cohortID}/assessment/${assessmentID}/responses/${candidateID}/answer_mark_correct/${answerID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const markAsInCorrect = async (token, cohortID, assessmentID, candidateID, answerID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${cohortID}/assessment/${assessmentID}/responses/${candidateID}/answer_mark_incorrect/${answerID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const resetCandidateResponse = async (token, cohortID, assessmentID, candidateID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${cohortID}/assessment/${assessmentID}/responses/${candidateID}/reset`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const exports = {
  getAllResponsesOfAssessment,
  getCandidateResponsesForReEvaluation,
  markAsCorrect,
  markAsInCorrect,
  resetCandidateResponse
}

export default exports