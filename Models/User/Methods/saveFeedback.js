const askUserDetails = pg_con.import ("../../../Schemas/PostgresSQL/UserDetails")

module.exports = function(request){
    return(async()=>{
        var t = await pg_con.transaction()
        try {
            let findPhone = await askUserDetails.findOne({
                where: {
                    WHATSAPP_PHONE: request.WHATSAPP_PHONE
                },
                raw: true
            })
            
            if(findPhone){
                await askUserDetails.update({
                    USER_RATING: parseInt(request.USER_RATING),
                    UPDATED_DATE: new Date()
                },{
                    where: {
                        WHATSAPP_PHONE: request.WHATSAPP_PHONE
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
            console.log(error);
            t.rollback();
            throw error
        }
        
    })()
}