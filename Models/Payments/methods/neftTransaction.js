const paymentTransaction = pg_con.import ("../../../Schemas/PostgresSQL/Transactions")
module.exports = function(request){
  console.log("in models",request);
    return(async()=>{
        var t = await pg_con.transaction()
        try {
            let createData = await paymentTransaction.create(request,{
                transaction: t,
                raw: true
            })
            t.commit();
            return true
        } catch (error) {
            console.log(error);
            t.rollback();
            //throw error
        }
    })()
}