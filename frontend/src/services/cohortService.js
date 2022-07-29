import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/examcohort'

const getEvaluatorsCohorts = async (token) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl)
    return response.data.response
  } catch (error) {
    console.log(error);
    throw Error(error.response.data.response.error);
  }
}

const getSingleCohortDetails = async (token, cohortID) => {
  try {
    const axiosInstance = axios.create({
      headers: { 'Authorization': 'bearer ' + token }
    });
    const response = await axiosInstance.get(baseUrl + `/${cohortID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const addEvaluatorsCohort = async (token, body) => {
  try {
    const response = await axios.post(baseUrl, body, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getCandidateList = async (token, cohortID) => {
  try {
    const axiosInstance = axios.create({
      headers: { 'Authorization': 'bearer ' + token }
    });
    const response = await axiosInstance.get(baseUrl + `/${cohortID}/candidate`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const addCandidateToCohort = async (token, cohortID, body) => {
  try {
    const response = await axios.post(baseUrl + `/${cohortID}/candidate`, body, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const deleteCandidate = async (token, cohortID, candidateID) => {
  try {
    const response = await axios.delete(baseUrl + `/${cohortID}/candidate/${candidateID}`, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getAssessmentList = async (token, cohortID) => {
  try {
    const axiosInstance = axios.create({
      headers: { 'Authorization': 'bearer ' + token }
    });
    const response = await axiosInstance.get(baseUrl + `/${cohortID}/assessment`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const addAssessmentToCohort = async (token, cohortID, body) => {
  try {
    const response = await axios.post(baseUrl + `/${cohortID}/assessment`, body, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const deleteAssessment = async (token, cohortID, candidateID) => {
  try {
    const response = await axios.delete(baseUrl + `/${cohortID}/assessment/${candidateID}`, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getSingleAssessmentDetails = async (token, cohortID, assessmentID) => {
  try {
    const axiosInstance = axios.create({
      headers: { 'Authorization': 'bearer ' + token }
    });
    const response = await axiosInstance.get(baseUrl + `/${cohortID}/assessment/${assessmentID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getQuestionsList = async (token, cohortID, assessmentID) => {
  try {
    const axiosInstance = axios.create({
      headers: { 'Authorization': 'bearer ' + token }
    });
    const response = await axiosInstance.get(baseUrl + `/${cohortID}/assessment/${assessmentID}/questions`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const addQuestionToAssessment = async (token, cohortID, assessmentID,body) => {
  try {
    const response = await axios.post(baseUrl + `/${cohortID}/assessment/${assessmentID}/questions`, body, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const deleteQuestion = async (token, cohortID, assessmentID,questionID) => {
  try {
    const response = await axios.delete(baseUrl + `/${cohortID}/assessment/${assessmentID}/questions/${questionID}`, { headers: { Authorization: `bearer ${token}` } })
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}



const exports = {
  getEvaluatorsCohorts,
  addEvaluatorsCohort,
  getSingleCohortDetails,
  getCandidateList,
  addCandidateToCohort,
  deleteCandidate,
  getAssessmentList,
  addAssessmentToCohort,
  deleteAssessment,
  getSingleAssessmentDetails,
  getQuestionsList,
  addQuestionToAssessment,
  deleteQuestion
}

export default exports