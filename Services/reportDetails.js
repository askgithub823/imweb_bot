const reportDetails = pg_con.import ("../Schemas/PostgresSQL/reportDetails")

module.exports = async (payloadData) => {
    try {
  let payload={
    "MOBILE":payloadData.mobile,
    "BO_CODE":payloadData.BO_CODE,
    "TOKEN":payloadData.referenceNumber,
    "PAN":payloadData.panCardNo,
    "MENUID":payloadData.data.menuId,
    "REPORT_DETAILS":payloadData.data,
    "REPORT_NAME":payloadData.reportName,
    "ROLE":payloadData.ROLE,
    "REPORT_STATUS":payloadData.REPORT_STATUS
  }
console.log("payload",payload)
          var t = await pg_con.transaction()
             // let response  = Object.assign({}, BasicResponse);
              let data = await reportDetails.create(payload,{
                  transaction: t,
                  raw: true
                })
          t.commit();
          console.log("data");
          return true
	    } catch (err) {
              console.log("error while inserting the logs",err);
              // res.status(400).json(err.message)
              return false

    }

}
