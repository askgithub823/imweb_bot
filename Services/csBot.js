const axios = require('axios')
module.exports=async(payload)=>{
  try{
   let options = {
     method:"POST",
     url:"http://172.20.40.106:6565/v1/rpa/metadata/rabbitMQ/standardBots/producerByFlowName",
     headers :{
          "Content-Type":"application/json",
          "Authorization":"Bearer 5b635f3ea5fcf54517c40634b13b74d34dfdea4524",
          "auth":"default"
     },
     data:payload
   }

    let {data}  = await axios(options)
	console.log("result",data)
    return data
  }catch(e){
    console.log("e",e)
    throw e
  }
}
