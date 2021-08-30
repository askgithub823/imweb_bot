const aws = require("aws-sdk");
const fs = require('fs');
const axios = require('axios');
//const path = require('path');

// if(process.env.ROLE_BASED){
//   console.log("4444444444444444444444444444444444444444444444444444444444444")
//   axios.get("http://localhost:9000/usr").then((data)=>{
//     console.log("555555555555555555555555555555555555555555555555555:",data);
//     aws.config.update({
//       accessKeyId: data.AccessKeyId,
//       secretAccessKey: data.SecretAccessKey,
//       region: process.env.REGION,
//     });
//   });
// }else{
//   console.log("666666666666666666666666666666666666666666666666666666666")
//   aws.config.update({
//     accessKeyId: process.env.ACCESSKEYID,
//     secretAccessKey: process.env.SECRETACCESSKEY,
//     region: process.env.REGION,
//   });
// }

module.exports = class AWS {
  constructor() {
    this.s3 = new aws.S3();
  }
  
  async uploadFile(fileData, storage){
    if(process.env.ROLE_BASED === "true"){
      let data = await axios.get(process.env.ROLE_BASED_URL)
      let upload_cred = data;
      aws.config.update({
        accessKeyId: upload_cred.AccessKeyId,
        secretAccessKey: upload_cred.SecretAccessKey,
        region: process.env.REGION
      });
    }else{
      aws.config.update({
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        region: process.env.REGION
      });
    }
    var date = new Date();
    var timeStamp = date.getTime();
    let filepath = fileData.files.path;
    //let localpath = path.resolve(__dirname,"..","tmp",`${filename}`)
    let newpath = filepath.replace(/\\/g,"/")
    let binarydata = fs.readFileSync(newpath)
    let base64data = new Buffer.from(binarydata, "binary");
    const params = {
        Bucket: storage.endpoint != "null" ? storage.endpoint : "accenture-project",
        Key: timeStamp + "_" + fileData.files.name,// File name you want to save as in S3
        Body: base64data, //file.buffer,
        // ACL: "public-read"
    };
    let data = await this.s3.upload(params).promise()
                        .catch((err) =>{
                            return {"error": err}
                        });
    return data;
  }

  async downloadS3File(fileName,bucketname){
    if(process.env.ROLE_BASED === "true"){
      let data = await axios.get(process.env.ROLE_BASED_URL)
      let upload_cred = data;
      aws.config.update({
        accessKeyId: upload_cred.AccessKeyId,
        secretAccessKey: upload_cred.SecretAccessKey,
        region: process.env.REGION
      });
    }else{
      aws.config.update({
        accessKeyId: process.env.ACCESSKEYID,
        secretAccessKey: process.env.SECRETACCESSKEY,
        region: process.env.REGION
      });
    }
      //var s3 = new aws.S3();
      let bucket_name = bucketname;
      let data = await this.s3.getObject(
        { Bucket: bucket_name, Key: fileName }
      ).promise().then(data => {
        let filedata = data.Body;
        return filedata;
      }).catch(err=>{
        console.log("errrrrrr:",err)
        return err;
      })
      return data;
  }

}