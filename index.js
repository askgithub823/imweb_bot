global.log = require('./Utilities/Logger')
global.appPath = __dirname
require('./set_log_colors.js')
require('dotenv').config()
const restify = require('restify')
global.builder = require('techforce-botbuilder')
require('./Globals')
require('marko/node-require')
const fs = require('fs')
const path = require('path')
const qs = require('query-string')
const axios = require('axios')
const eventEmitter = require('events')
const corsMiddleware = require('restify-cors-middleware')
const { QueryTypes } = require('sequelize')
const jsonexport = require('jsonexport')
const uuidv1 = require('uuid/v1')

const createDeployment = require('./integrations/createDeployment')
const getDeployment = require('./integrations/getDeployment')
const deleteDeployment = require('./integrations/deleteDeployment')
const completeTask = require('./integrations/completeTask')
const getFormVariables = require('./integrations/getFormVariables')
const deployFlows = require('./integrations/deployFlows')
const Outgoing = require('./Utilities/Outgoing')
const saveBPMN = require('./Utilities/saveFlowBPMN')
const parseStartTask = require('./Utilities/parseStartTask')
// const saveXML = require('./integrations/saveXML')
//const createDialog = require('../techforceai-dialog-constructor')
const createDialog = require('techforceai-dialog-constructor')
const startProcessInstance = require('techforceai-dialog-constructor/lib/integrations/startProcessInstance')
const downloadFile = require('./integrations/downloadFile')
const uploadFile = require('./apis/uploadFile')
const AWS = require('./apis/uploadS3File')
const clearCamundaLogs = require('./integrations/clearCamundaLogs')
const downloadSurvey= require('./integrations/surveyDownload')
const startFormTemplate = require("./Views/start-form.marko");

const middleware = require('./Utilities/Middleware')
const autoTrigger = require('./Utilities/autoTrigger')


const randomize = require('randomatic');
const nodemailer = require("nodemailer");
const DBHelper = require("./Globals/PGDBHelper")
var azure = require('botbuilder-azure');
const base64 = require('base64topdf');
const dotenv = require('dotenv')
dotenv.config()
const storage = require('azure-storage');
const blobService = storage.createBlobService();


global.connectedEmitter = new eventEmitter()
if (!fs.existsSync('./tmp')) {
  fs.mkdirSync('./tmp')
}


const USER = require("./Models/User")
const cors = corsMiddleware({
  origins: ['https://rpabotstgacct.blob.core.windows.net', 'https://modeler.development.techforce.ai', 'http://localhost:*', 'http://127.0.0.1:60969', 'https://*.development.techforce.ai', 'https://*.techforce.ai/*', '*'],
  allowHeaders: ['Authorization']
})

const server = restify.createServer()

const connector = new builder.ChatConnector({
  appId: process.env.APP_ID,
  appPassword: process.env.APP_PASSWORD,
  gzipData: true
})

let memoryStorage = {}
if (process.env.SESSION_STORE == "COSMOS") {
var documentDbOptions = {
    host: process.env.SESSION_STORE_HOST,
    masterKey: process.env.SESSION_STORE_MASTERKEY,
    database: process.env.SESSION_STORE_DATABASE,
    collection: process.env.SESSION_STORE_COLLECTION
  };
  var docDbClient = new azure.DocumentDbClient(documentDbOptions);
  memoryStorage = new azure.AzureBotStorage({ gzipData: process.env.SESSION_GZIP }, docDbClient);
  console.log("cosmos db connected")
}

else if (process.env.TABLESTORE_Name && process.env.TABLESTORE_KEY) {
  let storageName = process.env.TABLESTORE_Name;
  let storageKey = process.env.TABLESTORE_KEY;
  // let tableName = "AccentureBotSessions";
  let tableName = process.env.SESSION_TABLE_NAME;

  let azureTableClient = new azure.AzureTableClient(tableName, storageName, storageKey);
  memoryStorage = new azure.AzureBotStorage({gzipData: process.env.SESSION_GZIP}, azureTableClient);
}

else {
  memoryStorage = new builder.MemoryBotStorage()
}

const bot = new builder.UniversalBot(connector).set('storage', memoryStorage)

async function authenticateUser(bToken) {
  try {
    let creds = Buffer.from(bToken.split(" ")[1], 'base64').toString()
    let [username, password] = creds.split(":")
    let res = await postgresSequelize.query(`select * from account where username = '${username}';`, { type: QueryTypes.SELECT })
    // if (res.rowCount && (res.rows[0].password === password)) {
    if (res[0].password === password) {
      return true
    } else {
      return false
    }
  } catch (e) {
    throw e
  }
}

// register middleware
bot.use({
  botbuilder: middleware,
  send: Outgoing
})

server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser())
server.pre(cors.preflight)
server.use(cors.actual)

server.post('/conversations', (req, res, next) => {

  console.log(req.body)
  if (req.body.channelId === 'webchat' || req.body.channelId === 'directline' || req.body.channelId === 'emulator') {
    req.isDirectline = true
  } else {
    req.isDirectline = false
  }
  next()
}, connector.listen())

server.post('/api/v1/dialog', async (req, res) => {
  try {
    console.log("Deploying Flow!");
    let validUser = false
    if (process.env.DATABASE_URI) {
      validUser = await authenticateUser(req.headers.authorization)
    } else {
      validUser = true
      postgresSequelize = null
    }
    if (validUser && req.body.toString()) {
      let bpmn = req.body.toString()
      let { dialog, processId, dialogFlows } = createDialog(bpmn, postgresSequelize)
/*       let deployments = await getDeployment(processId)

      if (deployments.length) {
        let deleteDeployments = []
        deployments.forEach(deployment => deleteDeployments = [...deleteDeployments, deleteDeployment(deployment.id)])
        await Promise.all(deleteDeployments)
      } */
      let deployment = await createDeployment(processId, bpmn)
      Object.keys(dialogFlows).forEach((dialogKey, index) => {
        console.log(dialogKey);
        if (bot.dialogs[dialogKey]) {
          delete bot.dialogs[dialogKey]
        }
        bot.dialog(dialogKey, dialogFlows[dialogKey])
      })
      // saveBPMN(processId, bpmn)
      res.json(200, { processId: processId })
    } else if (!validUser) {
      res.json(403, {error: 'Invalid username or password'})
    } else {
      res.json(401, { error: 'Invalid BPMN' })
    }
  } catch (e) {
    res.json(500, { error: 'Error Deploying Process' })
    console.log(e)
  }
})

// serve start-process form
server.get('/forms/:processId', parseStartTask, (req, res) => {
  startFormTemplate.render(req.startFormData, res)
})


server.post('/start/:processId', async (req, res) => {
  try {
    let processId = req.params.processId
    await startProcessInstance(processId, req.body)
    res.json(200, {message: `Process '${processId}' deployed successfully !`})
  } catch (e) {
    console.log(e)
    res.json(500, {message: 'Sorry there is some error from our side.'})
  }
})

// intent to clear stack
bot.dialog('startover', (session, args, next) => {
  session.clearDialogStack()
  session.endDialogWithResult({ response: true })
})

// default dialog
bot.dialog('/', [
  ...autoTrigger,
  (session,args) => {
    console.log("From Next fn");
    if (session.privateConversationData.currentIntentName){
      console.log(session.privateConversationData.currentIntentName);
      session.replaceDialog(session.privateConversationData.currentIntentName)
    }
  }
])



server.get('/files/*', restify.plugins.serveStatic({
  directory: './tmp',
  appendRequestPath: false
}))

server.get('/public/*', restify.plugins.serveStatic({
  directory: __dirname,
}))

server.get('/api/v1/surveyDownload', async (req, res) => {
  var data = await downloadSurvey();
    let name = `tmp/${uuidv1()}.xls`;
    await jsonexport(data[0],{rowDelimiter:"\t",mapHeaders: (header) => header.replace('data.', '')},function(err, csv){
      if(err) return console.log(err);
       fs.appendFile(name, csv, function(out,err) {
        if (err) throw err;
        res.writeHead(200, {
          "Content-Type": 'application/octet-stream',
          "Content-Disposition": "attachment; filename=surveydata.xls"
        });
        var readStream = fs.createReadStream(name);
        readStream.pipe(res);
        readStream.on("end",function(){
          fs.unlinkSync(name);
        })
      });
  });
})

if (process.env.DEBUG) {
  let bpmnFlows = [fs.readFileSync(path.resolve(__dirname, 'test', 'dialog.bpmn'), {
    encoding: 'utf8'
  }), fs.readFileSync(path.resolve(__dirname, 'test', 'dialog1.bpmn'), {
    encoding: 'utf8'
  })]
  bpmnFlows.forEach(bpmnFlow => {
    let { dialogFlows } = createDialog(bpmnFlow)
    Object.keys(dialogFlows).forEach((dialogKey, index) => {
      bot.dialog(dialogKey, dialogFlows[dialogKey]).triggerAction({
        matches: dialogKey
      })
    })
  })
}
server.get('/api/v1/download', async (req, res) => {
  await downloadFile(req.query.id, res)

})

server.get('/api/aws/download', async(req, res)=>{
  let fileName = req.query.filename;
  let bucketName = req.query.bucketname;
  let aws = new AWS();
	let data = await aws.downloadS3File(fileName,bucketName);
  console.log("Downloaded Data--------------------------------------------------------------:",data)
  if(data){
    fs.writeFileSync(__dirname + `/${fileName}`, data)
    var filestream = await fs.createReadStream(__dirname + `/${fileName}`);
    filestream.pipe(res);
    fs.unlinkSync(__dirname + `/${fileName}`)
  }
})

server.post('/api/v1/upload', async(req, res)=>{
	await uploadFile(req.body.payload)
})

server.post('/api/aws/upload', async(req, res)=>{
  let { files, body } = req;
  let aws = new AWS();
  let data = await aws.uploadFile(files, body);
  if(data.Location){
    let { Key, Location } = data
    res.send({Key, Location})
  }else{
  res.send(data.error)
  }
})
//Added WhatApp APIs
server.post('/generateOtp', async (req, res)=>{
  try {
    let sendOtp = await require('./Services/sendOtp')(req.body)
    console.log("==Sending the OTP====", sendOtp);
    if(sendOtp){
      console.log("132564564");
      res.send({msg:"Success", status: true})
    }
  } catch (error) {
    console.log("e",error);

    res.send({msg:"Failed", status: false})
  }
})

server.get('/validateOtp', async (req, res)=>{
  console.log("validateOTP", req.query);
  try {
    let request = {
      phoneNo: req.query.phoneNo ? req.query.phoneNo : null,
      whatsAppNo : req.query.whatsAppNo,
      otp: req.query.otp,
      email: req.query.email ? req.query.email : null
    }
    let verifyOtp = await require('./Services/verifyOtp')(request)
  console.log("verifyOtp",verifyOtp);
    res.send(verifyOtp)
  } catch (error) {
	console.log("error in validating OTP",error)
    res.send({msg:"Failed", isVerified: false})
  }

})


server.get('/saveFeedback', async (req, res)=>{
  try {
    let feedback = parseInt(req.query.feedback)
    let saveFeedback
    if(feedback > 5) {
      saveFeedback = 5
    } else {
      saveFeedback = feedback
    }
    let query = {
      userFeedback: saveFeedback,
      whatsAppPhone: req.query.whatsAppPhone
    }
    let saveUserFeedback = await require("./Services/saveUserFeedback")(query)
    res.send({msg: "Thank you for your feedback", status:true})
  } catch (error) {
    console.log("=======error in saving feedback", error);
    res.send({msg: "Something went wrong", status:false})
  }
})

server.post('/sendPdfFile', (req, res)=>{
console.log("req for sending PDF",req.body.phoneNo)

  try {
    let fileData =req.body.file
    let fileName=req.body.fileName.replace(/ /g,"_")
    if(!fileName.endsWith(".pdf")){
      fileName=fileName+".pdf"
  }

  base64.base64Decode(fileData,fileName);
  blobService.createBlockBlobFromLocalFile(process.env.CONTAINER_NAME,fileName,fileName,async function(err,result,response){
  if(!err){
      let containerName = process.env.CONTAINER_NAME;
      let hostName = process.env.HOST_NAME;
      let url = blobService.getUrl(containerName,fileName, null, hostName);

      let data = {
        phoneNo:req.body.phoneNo,
        msg: fileName.replace(".pdf","")+ " with the reference number "+req.body.transcationId,
        caption: fileName.replace(".pdf","")+" with the reference number "+req.body.transcationId,
        method: "SendMediaMessage",
        msgType:"Document",
        media_url: url
      }
	// console.log("pdfffffffffffff",data)
    await  require('./Services/sendWhatsAppMsg')(data)
      fs.unlinkSync(fileName)
      res.send({url})
  }else{
      throw err
    }
  })
  } catch (error) {
    console.log(error);
    res.send({msg: "Error in Uploading file to Cloud Storage"})
  }

})



server.post('/caseCreation',async (req,res)=>{
   console.log("caseCreationreq.body",req.body);
  try {
  //  var accessTokenData = await require('./Services/accessTokenGeneration')()
      var accessTokenData = await require('./Services/getAccesstoken')()
   if (accessTokenData) {
         let reqObj = {
           accountName :req.body.accountId,
           accessToken : accessTokenData.access_token,
           tokenType : accessTokenData.token_type,
           subject : req.body.subject,
           description : req.body.description,
           contactName : req.body.contactName?req.body.contactName:"",
           status : req.body.satus?req.body.status:"",
           caseOrigin : req.body.caseOrigin?req.body.caseOrigin:"",
           stage : req.body.stage?req.body.stage:"",
           category : req.body.category?req.body.category:"",
           subCategory : req.body.subCategory?req.body.subCategory:"",
           subSubCategory : req.body.subSubCategory?req.body.subSubCategory:"",
           priority : req.body.priority?req.body.priority:"",
           product : req.body.product?req.body.product:"",
           caseFlag : req.body.caseFlag?req.body.caseFlag:"",
           WhichQueue:req.body.WhichQueue?req.body.WhichQueue:"",
           displayFlowName:req.body.displayFlowName,
           flowName:req.body.flowName,
           fromDate : req.body.from_date,
           toDate:req.body.to_date,
	         TokenNumber:req.body.transcationId,
	         radioData:req.body.radioData?req.body.radioData:"",
           radioData_Email:req.body.radioData_Email?req.body.radioData_Email:null


         }
       // var caseCreation = await require('./Services/caseCreation')(reqObj)${caseCreation.Case.CaseNumber}
       // console.log("caseCreation",caseCreation);




         var data = {
           phoneNo:req.body.phoneNo,
           msg: `We have registered a case number  against your request for ${req.body.displayFlowName} which was requested by you through WhatsApp with reference number ${req.body.transcationId} . Unfortunately, we could not deliver it to you via WhatsApp therefore, it will be delivered to you by our Customer Experience Team on your registered email id shortly.`,
	          method: "SendMessage",
           msgType:"TEXT"
         }

         let sendWhatsAppMsg = await require('./Services/sendWhatsAppMsg')(data)
         console.log("sendWatsupMsg",sendWhatsAppMsg);
           res.send ({msg:"Case created succesfully",status:true})
         }
     } catch (e) {
       console.log("e",e);
       res.send ({msg:"Something went wrong",status:false})
     }
  })

  server.post('/getAccesstoken', async (req, res) => {
    try {
      let getAccessToken = await require('./Services/getAccesstoken')()
      res.send(getAccessToken)
    } catch (error) {
      res.send("Something Went Wrong")
    }
  })

  server.get('/createAccessToken', async (req, res)=>{
    try {
      let createAccessToken = await require("./Services/createAccessToken")()
      res.send(createAccessToken)
    } catch (error) {
      res.send({msg: "Error While generating access token"})
    }

  })

  server.post('/getProdAccesstoken', async (req, res) => {
    try {
      let getAccessToken = await require('./Services/getProdAccesstoken')()
	console.log("getAccessToken",getAccessToken)
      res.send(getAccessToken)
    } catch (error) {
	console.log("error",error)
      res.send("Something Went Wrong")
    }
  })


  server.get('/CustomerValidate', async (req, res)=>{
    console.log("------------------------------------REQUEST", req.params, req.query);
    try {
      let accessTokenData = await require('./Services/getAccesstoken')()
      // console.log("accessTokenData",accessTokenData);
      let tokenObj = {
          accessToken: accessTokenData.access_token,
          tokenType : accessTokenData.token_type,
          queryParams: req.query
        }
      let validateCustomer = await require("./Services/validateCustomer")(tokenObj)

      console.log("validateCustomer",validateCustomer);

      res.send(validateCustomer)
    } catch (error) {
      console.log("123",error);
      res.status(200)
      res.send({msg: "Something went wrong with the number."})
    }
  })

  server.get('/accountdetails', async (req, res)=>{
    console.log("------------------------------------REQUEST", req.params, req.query);
    try {
      let accessTokenData = await require('./Services/getAccesstoken')()
      // console.log("accessTokenData",accessTokenData);
      let tokenObj = {
          accessToken: accessTokenData.access_token,
          tokenType : accessTokenData.token_type,
          queryParams: req.query
        }
      let accDetails = await require("./Services/getAccountDetails")(tokenObj)
      console.log("account details",accDetails)
      res.send(accDetails)
    } catch (error) {
      // console.log("123",error);
      res.status(200)
      res.send({msg: "Something went wrong with the number."})
    }
  })


  server.get('/getProductMasters', async (req, res)=>{
    console.log("------------------------------------REQUEST", req.params, req.query);
    try {
      let accessTokenData = await require('./Services/getAccesstoken')()
      // console.log("accessTokenData",accessTokenData);
      let tokenObj = {
          accessToken: accessTokenData.access_token,
          tokenType : accessTokenData.token_type,
          queryParams: req.query
        }
      let strategyList = await require("./Services/getStrategyList")(tokenObj)
      res.send(strategyList)
    } catch (error) {
      // console.log("123",error);
      res.status(200)
      res.send({msg: "Something went wrong with strategy api service"})
    }
  })

  server.get('/DistributorValidate', async (req, res)=>{
    try {
      let accessTokenData = await require('./Services/getAccesstoken')()
      let tokenObj = {
          accessToken: accessTokenData.access_token,
          tokenType : accessTokenData.token_type,
          queryParams: req.query
        }
      let validateParnter = await require("./Services/validatePartner")(tokenObj)
      res.send(validateParnter)
    } catch (error) {
      console.log(error);
      res.send("Something Went Wrong")
    }
  })


  server.get('/mobileValidate', async (req, res)=>{
    // console.log("------------------------------------REQUEST", req.params, req.query);
    try {
      let accessTokenData = await require('./Services/getAccesstoken')()
      // console.log("accessTokenData",accessTokenData);
      let tokenObj = {
          accessToken: accessTokenData.access_token,
          tokenType : accessTokenData.token_type,
          queryParams: req.query
        }
      let validateMobile = await require("./Services/validateMobile")(tokenObj)

      console.log("validateCustomer",validateMobile);

      res.send(validateMobile)
    } catch (error) {
       console.log("123",error);
      res.status(200)
      res.send({msg: "Something went wrong with the number."})
    }
  })


  createCaseAPI = async(req, res)=>{
    console.log("123createcaseApi");
    try {
      let accessTokenData = await require('./Services/getAccesstoken')()
      let tokenObj = {
        accessToken: accessTokenData.access_token,
        tokenType : accessTokenData.token_type,
        queryParams: req.query,
        method: req.method
      }
      console.log("tokenObj",tokenObj);
    let createCase = await require("./Services/createCase")(tokenObj)
    console.log("createCase",createCase);
    if (req.method == "POST" ) {
      let arr_redmetion = ["Redemption / Switch","Switch","Redemption"]
      let subCategory = req.query.Sub_Category
      console.log(arr_redmetion.includes(subCategory));
      if (arr_redmetion.includes(subCategory)) {
        let obj = {
          data:{
          "CaseNumber": createCase.Case.CaseNumber,
          "QueueId":"00G6F000003Abr7UAC"},
          headers:{
            Authorization : `Bearer ${accessTokenData.access_token}`
          }
        }
        let {data} = await require("./Services/redemptionQueue")(obj)
      }
    }
    res.send(createCase)
    } catch (error) {
      res.send("Something happened")
    }

  }
  server.get("/CaseCreationFromChatBot",createCaseAPI)
  server.post("/CaseCreationFromChatBot", createCaseAPI)


//type script getting file
server.post('/getLogFile',async (req,res)=>{
  console.log(req.query);
  try {
    let accessTokenData = await require('./Services/getAccesstoken')()

// console.log("accessTokenData",accessTokenData);
  let obj ={
    phoneNo:91+req.query.Mobile,
    StartTime:req.query.StartTime?req.query.StartTime:null
  }
    let fileDataObj = await require("./Services/getLogFile")(obj)
    //let fileData =req.body.file
// console.log("fileData",fileDataObj);
    let fileName = req.query.Mobile+"_"+fileDataObj.startTime+"_"+fileDataObj.endTime+"_"+req.query.Pan+".txt"
    decodedData =  base64.base64Decode(fileDataObj.data,fileName);
    console.log("data,data",decodedData);
  blobService.createBlockBlobFromLocalFile(process.env.CONTAINER_NAME,fileName,fileName,async function(err,result,response){
    console.log('err',err);

  if(!err){
      let containerName = process.env.CONTAINER_NAME;
      let hostName = process.env.HOST_NAME;
      let url = blobService.getUrl(containerName,fileName, null, hostName);
      // console.log("url",url);

      let data = {
        queryParams:{
          Url: url,
          Mobile:req.query.Mobile,
          Pan:req.query.Pan,
          StartTime:fileDataObj.startTime,
          EndTime:fileDataObj.endTime,
          Flag:req.query.Flag
        },
        accesstoken :accessTokenData.access_token,

      }
      console.log("senLogFile", data);
      let logFile = await require("./Services/sendLogFile")(data)
      fs.unlinkSync(fileName)
  res.send({message:"success",status:true})

  }
  })


  } catch (e) {
    console.log("e",e);
    res.send({msg:"error",status:false})
  }


})



//TimeOut transscrpit


server.get('/deleteInstances', async (req, res) => {
    try {
      let deleteInstancedata = await require('./integrations/deleteInstance')()
      // console.log("deleteInstancd",deleteInstancedata);
      if(deleteInstancedata){
        res.send({msg:"Success", status: true})
      }
    } catch (error) {
      console.log("e",error);
      res.send({msg:"Failed", status: false})
    }
  })

//NERNLP API's


server.get('/NLPCustomerDetails', async (req, res) => {
   try {
     /* let accessTokenData = await require('./Services/getProdAccesstoken')()
    let tokenObj = {
	queryParams: req.query,
        accessToken: accessTokenData.access_token,
        tokenType : accessTokenData.token_type

      }
console.log("tokenObj ",tokenObj )*/
    let NLPCustomerDetails = await require("./Services/NLPCustomerDetails")(req.query)
    // console.log("createCase",createCase);
    res.send(NLPCustomerDetails)
    } catch (error) {
      res.send("Something happened")
    }
  })



server.get('/NLPCaseDump', async (req, res) => {
console.log("NLPCaseDump",req.query)
   try {
      let accessTokenData = await require('./Services/getProdAccesstoken')()
      let tokenObj = {
        accessToken: accessTokenData.access_token,
        tokenType : accessTokenData.token_type,
        queryParams: req.query
      }
    let NLPCaseDump= await require("./Services/NLPCaseDump")(tokenObj)
    console.log("createCase",NLPCaseDump);
    res.send(NLPCaseDump)
    } catch (error) {console.log("00000000000000000",error)
      //res.send({data:error})
    }
  })

server.post('/transaction',async (req,res)=>{
    try {
    let transaction= await require("./Services/storeTransactions")(req.body)
    res.send(transaction)
    } catch (error) {
      res.send({success:false,reason:error})
    }
  })

server.post('/createTopUp',async (req,res)=>{
      try {
        let accessTokenData = await require('./Services/getAccesstoken')()
        console.log("req.body",req.body);
        let tokenObj = {
            accessToken: accessTokenData.access_token,
            tokenType : accessTokenData.token_type,
            data: req.body
          }
      let topupData = await require("./Services/createTopUp")(tokenObj)
      console.log(topupData);
      res.send(topupData)
      } catch (error) {
        res.send({success:false,reason:error})
      }
    })

server.post('/createAdditionalStrategy',async (req,res)=>{
      try {
        let accessTokenData = await require('./Services/getAccesstoken')()
        console.log("req.body",req.body);
        let tokenObj = {
            accessToken: accessTokenData.access_token,
            tokenType : accessTokenData.token_type,
            data: req.body
          }
      let addStrategy = await require("./Services/createAdditionalStrategyLead")(tokenObj)
      console.log(addStrategy);
      res.send(addStrategy)
      } catch (error) {
        res.send({success:false,reason:error})
      }
    })


    // pdffile
  server.post('/sendReport',async(req,res)=>{
      try {
        let payload= req.body
        console.log("payload",payload);
  //let dataSaved = await require('./Services/reportDetails.js')(payload)
    let getReportData = await require('./Services/getReportData')(payload)
    if (getReportData.data == null) {
      let data = {
        phoneNo:"91"+payload.mobile,
        msg: `We are unable to share the requested report with the reference number ${payload.referenceNumber}. Kindly requested to reach out to us at ce@askpms.in`,
        method: "SendMessage",
        msgType:"TEXT"
      }
      // console.log("pdfffffffffffff",data)
	payload["REPORT_STATUS"]= "Got the report name as null"
	//let dataSaved = await require('./Services/reportDetails.js')(payload)
      //await  require('./Services/sendWhatsAppMsg')(data)
        res.send({msg:`We are unable to share the requested report with the reference number ${payload.referenceNumber}. Kindly requested to reach out to us at ce@askpms.in`, generated:"filelnotgenerated", status: true})
    } else {
          let fileName = getReportData.data
        let pdfData = await require('./Services/getPDF')(fileName)
        console.log("111111111",pdfData["headers"]["content-length"]);
        if (pdfData["headers"]["content-length"]>1024) {


        decodedData =  base64.base64Decode(pdfData.data,fileName);
        // console.log("data,data",decodedData);
        blobService.createBlockBlobFromLocalFile(process.env.CONTAINER_NAME,fileName,fileName,async function(err,result,response){
        console.log('err',err);

      if(!err){
          let containerName = process.env.CONTAINER_NAME;
          let hostName = process.env.HOST_NAME;

          let url = blobService.getUrl(containerName,fileName, null, hostName);
          console.log("url",url);
          // fs.writeFileSync('some.pdf', pdfData);
      let data = {
        phoneNo:"91"+payload.mobile,
        msg: fileName.replace(".pdf",""),
        caption: fileName.replace(".pdf",""),
        method: "SendMediaMessage",
        msgType:"Document",
        media_url: url,
      }

      //await  require('./Services/sendWhatsAppMsg')(data)
      fs.unlinkSync(fileName)
payload["REPORT_STATUS"]= "Success"
	//let dataSaved = await require('./Services/reportDetails.js')(payload)


      res.send({msg:"Success", url:url, generated:"url", status: true})

      }
    })
      }else{
        let data = {
          phoneNo:"91"+payload.mobile,
          msg: `We are unable to share the requested report with the reference number ${payload.referenceNumber}. Kindly requested to reach out to us at ce@askpms.in`,
          method: "SendMessage",
          msgType:"TEXT"
        }
        // console.log("pdfffffffffffff",data)
        //await  require('./Services/sendWhatsAppMsg')(data)
	payload["REPORT_STATUS"]= "Generated file is less thank 1 KB"
	let dataSaved = await require('./Services/reportDetails.js')(payload)

          res.send({msg:`We are unable to share the requested report with the reference number ${payload.referenceNumber}. Kindly requested to reach out to us at ce@askpms.in`, generated:"filelnotgenerated", status: true})
      }
     }
      } catch (e) {
        console.log(e);
            res.send({msg:"Failed", status:false})
      }
    })


//report cretiria for by giving menu id
server.get("/reportCriteria", async(req,res)=>{
try {
  var criteria = await require("./Services/getReportCriteria")(req.query)
  console.log("...........",criteria);
  res.send({...criteria})
}catch(e){
    res.send({"msg":failed})
}

})

//send mail Api


server.post("/sendMail", async(req,res)=>{
  try {
  var name = ["Monica_More"]
  var transporter = nodemailer.createTransport({
    host: "172.25.2.5",
    port: 587
    //auth: {
      //user: "c51e24ffcc9710",
      //pass: "2ffe26b382041d"
    //}
});
var path=appPath+'/tmp/'+name[0]+".zip"
var mailOptions = {
  from: ' rpabot@askgroup.in', // sender address
  to: 'rgudipally@techforce.ai', // list of receivers
  subject: 'Subject of your email', // Subject line
  html: '<p>Your html here this is for testing.</p>',// plain text body
  attachments: [
    {
      filename: name[0]+'.zip',
      path:path,
      // appPath+'/tmp/'+name[0]+'.zip',
      contentType: 'application/pdf'
      // content: attachment
      // cid: 'Mounica_More.zip'
    }
  ]
};
console.log("mailOptions",mailOptions);
await transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log("/////////////",err)
   else
     console.log(info);
})
  res.send({"msg":"fine"})

  }catch (e) {
    console.log("error on sendmail",e);

  }
})


//Modified till here========================================================

server.get('/endpoint', restify.plugins.serveStatic({
  directory: './LocalStorage',
  file: 'Romil123.pdf',
}))

server.post('/api/v1/save_chat_history', async(req, res)=>{
  let db_helper = new DBHelper()
  if(req.body.fetch){
    let data = await db_helper.fetch_chat_history(req.body.user_id,req.body.query_param)
    let chat = []
    for(let x of data){
      chat = [...chat,...x.CHAT]
    }
    res.send({payload:chat})
    return
  }
  db_helper.chat_history__update_record(req.body.user_id,req.body.chat_history)
  res.send({"status":"ok"})
})

server.get('/api/v1/delete_chat_history/:id',async(req,res)=>{

  let user_id=req.params.id
  let db_helper = new DBHelper()

await db_helper.delete_chat_history(user_id)
res.send({"msg":"ok"});

})


server.post('/api/v1/check_chat_history', async(req, res)=>{
  let db_helper = new DBHelper()
  let data = await db_helper.check_chat_history(req.body.user_id)
  res.send(data[0])
})



/*
We are allowing the server to run even though there is no DB connection.
Since, there are many operations which does not require DB connections, we made DB conn optional.
 */

server.listen(process.env.port || process.env.PORT || 3010, function () {
  console.log('%s listening to %s', server.name, server.url)
    setTimeout(function(){deployFlows() }, 15000);

})
global.db_active = false

connectedEmitter.on('dbError', ()=>{
  console.log("Database connection failed. So, all the database operations will be compromised !");
  global.db_active = false

})


connectedEmitter.on('connectedDb', async ()=>{
  console.log("database connection is active !");
  global.db_active = true
  let db_helper = new DBHelper()
  console.log("==========DB=============")
  let all_tables = await db_helper.fetch_all_tables()
  db_helper.check_and_create(all_tables,'ACC_CHAT_HISTORY')

})


