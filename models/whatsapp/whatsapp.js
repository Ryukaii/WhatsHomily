const fs = require('fs')
const path = require('path')
// rootPath, pasta raiz do projeto(whatshomily)
const rootPath = path.join(__dirname, '..' ,'..' )

const { Client, LocalAuth } = require('whatsapp-web.js');

const qrcode = require('qrcode-terminal');

const sessionDataPath = rootPath + '/config/.wwebjs_auth'

const logger = require('../../config/components/logger.js')

async function startNewConnection(){

const puppeteerOptions = {
    headless: true,
    args: ["--no-sandbox"],
    //executablePath: '/usr/bin/google-chrome-stable',

};

const ws = new Client({
    authStrategy: new LocalAuth({ dataPath: sessionDataPath }),
    restartOnAuthFail: true,
    puppeteer: puppeteerOptions
});
return ws
}



async function checkAuth(ws){
    logger.info(" > Verificando Autenticação!")
        if (fs.existsSync(sessionDataPath)) {
            logger.info(" > Autenticação Existe!")
            await authenticatedWhats(ws)
        } else if (!fs.existsSync(sessionDataPath)) {
            logger.info(" > Autenticação Pai Não Existe!")
            await qrWhats(ws)
        }
}

async function authenticatedWhats(ws) {
    logger.info(" > Autenticando!")

    ws.on('authenticated', () => {
        logger.info(" > Autenticado!")
    });

    ws.on('ready', () => {
        logger.info(' > Client Pronto!');
    });
    await ws.initialize()
}

async function qrWhats(ws) {
    logger.info(" > Gerando QR Code!")
    ws.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    ws.on('authenticated', () => {
        logger.info(" > Autenticado!")
    });

    ws.on('ready', () => {
        logger.info(' > Client Pronto!');
    });

    await ws.initialize();
    
}


async function main(){
    
    const ws = await startNewConnection()
    await checkAuth(ws)
    //logger.info(ws)
    return ws

}

process.on("SIGINT", async () => {
    logger.info("(SIGINT) Shutting down...");
    await ws.destroy();
    process.exit(0);
})
const ws = main()

module.exports = ws;                                                                                                                                                            