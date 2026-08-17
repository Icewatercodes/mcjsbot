const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Point the Bot to your mc ip/domain'),
    async execute(interaction) {

        const sent = await interaction.reply({ content: 'Checker Lige...', withReponse: true, ephemeral: true});

        const getstatus = await fetch(`https://api.mcstatus.io/v2/status/java/${process.env.MC_IP}`);
        const mcstatus = await getstatus.json();

        let reply = 
            `OTG Minecraft server status:  ${mcstatus.online ? "Online" : "Offline"}\n` +
            `IP:  ${mcstatus.host}\n` +
            `Spiller:  ${mcstatus.players.online} / ${mcstatus.players.max}\n` +
            `Spillere:\n`
        ;

        for(i = 0; i < mcstatus.players.online; i++) {
            reply += mcstatus.players.list[i].name_clean + '\n';
        
        }
            
        if (!mcstatus.online) {
            await interaction.editReply("OTH Minecraft server status: Offline");
            return;
        }else {
            await interaction.editReply({content: reply, ephemeral: true});
        }
    },
};
