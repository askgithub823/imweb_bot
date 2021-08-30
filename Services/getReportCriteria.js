const axios = require('axios')
var fs = require('fs');
module.exports=async(payload_data)=>{
  // console.log("payload",payload_data,typeof(payload_data));
  try{
   let payload = {
     method: "GET",
     headers:{
         "Authorization":"Bearer a2e305ffa1u7dN0B4d57hW8252F26a82R5d0c9da",
     },

     params: {
         ...payload_data
     }
    }
    console.log(payload);
    var refinedCriteria = {}
    let {data}  = await axios("https://wcuatim.askgroup.co.in/wealthspectrum/app/api/reportCriteria",payload)
    data.data.map((obj,i)=>{
      refinedCriteria[obj.field]={
        "defaultValue":obj.defaultValue,
        "options":obj.options
      }
    })

    return refinedCriteria
  }catch(e){
    console.log("e in report data file",e)
    throw e
  }
}
