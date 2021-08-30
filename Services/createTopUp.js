const axios = require('axios')
const Payments = require("../Models/Payments")

module.exports = async function(requestData){
console.log("requestData",requestData)
  try {
    let options = {
        method: "POST",
        baseURL: process.env.ASK_USER_VALIDATE,
        data:{
          ...requestData.data
        },
        headers :{
          Authorization : `Bearer ${requestData.accessToken}`
        }
    }
        console.log("============OPTIOS",options);
        let payments = new Payments()
      let { data } =   await axios("/createTopUpLead",options)
	console.log("topup",data )
      let topup_data = {
        ACCOUNT_SF_ID:requestData.data.account_sf_id,
        STRATEGY:requestData.data.strategy,
        BANK_OFFICE_EQUITY_CODE:requestData.data.back_office_equity_code,
        ACCOUNT_NUMBER:requestData.data.bank_account.account_number,
        DISTIBUTOR:requestData.data.distributor,
        ASK_RM:requestData.data.ask_rm,
        NAME:requestData.data.bank_account.name,
        IFSC:requestData.data.bank_account.ifsc,
        TRANSACTION_ID:requestData.data.transaction_id,
        CURRENCY:requestData.data.currency,
	AMOUNT : requestData.data.amount,
        LEAD_ID:data.leadId,
	STP_AMOUNT: requestData.data.stp_amount,
	NO_OF_INSTALLMENTS:requestData.data.number_of_installments,
	IS_LIQUID_FLOW:requestData.data.is_liquid_flow,
	IS_CUSTOMER_FLOW:requestData.data.is_customer_flow,
	FINANCIAL_STRATEGY :"Top Up",
        STP_START_MONTH:requestData.data.stp_start_month
      }
      console.log(topup_data);
      var res= await payments.neftTransaction(topup_data)
      console.log(res);
      return data
  } catch (e) {
    console.log("eeeeeeeeeeee",e);
    throw e
  }
}
