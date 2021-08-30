const axios = require('axios')

module.exports = async function(request){
 try {
   let {data}  =   await axios.post("https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9YDQS5WtC11ptqekXxB5KC0LjboK9DRk.B6ac9p0sX6qaf7Mul0RZPiCbXICLbca14KflmjG6d87EFihZ&client_secret=6145F1620CE6DF2898353CDC394581AE324C7D4C0F32F7D68B49AB051BE08448&username=integration.user@askgroup.com&password=centelon@123")
   return data
 } catch (e) {
   throw e
 }
}