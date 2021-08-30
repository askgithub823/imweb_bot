const axios = require('axios')
const bot = require("./csBot")

module.exports = async function(request){
  console.log(request);
  try {
    let options = {
        method: 'POST',
        baseURL: process.env.ASK_USER_VALIDATE,
        params:{
          Contact_Name:request.contactName,
          Account_Name:request.accountName,
          Status:request.status,
          Case_Origin:request.caseOrigin,
          Subject:request.subject,
          Description:request.description,
          Stage:request.stage,
          Category:request.category,
          Sub_Category:request.subCategory,
          Sub_Sub_Category:request.subSubCategory,
          Priority:request.priority,
          Product:request.product,
          CaseFlag:request.caseFlag,
          WhichQueue:request.WhichQueue
        },
        headers :{
          Authorization : `${request.tokenType} ${request.accessToken}`
        }

    }
      let { data } =   await axios("/CaseCreationFromChatBot",options)
        if (data) {
          let fromDate = request.fromDate?request.fromDate.split('/').reverse().join("-"):null
          let toDate = request.toDate?request.toDate.split('/').reverse().join("-"):null

	let tfparamsObj = JSON.stringify([{
     flowName:request.flowName,
     execution_type: '',
    TF_PARAM: true,
    TF_PARAMETERS:{
      AccountName: data.Case.Account_Name,
      accountId:"-",
      phoneNo:"-",
      panNumber:"-",
      [request.flowName+"_fromdate"]: fromDate,
      [request.flowName+"_todate"]: toDate,
      flowName:  request.flowName,
      TokenNumber:request.TokenNumber,
      CaseNumber: data.Case.CaseNumber,
      loginUserMail:"rgudipally@techforce.ai",
      radioData: request.radioData,
      radioData_Email: request.radioData_Email,  }
  }])
    let arr = encodeURIComponent(tfparamsObj)
	console.log("tfparamsObj",arr)
          var csBotData = {
            	"TF_FLOW_NAME":"WhatsAppMultyReport_Bot",
              "routingKey":"172.20.40.106",
              "rabbitMqUserName":"techforce",
              "rabbitMqPassword":"techforce",
              "execution_type":"chrome",
              "user_name":"wini",
              "role":"admin",
              "TF_RESOLUTION_WIDTH":"1280",
              "TF_RESOLUTION_HEIGHT": "600",
              "TF_IF_RESOLUTION": "0",
              "TF_PARAM":"true",
              "TF_PARAMETERS":arr
        }
          // console.log("csBotData",csBotData)
          let cs =  bot(csBotData)
          return data
          //console.log("cs");
        }

  } catch (e) {
    console.log("eeeeeeeeeeee",e);
    throw e
  }
}
