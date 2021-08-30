const axios = require('axios')
const randomize = require("randomatic")
const User = require("../Models/User")
module.exports = async function(request){
    console.log("========r",request);

    try {

        let userName = request.userName
        let phone = request.phoneNo ? request.phoneNo : null
        let emailId = request.email
        let whatsAppNo = request.phoneNo

        // let userName = request.userName ? request.userName : "Partner"
        // let phone = request.phoneNo ? request.phoneNo : null
        // let emailId = "mmanchukonda@techforce.ai"
        // let whatsAppNo = "8179382234"

        let randomNumber = randomize('0', 6);
        console.log("=========OTP",randomNumber);
        console.log("=========request.user\n",request.userName);
        if(request.userName == "Customer"){
            console.log("=========inside customer");
        let options = {
            method: 'GET',
            params: {
            method: "SendMessage",
            send_to: phone,
            msg_type: "TEXT",
            userid: process.env.GUPSHUP_SEND_MESSAGE_USERID,
            auth_scheme : "plain",
            password: process.env.GUPSHUP_SEND_MESSAGE_PASSWORD,
            v: "1.1",
            format:"JSON",
            msg: `Dear ${userName}, your One Time Pin (OTP) for validating your mobile is ${randomNumber}. It is going to expire in 5 minutes.`
            }
        }
          var resp=await axios(`https://enterprise.smsgupshup.com/GatewayAPI/rest`,options)
          console.log("resp===========\n\n",resp)
    }
  let sendMailOptions = {
    method: 'POST',
    params: {
        method: "EMS_POST_CAMPAIGN",
        userid: process.env.GUPSHUP_SEND_MAIL_USERID,
        auth_scheme : "plain",
        password: process.env.GUPSHUP_SEND_MAIL_PASSWORD,
        v: "1.1",
        format:"JSON",
        name: "Customer Experience",
        recipients: emailId,
        fromEmailId: process.env.GUPSHUP_SEND_MAIL_FROMID,
        replyToEmailId: process.env.GUPSHUP_SEND_MAIL_REPLYID,
        subject: "ASK Investment Managers Ltd. - Your One-Time Password",
        content_type: "text/html",
        content: `Dear ${userName}, your One Time Pin (OTP) for validating your email is ${randomNumber}. It is going to expire in 5 minutes.`
        }
    }
    let {data : {response}} = await axios(`https://enterprise.webaroo.com/GatewayAPI/rest`, sendMailOptions)

    let user = new User()
    console.log("====OTP updateing in DB=========", user)
    let createData = {
        PHONE_NO: phone,
        WHATSAPP_PHONE: phone,
        EMAIL_ID:emailId,
        CREATED_DATE: new Date(),
        UPDATED_DATE: new Date(),
        VERIFIED: false,
        OTP: randomNumber
    }
    console.log("====Data=========", createData)

    var res= await user.createOTP(createData)
    console.log("res\n\n\n",res)
    return true;
} catch (error) {
    console.log(error);
    throw error
    }
}
