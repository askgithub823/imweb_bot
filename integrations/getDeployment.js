const axios = require('axios')

module.exports = async (name) => {
    try {
        let config = {
            method: 'get',
            baseURL: `${process.env.CAMUNDA_URL}/engine-rest`,
            params: {
                name
            }
        }
        let { data } = await axios('/deployment', config)
        return data
    } catch (e) {
        throw e
    }
}