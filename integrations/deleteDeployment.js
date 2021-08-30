const axios = require('axios')

module.exports = async (id) => {
    try {
        let config = {
            method: 'delete',
            baseURL: `${process.env.CAMUNDA_URL}/engine-rest`,
            params: {
                
                cascade: true
            }
        }
        let { data } = await axios(`/deployment/${id}`, config)
        return data
    } catch (e) {
        throw e
    }
}