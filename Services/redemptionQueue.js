const axios = require('axios')

module.exports = async function(requestData){
  try {
    console.log("in createCase");
    let options = {
      method: "POST",
       baseURL: process.env.ASK_USER_VALIDATE,
       data : {
         ...requestData.data
       },
       headers :{
          ...requestData.headers
       }
    }
        console.log("============OPTIOS",options);
      let { data } =   await axios("/CaseQueueWebServ",options)
      console.log("data",data);

      return data
  } catch (e) {
    console.log("eeeeeeeeeeee",e);
    throw e
  }
}
