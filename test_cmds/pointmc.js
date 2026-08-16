const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName(__filename)
        .setDescription('Point the Bot to your mc ip/domain'),
    async execute(interaction) {
        
        
        /*const sent = await interaction.reply({ content: 'pinging...', fetchReply: true});
        const pingTime = sent.createdTimeStamp - interaction.createdTimeStamp;

        await interaction.editReply(`Pong!\nping time: ${pingTime}ms\nAPI latency: ${Math.round(interaction.client.ws.ping)}ms`);*/
    },
};
