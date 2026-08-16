const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Point the Bot to your mc ip/domain'),
    async execute(interaction) {

        const sent = await interaction.reply({ content: '...', withReponse: true})

        //const getstatus = await fetch(`https://api.mcsrvstat.us/3/${process.env.MC_IP}`);
        const getstatus = await fetch(`https://api.mcstatus.io/v2/status/java/${process.env.MC_IP}`)
        const mcstatus = await getstatus.json()

        console.log("\n" + JSON.stringify(mcstatus, null, 2) + "\n");

        /*var list = "";
        for(var i = 0; i < mcstatus.players.list.length(); i++){
            console.log(i);
        }*/

        await interaction.editReply(`
            OTG Minecraft server status: ${mcstatus.online ? "Online" : "Offline"}
            IP: ${mcstatus.host}
            Spiller: ${mcstatus.players.online} / ${mcstatus.players.max}
        `);
    },
};
