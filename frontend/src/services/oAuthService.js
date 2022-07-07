import axios from "axios";

const baseUrl = '/api/signin'

const getToken = async (code) => {
  const response = await axios.post(baseUrl, {code})
  return response.data
}

const exports = {
  getToken
}

export default exports