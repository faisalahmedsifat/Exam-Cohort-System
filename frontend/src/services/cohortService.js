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

const exports = {
  getEvaluatorsCohorts
}

export default exports