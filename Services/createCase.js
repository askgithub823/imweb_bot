const axios = require('axios')

module.exports = async function(requestData){
  try {
    let options = {
        method: requestData.method,
        baseURL: process.env.ASK_USER_VALIDATE,
        params:{
          ...requestData.queryParams
        },
        headers :{
          Authorization : `Bearer ${requestData.accessToken}`
        }
    }
        console.log("============OPTIOS",options);
        
      let { data } =   await axios("/CaseCreationFromChatBot",options)
      return data
  } catch (e) {
    console.log("eeeeeeeeeeee",e);
    throw e
  }
}