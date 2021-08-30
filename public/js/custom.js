// JavaScript Document
$(window).load(function(e) {
    $("#preloader").delay(100).fadeOut('slow');
});

function promisifyReader(fr, file, varName) {
    return new Promise((resolve, reject) => {
        fr.onload = () => {
            resolve({
                [varName]: {
                    value: fr.result.split(',')[1],
                    type: 'File',
                    valueInfo: {
                        filename: file.name,
                        mimetype: file.type,
                        encoding: 'UTF-8'
                    }
                }
            })
        }
        fr.readAsDataURL(file) 
    })
}

function getFormValues() {
    let formVars = formData.formFields.reduce((acc, curr) => {
        let value = curr.type == "enum" ? $(`input[name=${curr.id}]:checked`).val() : ($(`input[name=${curr.id}]`).val() || $(`textarea[name=${curr.id}]`).val())
        value = curr.type == "boolean" ? $(`input[name=${curr.id}]`).is(":checked") : value
        acc[curr.id] = {
            value: value,
            type: curr.type == "enum" ? "string" : curr.type
        }
        return acc
    }, {})
    return formVars
}

function sendFormData(payload) {
    fetch(`/start/${formData.processId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }).then((res) => {
        console.log(res)
        alert('Form submitted successfully !')
        $(`#${formData.taskId}`).trigger('reset')
    }).catch((e) => {
        console.log(e)
        alert('Form submission failed !')
    })
}

async function readFiles() {
    let formVars = {}
    let readers = []
    $('input[type=file]').each(function() {
        let fr = new FileReader()
        let file = $(this).prop('files')[0]
        file ? readers.push(promisifyReader(fr, file, $(this).attr('name'))) : null
    })
    let contents = await Promise.all(readers)
    contents.forEach(content => {
        formVars = {
            ...formVars,
            ...content
        }
    })
    return formVars
}

async function submitHandler(evt) {
    evt.preventDefault()
    let fileVars = await readFiles()
    let formVars = getFormValues()
    let processPayload = {
        variables: {
            ...formVars,
            ...fileVars
        }
    }
    sendFormData(processPayload)
}

const app = {
    submitHandler
}

$(document).ready(() => {
    $(".upload").change(function() {
        let filePath = $(this).val()
        let id = $(this).attr('id')
        console.log(id)
        $(`#${id}-holder`).val(function(idx, value) {
            return filePath.replace("C:\\fakepath\\", "")
        })
    })
    $(`#${formData.taskId}`).submit(app.submitHandler)
})