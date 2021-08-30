const Payment = require("../Models/Payments")
module.exports = async function(request){
    try {
        let payment = new Payment()
        let reqObj = {
            ID: request.ID,
            PAN_NUMBER: request.PAN_NUMBER,
            BO_CODE: request.BO_CODE,
            CUST_ACC_NO: request.CUST_ACC_NO,
            ASK_ACC_NO: request.ASK_ACC_NO,
            MOBILE_NO: request.MOBILE_NO
        }
        var dbres=await payment.neftTransaction(reqObj)
        console.log(dbres);
        return {success:true}    
	} catch (error) {        
	throw error    
	}}