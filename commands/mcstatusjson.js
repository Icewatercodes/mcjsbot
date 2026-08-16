const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mcstatusjson")
        .setDescription('mcstatus i fuld json'),
    async execute(interaction) {

        const sent = await interaction.reply({ content: '...', withReponse: true})

        const getstatus = await fetch(`https://api.mcstatus.io/v2/status/java/${process.env.MC_IP}`)
        const mcstatus = await getstatus.json()

        console.log("\n" + JSON.stringify(mcstatus, null, 2) + "\n");

        await interaction.editReply(JSON.stringify(mcstatus, null, 2));
    }
}