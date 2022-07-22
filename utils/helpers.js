const { getHomiliaData, updateAudioTime, setHomiliaDataToDefault } = require('../models/misc')

const fs = require('fs')
const http = require('https')
const path = require('path');

const rootPath = path.resolve(__dirname, "..");

DIR_DATA_PATH = rootPath + '/public/data/'

const logger = require(rootPath + '/config/components/logger')




const downloadFilesToBase64 = async () => {


    const homiliaData = await getHomiliaData()

    const audioUrl = homiliaData.urlAudio

    http.get(audioUrl, (res) => {
    res.setEncoding('base64');

        let base64file = {
            mimetype: res.headers['content-type'],
            data: ''
        };

    res.on('data', (data) => { 
        base64file.data += data;
    })

    res.on('end', async () => {
        // write base64 file to disk in async mode to waiting for the file to be written
       fs.writeFileSync(rootPath + '/public/data/selectedAudio.mp3', base64file.data, 'base64')        
            logger.info(' > Audio Base64 Salvo!')
             await audioDuration()
    })
    }).on('error', (e) => {
    console.log(e.message)
    }
    )
    
}

const audioDuration = async () => {
    let ffmpeg = require("fluent-ffmpeg");
    const path = require('path')
    const rootPath = path.resolve(__dirname, "..");
    const DIR_DATA_PATH = rootPath + '/public/data/selectedAudio.mp3'
        ffmpeg.ffprobe(DIR_DATA_PATH, async function m(err, metadata) {
            const secondsAudio = (parseInt(metadata.format.duration));
            await updateAudioTime(secondsAudio)
            logger.info(' > Audio Duracao Salvo!')
            logger.info(' > Audio Duracao: ' + secondsAudio)            
        }); 
    
}

const setAppToDefault = async () => {

    await setHomiliaDataToDefault()
    logger.info(' > Db to Default!')

    fs.unlink(DIR_DATA_PATH + 'selectedAudio.mp3', (err) => {
        if (err)
            logger.error(`Arquivo de Audio não existe! - Error: ${err}`);
        logger.info(' > File Audio Deleted!');
    });

    fs.unlink(DIR_DATA_PATH + 'video.mp4', (err) => {
        if (err)
            logger.error(`Arquivo de video não existe! - Error: ${err}`);
        logger.info(' > File Video Deleted!');
    });

    await sleep()

}

const sleep = async (milliseconds = 5000) => {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
    logger.info(' > Sleep!')
}


// const deleteAudioFromGoogleCloud = async () => {
//     const { Storage } = require('@google-cloud/storage')

//     const storage = new Storage({
//         projectId: 'homilia-bot',
//         keyFilename: rootPath + '/config/homilia-bot-e54a49e430c5.json'
//     })

//     var myBucket = storage.bucket('homily-bot-df')

//     const audioName = getHomiliaData().fileAudioName

    


// }



module.exports = {
    downloadFilesToBase64,
    audioDuration,
    setAppToDefault,
    sleep,
    //deleteAudioFromGoogleCloud


}