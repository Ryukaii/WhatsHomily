const { List } = require("whatsapp-web.js");


async function menu(){


const ws = await require("../whatsapp");

    ws.on('message_create', async (inboundMsg) => {
console.log(inboundMsg);

        const { from, body } = inboundMsg;

        if(body === "!start"){
    // Have to keep this array here because I want the most updated list of super Admins
    // every time this is needed.


    let startID = 0; // dynamic ID to be used for whatsapp list
    const tempRows = [];

    
        startID++;
        tempRows.push({ id: `menu-${startID}`, title: "!PASCOM", description: "https://wa.me/556198444403" });

        startID++;
        tempRows.push({ id: `menu-${startID}`, title: "!PASTORAL LITÚRGICA", description: "https://wa.me/5561985935341" });

        startID++;
        tempRows.push({ id: `menu-${startID}`, title: "!MESCE", description: "https://wa.me/5561998076221" });




    const list = new List(
        '\nUma lista com os contatos dos responsáveis pelas pastorais ',
        'Clique aqui!',
        [{
            title: `Pastorais`,
            rows: tempRows
        }],
        'Lista de contato das pastorais'
    );
//556193351196@c.us        556198444403@c.us
            const chat = await ws.getChatById('556193351196@c.us');
        await chat.sendMessage(list)

    }
})

}

menu()

module.exports = {
    // name: "menu",
    // description: "Get list of commands ⚙",
    // alias: ["commands", "command", "coms", "comms", "menus"],
    // category: "everyone", // admin | everyone
    // help: `To use this command, type:\n*${currentPrefix}menu* or ping the bot in a group chat`,
    //execute,
}