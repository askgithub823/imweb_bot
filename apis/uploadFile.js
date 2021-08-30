const fs = require('fs')
module.exports = async(fileData) =>{
     try{
		let path = appPath+"/LocalStorage"
		let filename = fileData.filename

		let data = fileData.fileData
		await fs.writeFileSync(`${path}/${filename}`, data)
	}catch(e){
		throw e
	}	
}