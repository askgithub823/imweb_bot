const fs = require('fs')
const path = require('path');
const directoryPath = path.join(__dirname, '../Flows');
const axios = require('axios')
console.log("=====deploy directory path===", directoryPath)

module.exports = async () => {
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        //listing all files using forEach
        files.forEach(function (file) {
            let fromPath = path.join(directoryPath, file);
            fs.readFile(fromPath, 'utf8', function (err, xml) {
                let config = {
                    baseURL:`${process.env.BOT_URL}` ,
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/xml'
                    },
                    data: xml
                }
                 axios('/api/v1/dialog', config)
                    .then(res => {
                        console.log(`Process ${file.replace('.bpmn', "")} deployed Successfully !`);
                    })
                    .catch(e => console.log(`Error deploying process ${file.replace('.bpmn',"")} ${e}` ));
            });

        });
    })
}
