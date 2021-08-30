const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')

module.exports = (req, res, next) => {
    let processId = req.params.processId
    try {
        let filePath = path.join(__dirname, '..', 'Flows', `${processId}.bpmn`)
        let $ = cheerio.load(fs.readFileSync(filePath, 'utf8'), {
            xmlMode: true
        })
        let startId = $('bpmn2\\:startEvent').attr('id')
        let startFormData = []
        $(`#${startId}`).find('camunda\\:formField').each((i, formEl) => {
            let type = $(formEl).attr('type')
            let payload = {}
            let constraints = {}
            $(formEl).find('camunda\\:constraint').each((i, constrEl) => {
                constraints[$(constrEl).attr('name')] = $(constrEl).attr('config')
            })
            payload = {
                id: $(formEl).attr('id'),
                label: $(formEl).attr('label'),
                type: type,
                defaultValue: $(formEl).attr('defaultValue'),
                constraints: constraints
            }
            if (type == 'enum') {
                payload['options'] = []
                $(formEl).find('camunda\\:value').each((i, el) => {
                    payload.options = [...payload.options, {
                        id: $(el).attr('id'),
                        name: $(el).attr('name')
                    }]
                })
            }
            startFormData = [...startFormData, payload]
        })
        req.startFormData = {
            name: $(`#${startId}`).attr('name'),
            processId: processId,
            taskId: startId,
            formFields: startFormData
        }
        next()    
    } catch (e) {
        res.json(400, {
            message: `process with name '${processId}' doesn't exist.`
        })
    }
}