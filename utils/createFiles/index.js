const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = function (files) {
  files = files.map((file, index) => {
    let shasum = crypto.createHash('sha1')
    let fileExtension = path.extname(file.name)
    let fileName = shasum.update(file.content).digest('hex') + fileExtension
    let filePath = path.resolve(__dirname, '..', '..', 'tmp', fileName)
    // let filePath = `${appDir}/tmp/${fileName}`
    fs.writeFileSync(filePath, file.content)
    return {
      ...file,
      path: filePath
    }
  })
  return files
}
