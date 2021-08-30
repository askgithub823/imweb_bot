const askUserDetails = pg_con.import ("../../../Schemas/PostgresSQL/UserDetails")

module.exports = function(request){
    return(async ()=>{
        try {
            let findPhone = await askUserDetails.findOne({
                where: {
                    [request.key]: request.value
                },
                raw: true
            })
            return findPhone
        } catch (error) {
            throw error
        }
        
    })()
}