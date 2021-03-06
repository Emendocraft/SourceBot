const { CommandInteraction, Client, MessageEmbed } = require("discord.js");

module.exports = {
    name: "music",
    description: "Music-Commands",
    permission: "SPEAK",
    options: [
        {
            name: "play",
            description: "play a song",
            type: "SUB_COMMAND",
            options: [{ name: "query", description: "Provide name or URL for song", type: "STRING", required: true }]
        },
        {
            name: "volume",
            description: "Alter the volume",
            type: "SUB_COMMAND",
            options: [{ name: "percent", description: "10 = 10%", type: "NUMBER", required: true }]
        },
        {
            name: "settings",
            description: "select an option",
            type: "SUB_COMMAND",
            options: [{ name: "options", description: "select an option", type: "STRING", required: true,
            choices: [
                {name: "π’ View Queue!", value: "queue"},
                {name: "β­οΈ Skip Song!", value: "skip"},
                {name: "βΈοΈ Pause Song!", value: "pause"},
                {name: "βΆοΈ Resume Song!", value: "resume"},
                {name: "βΉ Stop Song!", value: "stop"},
                {name: "π Shuffle Queue!", value: "shuffle"},
                {name: "π Toggle Autoplay Mode!", value: "AutoPlay"},
                {name: "π Add a Related Song!", value: "RelatedSong"},
                {name: "π Toggle Repeat Mode!", value: "RepeatMode"}
            ]}]
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client){
        const { options, member, guild, channel } = interaction;
        const VoiceChannel = member.voice.channel;

        if(!VoiceChannel)
        return interaction.reply({content: "You need to be in a channel to execute this command! CUNT!!!", emphemeral: true});

        if(guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
        return interaction.reply({content: "Fuck off, I'm busy (Bot is already in another channel)", emphemeral: true});

        try{
            switch(options.getSubcommand()){
                case "play" : {
                    client.distube.playVoiceChannel( VoiceChannel, options.getString("query"), { textChannel: channel, member: member });
                    return interaction.reply({content: "π΅ Request recieved. That's a fire song, bro!"});
                }
                case "volume" : {
                    const Volume = options.getNumber("percent");
                    if(Volume > 100 || Volume < 1)
                    return interaction.reply({content: "Type in a Number between 1 and 100, fucking idiot!"});

                    client.distube.setVolume(VoiceChannel, Volume);
                    return interaction.reply({content: `π Volume has been set to \`${Volume}%\``});
                }
                case "settings" : {
                    const queue = await client.distube.getQueue(VoiceChannel);

                    if(!queue)
                    return interaction.reply({content: "β There is no queue, faggot!"});

                    switch(options.getString("options")) {
                        case "skip" : 
                        await queue.skip(VoiceChannel);
                        return interaction.reply({content: "β­οΈ This song sucks, let's skip it!"})

                        case "stop" :
                        await queue.stop(VoiceChannel);
                        return interaction.reply({content: "βΉ Song has been stopped!"})

                        case "pause" :
                        await queue.pause(VoiceChannel);
                        return interaction.reply({content: "βΈοΈ Song has been paused!"})

                        case "resume" :
                        await queue.resume(VoiceChannel);
                        return interaction.reply({content: "βΆοΈ Let's get this banger on! (Song has been resumed)"})

                        case "shuffle" :
                        await queue.shuffle(VoiceChannel);
                        return interaction.reply({content: "π The queue has been shuffled!"})

                        case "AutoPlay" :
                        let Mode = await queue.toggleAutoplay(VoiceChannel);
                        return interaction.reply({content: `π Autoplay is set to: ${Mode ? "ON" : "OFF"}!`})

                        case "RelatedSong" :
                        await queue.addRelatedSong(VoiceChannel);
                        return interaction.reply({content: "π A related Song has been added!"})

                        case "RepeatMode" :
                        let Mode2 = await client.distube.setRepeatMode(queue); 
                        return interaction.reply({content: `π Repeat is set to: ${Mode2 = Mode2 ? Mode2 == 2 ? "QUEUE" : "SONG" : "OFF"}!`})

                        case "queue" : 
                        return interaction.reply({embeds: [new MessageEmbed()
                        .setColor("PURPLE")
                        .setDescription(`${queue.songs.map(
                            (song, id) => `\n**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``)}`
                        )]});
                    }
                    return;
                }
            }


        } catch (e) {
            const errorEmbed = new MessageEmbed()
            .setColor("RED")
            .setDescription(`β ALERT: ${e}`)
            return interaction.reply({embeds: [errorEmbed]});
        }
    }
}