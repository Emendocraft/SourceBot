const { Client } = require("discord.js");


module.exports = {
    name: "ready",
    once: true,
    /**
    * @param {Client} client
    */
    execute(client) {
        console.log(`Logged in as ${client.user.tag}`);
        client.user.setActivity("/music", {type: "PLAYING"})
    }
}