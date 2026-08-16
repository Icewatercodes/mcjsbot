const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('reply pong and latency'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'pinging...', withResponse: true});
        const pingTime = sent.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply(`Pong!
            ping time: ${pingTime}ms
            API latency: ${Math.round(interaction.client.ws.ping)}ms`);
    },
};
