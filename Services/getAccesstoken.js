//const User = require("../Models/User")
const generateAccesstoken = require("./accessTokenGeneration")
const createAccessToken = require("./createAccessToken")
module.exports = async function() {
    try {

      let generateToken = await generateAccesstoken()
      return {
          access_token: generateToken.access_token,
          token_type: "Bearer"
      }

        // let user = new User()
        // let fetchToken = await user.fetchAccesstoken()
        // if(fetchToken.length){
        //     let currentTime = new Date().getTime()
        //     let createdDateTime = new Date(fetchToken[0]['CREATED_DATE']).getTime()
        //     let timeDiff = currentTime-createdDateTime
        //     // validating  for 11hours
        //     if(timeDiff <= 39600000){
        //         return {
        //             access_token : fetchToken[0]['ACCESS_TOKEN'].trim(),
        //             token_type: "Bearer"
        //         }
        //     }
        //     else {
        //         let generateToken = await generateAccesstoken()
        //         let obj = {
        //             ACCESS_TOKEN: generateToken.access_token,
        //             CREATED_DATE: new Date()
        //         }
        //         let updateToken = await user.updateToken(obj)
        //         return {
        //             access_token: generateToken.access_token,
        //             token_type: "Bearer"
        //         }
        //
        //     }
        // }
        // else {
        //     let generateToken = await generateAccesstoken()
        //     let obj = {
        //         ACCESS_TOKEN: generateToken.access_token,
        //         CREATED_DATE: new Date()
        //     }
        //     let createToken = await user.createToken(obj)
        //     return {
        //             access_token: generateToken.access_token,
        //             token_type: "Bearer"
        //         }
        // }
    } catch (error) {
        throw error
    }
}

