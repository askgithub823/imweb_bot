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
	console.log("hhh",options)
        let {data} = await axios(`/MobileValidateCustDist`,options)
        console.log("in this api",data);
        return data
    } catch (error) {
        console.log(error.data);
        throw error
    }
}
