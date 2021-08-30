const ElasticSearch = require('elasticsearch')
const uuid = require('uuid/v4')

function Tracer (index, elasticSearch) {
  this.index = index
  this.client = new ElasticSearch.Client({
    host: elasticSearch
  })
}

Tracer.prototype.wrapStep = function (step) {
  return async (session, args, next) => {
    try {
      this.logTrace(session)
      await step(session, args, next, this.logError)
    } catch (e) {
      this.logError(e, session)
    }
  }
}

Tracer.prototype.wrapFlow = function (flow) {
  let wrappedSteps = []
  for (let step of flow) {
    wrappedSteps = [...wrappedSteps, this.wrapStep(step)]
  }
  return wrappedSteps
}

Tracer.prototype.logTrace = function (session) {
  return (async () => {
    try {
      let senderId = session.message.user.id
      let data = {
        id: senderId,
        conversation_data: session.privateConversationData,
        address: session.message.address,
        message: session.message.text,
        session_state: session.sessionState,
        dialog_data: session.dialogData,
        type: 'info'
      }
      let response = await this.client.index({
        index: this.index,
        type: 'trace',
        id: uuid(),
        body: data
      })
      return response
    } catch (e) {
      console.log('.')
    }
  })()
}

Tracer.prototype.logError = function (err, session) {
  return (async () => {
    try {
      let senderId = session.message.user.id
      let data = {
        id: senderId,
        conversation_data: session.privateConversationData,
        address: session.message.address,
        message: session.message.text,
        session_state: session.sessionState,
        dialog_data: session.dialogData,
        error: err.toString(),
        type: 'error'
      }
      let response = await this.client.index({
        index: this.index,
        type: 'trace',
        id: uuid(),
        body: data
      })
      return response
    } catch (e) {
      console.log('.')
    }
  })()
}

module.exports = Tracer