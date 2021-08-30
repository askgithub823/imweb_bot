const chatHistory = require('../../../integrations/chatHistory')

module.exports = [
  (event, next) => {
    if (event.type !== 'typing' && event.text !== undefined) {
      if (event.address.user.user_id) {
        let receiver = {
          'userId': event.address.user.user_id,
          'data': [{
            'from': 'bot',
            'text': event.text,
            'payload': event.payload ? event.payload : '',
            'date' : new Date()
          }]
        }      
        console.log('sent msgs---------')  
        //chatHistory(receiver)
      }

    }
    next()
  }
]
