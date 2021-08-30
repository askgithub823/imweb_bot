  const path = require('path')
  var fs = require('fs');
  const axios = require('axios')
module.exports = async function(payload){
  console.log("in services");
  try {

    let options = {
      method: "GET",
      headers:{
           "Content-Type":"application/json",
         },
      data:payload

    }
    // console.log("options",options);
let{ data} =  await axios(`http://172.25.8.15:3030/getLog`,options)
console.log("log file ",data);
return data
  }catch(e){
console.log("error",e);
throw e
  }
}
