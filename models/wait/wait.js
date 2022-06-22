async function videoNotExist() {
    require('dotenv').config()
    const audioOrigin = process.env.AUDIO_ORIGIN

    //ID's dos Grupos
    const grpIdHomilia = '556181705741-1607477310@g.us'
    const grpIdTest = '120363024953035513@g.us'
    const guisNumber = '556191089985@c.us'

    const fs = require('fs')
    const path = require('path')
    const rootPath = path.resolve(__dirname, "..", "..");

    const logger = require(rootPath + '/config/components/logger')

    const DIR_DATA_PATH = rootPath + '/public/data/'


    const ws = await require("../whatsapp");


    logger.info(' > Esperando Audio! ')

    async function audioOriginer() {

        if (audioOrigin == 'homilia') {
            const audioOrigin = grpIdHomilia
            return audioOrigin
        } else if (audioOrigin == 'test') {
            const audioOrigin = guisNumber
            return audioOrigin
        }
    }

    async function chatSelect() {
        if (audioOrigin == 'test') {
            const chat = await ws.getChatById(grpIdTest);
            return chat
        } else if (audioOrigin == 'homilia') {
            const chat = await ws.getChatById(grpIdHomilia);
            return chat
        }
    }
    const chatSelected = await chatSelect()

    ws.on('message_create', async (inboundMsg) => {
        //console.log(inboundMsg);
        const { from, type } = inboundMsg;
        if (type === 'audio' && from === await audioOriginer()) {
            logger.info(' > Audio Recebido!')

            let messages = await chatSelected.fetchMessages({ limit: 1 });
        
            let tmpMsg = messages[0]

            let nameAudio = (DIR_DATA_PATH + 'selectedAudio')

            const mediafile = await tmpMsg.downloadMedia();

            fs.writeFile(
                nameAudio,
                mediafile.data,
                "base64",
                function (err) {
                    if (err) {
                        logger.error(err);
                    }
                })

            logger.info(' > Download Concluído!')
            const { renderVideo } = require(rootPath + '/models/convert/')
            renderVideo()
        }

    })
}

module.exports = { videoNotExist }