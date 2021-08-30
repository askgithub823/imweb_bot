const axios = require('axios')
const chatHistory = require('../integrations/chatHistory')
const logger = require(`${appPath}/Utilities/Logger`)

module.exports = async function(request){
console.log ("=======request wats up send msg",request)
  try {    
    let options = {
        method: 'POST',
        baseURL:process.env.GUP_SHUP_WHATSAPP_URL,
        params:{
          method:request.method,
          send_to:request.phoneNo,
          msg: request.msg,
          caption: request.caption ? request.caption : "",
          media_url: request.media_url ? request.media_url : "",
          msg_type: request.msgType,
          userid: process.env.GUPSHUP_USER,
          password: process.env.GUPSHUP_PASSWORD,
          auth_scheme: "plain",
          v: "1.1",
          format: "JSON"
        }
    }

	  let receiver = {
      'userId': request.phoneNo,
      'data': [{
        'from': 'bot',
        'text': request.caption,
        'payload': '',
        'date' : new Date()
      }]
    }
    // console.log('====================================');
    // console.log("receiver", receiver);
    // console.log('====================================');
    chatHistory(receiver)
  global.channelLog = logger(request.phoneNo)
    channelLog.info(`BOT_TIMESTATMP:::::${new Date().getTime()} sent to channel manager ${request.phoneNo} :::: ${request.msg}`)
      let {data} = await axios("/rest",options)  
console.log("data",data)   
      return data
  } catch (e) {
    throw e
  }
}