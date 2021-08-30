const axios = require('axios')
const logger = require(`${appPath}/Utilities/Logger`)
module.exports = async function(requestData) {
  console.log("hi incustomer",requestData.Pan);
  let validate = requestData.Pan == undefined ?  "Customer" : "Pan"
	
    try {
 let channelLog = logger(91+requestData.queryParams.Mobile)
        channelLog.info(`BOT_TIMESTATMP:::::${new Date().getTime()}  before invoking ${validate} validate Api ::::`)


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
            remappedPayload = JSON.stringify(data);
        remappedPayload = JSON.parse(remappedPayload)
        for (let i = 0; i < data.PANAssociatedBOCodeStrategy.length; i++){
          let boCode = Object.keys(data.PANAssociatedBOCodeStrategy[i])
          var bodata= data.PANAssociatedBOCodeStrategy[i][boCode[0]]
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]]={}
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Id = bodata.Id
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Strategy = bodata.Strategy
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Cell_No = bodata.Cell_No
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].NAV_Amount = bodata.NAV_Amount
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Nav_As_On_Date = bodata.Nav_As_On_Date
	  remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].PersonEmail = bodata.PersonEmail
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Client_Type = bodata.Client_Type
          remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].DP_Name_Primary  = bodata.DP_Name_Primary
	  remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Intermediary_RM_Id  = bodata.Intermediary_RM_Id
	  remappedPayload.PANAssociatedBOCodeStrategy[i][boCode[0]].Intermediary_RM_SF_Id  = bodata.Intermediary_RM_SF_Id
        }
        channelLog.info(`BOT_TIMESTATMP:::::${new Date().getTime()} after receiving response from  ${validate} validate api  :::: ${data.isMobileValidated}`)
          return remappedPayload;    } catch (error) {
      console.log("==========================================================================");
      console.log(error.response.data);
      console.log("==========================================================================");
        throw error.response.data[0]
    }
}
