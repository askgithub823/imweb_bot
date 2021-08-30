const axios = require('axios')
// var fs = require('fs');
// var Blob = require('blob');
// const request = require('request');
module.exports=async(payload_data)=>{
  console.log("payload",payload_data);
  try{
   let payload = {
     method: "GET",
     headers:{
         "Authorization":"Bearer a2e305ffa1u7dN0B4d57hW8252F26a82R5d0c9da",
     },
     params:{
      fileName:payload_data
    },
    responseType:"arraybuffer",
    // encoding: null
    }

var data =   await axios("https://wcuatim.askgroup.co.in/wealthspectrum/app/api/download",payload)
 console.log("datataa",data.data);
    return data
  }catch(e){
    console.log("e in pdf file",e)
    throw e
  }
}
