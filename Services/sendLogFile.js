const axios = require('axios')
module.exports=async(requestData)=>{
  try{
   let payload = {
     method: "GET",
     baseURL: process.env.ASK_USER_VALIDATE,
     headers :{
       Authorization : `Bearer ${requestData.accesstoken}`
     },
     params:{
       ...requestData.queryParams
     },

    }

    let {data}  = await axios("/IndividualWhatsAppTranscripts",payload)
	console.log("result",data)
    return data
  }catch(e){
    console.log("e",e)
    throw e
  }
}
