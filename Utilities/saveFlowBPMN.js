const fs = require('fs')
const path = require('path')

module.exports = (fileName, xmlBody) => {
    let filePath = path.join(__dirname, '..', 'Flows', `${fileName}.bpmn`)
    fs.writeFile(filePath, xmlBody, 'utf8', (err) => {
        if (err) {
            console.log(err)
        } else {
            console.log(`written flow to ${filePath}.`)
        }
    })
}