const request = require('request-promise-native')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

module.exports = async (processId, bpmn) => {
    const secret = 'tfai'
    let hash = crypto.createHmac('sha256', secret).update(bpmn).digest('hex')
    let filePath = path.resolve(__dirname, '..', 'tmp', `${hash}.bpmn`)
    fs.writeFileSync(filePath, bpmn)
    try {
        let config = {
            method: 'POST',
            uri: `${process.env.CAMUNDA_URL}/engine-rest/deployment/create`,
            strictSSL: false,
            formData: {
                "deployment-name": processId,
                "enable-duplicate-filtering": "false",
                "data": fs.createReadStream(filePath),
                "deployment-source": "process application"
            }
        }
        const res = request(config)
        fs.unlink(filePath, () => {})
        return res
    } catch (e) {
        fs.unlink(filePath, () => {})
        throw e
    }
}
















// const axios = require('axios')
// const FormData = require('form-data')

// module.exports = async (processId, bpmn) => {
//     try {
//         const form = new FormData()
//         form.append('deployment-name', processId)
//         form.append('enable-duplicate-filtering', 'true')
//         form.append('data', bpmn)
//         form.append('deployment-source', 'process application')
//         let config = {
//             baseURL: `${process.env.CAMUNDA_URL}/engine-rest`,
//             headers: form.getHeaders()
//         }
//         let { data } = await axios.post('/deployment/create', form, config)
//         console.log(data)
//         return data
//     } catch (e) {
//         throw e
//     }
// }
