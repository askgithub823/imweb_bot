const { createLogger, transports, format } = require('winston')
const { combine, timestamp, printf, prettyPrint, colorize} = format


const CUSTOM_FORMAT = combine(
  timestamp({ format: 'YYYY.MM.DD HH:mm:ss:SSS' }),
  prettyPrint(),
  printf(info => {
    return `[BOT_LOGS][${info.timestamp}- ${info.level.toUpperCase()}] ${info.message}`;
  }))

module.exports = (logId) => {
  console.log(logId);
  const logger = createLogger({
    level: 'info',
    format: combine(CUSTOM_FORMAT),
    transports: [
      new transports.File({ filename: `${process.env.BOTLOGPATH}/${new Date().getUTCFullYear()}-${new Date().getUTCMonth() + 1}-${new Date().getUTCDate()}/${logId}.log`})
    ]})

    logger.add(new transports.Console({
      format: combine(colorize(), CUSTOM_FORMAT)
    }))
    // console.log("logger",logger.transports);
    return logger
}
