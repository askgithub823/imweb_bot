const axios = require('axios')

module.exports = async (taskId, processVars, value) => {
    try {
        let variables = {}
        processVars.forEach(obj => {
          variables[obj.name] = {
            value: value
          }
        })
        let config = {
            baseURL: `${process.env.CAMUNDA_URL}/engine-rest`,
            method: 'post',
            data: { variables }
        }
        let { data } = await axios(`/task/${taskId}/complete`, config)
        return data
    } catch (e) {
        throw e
    }
}