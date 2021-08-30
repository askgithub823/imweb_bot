const axios = require('axios')
const logger = require(`${appPath}/Utilities/Logger`)
module.exports = async function(requestData) {  
console.log("hi incustomer",requestData.Pan);
  let validate = requestData.Pan == undefined ?  "Customer" : "Pan"	   
 try {     
   let channelLog = logger(91+requestData.queryParams.Mobile)       
 channelLog.info(`BOT_TIMESTATMP:::::${new Date().getTime()}  before invoking ${validate} validate Api ::::`)  
      let accDetails= []      
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
	let {data} = await axios(`/CustomerValidate`,options)       
	 console.log(data)   
     for (let i = 0; i < data.PANAssociatedBOCodeStrategy.length; i++){     
     let boCode = Object.keys(data.PANAssociatedBOCodeStrategy[i])          
	let account={}    
      let dataObj = data.PANAssociatedBOCodeStrategy[i][boCode[0]]       
	   account.Bo_Code = boCode[0]    
      account.Client_Personal_Bank_Name =dataObj.Client_Personal_Bank_Name       
	   account.Client_Personal_Bank_Branch =dataObj.Client_Personal_Bank_Branch      
    account.Client_Personal_AC_No =dataObj.Client_Personal_AC_No    
      account.Client_Personal_AC_Type =dataObj.Client_Personal_AC_Type          
	account.Client_Personal_IFSC_Code =dataObj.Client_Personal_IFSC_Code          
	account.Client_Type =dataObj.Client_Type          
	account.DP_Name_Primary = dataObj.DP_Name_Primary
	account.Strategy = dataObj.Strategy
        account.NAV_Amount = dataObj.NAV_Amount
	account.Intermediary_RM_Name = dataObj.Intermediary_RM_Name
	account.Intermediary_RM_SF_Id = dataObj.Intermediary_RM_SF_Id
	account.Channel_Partner = dataObj.Channel_Partner
	account.Channel_Partner_Id = dataObj.Channel_Partner_Id
	 accDetails.push(account)        
	}       
	 channelLog.info(`BOT_TIMESTATMP:::::${new Date().getTime()} after receiving response from  ${validate} validate api  :::: ${data.isMobileValidated}`)    
	    return accDetails;   
	 } catch (error) {     
	 console.log("==========================================================================");     
	 console.log(error.response.data);     
	 console.log("==========================================================================");     
   throw error.response.data[0]  
  }}