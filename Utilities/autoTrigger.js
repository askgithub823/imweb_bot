module.exports = [
    async (session, args, next) => {
        console.log('autotrigger---------',session.message)
        let payload = session.message.payload
        if (payload && payload.trigger) {
            session.message.text = payload.triggerId
            console.log(payload.triggerId)
            session.replaceDialog(payload.triggerId)
        } else {
            next()
        }
    }
]
