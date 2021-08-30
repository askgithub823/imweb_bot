const axios = require('axios')
var fs = require('fs');
module.exports=async(payload_data)=>{
  // console.log("payload",payload_data,typeof(payload_data));
  try{
   let payload = {
     method: "POST",
     headers:{
         "Authorization":"Bearer a2e305ffa1u7dN0B4d57hW8252F26a82R5d0c9da",
     },

      data:payload_data.data
    }
     console.log(JSON.stringify(payload));
    let {data}  = await axios("https://wcuatim.askgroup.co.in/wealthspectrum/app/api/reports/executeDynamic",payload)
	   console.log("result",data)
    return data
  }catch(e){
    console.log("e in report data file",e)
    // throw e
  }
}
