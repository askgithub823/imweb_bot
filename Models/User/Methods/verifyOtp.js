const askUserDetails = pg_con.import ("../../../Schemas/PostgresSQL/UserDetails")

module.exports = function(request){
    return(async()=>{

        try {
	console.log("models Verify otp request",request)
            let data = await askUserDetails.findOne({
                where: {
                    [request.key]: request.value
                },
                raw: true
            })
console.log("data in models",data)
            if(data) return data
            else {
		
                throw new Error("No Data Found")
            }
        } catch (error) {
	console.log("err",error)
            throw error
        }
    })()
}