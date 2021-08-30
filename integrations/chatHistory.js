module.exports = function (response) {
  // console.log("response",response);
  
  return (async () => {
    if (process.env.DATABASE_URI) {
      try {
        let [data] = await mssqlSequelize.query(`Select * from chathistory where userId= '${response.userId}'`)
        if (data.length) {
          let updateObj = response.data[0]
          let updateData = JSON.stringify(updateObj)
  
          outIdeaData = await mssqlSequelize.query(`UPDATE chathistory
                                                                  SET DATA = JSON_MODIFY(DATA, 'append $', JSON_QUERY(N'${updateData}')) 
                                                                  WHERE userId = '${response.userId}'`)
  
        }
        else {
          let stringData = JSON.stringify(response)
          let data = await mssqlSequelize.query(`DECLARE @json as NVARCHAR(max)  = N'${stringData}';  
              INSERT INTO chathistory 
              SELECT *   
              FROM OPENJSON(@json) 
              WITH (userId varchar(200),
                  data nvarchar(max) as json)`)
        }
  
  
      } catch (e) {
        console.log(e)
      }  
    } else {
      return null
    }
  })()
}
