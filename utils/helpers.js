const fs = require('fs');
const http = require('https');
const path = require('path');
const videoshow = require('videoshow');
const { MessageMedia } = require('whatsapp-web.js');
const {
  getHomiliaData,
  updateAudioTime,
  setHomiliaDataToDefault,
} = require('../models/misc');

const rootPath = path.resolve(__dirname, '..');

const DIR_DATA_PATH = `${rootPath}/public/data/`;
const FILE_VIDEO_PATH = DIR_DATA_PATH + 'homiliadiaria.mp4';

const logger = require(`${rootPath}/config/components/logger`);

const downloadFilesToBase64 = async () => {
  const homiliaData = await getHomiliaData();

  const audioUrl = homiliaData.urlAudio;

  http
    .get(audioUrl, (res) => {
      res.setEncoding('base64');

      const base64file = {
        mimetype: res.headers['content-type'],
        data: '',
      };

      res.on('data', (data) => {
        base64file.data += data;
      });

      res.on('end', async () => {
        // write base64 file to disk in async mode to waiting for the file to be written
        fs.writeFileSync(
          `${rootPath}/public/data/selectedAudio.mp3`,
          base64file.data,
          'base64',
        );
        logger.info(' > Audio Base64 Salvo!');
        await audioDuration();
      });
    })
    .on('error', (e) => {
      console.log(e.message);
    });
};



const audioDuration = async () => {
  // eslint-disable-next-line global-require
  const ffmpeg = require('fluent-ffmpeg');
  const audioFile = `${DIR_DATA_PATH}homilyAudio`;
  return new Promise((resolve) => {
    ffmpeg.ffprobe(audioFile, (err, metadata) => {
      const secondsAudio = parseInt(metadata.format.duration, 10);
      logger.info(' > Audio Duração Salvo!');
      logger.info(` > Audio Duração: ${secondsAudio}`);
      resolve(secondsAudio);
    });
  });
};

const calculateBitrate = async () => {
  console.log(audioDuration)
  if (await audioDuration() < 450) {
    return 250
  } else {
    return 180
  }
}



const setAppToDefault = async () => {
  await setHomiliaDataToDefault();
  logger.info(' > Db to Default!');

  fs.unlink(`${DIR_DATA_PATH}selectedAudio.mp3`, (err) => {
    if (err) {
      logger.error(`Arquivo de Audio não existe! - Error: ${err}`);
    }
    logger.info(' > File Audio Deleted!');
  });

  fs.unlink(`${DIR_DATA_PATH}video.mp4`, (err) => {
    if (err) {
      logger.error(`Arquivo de video não existe! - Error: ${err}`);
    }
    logger.info(' > File Video Deleted!');
  });

  await sleep();
};

const sleep = async (milliseconds = 5000) => {
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
  logger.info(' > Sleep!');
};
// const deleteAudioFromGoogleCloud = async () => {
//     const { Storage } = require('@google-cloud/storage')

//     const storage = new Storage({
//         projectId: 'homilia-bot',
//         keyFilename: rootPath + '/config/homilia-bot-e54a49e430c5.json'
//     })

//     var myBucket = storage.bucket('homily-bot-df')

//     const audioName = getHomiliaData().fileAudioName

// }

const fetchLastMessage = async (client) => {
  const chat = await client.getChatById('120363024953035513@g.us');
  const messages = await chat.fetchMessages({ limit: 1 });
  const tmpMsg = messages[0];
  return tmpMsg;
};

const downloadLocalAudio = async (client, audioMsg) => {
  const nameAudio = `${DIR_DATA_PATH}homilyAudio`;

  const mediafile = await audioMsg.downloadMedia();
  fs.writeFile(nameAudio, mediafile.data, 'base64', (err) => {
    if (err) {
      logger.error(err);
    } else {
      logger.info('The file was saved!');
    }
  });
};

const convertVideo = async (mode) => {
  logger.info(' > Renderizando Video!');
  if (mode === 'local') {
    const images = [
      {
        path: `${rootPath}/public/data/selectedImage.png`,
      },
    ];

    const videoOptions = {
      fps: 25,
      loop: await audioDuration(), // seconds
      transition: false,
      videoBitrate: await calculateBitrate(),
      videoCodec: 'libx264',
      size: '640x?',
      audioBitrate: '128k',
      audioChannels: 2,
      format: 'mp4',
      pixelFormat: 'yuv420p',
    };
    logger.info(`videoBitrate atual: ${videoOptions.videoBitrate}`)
    await new Promise((resolve) => {
      videoshow(images, videoOptions)
        .audio(`${DIR_DATA_PATH}homilyAudio`)
        .save(`${DIR_DATA_PATH}homiliadiaria.mp4`)
        .on('start', () => {
          logger.info(' > Renderizando Video!');
        })

        .on('start', (command) => {
          logger.info('ffmpeg process started:', command);
        })
        .on('progress', (data) => {
          logger.info(`Progress:${data.percent.toFixed(0)}%`);
          logger.info(`Frames: ${data.frames}`);
        })

        .on('error', (err, stdout, stderr) => {
          logger.error('Error:', err);
          logger.error('ffmpeg stderr:', stderr);
        })
        .on('end', async (output) => {
          logger.info('Video created in:', output);

          const stats = fs.statSync(`${DIR_DATA_PATH}homiliadiaria.mp4`);
          logger.info(stats.size)
          resolve()

        });
    });
  }
};

const sendVideo = async (client) => {
  const chat = await client.getChatById('120363024953035513@g.us');
  const media = MessageMedia.fromFilePath(FILE_VIDEO_PATH);
  await chat.sendMessage(media);
};




module.exports = {
  //streamDownloadToGoogle,
  downloadFilesToBase64,
  audioDuration,
  setAppToDefault,
  sleep,
  fetchLastMessage,
  downloadLocalAudio,
  convertVideo,
  sendVideo,
  // deleteAudioFromGoogleCloud
};
