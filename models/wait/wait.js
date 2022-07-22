async function videoNotExist() {
    require('dotenv').config()
    const audioOrigin = process.env.AUDIO_ORIGIN
    const crypto = require('crypto')

    //ID's dos Grupos
    const grpIdHomilia = '556181705741-1607477310@g.us'
    const grpIdTest = '120363024953035513@g.us'
    const guisNumber = '556191089985@c.us'

    const fs = require('fs')
    const path = require('path')
    const rootPath = path.resolve(__dirname, "..", "..");

    const logger = require(rootPath + '/config/components/logger')

    const DIR_DATA_PATH = rootPath + '/public/data/'

    const { Storage } = require('@google-cloud/storage')
    
    const storage = new Storage({
        projectId: 'homilia-bot',
        keyFilename: rootPath + '/config/homilia-bot-e54a49e430c5.json' 
    })

    var myBucket = storage.bucket('homily-bot-df')

    const { updateAudioData } = require(rootPath + '/models/misc')


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
           

            //console.log(mediafile)
            // convert mediafile base64 in stream to upload to google storage
            
            var video = mediafile,
                directory = 'audios',
                mimeType = mediafile.mimetype,
                mimeTypeSplited = mimeType.split('/')[1],
                fileName = `audio_${crypto.randomBytes(8).toString('hex')}.${mimeTypeSplited}`;
                base64EncodedVideoString = video.data
                
               videoBuffer = Buffer.from(base64EncodedVideoString, 'base64')

            // upload video to google storage with prefix 'audio_'



            var file = myBucket.file(`${directory}/${fileName}`);
            var stream = file.createWriteStream({
                metadata: { contentType: mimeType },
                public: true,
                validation: 'md5'
            }, function (error) {
                if (error) {
                    logger.info(error)
                }

            }
            )

            stream.end(videoBuffer)
            const audioURL = `https://storage.googleapis.com/homily-bot-df/${directory}/${fileName}`
            await updateAudioData(fileName, audioURL)
            stream.on('finish', function () {
                logger.info(' > Upload Concluído!')
                const { renderVideo } = require(rootPath + '/models/convert/')
                renderVideo()
            })


        }

    })
}


module.exports = { videoNotExist }