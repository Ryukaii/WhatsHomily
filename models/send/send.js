require('dotenv').config()
const webmode = process.env.WEB_MODE

async function videoExist() {
      

    const fs = require('fs')

    const path = require('path')
    const rootPath = path.resolve(__dirname, "..", "..");
    const logger = require(rootPath + '/config/components/logger')

    const grpIdHomilia = '556181705741-1607477310@g.us'
    const grpIdTest = '120363024953035513@g.us'

    const VIDEO_FILE_PATH = rootPath + '/public/video/video.mp4'
    const VIDEOTEMP_FILE_PATH = rootPath + '/public/tmpvideo/videotmp.mp4'

    const ws = await require("../whatsapp");
    const {MessageMedia} = require('whatsapp-web.js');

    async function chatSelected() {
    if (webmode == 'dev') {
        const chatwww = await ws.getChatById(grpIdTest);
        return chatwww
    } else if (webmode == 'prod') {
        const chatwww = await ws.getChatById(grpIdHomilia);
        return chatwww
    }
    }

    const chatSelectedd = await chatSelected()

    let media = MessageMedia.fromFilePath(VIDEO_FILE_PATH)
    await chatSelectedd.sendMessage(media)

    //Enviando para diretório temporário 
    fs.rename(VIDEO_FILE_PATH, VIDEOTEMP_FILE_PATH, (err) => {
        if (err) throw err;
        logger.info(' > File Moved!');
        logger.info(' > Esperando Audio!')
    })
    return
}
module.exports = { videoExist }