import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/examcohort'

const getEvaluatorsCohorts = async (token) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  const response = await axiosInstance.get(baseUrl)
  return response.data.response
}

const getSingleCohortDetails = async (token, cohortID) => {
  const axiosInstance = axios.create({
    headers: { 'Authorization': 'bearer ' + token }
  });
  const response = await axiosInstance.get(baseUrl + `/${cohortID}`)
  return response.data.response
}

const addEvaluatorsCohort = async (token, body) => {
  const response = await axios.post(baseUrl,body,{headers: { Authorization: `bearer ${token}` }})
  return response.data.response
}

const exports = {
  getEvaluatorsCohorts,
  addEvaluatorsCohort,
  getSingleCohortDetails
}

export default exports