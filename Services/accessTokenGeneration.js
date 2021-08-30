const axios = require('axios')

module.exports = async function(request){
 try {
   let {data}  =   await axios.post(`${process.env.ASK_ACCESS_TOKEN_URL}`)
   return data
 } catch (e) {
   throw e
 }
}