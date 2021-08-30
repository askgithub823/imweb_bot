const fs = require('fs')
const path = require('path');
const directoryPath = path.join(__dirname, '../LocalStorage');

module.exports = async (id, res) => {
    var data
    await fs.readdir(directoryPath, function (err, files) {
        if (err) {
            data = {
                "message": "file not found"
            }
            res.send(data)
        }
        files.forEach(function (file) {
            console.log("file------------", file);
            
            let fileName = file.split(".")
            if (fileName[0] == id) {
                let fromPath = path.join(directoryPath, file);
                let fileData = fs.readFileSync(fromPath, 'utf8');
                // var PdfReader = require("pdfreader").PdfReader;
                // new PdfReader().parseFileItems(file, function (err, item) {
                //     console.log("item----------item-------",item);
                    
                //     if (item && item.text)
                //         console.log("item------------------------",item.text);
                // });
                data = {
                    "message": "true",
                    'filePath': fromPath,
                    'fileName': fileData
                }
                console.log("data===============", data);

                res.send(data)
            } else {
                data = {
                    "message": "file not found"
                }
                res.send(data)
            }
        });

    })
}
