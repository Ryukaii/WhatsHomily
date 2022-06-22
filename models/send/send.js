require('dotenv').config()
const videoDest = process.env.VIDEO_DEST

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

    async function chatDestiny() {
    if (videoDest == 'test') {
        const chat = await ws.getChatById(grpIdTest);
        return chat
    } else if (videoDest == 'homilia') {
        const chat = await ws.getChatById(grpIdHomilia);
        return chat
    }
    }

    const chatDest = await chatDestiny()

    let media = MessageMedia.fromFilePath(VIDEO_FILE_PATH)
    await chatDest.sendMessage(media)

    //Enviando para diretório temporário 
    fs.rename(VIDEO_FILE_PATH, VIDEOTEMP_FILE_PATH, (err) => {
        if (err) throw err;
        logger.info(' > File Moved!');
        logger.info(' > Esperando Audio!')
    })
    return
}
module.exports = { videoExist }