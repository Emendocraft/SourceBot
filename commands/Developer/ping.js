const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Ping",
    permission: "SPEAK",
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    execute(interaction) {
        interaction.reply({content: "Fuck You!"})
    }
}