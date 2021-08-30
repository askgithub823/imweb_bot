//const UserState = require('./UserState')
const fs = require('fs')
const path = require('path')
const axios = require('axios')
const startOver = require('./StartOver')

module.exports = [...startOver, parseMessage,
async (session, next) => {
    console.log('after parse message-------\n\n\n',session.message )
    // let msg = session.message.text
    // if (msg && msg.length) {
    //     // if (/[0-9]/gi.test(msg)) {
    //     fs.appendFile(path.join(__dirname, '..', '..', 'flow.log'), 'USER -> ' + msg + '\n', (e) => {
    //         if (e) console.log(e)
    //     })
    //     // }
    // }
    next()
}]

async function parseMessage(session, next) {
  console.log("session.message :",session.message);
    let displayData = {}
    let textMsg = session.message.text
    if (textMsg && textMsg.length) {
        try {
            let config = {
                method: 'get',
                params:{
                  q:textMsg
                },
                data: {
                    text: textMsg
                }
            }
            console.log('{process.env.RASA_URL}/model/parse---\n\n\n',"process.env.RASA_URL"+"/model/parse","\n",config)
            let { data } = await axios(`${process.env.RASA_URL}`, config)
            console.log("Rasa response : ");
            console.log(data.topScoringIntent);
            session.privateConversationData.currentIntent = data.topScoringIntent
            session.privateConversationData.currentIntentName = data.topScoringIntent.intent
            let entities = {}
            for (let entity of data.entities) {
                entities[entity.entity] = entity.value
            }
            session.privateConversationData.entities = entities
            displayData = {
                intent: data.intent.name,
                ...entities,
                confidence: data.intent.confidence
            }
            fs.appendFile(path.join(__dirname, '..', '..', 'flow.log'), 'USER -> ' + textMsg + ' ' +  JSON.stringify(displayData) + '\n', (e) => {
                if (e) console.log(e)
            })
            // if (displayData.confidence < 0.80) {
            //     let callstack = session.sessionState.callstack
            //     session.send("माफ़ कीजिये में आपको समज नहीं पायी")
            //     session.replaceDialog(callstack[callstack.length - 2].id)
            //     console.log(JSON.stringify(session.sessionState.callstack, null, 2))
            //     session.endDialog()
            // }
        } catch (e) {
            console.log(e)
        }
    }
    if (displayData.confidence < parseFloat(process.env.INTENT_THRESHOLD)) {

        if(process.env.channelId == 'nexmo'){
          session.send("माफ़ कीजिये में आपको समज नहीं पायी , क्या आप फिरसे बता सकते है ?")
        }else{
          next()
        }
      } else {
          if (!textMsg.includes('हेलो')) {
              next()
          } else {
              session.send('हेलो')
          }
      }
}
