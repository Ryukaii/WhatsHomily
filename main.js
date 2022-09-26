require('dotenv').config();

const currentEnv = process.env.PROJECT_RUN;

const app = require('express')();
const { Client, RemoteAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const { MongoStore } = require('wwebjs-mongo');
const logger = require('./config/components/logger');

const processType = process.env.PROCESS_TYPE;

// ID's dos Grupos
// eslint-disable-next-line no-unused-vars
const grpIdHomilia = '556181705741-1607477310@g.us';
// eslint-disable-next-line no-unused-vars
const grpIdTest = '120363024953035513@g.us';
const guilhermeNumber = '556191089985@c.us';

const {
  fetchLastMessage,
  downloadLocalAudio,
  convertVideo,
  sleep,
  sendVideo,
  streamDownloadToGoogle
} = require('./utils/helpers');
require('./models/misc');

logger.info(` > Iniciando em Modo ${processType}!`, { pid: process.pid });

if (currentEnv === 'prod') {
  // eslint-disable-next-line no-undef
  puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // executablePath: '/usr/bin/google-chrome-stable'
  };
} else if (currentEnv === 'dev') {
  // eslint-disable-next-line no-undef
  puppeteerOptions = {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/google-chrome-stable',
  };
}

mongoose.connect(process.env.MONGODB_URI).then(() => {
  const store = new MongoStore({ mongoose });
  const client = new Client({
    // eslint-disable-next-line no-undef
    puppeteer: puppeteerOptions,
    authStrategy: new RemoteAuth({
      store,
      backupSyncIntervalMs: 300000,
      clientId: 'botshomilt',
    }),
  });

  client.setMaxListeners(0); // for an infinite number of event listeners

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on('disconnected', () => {
    logger.info('Oh no! Client is disconnected!');
  });

  app.get('/', (req, res) => {
    res.send('<h1>Esse server é produzido por Guilherme Costa!</h1>');
  });

  app.listen(port, () => logger.info(` > Server is running on port ${port}`));

  // --------------------------------------------------
  // BOT LOGIC
  // --------------------------------------------------

  // Bot initialization
  client.on('ready', async () => {
    logger.info('Client is ready!', currentEnv === 'dev' ? '\n' : '');
  });

  client.on('remote_session_saved', () => {
    logger.info('Session Remote Saved!');
  });

  client.on(process.env.SEND_MSG, async (inboundMsg) => {
    const { body, type, from } = inboundMsg;
    if (type === 'audio' && from === guilhermeNumber) {
      logger.info(body);
      const audio = await fetchLastMessage(client);
      if (processType === 'localaudio') {
        await downloadLocalAudio(client, audio);
        const mode = 'local';
        await sleep();
        await convertVideo(mode);
        await sendVideo(client);
      } else {
        await streamDownloadToGoogle(client)
      }
    }
  });

  client.initialize();
});
