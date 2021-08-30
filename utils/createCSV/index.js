let createFiles = require('../createFiles')

module.exports = function (tableData) {
  let content = ''
  let keys = Object.keys(tableData[0])
  content = keys.join(',') + '\n'
  tableData.forEach(obj => {
    keys.forEach(key => content = content + obj[key] + ',')
    content = content + '\n'
  })
  let fileMeta = {
    name: 'data.csv',
    content: content,
    mimeType: 'text/plain'
  }
  let files = createFiles([fileMeta])
  return files
}
