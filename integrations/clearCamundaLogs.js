const exec = require('child_process').exec;
const cron = require('node-cron')
const path = require('path');
const directoryPath = path.join(__dirname);


module.exports = cron.schedule('0 21 * * *', async () => {
    return (async () => {
        console.log('------Executing send Customer Details Script------TIME NOW IS', new Date());
        try {
            exec(directoryPath + '/../clearCamundaLogs.sh', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        } catch (error) {
            console.log("log---------------", error);

            throw error
        }
    })()
},
    {
        scheduled: true,
        timezone: "Asia/Kolkata"
    })