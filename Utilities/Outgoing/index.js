const fs = require('fs')
const path = require('path')
const BotState = require('./BotState')

module.exports = [...BotState, async (event, next) => {
    let msg = event.text
    if (msg && msg.length) {
        // if (/(स्टार|बोर्नविटा|हॉल्स|पर्क)/gi.test(msg)) {
            fs.appendFile(path.join(__dirname, '..', '..', 'flow.log'), 'BOT -> ' + msg + '\n' , (e) => {
                if (e) console.log(e)
            })
        // }    
    }
    next()
}]
