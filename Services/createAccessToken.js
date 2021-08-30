//const User = require("../Models/User")
const generateAccesstoken = require("./accessTokenGeneration")
const createAccessToken = require("./createAccessToken")
module.exports = async function() {
    try {
        //let user = new User()
        //let fetchToken = await user.fetchAccesstoken()
        let generateToken = await generateAccesstoken()
                let obj = {
                    ACCESS_TOKEN: generateToken.access_token,
                    CREATED_DATE: new Date()
                }
       /* if(fetchToken.length){
                let updateToken = await user.updateToken(obj)
                return {
                    access_token: generateToken.access_token,
                    token_type: "Bearer"
                }
        } else {
            let createToken = await user.createToken(obj)
            return {
                    access_token: generateToken.access_token,
                    token_type: "Bearer"
                }
        }*/
    } catch (error) {
        throw error
    }
}