import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/assignedcohort'

const getAssignedCohorts = async (token) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getSingleAssignedCohortDetails = async (token, cohortID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  try {
    const response = await axiosInstance.get(baseUrl+`/${cohortID}`)
    return response.data.response
  } catch (error) {
    throw Error(error.response.data.response.error);
  }
}

const getAssignedAssessmentList = async (token, cohortID) => {
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

const exports = {
  getAssignedCohorts,
  getSingleAssignedCohortDetails,
  getAssignedAssessmentList
}

export default exports