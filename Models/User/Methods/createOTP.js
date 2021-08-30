const askUserDetails = pg_con.import ("../../../Schemas/PostgresSQL/UserDetails")

module.exports = function(request){
    return(async()=>{
        var t = await pg_con.transaction()
        try {
            // let findPhone = await askUserDetails.findOne({
            //     where: {
            //         WHATSAPP_PHONE: request.WHATSAPP_PHONE
            //     },
            //     raw: true
            // })
		console.log("=========== log in Models===", request, askUserDetails)
                let userDetails = {}
                userDetails["key"] = request.PHONE_NO ? "WHATSAPP_PHONE" : "EMAIL_ID",
                userDetails["value"] = request.PHONE_NO ? request.WHATSAPP_PHONE : request.EMAIL_ID
		console.log("====user details=====", userDetails)
            let findPhone = await this.findDetails(userDetails)
console.log("models CreateOTP findPone",findPhone)
            if(findPhone){
                await askUserDetails.update({
                    OTP: request.OTP,
                    UPDATED_DATE: new Date(),
                    PHONE_NO: request.PHONE_NO,
                    EMAIL_ID: request.EMAIL_ID,
                    WHATSAPP_PHONE: request.WHATSAPP_PHONE
                },{
                    where: {
                        [userDetails.key]: userDetails.value
                    },
                    transaction: t
                })
            } else {
                let createData = await askUserDetails.create(request,{
                    transaction: t,
                    raw: true
                  })    
            }
            t.commit();
            return true
        } catch (error) {
	    console.log("==Error in OTP===", error)
            t.rollback();
            throw error
        }
        
    })()
}