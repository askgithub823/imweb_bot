const Sequelize = require('sequelize')
const EventEmitter = require('events')


//function initiate_db_connection() {
  /*let postgresCredentials = {
    database: process.env.PG_DATABASE,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT
  }*/

let postgresCredentials = {
    database: "imwebchatbot_dev",
    username: "postgres",
    password: "A$kP0$TGR@S%#456",
    host: "172.25.6.11",
    port: 5442
  }
global.connectedEmitter = new EventEmitter()

console.log("======== inside potgresDB connection================")
  global.pg_con = new Sequelize(postgresCredentials.database, postgresCredentials.username, postgresCredentials.password, {
    host: postgresCredentials.host,
    port: postgresCredentials.port,
    dialect: "postgres",
	dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
      },

    //dialect: process.env.DIALECT,

    /*logging: function(query) {
        var myStr = query
        var str = '-- START',
          ind1 = myStr.indexOf(str);
        var str2 = '-- END',
          ind2 = myStr.indexOf(str2);
       var newStr = myStr.substring(ind1 + str.length, ind2).trim();
        if (ind1 == -1) {
          newStr = query.substring(0, 100)
        }
        console.log(global.colors.bg.Yellow, global.colors.fg.White,"DB LOG",global.colors.Reset, newStr,global.colors.Reset);
      },*/
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });

  // Checks whether Connection is live or not.
console.log("======== inside potgresDB after connection================", pg_con.authenticate())
  pg_con.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      connectedEmitter.emit('connectedDb')
    })
    .catch(err => {
      console.error('Unable to connect to the database:', err.toString());
      connectedEmitter.emit('dbError')
    });
//}

//initiate_db_connection()
