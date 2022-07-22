
const logger = require('../../config/components/logger')
const path = require('path')
const rootPath = path.resolve(__dirname, "..", "..");

const fs = require('fs')

const FILE_VIDEO_PATH = rootPath + '/public/data/video.mp4'
const FILE_AUDIO_PATH = rootPath + '/public/data/selectedAudio.mp3'

const { getHomiliaData }  = require( rootPath + '/models/misc')
const { downloadFilesToBase64, sleep } = require(rootPath + '/utils/helpers')


const videoshow = require('videoshow');

async function renderVideo(){
await downloadFilesToBase64()
await sleep()
    // wait downloadFilesToBase64() to start videoOptions()

    logger.info(' > Renderizando Video!')

    var images = [{
        path: rootPath + '/public/data/selectedImage.png',
    }]
    const homiliaData = await getHomiliaData()
    
    // send getHomiliaData() to videoOptions()
    const loop = homiliaData.audioDuration 

    

        var videoOptions = {
            fps: 25,
            loop: loop, // seconds
            transition: false,
            videoBitrate: 250,
            videoCodec: 'libx264',
            size: '640x?',
            audioBitrate: '128k',
            audioChannels: 2,
            format: 'mp4',
            pixelFormat: 'yuv420p'
        }

    logger.info(' > Video Options: ' + JSON.stringify(videoOptions))
    renderingVideo()
function renderingVideo() {
videoshow(images, videoOptions)


    .audio(FILE_AUDIO_PATH)
    .save(FILE_VIDEO_PATH)
    .on('start', function (command) {
        logger.info(' > Renderizando Video!')
    }
    )
    
    .on('start', function (command) {
        logger.info('ffmpeg process started:', command)
    })
    .on('progress', function (data) {


        logger.info('Progress:' + data.percent.toFixed(0) + "%")
        logger.info('Frames: ' + data.frames)


    })
    
    .on('error', function (err, stdout, stderr) {
        logger.error('Error:', err)
        logger.error('ffmpeg stderr:', stderr)
    })
    .on('end', async function (output) {
        logger.info('Video created in:', output)

        const stats = fs.statSync(FILE_VIDEO_PATH)

        if (stats.size > 14680064) {
            logger.info(' > Arquivo passou do limite!')
            logger.info(' > Reduzindo BitRate!')

            videoOptions.videoBitrate = videoOptions.videoBitrate -50

            if (videoOptions.videoBitrate == 0) {
                logger.error(' > BitRate não pode ser menor que 0!')
                logger.error(' > Arquivo não pode ser gerado!')
                const { videoNotExist } = require('../wait')
                videoNotExist()
                return
            }       
            renderingVideo()
            
            

        } else {
            logger.info(' > Arquivo respeito o limite')
            const { videoExist } = require('../send')
            videoExist()
        }

    })
}
}


module.exports = { renderVideo }