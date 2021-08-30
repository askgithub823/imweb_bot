const accessToken = pg_con.import ("../../../Schemas/PostgresSQL/AccessToken")

module.exports = function(request) {
    return(async ()=>{
       try {          
           console.log("UPDATING ACCESS TOKEN", request);
           
            var t = await pg_con.transaction()
            let data =  await accessToken.update(request,{
                where: {},
                transaction: t,
                raw: true
            })
            t.commit()
            return data
        } catch (error) {
            t.rollback()
            throw error
        }
    })()
}