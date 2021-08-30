const accessToken = pg_con.import ("../../../Schemas/PostgresSQL/AccessToken")

module.exports = function(params) {
    return(async ()=>{
       try {
           let data =  await accessToken.findAll({
               raw:true
           })

		console.log("TOKEN_DATA",data [0])
		return data
       } catch (error) {
           throw error
       }
    })()
}