const axios = require('axios')

module.exports = async function(requestData){
  try {
console.log("requestData---------------",requestData)
  let url = "https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9YDQS5WtC11ptqekXxB5KC0LjboK9DRk.B6ac9p0sX6qaf7Mul0RZPiCbXICLbca14KflmjG6d87EFihZ&client_secret=6145F1620CE6DF2898353CDC394581AE324C7D4C0F32F7D68B49AB051BE08448&username=integration.user@askgroup.com&password=centelon@123"
    	let {data}= await axios.post(url);
	let access_token = data.access_token;
	//console.log("access_token..............", access_token, data)
	let token = "Bearer "+access_token;

	
	let options = {
        headers :{
          'Authorization' : token 
        }
	     }

        console.log("============OPTIOS",options);
let Mobile=requestData.Mobile?requestData.Mobile:"";
let ClientName=requestData.ClientName?requestData.ClientName:"" ;
let Pan=requestData.Pan?requestData.Pan:"";
let Email=requestData.Email?requestData.Email:"";
let BO_Code=requestData.BO_Code?requestData.BO_Code:"";
        
      let data1  =   await axios.get("https://askgroup.my.salesforce.com/services/apexrest/NLPCustomerDetails?Mobile="+Mobile+"&ClientName="+ClientName+"&Pan="+Pan+"&Email="+Email+"&BO_Code="+BO_Code, options)
	console.log('...............', data1.data);

      return data1.data
  } catch (e) {
    console.log("eeeeeeeeeeee",e);
    throw e
  }
}