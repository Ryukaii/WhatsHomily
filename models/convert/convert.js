
const logger = require('../../config/components/logger')
const path = require('path')
const rootPath = path.resolve(__dirname, "..", "..");

const fs = require('fs')

const FILE_IMAGE_PATH = rootPath + '/public/data/selectedImage.png'
const FILE_AUDIO_PATH = rootPath + '/public/data/selectedAudio'
const FILE_VIDEO_PATH = rootPath + '/public/video/video.mp4'

const videoshow = require('videoshow')

var images = [{
    path: FILE_IMAGE_PATH
}]
  
async function renderVideo(){
    const { vOptions } = require('../../config/components/convert.js')
    var videoOptions = await vOptions()
    logger.info(' > Renderizando Video!')

renderingVideo()
function renderingVideo(){
videoshow(images, videoOptions)
    .audio(FILE_AUDIO_PATH)
    .save(FILE_VIDEO_PATH)
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