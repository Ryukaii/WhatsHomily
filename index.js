require('dotenv').config()

const logger = require('./config/components/logger.js')

const type = process.env.PROCESS_TYPE

require('./utils/db')
const {connectToDB} = require('./utils/db')
require('./models/misc')

logger.info(` > Iniciando em Modo ${type}!`, { pid: process.pid })

if (type === 'webaudio') {
    require('./web')
} else if (type === 'localaudio') {
    //require('./worker/twitter-stream')
    
} else {
    throw new Error(`
    ${type} is an unsupported process type. 
    Use one of: 'webaudio or 'localaudio'!
  `)
}


