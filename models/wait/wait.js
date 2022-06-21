async function videoNotExist() {
    require('dotenv').config()
    const webmode = process.env.WEB_MODE

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

    async function fromSelected() {

        if (webmode == 'dev') {
            const fromSelected = guisNumber
            return fromSelected
            
        } else if (webmode == 'prod') {
            const fromSelected = grpIdHomilia
            return fromSelected
        }
    }

    const fromSelectedNow = await fromSelected()

    logger.info(' > Esperando Audio! ')

    ws.on('message_create', async (inboundMsg) => {
        //console.log(inboundMsg);
        const { from, type } = inboundMsg;

        if (type === 'audio' && from === fromSelectedNow) {
            logger.info(' > Audio Recebido!')
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
            

            let messages = await chatSelectedd.fetchMessages({ limit: 1 });
        
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