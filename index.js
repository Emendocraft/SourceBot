const Discord = require("discord.js")
require("dotenv").config()
const { DisTube } = require ("distube");
const { SpotifyPlugin } = require("@distube/spotify");

const generateImage = require("./generateImage")

const fs = require("fs")


const client = new Discord.Client({
    intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "GUILD_VOICE_STATES",
        "GUILD_EMOJIS_AND_STICKERS",
        "GUILD_BANS",
        "GUILD_INTEGRATIONS",
        "GUILD_WEBHOOKS",
        "GUILD_INVITES",
        "GUILD_VOICE_STATES",
        "GUILD_PRESENCES",
        "GUILD_MESSAGES",
        "GUILD_MESSAGE_TYPING",
        "DIRECT_MESSAGE_REACTIONS",
        "DIRECT_MESSAGES",
        "DIRECT_MESSAGE_TYPING"
    ]
})

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync("./commands/").filter(file => file.endsWith(".js"))
for(const file of commandFiles){
    const command = require(`./commands/${file}`)

    client.commands.set(command.name, command)
}

require("./Handlers/Events")(client);
require("./Handlers/Commands")(client);

    // send welcome message
// const welcomeChannelId = process.env.WELCOMECHANNEL

// client.on("guildMemberAdd", async (member) => {
//    const img = await generateImage(member)
//    member.guild.channels.cache.get (welcomeChannelId).send({
//        content: `<@${member.id}> Welcome to the server!`,
//        files: [img]
//    })
// })

    // Music-Bot
    client.distube = new DisTube(client, {
        emitNewSongOnly: true,
        leaveOnFinish: true,
        nsfw: true,
        emitAddSongWhenCreatingQueue: false,
        plugins: [new SpotifyPlugin()]
    });
    
    module.exports = client;

    // this line has to be at the end of the document!!!
client.login(process.env.TOKEN)
