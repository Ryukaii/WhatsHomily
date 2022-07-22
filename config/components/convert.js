
const vOptions = async () => {

 var videoOptions = {
    fps: 25,
    loop: '', // seconds
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