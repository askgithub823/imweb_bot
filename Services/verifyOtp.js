const User = require("../Models/User")

module.exports = async function(request){
    try {
        let user = new User()
        let req = {
            value: request.phoneNo ? request.phoneNo : request.email,
            key: request.phoneNo ? "WHATSAPP_PHONE" : "EMAIL_ID"
        }        
        let verifyOtp = await user.verifyOtp(req)

        if(verifyOtp){
        if(verifyOtp['OTP'] !== parseInt(request.otp)){
            return {
                    isVerified: false,
                    reEnter: true,
                    msg: "Please Enter Valid OTP"
                }
            }
            let currenTime = new Date().getTime()

            let otpCreatedTime = new Date(verifyOtp['UPDATED_DATE']).getTime()

            let timeDiff = currenTime - otpCreatedTime

            if(timeDiff <= 300000){
                return {
                        isVerified: true,
                        reEnter: false,
                        msg: "OTP Verified Successfully"
                    }
            } else {
                return {
                    isVerified: false,
                    reEnter: false,
                    msg: "OTP Expired"
                }
            }
        }
        
    } catch (error) {
        throw error
    }
}