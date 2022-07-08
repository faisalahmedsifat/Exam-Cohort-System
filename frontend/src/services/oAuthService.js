import axios from "axios";
import config from "../utils/config"

const baseUrl = config.REACT_APP_BACKEND_URL + '/api/user/signin'

const getToken = async (code) => {
  const response = await axios.post(baseUrl, {code})
  return response.data
}

const exports = {
  getToken
}

export default exports