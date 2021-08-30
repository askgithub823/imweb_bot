const User = require("../Models/User")

module.exports = async function(request){
    try {
        let user = new User()
        let reqObj = {
            USER_RATING: request.userFeedback,
            WHATSAPP_PHONE: request.whatsAppPhone,
            CREATED_DATE: new Date(),
            UPDATED_DATE: new Date()
        }
        let saveFeedback = await user.saveFeedback(reqObj)
        return true
    } catch (error) {
        throw error
    }
}