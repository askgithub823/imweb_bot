const axios = require('axios')

module.exports = async (taskId) => {
  try {
    let config = {
      baseURL: `${process.env.CAMUNDA_URL}/engine-rest`,
      method: 'get',
      params: {
        deserializeValues: false
      }
    }
    let { data } = await axios(`/task/${taskId}/form-variables`, config)
    return data
  } catch (e) {
    throw e
  }
}