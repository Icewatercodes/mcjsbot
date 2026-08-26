const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skema')
        .setDescription('Print vore skema'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Finder skema', withResponse: true, ephemeral: true});

        const skemajson = require("../skema.json");

        var skema = `Ugens skema ${skemajson.classes[0].day} til ${skemajson.classes[skemajson.classes.length-1].day}\n\n`;

        const days = [
            "mandag",
            "tirsdag",
            "onsdag",
            "torsdag",
            "fredag"
        ];

        for(const d in days) {
            const day = days[d];
            console.log(day);
            var corDayClasses = [];
            for(const k in skemajson.classes) {
                klass = skemajson.classes;
                if(i.day.slice(7) != day) continue;
                corDayClasses.push(k);

            }

            skema += `Dag: ${day}`


        }

        await interaction.editReply({content: skema});
        
    },
};
