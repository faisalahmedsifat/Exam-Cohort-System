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
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  const response = await axiosInstance.get(baseUrl + `/${cohortID}`)
  return response.data.response
}

const addEvaluatorsCohort = async (token, body) => {
  const response = await axios.post(baseUrl, body, { headers: { Authorization: `bearer ${token}` } })
  return response.data.response
}

const getCandidateList = async (token, cohortID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  const response = await axiosInstance.get(baseUrl + `/${cohortID}/candidate`)
  return response.data.response
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

const exports = {
  getEvaluatorsCohorts,
  addEvaluatorsCohort,
  getSingleCohortDetails,
  getCandidateList,
  addCandidateToCohort,
  deleteCandidate
}

export default exports