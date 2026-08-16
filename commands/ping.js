const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('reply pong and latency'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'pinging...', fetchReply: true});
        const pingTime = sent.createdTimeStamp - interaction.createdTimeStamp;

        await interaction.editReply(`Pong!\nping time: ${pingTime}ms\nAPI latency: ${Math.round(interaction.client.ws.ping)}ms`);
    },
};
