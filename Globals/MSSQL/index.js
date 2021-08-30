const eventEmitter = require('events')
const Sequelize = require('sequelize')

let mssqlCredentials = {
  database:"test",
  host:"localhost",
  username:"sa",
  password:"admin@123"
}
global.connectedEmitter = new eventEmitter()
global.Op = Sequelize.Op
global.mssqlSequelize = new Sequelize(mssqlCredentials.database, mssqlCredentials.username, mssqlCredentials.password, {
  host: mssqlCredentials.host,
  dialect: 'mssql',
  dialectOptions: {
    encrypt: true
  },
  pool: {
    max: 5,
    min: 1,
    acquire: 30000,
    idle: 20000
  }
})

let seq = [mssqlSequelize]

  for(let con of seq){
    con.authenticate().then(() => {
      console.log(`Connection has been established successfully for ${con.config.username}.`);
      global.connectedEmitter.emit('connectedDbs')
    }).catch(err => {
      console.error('Unable to connect to the database:', err);
    });
  }
