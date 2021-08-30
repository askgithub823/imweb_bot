const fs = require('fs')

class Payments {
  constructor(payments = {}) {
    Object.assign(this, payments)
  }
}

fs.readdirSync(__dirname + "/methods/").forEach(function(file) {
  console.log("inmedels",file);
  if (file != 'index.js') {
    let filename = file.replace('.js', '')
    console.log("inmedels",file,filename);
    Payments.prototype[filename] = require(__dirname + "/methods/" + filename)
  }
})

module.exports = Payments
