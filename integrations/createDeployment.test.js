const fs = require('fs')
const path = require('path')
const createDialog = require('techforceai-dialog-constructor')
const createDeployment = require('./createDeployment')

let bpmn = fs.readFileSync(path.resolve('..', 'test', 'dialog.bpmn'), {
    encoding: 'utf8'
})

let { dialog, processId, dialogFlows } = createDialog(bpmn)

createDeployment(processId, bpmn).then(data => console.log(data)).catch(e => console.log(e))
