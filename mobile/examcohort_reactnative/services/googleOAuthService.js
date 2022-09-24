import axios from "axios";
import Config from "react-native-config";

const baseUrl = Config.BACKEND_URL + '/api/auth/oauth/google/app'

const getToken = async (idToken) => {
  const response = await axios.post(baseUrl, {idToken})
  return response.data
}

const exports = {
  getToken
}

export default exports