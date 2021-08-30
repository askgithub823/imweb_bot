const axios = require('axios')
const logger = require(`${appPath}/Utilities/Logger`)
module.exports = async function(requestData) {
console.log("umaaaaaaaaaaaaaaaaaa") 
   try {        
	let options = {            
	method: "GET",            
	baseURL: process.env.ASK_USER_VALIDATE,            
	params: {                
		...requestData.queryParams            
	 },            
	headers: {                
		Authorization: `Bearer ${requestData.accessToken}`            
		}        

	}        
	let {data} = await axios(`/getProductMasters`,options)        
	console.log(Object.values(data.mapOfProducts))        
	return Object.values(data.mapOfProducts)    
	} catch (error) {      
	console.log("==========================================================================");      
	console.log(error.response.data);      
	console.log("==========================================================================");       
 	throw error.response.data[0]   
 	}}