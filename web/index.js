(async () => {
    require('dotenv').config()

    const webmode = process.env.WEB_MODE
   
    // Definição de Módulos 
    const fs = require("fs")

    const path = require('path')

    const logger = require('../config/components/logger.js')

    //Definição de diretórios
    
    const rootPath = path.resolve(__dirname, "..");
    const FILE_VIDEO_PATH = rootPath + '/public/video/video.mp4'

    if (webmode == 'dev') {
        logger.info(' > Webmode: dev')
    } else if (webmode == 'prod') {
        logger.info(' > Webmode: prod')
    }
   

    // Conferindo se o arquivo final está criado.
    if (fs.existsSync(FILE_VIDEO_PATH)) {
        logger.info(' > Video Existe!')
        const { videoExist } = require(rootPath + '/models/send/')
        videoExist()
        const { videoNotExist } = require(rootPath + '/models/wait/')
        videoNotExist()
    } else if (!fs.existsSync(FILE_VIDEO_PATH)) {
        logger.info(' > Video Não Existe!')
        const { videoNotExist } = require(rootPath + '/models/wait/')
        videoNotExist()
    }
})();
