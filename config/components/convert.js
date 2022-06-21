
const vOptions = async () => {
    
    async function loop() {
        let ffmpeg = require("fluent-ffmpeg");
        const path = require('path')
        const rootPath = path.resolve(__dirname, "..", "..");
        const DIR_DATA_PATH = rootPath + '/public/data/selectedAudio'
        
        return new Promise((resolve) => {
            ffmpeg.ffprobe(DIR_DATA_PATH, function m(err, metadata) {
                const secondsAudio = (parseInt(metadata.format.duration));
                resolve(secondsAudio)
            });
        })
    }

 var videoOptions = {
    fps: 25,
    loop: await loop(), // seconds
    transition: false,
    videoBitrate: 250,
    videoCodec: 'libx264',
    size: '640x?',
    audioBitrate: '128k',
    audioChannels: 2,
    format: 'mp4',
    pixelFormat: 'yuv420p'
}
return videoOptions

}



module.exports = { vOptions }