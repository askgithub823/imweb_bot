const axios = require('axios')

module.exports = async function(requestData) {
    try {
        let options = {
            method: "GET",
            baseURL: process.env.ASK_USER_VALIDATE,
            params: {
                ...requestData.queryParams
            },
            headers: {
                Authorization: `Bearer ${requestData.accessToken}`
            }
        }
        let {data} = await axios(`/DistributorValidate`,options)
        return data
    } catch (error) {
        console.log(error); 
        throw error
    }
}