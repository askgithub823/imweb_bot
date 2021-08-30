const fs = require('fs')
const normalizedPath = require('path').join(__dirname)

// if (process.env.DEBUG != 'true') {
//   global.mochalog = global.console.log
//   global.console.log = () => {}
// }

// fs.readdirSync(normalizedPath).forEach(function(file) {
//   if (fs.lstatSync(normalizedPath + '/' + file).isDirectory()) {
//     console.log(file)
//     require(normalizedPath + '/' + file)
//   }
// })

if (process.env.DIALECT == "postgres") {
  //Check whether DIALECT is postgres, so that we can initiate a new postgres database connection.

  console.log("Detected PostgresSQL Database !");

  //This file is responsible for connecting to PostgresSQL with all the details.
  /**
   * Details needed from .env (All the details are mandatory)
   DATABASE=database
   USERNAME=username
   PASSWORD=password
   HOST=host
   PORT=port
   DIALECT=dialect
   */
  if (
    process.env.PG_DATABASE &&
    process.env.PG_USERNAME &&
    process.env.PG_PASSWORD &&
    process.env.PG_HOST &&
    process.env.PG_PORT)
    {
      	console.log("====inside if postgresglobal===========")
	require('./PostgresSQL')
    }
    else {
      console.log(`Unable to connect to PostgresSQL Databse since below details are missing:\n${process.env.PG_DATABASE ? "":"    PG_DATABASE\n"}${process.env.PG_USERNAME ? "":"    PG_USERNAME\n"}${process.env.PG_PASSWORD ? "":"    PG_PASSWORD\n"}${process.env.PG_HOST ? "":"    PG_HOST\n"}${process.env.PG_PORT ? "":"    PG_PORT"}`);
    }
}
